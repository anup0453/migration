import {
  ChatCompletions,
  ChatMessageContentItemUnion,
  ChatMessageImageContentItem,
  ChatMessageTextContentItem,
  ChatRequestAssistantMessage,
  ChatRequestMessageUnion,
  ChatRequestSystemMessage,
  ChatRequestUserMessage,
} from '@azure/openai'
import { AzureAISearchFilterType } from '@langchain/community/vectorstores/azure_aisearch'
import { AIMessageChunk } from '@langchain/core/messages'
import { DynamicTool } from '@langchain/core/tools'
import { IterableReadableStream } from '@langchain/core/utils/stream'
import { FastifyReply } from 'fastify'
import { forEach } from 'lodash'

import {
  ChatRequestType,
  DatasourceEnum,
  DirectoryEnum,
  EmbeddingRequestType,
  InternalToolEnum,
  RoleEnum,
  SkillsetNameEnum,
} from '../../constants'
import { DefaultSystemMessageEnum } from '../../constants/defaultValues'
import {
  IChatBody,
  IChatCompletionBody,
  IChatCompletions,
  IChatCompletionsSnakeCase,
  IChatRequestParams,
  IEmbeddingsBody,
  ISharedChatPrep,
} from '../../customTypes'
import { Customer } from '../../models/types'
import {
  generateSearchQueryPrompt,
  reactOnUserMessagePrompt,
  summarizeConversationPrompt,
} from '../../prompts'
import { hashText, transformKeysToSnakeCase } from '../../utils'
import BaseService from '../base'

export default class AzureOpenAiService extends BaseService {
  public async embedding(body: IEmbeddingsBody, params: IChatRequestParams) {
    this.req.services.langchain.embedding.setEngine(
      params.engine,
      params.apiVersion,
    )
    const input = body.input

    // TODO: incorporate other IEmbeddingsBody properties like model and encoding_format

    const embedds =
      await this.req.services.langchain.embedding.retrieveEmbeddings(
        input,
        EmbeddingRequestType.MANUAL,
      )

    return embedds
  }

  public async stream(
    reply: FastifyReply,
    body: IChatCompletionBody,
    params: IChatRequestParams,
  ) {
    const {
      openAiRequestParams,
      urlPlaceholderMap,
      fileNameMap,
      sourceIds,
      messages,
      internalTools,
      tools,
    } = await this.prepareCompletion(body, params)

    const myStream =
      await this.req.services.langchain.openai.getCompletionStream(messages, {
        maxTokens: openAiRequestParams.maxTokens,
        temperature: openAiRequestParams.temperature,
        frequencyPenalty: openAiRequestParams.frequencyPenalty,
        presencePenalty: openAiRequestParams.presencePenalty,
        stop: openAiRequestParams.stop,
        topP: openAiRequestParams.topP,
        internalTools: internalTools,
        tools: tools,
      })

    await this.processCompletionStream(
      myStream,
      reply,
      urlPlaceholderMap,
      fileNameMap,
      sourceIds,
    )
  }

  private async processCompletionStream(
    stream: IterableReadableStream<AIMessageChunk>,
    reply: FastifyReply,
    urlPlaceholderMap: Map<string, string>,
    fileNameMap: Map<string, string>,
    sourceIds: string[],
    parentId?: string,
  ) {
    let queue = []
    const maxSizeQueue = 30

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    for await (const chunk of stream) {
      let streamedChunk
      const openAIChunk = chunk.additional_kwargs
        .__raw_response as ChatCompletions

      if (!openAIChunk && chunk?.usage_metadata) {
        await this.req.services.langchain.openai.registerChatRequest(
          {
            usage: {
              completion_tokens: chunk.usage_metadata.output_tokens,
              prompt_tokens: chunk.usage_metadata.input_tokens,
              total_tokens: chunk.usage_metadata.total_tokens,
            },
          },
          ChatRequestType.EXTERNAL,
        )
        continue
      }

      if (openAIChunk?.choices?.length === 0) {
        reply.raw.write(`data: ${JSON.stringify(openAIChunk)}\n\n`)
        continue
      }

      queue.push(openAIChunk)

      // Concatenate all chunk contents into a single string
      const word = queue
        .map((chunk) =>
          chunk.choices[0].delta.content ? chunk.choices[0].delta.content : '',
        )
        .join('')

      // Check if word contains any of the ids in sourceIds
      if (sourceIds.some((id) => word.includes(id))) {
        streamedChunk = queue.shift()
        streamedChunk.choices[0].delta.content =
          await this.replacePlaceholdersWithLinks(
            word,
            urlPlaceholderMap,
            fileNameMap,
            parentId,
          )
        queue = []
      }

      if (queue.length >= maxSizeQueue && !streamedChunk) {
        streamedChunk = queue.shift()
      }

      if (!streamedChunk) {
        continue
      }

      reply.raw.write(`data: ${JSON.stringify(streamedChunk)}\n\n`)
      //process.stdout.write(streamedChunk.content as string) //Uncomment this line for local testing of streaming
    }

    // Process remaining chunks
    if (queue.length > 0) {
      queue.forEach((chunk) => {
        //process.stdout.write(chunk.content as string) //Uncomment this line for local testing of streaming
        reply.raw.write(`data: ${JSON.stringify(chunk)}\n\n`)
      })
    }

    // End stream with a DONE message
    reply.raw.write('data: [DONE]\n\n')
  }

