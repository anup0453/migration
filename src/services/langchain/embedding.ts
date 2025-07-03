import { AzureAISearchFilterType } from '@langchain/community/vectorstores/azure_aisearch'
import { Document } from '@langchain/core/documents'
import { OpenAIEmbeddings } from '@langchain/openai'

import { EmbeddingRequestType, ModelTypeEnum } from '../../constants'
import { IEmbeddingsResponse, IOpenAiInstance } from '../../customTypes'
import { Customer } from '../../models/types'
import { getTokenCount } from '../../utils'
import { GAIAAzureAISearchVectorStore } from '../../utils/langchain'
import BaseService from '../base'

export default class LangchainEmbeddingService extends BaseService {
  private _openAIEmbeddingClient: OpenAIEmbeddings
  private _openAiEmbeddingsInstance: IOpenAiInstance
  private _openAiEmbeddingEngine: string
  private _queryParamApiVersion: string

  public async retrieveRecords(
    customer: Customer,
    input: string,
    queryVector: number[] = null,
    topN = 3,
    filter?: AzureAISearchFilterType,
    parentId?: string,
  ): Promise<[Document, number][]> {
    const result = await this.retrieveRecordsWithTracing(
      customer,
      input,
      queryVector,
      topN,
      filter,
      parentId,
    )

    return result
  }

  private async retrieveRecordsRequest(
    customer: Customer,
    input: string,
    queryVector: number[] | IEmbeddingsResponse = null,
    topN = 3,
    spanId?: string,
    filter?: AzureAISearchFilterType,
  ): Promise<[Document, number][]> {
    let result: [Document, number][]
    let has429: boolean

    do {
      has429 = false
      await this.openAiEmbeddingsClient()

      const store = new GAIAAzureAISearchVectorStore(
        this._openAIEmbeddingClient,
        {
          endpoint: customer.aiSearch.endpoint,
          indexName: customer.aiSearch.indexName,
          key: customer.aiSearch.apiKey,
        },
      )

      try {
        queryVector = await this.getEmbeddings(
          input,
          EmbeddingRequestType.MANUAL,
        )
        result = await store.semanticHybridSearchVectorWithScore(
          input,
          queryVector.data[0].embedding,
          topN,
          filter,
        )
        this.req.services.arize.setSpanOutputEmbedding(
          spanId,
          queryVector as unknown as IEmbeddingsResponse,
        )
      } catch (error) {
        // here code field is really string type!
        if (error.code === '429') {
          has429 = true
          await this.req.services.loadbalancer.removeInstance(
            this._openAiEmbeddingsInstance,
            this._openAiEmbeddingEngine,
            ModelTypeEnum.EMBEDDING,
          )
          this._openAiEmbeddingsInstance = null
        } else {
          throw Error(error)
        }
      }
    } while (has429)

    return result
  }

  private async retrieveRecordsWithTracing(
    customer: Customer,
    input: string,
    queryVector: number[] = null,
    topN = 3,
    filter?: AzureAISearchFilterType,
    parentId?: string,
  ): Promise<[Document, number][]> {
    let spanId: string
    try {
      spanId = this.req.services.arize.initializeSpanEmbedding(
        input,
        this._openAiEmbeddingEngine,
        parentId,
      )

      const result = await this.retrieveRecordsRequest(
        customer,
        input,
        queryVector,
        topN,
        spanId,
        filter,
      )

      this.req.services.arize.finalizeSpan(spanId)

      return result
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }
  }

  public async retrieveEmbeddings(
    input: string | string[],
    embeddingType: EmbeddingRequestType,
  ): Promise<IEmbeddingsResponse> {
    return await this.retrieveEmbeddingsWithTracing(input, embeddingType)
  }

