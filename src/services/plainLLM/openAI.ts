import { FastifyReply } from 'fastify'
import createError from 'http-errors'

import {
  ChatRequestType,
  EmbeddingRequestType,
  ModelTypeEnum,
} from '../../constants'
import {
  IApiCallPrepParams,
  IChatRequestParams,
  IOpenAiInstance,
  IUsageData,
} from '../../customTypes'
import BaseService from '../base'

export default class OpenAI extends BaseService {
  private _openAiInstance: IOpenAiInstance

  public async chat(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    params: IChatRequestParams,
  ) {
    const { url, bodyStringified, apiKey } =
      await this.prepareApiCallParameters({
        body,
        engine: params.engine,
        apiVersion: params.apiVersion,
        modelType: ModelTypeEnum.LLM,
        stream: false,
      })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: bodyStringified,
    })

    if (!response.ok) {
      await this.propagateError(response)
    }

    const completion = await response.json()

    const {
      gptModel,
      incomingTokenCount,
      incomingTokenCountDetails,
      outgoingTokenCount,
      outgoingTokenCountDetails,
    } = await this.extractUsageData(completion)

    const type = ChatRequestType.PLAIN

    await this.req.services.costTracking.trackChatRequest({
      gptModel,
      incomingTokenCount,
      incomingTokenCountDetails,
      outgoingTokenCount,
      outgoingTokenCountDetails,
      type,
    })

    return completion
  }

  public async stream(
    reply: FastifyReply,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    params: IChatRequestParams,
  ) {
    const { url, bodyStringified, apiKey } =
      await this.prepareApiCallParameters({
        body,
        engine: params.engine,
        apiVersion: params.apiVersion,
        modelType: ModelTypeEnum.LLM,
        stream: true,
      })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: bodyStringified,
    })

    if (!response.body) {
      throw new Error('No response body')
    }

    if (!response.ok) {
      await this.propagateError(response)
    }

    // Set up streaming response headers
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    let error = false
    while (!error) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      error = await this.trackStreamingUsage(chunk)
      reply.raw.write(`${chunk}`)
    }
    reply.raw.end()
  }

  public async embeddings(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
    params: IChatRequestParams,
  ) {
    const { url, bodyStringified, apiKey } =
      await this.prepareApiCallParameters({
        body,
        engine: params.engine,
        apiVersion: params.apiVersion,
        modelType: ModelTypeEnum.EMBEDDING,
        stream: false,
      })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: bodyStringified,
    })

    if (!response.ok) {
      await this.propagateError(response)
    }

    const responseData = await response.json()

    await this.req.services.langchain.embedding.registerEmbedding(
      responseData,
      EmbeddingRequestType.PLAIN,
    )

    return responseData
  }

  private async prepareApiCallParameters(params: IApiCallPrepParams) {
    const clonedBody = JSON.parse(JSON.stringify(params.body))
    const passedEngine = params.body.model || params.engine
    const passedApiVersion = params.apiVersion

    this._openAiInstance = await this.req.services.loadbalancer.getInstance(
      passedEngine,
      params.modelType,
    )

    // Set the engine so that the request cost can be handled correctly
    if (params.modelType === ModelTypeEnum.LLM) {
      this.req.services.langchain.openai.setEngine(
        passedEngine,
        passedApiVersion,
      )
    } else {
      this.req.services.langchain.embedding.setEngine(
        passedEngine,
        passedApiVersion,
      )
    }

    const { instanceUrl, deploymentName, apiVersion, apiKey } =
      this._openAiInstance

    if (params.stream) {
      clonedBody.stream = true
      clonedBody.stream_options = { include_usage: true }
    }

    const queryParamApiVersion = passedApiVersion || apiVersion

    const url =
      params.modelType === ModelTypeEnum.LLM
        ? `${instanceUrl}/openai/deployments/${deploymentName}/chat/completions?api-version=${queryParamApiVersion}`
        : `${instanceUrl}/openai/deployments/${deploymentName}/embeddings?api-version=${queryParamApiVersion}`

    return {
      url,
      bodyStringified: JSON.stringify(clonedBody),
      apiKey,
    }
  }

  public async getCostOfCompletion(completion): Promise<number> {
    const {
      gptModel,
      incomingTokenCount,
      outgoingTokenCount,
      outgoingTokenCountDetails,
    } = await this.req.services.plainLLM.openAI.extractUsageData(completion)

    const cost = this.req.services.costTracking.calculateChatRequestCost(
      gptModel,
      incomingTokenCount,
      outgoingTokenCount,
      outgoingTokenCountDetails.cached_tokens,
    )

    return cost
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async extractUsageData(completion: any): Promise<IUsageData> {
    const usageData = completion.usage || {}
    const gptModelName = this.req.services.langchain.openai.getEngine()
    const gptModel =
      await this.req.services.largeLanguageModelVersion.getLatestByModelName(
        gptModelName,
      )

    const incomingTokenCount =
      usageData?.completionTokens || usageData?.completion_tokens || 0

    const outgoingTokenCount =
      usageData?.promptTokens || usageData?.prompt_tokens || 0

    const outgoingTokenCountDetails = usageData?.prompt_tokens_details || {
      cached_tokens: 0,
      audio_tokens: 0,
    }

    const incomingTokenCountDetails = usageData?.completion_tokens_details || {
      accepted_prediction_tokens: 0,
      audio_tokens: 0,
      reasoning_tokens: 0,
      rejected_prediction_tokens: 0,
    }

    return {
      gptModel,
      incomingTokenCount,
      incomingTokenCountDetails,
      outgoingTokenCount,
      outgoingTokenCountDetails,
    }
  }

  private async propagateError(response: Response) {
    const responseData = await response.json()
    const statusText = response.statusText
    const error = createError(response.status, {
      ...responseData,
      statusText,
    })

    throw error
  }

  private async trackStreamingUsage(chunk: string): Promise<boolean> {
    // Split the chunk into individual events
    const events = chunk.split('\n\n').filter((event) => event.trim() !== '')
    let buffer = ''
    let data = ''

    for (const event of events) {
      // Only process valid json events
      if (!event.startsWith('data: ') && event.endsWith('}')) {
        data = buffer + event
      } else {
        data = event.slice(6).trim() // Remove 'data: ' prefix and trim whitespace
      }
      if (data === '[DONE]') {
        return true
      }

      try {
        JSON.parse(data) // Check if data is valid JSON
      } catch {
        buffer = data // If not valid JSON, store it in the buffer
        break
      }

      const jsonChunk = JSON.parse(data)

      if (jsonChunk.usage) {
        const completion = jsonChunk

        await this.req.services.langchain.openai.registerChatRequest(
          completion,
          ChatRequestType.PLAIN,
        )
      }
    }

    return false
  }
}