  private async prepareCompletion(
    body: IChatCompletionBody,
    params: IChatRequestParams,
    parentId?: string,
  ) {
    const passedEngine = body.model || params.engine
    const passedApiVersion = params.apiVersion

    this.req.services.langchain.openai.setEngine(passedEngine, passedApiVersion)
    this.req.services.langchain.embedding.setEngine(
      this.req.services.customer.getDefaultEmbeddingVersion(),
      passedApiVersion,
    )

    const chatData = this.prepareChatData(body)

    const openAiRequestParams = await this.getOpenAiRequestParams(chatData)

    const hasInternalTools = body.internalTools && body.internalTools.length > 0

    if (hasInternalTools) {
      if (body.internalTools?.includes('rag')) {
        body.internalTools = body.internalTools.filter((tool) => tool !== 'rag')
      } else {
        chatData.plainAOAI = true
      }
    }

    const internalTools =
      body.internalTools?.length &&
      (await this.req.services.internalTool.prepareInternalTools(
        body,
        parentId,
      ))

    const tools = body.tools?.length && body.tools

    const filter = await this.processFilters(body)

    const { messages, urlPlaceholderMap, fileNameMap, generatedQuestion } =
      await this.prepareMessages(chatData, internalTools, filter, parentId)
    const sourceIds = Array.from(fileNameMap.keys())

    const snakeCase = !!body.snakeCase

    return {
      openAiRequestParams,
      urlPlaceholderMap,
      fileNameMap,
      sourceIds,
      snakeCase,
      messages,
      internalTools,
      tools,
      generatedQuestion,
    } as ISharedChatPrep
  }

  public async chat(body: IChatCompletionBody, params: IChatRequestParams) {
    const completions: IChatCompletions | IChatCompletionsSnakeCase =
      await this.getCompletions(body, params)

    return completions
  }

  private async chatRequest(
    openAiRequestParams,
    urlPlaceholderMap: Map<string, string>,
    fileNameMap: Map<string, string>,
    snakeCase: boolean,
    messages,
    internalTools: DynamicTool[],
    tools: DynamicTool[],
    parentId?: string,
  ) {
    const originalCompletions =
      await this.req.services.langchain.openai.processPrompt(
        messages,
        ChatRequestType.EXTERNAL,
        {
          maxTokens: openAiRequestParams.maxTokens,
          temperature: openAiRequestParams.temperature,
          frequencyPenalty: openAiRequestParams.frequencyPenalty,
          presencePenalty: openAiRequestParams.presencePenalty,
          stop: openAiRequestParams.stop,
          topP: openAiRequestParams.topP,
          internalTools: internalTools,
          tools,
        },
        parentId,
      )

    const completions = await this.postProcessChatCompletions(
      originalCompletions,
      urlPlaceholderMap,
      fileNameMap,
      snakeCase,
      parentId,
    )

    return completions
  }

