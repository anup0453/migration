import {
  AIMessage,
  AIMessageChunk,
  BaseMessage,
  HumanMessage,
  OpenAIToolCall,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { DynamicTool } from '@langchain/core/tools'
import { IterableReadableStream } from '@langchain/core/utils/stream'
import { ChatOpenAI, ChatOpenAICallOptions } from '@langchain/openai'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { BadRequest } from 'http-errors'
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents'

import { ChatRequestType, ModelTypeEnum, RoleEnum } from '../../constants'
import { IChatCompletions, IOpenAiInstance } from '../../customTypes'
import { ChatModelCallbackHandler, ToolsCallbackHandler } from '../../utils'
import BaseService from '../base'

export default class LangchainOpenAiService extends BaseService {
  private _openAiClient: ChatOpenAI
  private _openAiInstance: IOpenAiInstance
  private _openAiEngine: string
  private _queryParamApiVersion: string

  constructor(fastify: FastifyInstance, req: FastifyRequest) {
    super(fastify, req)
  }

  public async processPrompt(
    prompts: {
      role: RoleEnum
      content: string
      tool_calls?: OpenAIToolCall[]
      tool_call_id?: string
    }[],
    type: ChatRequestType,
    options?: {
      maxTokens?: number
      temperature?: number
      topP?: number
      frequencyPenalty?: number
      presencePenalty?: number
      stop?: string[]
      internalTools?: DynamicTool[]
      tools?: DynamicTool[]
    },
    parentId?: string,
  ): Promise<IChatCompletions> {
    const messages = this.createMessages(prompts)
    const response = await this.getChatRequest(
      type,
      messages,
      options,
      parentId,
    )

    return response
  }

  private async getChatRequest(
    type: ChatRequestType,
    messages,
    options,
    parentId?: string,
  ) {
    // TODO: Move away from LangChain and use the OpenAI client directly
    let response: IChatCompletions
    let has429: boolean

    do {
      has429 = false
      await this.openAiClient()
      this._openAiClient.maxTokens = options.maxTokens
      this._openAiClient.temperature = options.temperature
      this._openAiClient.frequencyPenalty = options.frequencyPenalty
      this._openAiClient.presencePenalty = options.presencePenalty
      this._openAiClient.topP = options.topP
      this._openAiClient.stop = options.stop

      let retryCount = 0
      const maxRetries = 3

      try {
        if (!options.internalTools) {
          let spanId: string

          try {
            spanId = this.req.services.arize.initializeSpanChatRequest(
              type,
              messages,
              options,
              this._openAiEngine,
              parentId,
            )
            let langchainOptions: ChatOpenAICallOptions = {
              ...(this.getHeaders() as ChatOpenAICallOptions),
            }

            if (options.tools) {
              langchainOptions = {
                ...langchainOptions,
                tools: options.tools,
              }
            }

            while (retryCount < maxRetries) {
              try {
                const res = await this._openAiClient.invoke(messages, options)
                response = res.additional_kwargs
                  .__raw_response as IChatCompletions
                break
              } catch (error) {
                if (error.status >= 500 && error.status < 600) {
                  retryCount++
                  if (retryCount >= maxRetries) {
                    response = this.createErrorResponse(
                      'OpenAI service is currently unavailable. Please contact HelixAI support: https://siemens.sharepoint.com/teams/TIMA/SitePages/TIMA-Ticket-Management.aspx',
                    )
                  }
                } else {
                  throw error
                }
              }
            }

            await this.req.services.arize.setSpanOutputChatRequest(
              spanId,
              response,
            )
            this.req.services.arize.finalizeSpan(spanId)
          } catch (error) {
            this.req.services.arize.setErrorSpanStatus(spanId, error)
            throw error
          }
        } else {
          response = await this.processPromptWithInternalTools(
            messages,
            options.internalTools,
            parentId,
          )
        }
      } catch (error) {
        if (error.status === 429) {
          await this.req.services.loadbalancer.removeInstance(
            this._openAiInstance,
            this._openAiEngine,
            ModelTypeEnum.LLM,
          )
          this._openAiInstance = null
          has429 = true
        } else {
          throw error
        }
      }
    } while (has429)
    await this.registerChatRequest(response, type)

    return response
  }

  private createMessages(
    prompts: {
      role: RoleEnum
      content: string
      tool_calls?: OpenAIToolCall[]
      tool_call_id?: string
    }[],
  ): BaseMessage[] {
    const result = []
    for (const prompt of prompts) {
      const content =
        typeof prompt.content === 'object'
          ? JSON.stringify(prompt.content)
          : prompt.content
      let message
      switch (prompt.role) {
        case RoleEnum.user:
          message = new HumanMessage(content)
          message.role = RoleEnum.user
          break
        case RoleEnum.system:
          message = new SystemMessage(content)
          message.role = RoleEnum.system
          break
        case RoleEnum.assistant: {
          const tool_calls = prompt.tool_calls
          if (tool_calls && tool_calls.length > 0) {
            message = new AIMessage(content)
            message.tool_calls = tool_calls.map((tool) => ({
              type: tool.type,
              id: tool.id,
              name: tool['function'].name,
              args: tool['function'].arguments,
            }))
            message.role = RoleEnum.assistant
          } else {
            message = new AIMessage(content)
            message.role = RoleEnum.assistant
          }
          break
        }
        case RoleEnum.tool: {
          const toolMessageFields = {
            content: content,
            tool_call_id: prompt.tool_call_id,
          }
          message = new ToolMessage(toolMessageFields)
          message.role = RoleEnum.tool
          break
        }
        default:
          throw new Error('Invalid role')
      }
      result.push(message)
    }

    return result
  }

  public async processPromptWithInternalTools(
    messages: BaseMessage[],
    internalTools: DynamicTool[],
    parentId?: string,
  ) {
    let outputFormat: IChatCompletions
    let spanId: string

    try {
      spanId =
        this.req.services.arize.initializeSpanChatRequestWithInternalTools(
          messages,
          this._openAiEngine,
          parentId,
        )
      const toolsCallbackHandler = new ToolsCallbackHandler()
      const chatModelCallbackHandler = new ChatModelCallbackHandler()

      this._openAiClient.callbacks = [chatModelCallbackHandler]

      const promptTemplate = ChatPromptTemplate.fromMessages(messages)
      const placeholder = new MessagesPlaceholder('agent_scratchpad')

      const promptWithPlaceholder = ChatPromptTemplate.fromMessages([
        promptTemplate,
        placeholder,
      ])

      const agent = await createOpenAIToolsAgent({
        llm: this._openAiClient,
        tools: internalTools,
        prompt: promptWithPlaceholder,
      })

      const executor = AgentExecutor.fromAgentAndTools({
        agent: agent,
        tools: internalTools,
        maxIterations: 20,
        callbacks: [toolsCallbackHandler],
      })

      const res = await executor.invoke({})

      const completion_tokens =
        toolsCallbackHandler.completion_tokens +
        chatModelCallbackHandler.completion_tokens
      const prompt_tokens =
        toolsCallbackHandler.prompt_tokens +
        chatModelCallbackHandler.prompt_tokens

      outputFormat = {
        id: res.__run.runId,
        created: Math.floor(new Date().getTime() / 1000),
        model: this._openAiEngine,
        systemFingerprint: null,
        object: 'chat.completion',
        choices: [
          {
            contentFilterResults: {
              hate: {
                filtered: false,
                severity: 'safe',
              },
              selfHarm: {
                filtered: false,
                severity: 'safe',
              },
              sexual: {
                filtered: false,
                severity: 'safe',
              },
              violence: {
                filtered: false,
                severity: 'safe',
              },
            },
            message: {
              role: RoleEnum.assistant,
              content: res.output,
            },
            logprobs: undefined,
            index: 0,
            finishReason: '',
          },
        ],
        usage: {
          completionTokens: completion_tokens,
          promptTokens: prompt_tokens,
          totalTokens: completion_tokens + prompt_tokens,
        },
        success: true,
      }
      await this.req.services.arize.setSpanOutputChatRequest(
        spanId,
        outputFormat,
      )
      this.req.services.arize.finalizeSpan(spanId)
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }

    return outputFormat
  }

  public async getCompletionStream(
    prompts: {
      role: RoleEnum
      content: string
      tool_calls?: OpenAIToolCall[]
      tool_call_id?: string
    }[],
    options?: {
      maxTokens?: number
      temperature?: number
      topP?: number
      frequencyPenalty?: number
      presencePenalty?: number
      stop?: string[]
      internalTools?: DynamicTool[]
      tools?: DynamicTool[]
    },
  ): Promise<IterableReadableStream<AIMessageChunk>> {
    const messages = this.createMessages(prompts)

    let has429: boolean

    do {
      has429 = false
      await this.openAiClient()
      this._openAiClient.maxTokens = options.maxTokens
      this._openAiClient.temperature = options.temperature
      this._openAiClient.frequencyPenalty = options.frequencyPenalty
      this._openAiClient.presencePenalty = options.presencePenalty
      this._openAiClient.topP = options.topP
      this._openAiClient.stop = options.stop
      this._openAiClient.streamUsage = true

      // Todo: make traceable

      try {
        let langchainOptions = this.getHeaders() as ChatOpenAICallOptions

        if (options.tools) {
          langchainOptions = {
            ...(this.getHeaders() as ChatOpenAICallOptions),
            tools: options.tools,
          }
        }

        const myStream = await this._openAiClient.stream(
          messages,
          langchainOptions,
        )

        return myStream
      } catch (error) {
        if (error.status === 429) {
          await this.req.services.loadbalancer.removeInstance(
            this._openAiInstance,
            this._openAiEngine,
            ModelTypeEnum.LLM,
          )
          this._openAiInstance = null
          has429 = true
        } else if (error.status === 400 && error.code === 'content_filter') {
          throw new BadRequest(`Unfortunatelly, the response was filtered due to the prompt triggering Azure OpenAIs content management policy. Please modify your prompt and retry.
            To learn more about OpenAI content filtering policies please read the documentation: https://go.microsoft.com/fwlink/?linkid=2198766`)
        } else {
          throw new BadRequest(
            `An error occurred while processing the prompt. Error: ${error} \nPlease contact HelixAI support: https://siemens.sharepoint.com/teams/TIMA/SitePages/TIMA-Ticket-Management.aspx`,
          )
        }
      }
    } while (has429)
  }

  public setEngine(engine: string, apiVersion: string) {
    this._openAiEngine = this.sanitizeEngine(engine)
    this._queryParamApiVersion = apiVersion
  }

  public sanitizeEngine(engine: string) {
    if (
      !this.fastify.config.services.azure.supportedOpenAiModels.includes(engine)
    ) {
      return this.req.services.customer.getDefaultGPTVersion()
    }

    return engine
  }

  public getEngine() {
    return this._openAiEngine
  }

  private async openAiClient() {
    if (!this._openAiInstance) {
      this._openAiInstance = await this.req.services.loadbalancer.getInstance(
        this._openAiEngine,
        ModelTypeEnum.LLM,
      )

      if (this._queryParamApiVersion) {
        // Override default api version with the one passed in the query param
        this._openAiInstance.apiVersion = this._queryParamApiVersion
      }

      this._openAiClient = new ChatOpenAI({
        model: this._openAiInstance.modelName,
        modelName: this._openAiInstance.modelName,
        azureOpenAIApiKey: this._openAiInstance.apiKey,
        azureOpenAIApiVersion: this._openAiInstance.apiVersion,
        azureOpenAIApiDeploymentName: this._openAiInstance.deploymentName,
        azureOpenAIApiInstanceName: this._openAiInstance.instanceName,
        __includeRawResponse: true,
        maxRetries: 0,
      })
    }

    return this._openAiClient
  }

  public async registerChatRequest(completion, type: ChatRequestType) {
    const {
      gptModel,
      incomingTokenCount,
      incomingTokenCountDetails,
      outgoingTokenCount,
      outgoingTokenCountDetails,
    } = await this.req.services.plainLLM.openAI.extractUsageData(completion)

    await this.req.services.costTracking.trackChatRequest({
      gptModel,
      incomingTokenCount,
      incomingTokenCountDetails,
      outgoingTokenCount,
      outgoingTokenCountDetails,
      type,
    })
  }

  public getHeaders(type: 'api' | 'package' = 'package') {
    const chatUrl = `${this._openAiInstance.instanceUrl}${this._openAiInstance.modelName}/chat/completions?api-version=${this._openAiInstance.apiVersion}`

    return {
      ...(type === 'api' && { 'Content-Type': 'application/json' }),
      'api-key': this._openAiInstance.apiKey,
      chatgpt_url: chatUrl,
      chatgpt_key: this._openAiInstance.apiKey,
      'x-ms-useragent': 'SIinternal/PublicAPI/1.0.0',
    }
  }

  public createErrorResponse = (content: string): IChatCompletions => ({
    id: '0000000000000',
    created: Math.floor(new Date().getTime() / 1000),
    model: this._openAiEngine,
    systemFingerprint: null,
    object: 'chat.completion',
    choices: [
      {
        contentFilterResults: {
          hate: {
            filtered: false,
            severity: 'safe',
          },
          selfHarm: {
            filtered: false,
            severity: 'safe',
          },
          sexual: {
            filtered: false,
            severity: 'safe',
          },
          violence: {
            filtered: false,
            severity: 'safe',
          },
        },
        message: {
          role: RoleEnum.assistant,
          content: content,
        },
        logprobs: undefined,
        index: 0,
        finishReason: '',
      },
    ],
    usage: {
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0,
    },
    success: true,
  })
}