  private async getEmbeddings(
    input: string | string[],
    embeddingType: EmbeddingRequestType,
  ): Promise<IEmbeddingsResponse> {
    let embeddings: number[] | number[][]
    let has429: boolean

    do {
      has429 = false
      await this.openAiEmbeddingsClient()

      try {
        embeddings =
          typeof input === 'string'
            ? await this._openAIEmbeddingClient.embedQuery(input)
            : await this._openAIEmbeddingClient.embedDocuments(input)
      } catch (error) {
        if (error.status === 429) {
          has429 = true
          await this.req.services.loadbalancer.removeInstance(
            this._openAiEmbeddingsInstance,
            this._openAiEmbeddingEngine,
            ModelTypeEnum.EMBEDDING,
          )
          this._openAiEmbeddingsInstance = null
        } else {
          throw Error(error)
        }
      }
    } while (has429)

    const result = await this.createEmbeddingsResponse(input, embeddings)

    await this.registerEmbedding(result, embeddingType)

    return result
  }

  private async retrieveEmbeddingsWithTracing(
    input: string | string[],
    embeddingType: EmbeddingRequestType,
  ): Promise<IEmbeddingsResponse> {
    let spanId: string
    try {
      spanId = this.req.services.arize.initializeSpanEmbedding(
        input,
        this._openAiEmbeddingEngine,
      )
      const result = await this.getEmbeddings(input, embeddingType)
      this.req.services.arize.setSpanOutputEmbedding(spanId, result)
      this.req.services.arize.finalizeSpan(spanId)

      return result
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }
  }

  // Embedding response needs to be created as there is no raw response from the Langchain Azure OpenAI Embeddings API
  private async createEmbeddingsResponse(
    input: string | string[],
    embeddings: number[] | number[][],
  ) {
    // Enforce same type for input and embeddings
    input = typeof input === 'string' ? [input] : input

    embeddings = Array.isArray(embeddings[0])
      ? embeddings
      : [embeddings as number[]]

    const tokenCount = input
      .map((input) => getTokenCount(input))
      .reduce((a, b) => a + b, 0)

    const result: IEmbeddingsResponse = {
      object: 'list',
      data: (embeddings as number[][]).map((embedding, index) => ({
        object: 'embedding',
        embedding,
        index,
      })),
      model: this._openAiEmbeddingsInstance.modelName,
      usage: {
        prompt_tokens: tokenCount,
        total_tokens: tokenCount,
      },
    }

    return result
  }

  public async registerEmbedding(completion, type: EmbeddingRequestType) {
    const usageData = completion.usage || {}
    const tokenCount = usageData?.prompt_tokens || 0

    const embeddingModelName = this.req.services.langchain.embedding.getEngine()
    const embeddingModel =
      await this.req.services.embeddingModelVersion.getLatestByModelName(
        embeddingModelName,
      )

    await this.req.services.costTracking.trackEmbedding({
      embeddingModel,
      tokenCount,
      type,
    })
  }

  public setEngine(engine: string, apiVersion: string) {
    this._openAiEmbeddingEngine = this.sanitizeEngine(engine)
    this._queryParamApiVersion = apiVersion
  }

  public getEngine() {
    return this._openAiEmbeddingEngine
  }

  public sanitizeEngine(engine: string) {
    if (
      !this.fastify.config.services.azure.supportedEmbedddingModels.includes(
        engine,
      )
    ) {
      return this.req.services.customer.getDefaultEmbeddingVersion()
    }

    return engine
  }

  public async openAiEmbeddingsClient() {
    if (!this._openAiEmbeddingsInstance) {
      this._openAiEmbeddingsInstance =
        await this.req.services.loadbalancer.getInstance(
          this._openAiEmbeddingEngine,
          ModelTypeEnum.EMBEDDING,
        )

      if (this._queryParamApiVersion) {
        // Override default api version with the one passed in the query param
        this._openAiEmbeddingsInstance.apiVersion = this._queryParamApiVersion
      }

      this._openAIEmbeddingClient = new OpenAIEmbeddings({
        modelName: this._openAiEmbeddingsInstance.modelName,
        azureOpenAIApiKey: this._openAiEmbeddingsInstance.apiKey,
        azureOpenAIApiDeploymentName: this._openAiEmbeddingsInstance.modelName,
        azureOpenAIApiInstanceName: this._openAiEmbeddingsInstance.instanceName,
        azureOpenAIApiVersion: this._openAiEmbeddingsInstance.apiVersion,
        maxRetries: 0,
      })
    }

    return this._openAIEmbeddingClient
  }
}