  public async getCompletions(
    body: IChatCompletionBody,
    params: IChatRequestParams,
  ) {
    let completions: IChatCompletions | IChatCompletionsSnakeCase
    let spanId: string

    try {
      const userQuestion = body.messages[body.messages.length - 1]['content']
      spanId = this.req.services.arize.initializeSpanChatChain(userQuestion)

      const {
        openAiRequestParams,
        urlPlaceholderMap,
        fileNameMap,
        snakeCase,
        messages,
        internalTools,
        tools,
        generatedQuestion,
      } = await this.prepareCompletion(body, params, spanId)

      let innerSpanId: string
      try {
        innerSpanId = this.req.services.arize.initializeSpanFinalAnswer(
          generatedQuestion || userQuestion,
          spanId,
        )

        completions = await this.chatRequest(
          openAiRequestParams,
          urlPlaceholderMap,
          fileNameMap,
          snakeCase,
          messages,
          internalTools,
          tools,
          innerSpanId,
        )

        this.req.services.arize.setSpanOutputFinalAnswer(
          innerSpanId,
          completions,
        )
        this.req.services.arize.finalizeSpan(innerSpanId)
      } catch (error) {
        this.req.services.arize.setErrorSpanStatus(innerSpanId, error)
        throw error
      }

      this.req.services.arize.setSpanOutputChatChain(spanId, completions)
      this.req.services.arize.finalizeSpan(spanId)

      return completions
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }
  }

  private async postProcessChatCompletions(
    originalCompletions: IChatCompletions,
    urlPlaceholderMap: Map<string, string>,
    fileNameMap: Map<string, string>,
    snakeCase: boolean,
    parentId?: string,
  ) {
    // replace placeholders with links
    for (const choice of originalCompletions.choices) {
      if (choice.message.content) {
        choice.message.content = await this.replacePlaceholdersWithLinks(
          choice.message.content,
          urlPlaceholderMap,
          fileNameMap,
          parentId,
        )
      }
    }

    // Todo: check if needed in streaming as well
    // Enfore created as timestamp
    const transformedCompletions = {
      ...originalCompletions,
      created: Math.floor(new Date().getTime() / 1000),
    }

    // Todo: check if needed in streaming as well
    // Transform keys to snake case
    const completions: IChatCompletions | IChatCompletionsSnakeCase = snakeCase
      ? transformKeysToSnakeCase(transformedCompletions)
      : transformedCompletions

    return completions
  }

  private async summarizeMessages(
    messages: ChatRequestMessageUnion[],
    parentId?: string,
  ) {
    let msg = ''

    forEach(messages, (message) => {
      if (message.role === RoleEnum.user) {
        const content = (message as ChatRequestUserMessage).content
        msg += `${message.role}: ${content} \n`
      } else if (message.role === RoleEnum.assistant) {
        const content = (message as ChatRequestAssistantMessage).content
        msg += `${message.role}: ${content} \n`
      }
    })

    const summarizeConversationSystemMessage =
      this.req.customer.settings.summarizeConversationSystemMessage ||
      DefaultSystemMessageEnum.SUMMARIZE_CONVERSATION

    const prompts = [
      {
        role: RoleEnum.system,
        content: summarizeConversationSystemMessage,
      },
      {
        role: RoleEnum.user,
        content: summarizeConversationPrompt(msg, false) as string,
      },
    ]
    const options = { maxTokens: 500 }

    const response = await this.req.services.langchain.openai.processPrompt(
      prompts,
      ChatRequestType.INTERNAL,
      options,
      parentId,
    )

    return response?.choices?.[0]?.message?.content || ''
  }

  private async getGeneratedQuestion(
    messages: ChatRequestMessageUnion[],
    parentId?: string,
  ) {
    let msg = ''
    let userInput = ''

    forEach(messages.slice(-10), (message) => {
      if (message.role === RoleEnum.user) {
        const content = (message as ChatRequestUserMessage).content
        msg += `${message.role}: ${content} \n`
        userInput = content.toString()
      } else if (message.role === RoleEnum.assistant) {
        const content = (message as ChatRequestAssistantMessage).content
        msg += `${message.role}: ${content} \n`
      }
    })
    const question = await this.generateQuestion(msg, userInput, parentId)

    return question
  }

  private async generateQuestion(
    msg: string,
    userInput: string,
    parentId?: string,
  ) {
    let question = ''
    let spanId: string
    try {
      spanId = this.req.services.arize.initializeSpanGenerateQuestion(
        msg,
        userInput,
        parentId,
      )
      let generateSearchQuerySystemMessage =
        this.req.customer.settings.generateSearchQuerySystemMessage ||
        DefaultSystemMessageEnum.GENERATE_SEARCH_QUERY

      if (this.req.customer.settings.includeDateContext) {
        generateSearchQuerySystemMessage += `\nConsider that the current date is ${new Date().toString()}.`
      }

      const prompts = [
        {
          role: RoleEnum.system,
          content: generateSearchQuerySystemMessage,
        },
        {
          role: RoleEnum.user,
          content: generateSearchQueryPrompt(msg, false) as string,
        },
      ]

      const response = await this.req.services.langchain.openai.processPrompt(
        prompts,
        ChatRequestType.INTERNAL,
        {
          maxTokens: 500,
          temperature: 0.0,
        },
        spanId,
      )

      question = response?.choices?.[0]?.message?.content || ''

      this.req.services.arize.setSpanOutputValue(spanId, question)
      this.req.services.arize.finalizeSpan(spanId)
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }

    return question
  }

  private async getRecords(
    chatData: IChatBody,
    systemMessage: string,
    filter?: AzureAISearchFilterType,
    parentId?: string,
  ) {
    const customer = this.req.customer
    const customerSettings = customer.settings
    const customerId = customer._id.toString()

    const userMessage = chatData.msg
    const question = await this.getGeneratedQuestion(
      [...chatData.history, userMessage],
      parentId,
    )

    let topN = chatData.topN

    if (isNaN(topN)) {
      topN = customerSettings.topN
    }
    if (isNaN(topN)) {
      topN = this.fastify.config.services.default.topN
    }

    if (customerSettings.dynamicNActive) {
      const modelName = this.req.services.langchain.openai.getEngine()
      topN = await this.getTopN(customer, modelName, chatData, systemMessage)
    }

    const sourceLink = await this.getRecordsRequest(
      customer,
      question,
      topN,
      filter,
      customerId,
      parentId,
    )

    return {
      ...sourceLink,
      generatedQuestion: question,
    }
  }

  private async getRecordsRequest(
    customer: Customer,
    question: string,
    topN: number,
    filter: AzureAISearchFilterType,
    customerId: string,
    parentId?: string,
  ) {
    let spanId: string
    let sourceLink
    try {
      spanId = this.req.services.arize.initializeSpanRetrievedRecord(
        question,
        parentId,
      )
      const csSearchData =
        await this.req.services.langchain.embedding.retrieveRecords(
          customer,
          question,
          null,
          topN,
          filter,
          spanId,
        )

      if (customer.aiSearch.directIndex === true) {
        sourceLink = await this.getSourceLinkFromIndex(
          csSearchData,
          question,
          spanId,
        )

        this.req.services.arize.setSpanOutputRetrievedRecord(spanId, sourceLink)
        this.req.services.arize.finalizeSpan(spanId)

        return {
          ...sourceLink,
          generatedQuestion: question,
        }
      }

      sourceLink = await this.getSourceLink(
        customerId,
        csSearchData,
        question,
        spanId,
      )

      this.req.services.arize.setSpanOutputRetrievedRecord(spanId, sourceLink)
      this.req.services.arize.finalizeSpan(spanId)
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }

    return {
      ...sourceLink,
      generatedQuestion: question,
    }
  }

  public async getSourceLink(
    customerId: string,
    csSearchData,
    question: string,
    parentId?: string,
  ) {
    const urlPlaceholderMap = new Map<string, string>()
    const fileNameMap = new Map<string, string>()
    const tracingEnabled = this.req.customer?.arizeSettings?.tracingEnabled
    let records = ''

    let citationId = 0

    for await (const result of csSearchData) {
      citationId++
      let fileName = result[0].metadata.document['title']?.replace(
        /(([0-9]{2,4}-?)+|_chunk_\d+)\.md/g,
        '',
      )

      const regexDatasourceId = `.*?/${DirectoryEnum.chunks}/([0-9|a-z]+)`

      // Find the datasourceId in the file path
      const datasourceId = result[0].metadata.document['filepath'].match(
        new RegExp(regexDatasourceId),
      )?.[1]

      if (!datasourceId) {
        this.fastify.log.error('datasourceId not found in the file path')
        continue
      }

      const datasource = await this.fastify.models.datasource
        .findOne({ _id: datasourceId })
        .exec()

      if (!datasource) {
        this.fastify.log.error(
          `When searching a record for customer ${customerId} datasource ${datasourceId} did not exist`,
        )
        continue
      }

      const searchContent = result[0].metadata.document['content'] // Entire content of the document
      let tags = `citationId='${citationId.toString()}' `

      if (datasource.settings.sourceLinkActive) {
        const fileNameHash = hashText(fileName)
        let url = ''

        try {
          if (fileName) {
            url = await this.req.services.azure.blob.getFileURL(
              fileName,
              datasourceId,
            )
          }

          // If the datasource is a website, the fileName is the URL
          // For overwriting escape characters in the URL -> prevent weird looking link element
          if (datasource.type === DatasourceEnum.WEBSITE) {
            fileName = url
          }

          urlPlaceholderMap.set(fileNameHash, url)
          fileNameMap.set(fileNameHash, fileName)
        } catch (error) {
          urlPlaceholderMap.set(fileNameHash, 'URL_NOT_FOUND')
          fileNameMap.set(fileNameHash, 'FILE_NOT_FOUND')
        }
        tags += `fileId='${fileNameHash}' `
      }

      records += `<context ${tags}>` + `${searchContent}` + '</context>\n'

      if (records === '') {
        records = 'No records found'
      }
    }

    if (tracingEnabled) {
      records = await this.traceSourceLinking(
        question,
        records,
        csSearchData,
        parentId,
      )
    } //ToDo: add datasource map with only datasources where sourcelink active

    return { records, urlPlaceholderMap, fileNameMap }
  }

  public async getSourceLinkFromIndex(
    csSearchData,
    question: string,
    parentId?: string,
  ) {
    const urlPlaceholderMap = new Map<string, string>()
    const fileNameMap = new Map<string, string>()
    let records = ''

    let citationId = 0

    for await (const result of csSearchData) {
      citationId++
      const fileName = result[0].metadata.document['title']?.replace(
        /(([0-9]{2,4}-?)+|_chunk_\d+)\.md/g,
        '',
      )

      const searchContent = result[0].metadata.document['content'] // Entire content of the document
      let tags = `citationId='${citationId.toString()}' `

      const fileNameHash = fileName
        ? hashText(fileName)
        : hashText(result[0].metadata.document['id'])

      try {
        const url = result[0].metadata.document['filepath']
        urlPlaceholderMap.set(fileNameHash, url)
        fileNameMap.set(fileNameHash, fileName)
      } catch (error) {
        urlPlaceholderMap.set(fileNameHash, 'URL_NOT_FOUND')
        fileNameMap.set(fileNameHash, 'FILE_NOT_FOUND')
      }
      tags += `fileId='${fileNameHash}' `

      records += `<context ${tags}>` + `${searchContent}` + '</context>\n'

      if (records === '') {
        records = 'No records found'
      }
    }
    await this.traceProcessDocuments(question, csSearchData, parentId, true)

    return { records, urlPlaceholderMap, fileNameMap } //ToDo: add datasource map with only datasources where sourcelink active
  }

  public async traceProcessDocuments(
    question: string,
    csSearchData,
    parentId?: string,
    directIndex = false,
  ) {
    let spanId: string
    try {
      spanId = this.req.services.arize.initializeSpanProcessDocuments(
        question,
        parentId,
      )
      if (directIndex == false) {
        await this.req.services.arize.setSpanOutputProcessDocuments(
          spanId,
          csSearchData,
        )
      } else {
        await this.req.services.arize.setSpanOutputProcessDocumentsDirectIndex(
          spanId,
          csSearchData,
        )
      }
      this.req.services.arize.finalizeSpan(spanId)
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }
  }

  public prepareChatData(body: IChatCompletionBody) {
    const messages = body.messages
    const message = messages.slice(-1)[0]
    const history = messages.slice(0, -1)

    const tokenLimit =
      body.max_tokens || this.req.customer.settings?.maxResponseTokens

    const frequencyPenalty =
      body.frequency_penalty || this.req.customer.settings?.frequencyPenalty

    const presencePenalty =
      body.presence_penalty || this.req.customer.settings?.presencePenalty

    const temperature =
      body.temperature || this.req.customer.settings?.temperature

    const topP = body.top_p || this.req.customer.settings?.topP

    const stopInput = body.stop || this.req.customer.settings?.stop
    const stop = Array.isArray(stopInput)
      ? stopInput.filter(Boolean)
      : stopInput
      ? [stopInput].filter(Boolean)
      : null

    const plainAOAI =
      this.req.customer.datasources.length === 0 || body.plainAOAI

    const stream = body.stream || false

    return {
      msg: message,
      history,
      tokenLimit: tokenLimit,
      topN: body.topN,
      temperature: temperature,
      topP: topP,
      frequencyPenalty: frequencyPenalty,
      presencePenalty: presencePenalty,
      stop: stop,
      plainAOAI: plainAOAI,
      stream: stream,
    } as IChatBody
  }

  public async prepareMessages(
    chatData: IChatBody,
    internalTools: DynamicTool[],
    filter?: AzureAISearchFilterType,
    parentId?: string,
  ) {
    const customer = this.req.customer
    let reactOnUserMessageSystemMessage =
      customer.settings.reactOnUserMessageSystemMessage ||
      DefaultSystemMessageEnum.REACT_ON_USER_MESSAGE
    let urlPlaceholderMap = new Map<string, string>()
    let fileNameMap = new Map<string, string>()
    const templatedPrompt = chatData.msg
    let history = chatData.history
    const messages = []
    let generatedQuestion: string
    const lastMessage = chatData.msg

    // Dealing with Snowflake tools
    if (
      internalTools &&
      internalTools.some((tool) =>
        tool.name.includes(InternalToolEnum.SNOWFLAKE),
      )
    ) {
      reactOnUserMessageSystemMessage = await this.treatSnowflakeTools(
        internalTools,
        reactOnUserMessageSystemMessage,
      )
    }

    if (chatData.plainAOAI) {
      history = chatData.history
    } else {
      if (customer.settings.sourceLinkActive) {
        reactOnUserMessageSystemMessage +=
          customer.settings.sourceLinkInstructionSystemMessage ||
          DefaultSystemMessageEnum.SOURCE_LINK_INSTRUCTION
      }

      history = await this.generateHistory(chatData, customer, parentId)

      const records = await this.getRecords(
        chatData,
        reactOnUserMessageSystemMessage,
        filter,
        parentId,
      )
      urlPlaceholderMap = records.urlPlaceholderMap
      fileNameMap = records.fileNameMap
      generatedQuestion = records.generatedQuestion

      if (typeof lastMessage.content === 'string') {
        if (customer.settings.includeDateContext) {
          lastMessage.content += `\nConsider that the current date is ${new Date().toString()}.`
        }
        templatedPrompt.content = reactOnUserMessagePrompt(
          lastMessage.content,
          records.records,
        ) as string
      } else if (typeof lastMessage.content === 'object') {
        if (lastMessage.content.length > 0) {
          templatedPrompt.content = lastMessage.content.map(
            (item: ChatMessageContentItemUnion) => {
              switch (item.type) {
                case 'text': {
                  const textItem = item as ChatMessageTextContentItem
                  if (customer.settings.includeDateContext) {
                    textItem.text += `\nConsider that the current date is ${new Date().toString()}.`
                  }
                  textItem.text = reactOnUserMessagePrompt(
                    textItem.text,
                    records.records,
                  ) as string

                  return textItem
                }
                case 'image': {
                  const imageItem = item as ChatMessageImageContentItem

                  return imageItem
                }
                default: {
                  return item
                }
              }
            },
          )
        }
      }
    }

    if (!chatData.plainAOAI) {
      messages.push({
        role: RoleEnum.system,
        content: reactOnUserMessageSystemMessage,
      })
    }

    messages.push(
      ...history, // history can consist of additional system messages as well
      {
        role: RoleEnum.user,
        content: templatedPrompt,
      },
    )

    return {
      messages: messages,
      urlPlaceholderMap,
      fileNameMap,
      generatedQuestion,
    }
  }

  private async generateHistory(
    chatData: IChatBody,
    customer: Customer,
    parentId?: string,
  ) {
    const historyCount = +customer.settings?.historyCount
    const index = -1 * historyCount
    const history = chatData.history.slice(index)
    const summarizedMessages = chatData.history.slice(0, index)
    let spanId: string
    try {
      spanId = this.req.services.arize.initializeSpanGenerateHistory(
        chatData,
        parentId,
      )

      let summary = ''
      if (summarizedMessages.length > 0) {
        summary =
          'The following is a summary of the previous conversion: \n' +
          (await this.summarizeMessages(summarizedMessages, spanId))
        history.unshift({ role: RoleEnum.assistant, content: summary })
      }

      this.req.services.arize.setSpanOutputGenerateHistory(
        spanId,
        history,
        summary,
      )
      this.req.services.arize.finalizeSpan(spanId)

      return history
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }
  }

  private async getTopN(
    customer: Customer,
    model: string,
    chatData: IChatBody,
    systemMessage: string,
  ) {
    let topN = 8 // Artificially set default value to 8
    try {
      const modelUsed =
        await this.fastify.models.largeLanguageModelVersion.find({
          name: model,
        })

      const tokenCharRation = 4 // Assumption 1 token ~ 4 bytes ~ 4 characters
      const modelMaxTokens = Number(modelUsed.map((m) => m.maxTokens))
      const maxCapacityTokens = modelMaxTokens

      const userPromptTokens = chatData.msg.content.length / tokenCharRation
      const historyTokens =
        (
          chatData.history as (
            | ChatRequestAssistantMessage
            | ChatRequestUserMessage
            | ChatRequestSystemMessage
          )[]
        ).reduce((acc, message) => acc + message.content.length, 0) /
        tokenCharRation

      const reactOnUserMessageSystemMessageTokens =
        systemMessage.length / tokenCharRation

      const maxResponseTokens = customer.settings.maxResponseTokens
      const fixedTokens =
        maxResponseTokens + reactOnUserMessageSystemMessageTokens
      const chunkSize = 8192 // max chunk size for text-embedding-ada-002
      // TODO: Discuss about is DynamicNActive should be removed as a feature

      const preallocatedTokens = fixedTokens + historyTokens + userPromptTokens

      const remainingTokens = maxCapacityTokens - preallocatedTokens
      topN = Math.floor(remainingTokens / chunkSize)
    } catch (error) {
      this.fastify.log.error('Model not found', error.message)
      throw error
    }

    return topN
  }

  private async replacePlaceholdersWithLinks(
    content: string,
    urls: Map<string, string>,
    fileNames: Map<string, string>,
    parentId?: string,
  ) {
    const finalContent = await this.replacePlaceholdersWithLinksWithTracing(
      content,
      urls,
      fileNames,
      parentId,
    )

    return finalContent
  }

  private async replacePlaceholdersWithLinksWithTracing(
    content: string,
    urls: Map<string, string>,
    fileNames: Map<string, string>,
    parentId?: string,
  ): Promise<string> {
    let spanId: string
    try {
      spanId = this.req.services.arize.initializeSpanSourcelinkReplacement(
        content,
        fileNames,
        urls,
        parentId,
      )
      urls.forEach((url, placeholder) => {
        const regex = new RegExp(placeholder, 'gi')
        const fileName = fileNames.get(placeholder)
        const markdownLink = `[${fileName}](${url})`
        content = content.replace(regex, markdownLink)
      })

      this.req.services.arize.setSpanOutputValue(spanId, content)
      this.req.services.arize.finalizeSpan(spanId)

      return content
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }
  }

  private async treatSnowflakeTools(
    internalTools: DynamicTool[],
    reactOnUserMessageSystemMessage: string,
  ) {
    const dbTools = this.req.customer.internalTools
    const customerTools = await this.fastify.models.internalTool
      .find({
        _id: { $in: dbTools },
      })
      .exec()
    const customerSnowflakeTools = customerTools.filter(
      (tool) => tool.type === InternalToolEnum.SNOWFLAKE,
    )

    for (const snowflakeTool of customerSnowflakeTools) {
      if (
        internalTools.some((tool) =>
          tool.tags.some((tag) => tag === snowflakeTool.displayName),
        )
      ) {
        const tables = snowflakeTool?.settings?.snowflake?.table
        if (tables.length > 0) {
          reactOnUserMessageSystemMessage += `\nSnowflake Schema information:\n`
          for (const table of tables) {
            try {
              const tableDefinition =
                await this.req.services.tooling.snowflake.getSchemaDefinition(
                  snowflakeTool,
                  table,
                )
              reactOnUserMessageSystemMessage += `Table name: ${table}. \nTable definition: ${tableDefinition}\n`
            } catch (error) {
              this.fastify.log.error(
                `Failed to get schema definition for table ${table}:`,
                error.message,
              )
              throw error
            }
          }
        }
      }
    }

    return reactOnUserMessageSystemMessage
  }

  private async processFilters(body: IChatCompletionBody) {
    let combinedFilterExpression = ''
    const customer = this.req.customer
    const hasBodyFilter = body.filter && body.filter.length > 0
    const hasBodyKeywords = body.keywords && body.keywords.length > 0
    const hasBodyfilterButton =
      body.filter_button && body.filter_button.length > 0
    const isNoFilterNeeded =
      !hasBodyFilter && !hasBodyKeywords && !hasBodyfilterButton

    if (isNoFilterNeeded) {
      return { filterExpression: '' } as AzureAISearchFilterType
    }

    if (
      customer.datasources.length != 0 &&
      customer.aiSearch?.skillsetName !=
        SkillsetNameEnum.EMBEDDING_RELATIVEPATH_SKILL &&
      customer.aiSearch?.skillsetName != SkillsetNameEnum.EXTRACT_RELATIVE_PATH
    ) {
      this.fastify.log.error(
        `Failed to get datasource for customer ${customer._id.toString()}`,
      )
      throw new Error(
        'No datasources found for the customer or the customer is using the wrong skillset',
      )
    }

    if (hasBodyfilterButton) {
      const buttonFilterandKeywords =
        await this.req.services.azure.cognitiveSearch.extractButtonFilterAndKeywords(
          body,
        )
      body.filter = buttonFilterandKeywords.filters
      body.keywords = buttonFilterandKeywords.keywords
    }

    let filter =
      (hasBodyFilter || hasBodyfilterButton) &&
      (await this.req.services.azure.cognitiveSearch.prepareFilters(body))

    // HotFix for GCO
    if (!customer.settings.sourceFilterActive && body.filter.length === 0) {
      filter = null
    }

    const keywords =
      (hasBodyKeywords || hasBodyfilterButton) &&
      (await this.req.services.azure.cognitiveSearch.prepareKeywords(body))

    if (filter) {
      combinedFilterExpression += `${filter.filterExpression}`
    }

    if (keywords) {
      if (combinedFilterExpression) {
        combinedFilterExpression += ' or '
      }
      combinedFilterExpression += `${keywords.filterExpression}`
    }

    const finalFilter: AzureAISearchFilterType = {
      filterExpression: combinedFilterExpression,
    }

    return finalFilter
  }

  private async getOpenAiRequestParams(chatData: IChatBody) {
    const customer = this.req.customer
    const ignoreOpenAIParamsInBody = customer.settings.ignoreOpenAIParamsInBody
    const maxTokens = ignoreOpenAIParamsInBody
      ? customer.settings.maxResponseTokens
      : chatData.tokenLimit
    const temperature = ignoreOpenAIParamsInBody
      ? customer.settings.temperature
      : Number(chatData.temperature)
    const frequencyPenalty = ignoreOpenAIParamsInBody
      ? customer.settings.frequencyPenalty
      : chatData.frequencyPenalty
    const presencePenalty = ignoreOpenAIParamsInBody
      ? customer.settings.presencePenalty
      : chatData.presencePenalty
    const stop = ignoreOpenAIParamsInBody
      ? customer.settings.stop
      : chatData.stop
    const topP = ignoreOpenAIParamsInBody
      ? customer.settings.topP
      : chatData.topP

    return {
      maxTokens: maxTokens,
      temperature: temperature,
      frequencyPenalty: frequencyPenalty,
      presencePenalty: presencePenalty,
      stop: stop,
      topP: topP,
    }
  }

  // Sourcelinking functions:
  private async traceSourceLinking(
    question: string,
    records: string,
    csSearchData,
    parentId?: string,
  ) {
    let spanId: string
    try {
      spanId = this.req.services.arize.initializeSpanProcessDocuments(
        question,
        parentId,
      )
      await this.req.services.arize.setSpanOutputProcessDocuments(
        spanId,
        csSearchData,
      )
      this.req.services.arize.finalizeSpan(spanId)

      return records
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }
  }
}
