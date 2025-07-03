import {
  AzureKeyCredential,
  ScoringProfile,
  SearchField,
  SearchIndexClient,
  SearchIndexerClient,
  SemanticSearch,
  VectorSearch,
} from '@azure/search-documents'
import { AzureAISearchFilterType } from '@langchain/community/vectorstores/azure_aisearch'
import { BadRequest } from 'http-errors'

import { DirectoryEnum, SkillsetNameEnum } from '../../constants'
import { IChatCompletionBody } from '../../customTypes'
import {
  Customer,
  CustomerFrontendSettingFilterButton,
} from '../../models/types'
import BaseService from '../base'

export default class AzureCognitiveSearchService extends BaseService {
  private async checkIndexProcessCompletion(
    client: SearchIndexerClient,
    indexer: string,
    indexType?: 'reset',
  ) {
    const { lastResult } = await client.getIndexerStatus(indexer)

    const indexReRun =
      indexType === 'reset'
        ? !lastResult.endTime
        : lastResult.status !== 'success'

    if (indexReRun) {
      const duration =
        +this.fastify.config.services.azure.searchIndexerPollDuration
      await new Promise((resolve) => setTimeout(() => resolve(true), duration))
      await this.checkIndexProcessCompletion(client, indexer, indexType)
    }
  }

  public async runIndexer(name: string) {
    const indexerClient = new SearchIndexerClient(
      this.fastify.config.services.azure.searchEndpoint as string,
      new AzureKeyCredential(
        this.fastify.config.services.azure.searchApiKey as string,
      ),
    )

    return await indexerClient.runIndexer(name)
  }

  public async resetIndexer(name: string) {
    const indexerClient = new SearchIndexerClient(
      this.fastify.config.services.azure.searchEndpoint as string,
      new AzureKeyCredential(
        this.fastify.config.services.azure.searchApiKey as string,
      ),
    )

    await indexerClient.resetIndexer(name)
    await this.checkIndexProcessCompletion(indexerClient, name, 'reset')

    return await this.runIndexer(name)
  }

  public async createIndexer(
    name: string,
    index: string,
    datasource: string,
    skillsetName: SkillsetNameEnum,
  ) {
    const indexerClient = new SearchIndexerClient(
      this.fastify.config.services.azure.searchEndpoint as string,
      new AzureKeyCredential(
        this.fastify.config.services.azure.searchApiKey as string,
      ),
    )

    return await indexerClient.createIndexer({
      //TODO: Either create a local splitter or add the Azure skillset as used in Nexus
      //skillsetName: this.fastify.config.services.azure.skillsetName as string,
      // The Skillset is in comment, due to the Azure costs problem so we can deploy a new version of the bot
      name,
      targetIndexName: index,
      dataSourceName: datasource,
      skillsetName: skillsetName as string,
      outputFieldMappings: [
        {
          sourceFieldName: '/document/content',
          targetFieldName: 'content',
        },
        {
          sourceFieldName: '/document/metadata_storage_name',
          targetFieldName: 'title',
        },
        {
          sourceFieldName: '/document/metadata_storage_path',
          targetFieldName: 'filepath',
        },
        {
          sourceFieldName: '/document/embedding',
          targetFieldName: 'contentVector',
        },
        {
          sourceFieldName: '/document/relative_path',
          targetFieldName: 'relative_path',
        },
        {
          sourceFieldName: '/document/container_name',
          targetFieldName: 'container_name',
        },
        {
          sourceFieldName: '/document/datasource_id',
          targetFieldName: 'datasource_id',
        },
        {
          sourceFieldName: '/document/folder1',
          targetFieldName: 'folder1',
        },
        {
          sourceFieldName: '/document/folder2',
          targetFieldName: 'folder2',
        },
        {
          sourceFieldName: '/document/folder3',
          targetFieldName: 'folder3',
        },
        {
          sourceFieldName: '/document/folder4',
          targetFieldName: 'folder4',
        },
        {
          sourceFieldName: '/document/folder5',
          targetFieldName: 'folder5',
        },
        {
          sourceFieldName: '/document/folder6',
          targetFieldName: 'folder6',
        },
        {
          sourceFieldName: '/document/folder7',
          targetFieldName: 'folder7',
        },
        {
          sourceFieldName: '/document/folder8',
          targetFieldName: 'folder8',
        },
        {
          sourceFieldName: '/document/file_name',
          targetFieldName: 'file_name',
        },
        {
          sourceFieldName: '/document/chunk_name',
          targetFieldName: 'chunk_name',
        },
        {
          sourceFieldName: '/document/metadata_storage_last_modified',
          targetFieldName: 'last_updated',
        },
      ],
    })
  }

  public async createDataSourceConnection(
    name: string,
    containerName: string,
    containerConnectionString: string,
  ) {
    const indexerClient = new SearchIndexerClient(
      this.fastify.config.services.azure.searchEndpoint as string,
      new AzureKeyCredential(
        this.fastify.config.services.azure.searchApiKey as string,
      ),
    )

    try {
      return await indexerClient.createDataSourceConnection({
        name,
        connectionString: containerConnectionString,
        type: 'azureblob',
        dataDeletionDetectionPolicy: {
          odatatype:
            '#Microsoft.Azure.Search.NativeBlobSoftDeleteDeletionDetectionPolicy',
        },
        dataChangeDetectionPolicy: {
          odatatype:
            '#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy',
          highWaterMarkColumnName: 'metadata_storage_last_modified',
        },
        container: {
          name: containerName,
          query: DirectoryEnum.chunks,
        },
      })
    } catch (e) {
      this.fastify.log.error(
        `Could not create datasource connection ${name} for container ${containerName}: `,
        e.message,
      )

      throw new BadRequest(
        `Could not create datasource connection ${name} for container ${containerName}`,
      )
    }
  }

  public async createIndex(
    name: string,
    skillsetName?: SkillsetNameEnum,
    indexer?: string,
    datasource?: string,
  ) {
    const indexClient = new SearchIndexClient(
      this.fastify.config.services.azure.searchEndpoint as string,
      new AzureKeyCredential(
        this.fastify.config.services.azure.searchApiKey as string,
      ),
    )

    const fields = this.getDefaultIndexFields()
    const vectorSearchConfig = this.getVectorIndexConfig()
    const semanticSearchSettings = this.getSemanticIndexConfig()
    const scroringProfileConfig = this.getScoringProfileIndexConfig()

    try {
      const idx = await indexClient.createIndex({
        name,
        fields,
        vectorSearch: vectorSearchConfig,
        semanticSearch: semanticSearchSettings,
        scoringProfiles: scroringProfileConfig,
      })

      if (indexer) {
        await this.createIndexer(indexer, name, datasource, skillsetName)
      }

      return idx
    } catch (e) {
      this.fastify.log.error(`Could not create Index ${name}: `, e.message)

      throw new BadRequest(`Could not create Index ${name}`)
    }
  }

  public deleteDataSourceConnection(name: string) {
    const indexerClient = new SearchIndexerClient(
      this.fastify.config.services.azure.searchEndpoint as string,
      new AzureKeyCredential(
        this.fastify.config.services.azure.searchApiKey as string,
      ),
    )

    return indexerClient.deleteDataSourceConnection(name)
  }

  public async deleteIndexer(indexerName: string) {
    const indexerClient = new SearchIndexerClient(
      this.fastify.config.services.azure.searchEndpoint as string,
      new AzureKeyCredential(
        this.fastify.config.services.azure.searchApiKey as string,
      ),
    )

    return await indexerClient.deleteIndexer(indexerName)
  }

  public async deleteIndex(indexName: string) {
    const indexClient = new SearchIndexClient(
      this.fastify.config.services.azure.searchEndpoint as string,
      new AzureKeyCredential(
        this.fastify.config.services.azure.searchApiKey as string,
      ),
    )

    try {
      return await indexClient.deleteIndex(indexName)
    } catch (e) {
      this.fastify.log.error(
        `Could not delete index with name ${indexName}: `,
        e.message,
      )
    }
  }

  public async findOneIndexByName(indexName: string) {
    const indexClient = new SearchIndexClient(
      this.fastify.config.services.azure.searchEndpoint as string,
      new AzureKeyCredential(
        this.fastify.config.services.azure.searchApiKey as string,
      ),
    )

    const data = []

    for await (const idx of indexClient.listIndexes()) {
      data.push(idx)
    }

    return data.find((idx) => idx.name === indexName)
  }

  public async listIndexes() {
    const indexClient = new SearchIndexClient(
      this.fastify.config.services.azure.searchEndpoint as string,
      new AzureKeyCredential(
        this.fastify.config.services.azure.searchApiKey as string,
      ),
    )

    const data = []

    for await (const idx of indexClient.listIndexes()) {
      data.push(idx)
    }

    return {
      data,
      count: data.length,
      success: true,
    }
  }

  private getDefaultIndexFields(): SearchField[] {
    return [
      { name: 'content', type: 'Edm.String', searchable: true },
      { name: 'filepath', type: 'Edm.String' },
      { name: 'title', type: 'Edm.String', searchable: true },
      { name: 'url', type: 'Edm.String' },
      { name: 'id', type: 'Edm.String', key: true, sortable: true },
      { name: 'chunk_id', type: 'Edm.String' },
      {
        name: 'contentVector',
        type: 'Collection(Edm.Single)',
        searchable: true,
        vectorSearchDimensions: 1536,
        vectorSearchProfileName: 'vector-profile',
      },
      {
        name: 'relative_path',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'container_name',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'datasource_id',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'folder1',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'folder2',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'folder3',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'folder4',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'folder5',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'folder6',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'folder7',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'folder8',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'file_name',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'chunk_name',
        type: 'Edm.String',
        filterable: true,
        searchable: true,
      },
      {
        name: 'last_updated',
        type: 'Edm.DateTimeOffset',
        sortable: true,
        filterable: true,
      },
    ]
  }

  private getVectorIndexConfig(): VectorSearch {
    return {
      algorithms: [
        {
          name: 'hnsw-algorithm',
          kind: 'hnsw',
          parameters: {
            m: 4,
            efConstruction: 400,
            efSearch: 1000,
            metric: 'cosine',
          },
        },
      ],
      profiles: [
        {
          name: 'vector-profile',
          algorithmConfigurationName: 'hnsw-algorithm',
          vectorizer: null,
        },
      ],
      vectorizers: [],
      compressions: [],
    }
  }

  private getSemanticIndexConfig(): SemanticSearch {
    return {
      configurations: [
        {
          name: 'default',
          prioritizedFields: {
            titleField: {
              name: 'title',
            },
            contentFields: [
              {
                name: 'content',
              },
            ],
            keywordsFields: [],
          },
        },
      ],
    }
  }

  private getScoringProfileIndexConfig(): ScoringProfile[] {
    return [
      {
        name: 'balanced_search',
        functionAggregation: 'sum',
        textWeights: {
          weights: {
            contentVector: 10,
            content: 8,
            title: 4,
          },
        },
      },
    ]
  }

  public async cleanAiSearchResources(aiSearch: {
    indexName: string
    indexerName: string
  }) {
    await this.deleteIndex(aiSearch.indexName)
    await this.createIndex(aiSearch.indexName)
    await this.resetIndexer(aiSearch.indexerName)
    await this.runIndexer(aiSearch.indexerName)
  }

  public async prepareFilters(
    body: IChatCompletionBody,
  ): Promise<AzureAISearchFilterType> {
    const filter = body.filter
    if (filter.length != 0) {
      return await this.convertToAzureAISearchFilterType(filter)
    } else {
      return
    }
  }

  // TODO: Remove this after fix available
  public async convertToAzureAISearchFilterType(
    filters: string[],
  ): Promise<AzureAISearchFilterType> {
    // If the customer is Workwise, we want to use AND instead of OR
    let filterExpression = ''
    let lastFilterLevel = 0

    const customerId = this.req.customer._id.toString()
    if (customerId === '66a24df78b9b9ea595b76b1b' || customerId === '68405e9607b8ec588fc91d25' || customerId === '67dd3cba8a15f5997d18b10d') {
      for (let i = 0; i < filters.length; i++) {
        const filterSettings =
          this.req.customer.frontendSettings.filterButtons.find(
            (btn: CustomerFrontendSettingFilterButton) =>
              btn.filter[0] === filters[i],
          )

        if (filterSettings.level === lastFilterLevel) {
          if (i === 0) {
            // filterExpression += `(${filters[i]}`
            filterExpression += `(${filterSettings.filter[0]}`
          } else {
            // filterExpression += ` or ${filters[i]}`;
            filterExpression += ` or ${filterSettings.filter[0]}`
          }
        } else {
          // filterExpression += `) and (${filters[i]}`
          filterExpression += `) and (${filterSettings.filter[0]}`
        }
        lastFilterLevel = filterSettings.level
      }

      filterExpression += ')'
    } else {
      filterExpression = filters.join(' or ')
    }

    return { filterExpression }
  }

  // Preare keywords from chat request to Azure AI Search
  public async prepareKeywords(body: IChatCompletionBody) {
    const customerId = this.req.customer._id.toString()
    const keywords = body.keywords
    const dsId = []

    if (keywords.length === 0) {
      return
    }

    try {
      const datasources = await this.fastify.models.datasource
        .find({ owner: customerId })
        .exec()

      for (const keyword of keywords) {
        datasources.forEach((ds) => {
          if (ds.keywords.includes(keyword)) {
            dsId.push(ds._id.toString())
          }
        })
        datasources.forEach((ds) => {
          if (ds.displayName.includes(keyword)) {
            dsId.push(ds._id.toString())
          }
        })
      }

      const uniqueDsId = Array.from(new Set(dsId))

      return this.transformKeywordsToFilter(uniqueDsId)
    } catch (error) {
      this.fastify.log.error(
        `Could not prepare keywords filter for customer ${customerId}. `,
        error.message,
      )
    }
  }

  // Transform keywords to filter
  private async transformKeywordsToFilter(ds_id: string[]) {
    const ds = await this.fastify.models.datasource
      .find({ _id: { $in: ds_id } })
      .exec()
    const dsIds = ds.map((d) => d._id.toString())
    try {
      if (dsIds.length === 0) {
        throw new BadRequest(
          `No keywords found for the datasources provided. Please review the keywords sent.`,
        )
      }
      const filters = dsIds.map((id) => `datasource_id eq '${id}'`)

      return await this.convertToAzureAISearchFilterType(filters)
    } catch (error) {
      this.fastify.log.error(
        `No keywords found for the datasources provided. Please review the keywords sent.`,
      )
    }

    const filters = dsIds.map((id) => `datasource_id eq '${id}'`)

    return await this.convertToAzureAISearchFilterType(filters)
  }

  public async extractButtonFilterAndKeywords(body: IChatCompletionBody) {
    const customerId = this.req.customer._id.toString()
    const buttonFilter = body.filter_button

    try {
      if (!this.req.customer.settings.sourceFilterActive) {
        throw new BadRequest(`Activate Data Source filtering for ${customerId}`)
      }
    } catch (error) {
      this.fastify.log.error(
        `Source filter is not active for ${customerId}.`,
        error.message,
      )
    }

    if (!buttonFilter) {
      return
    }

    try {
      const filterButtons = this.req.customer.frontendSettings.filterButtons

      if (!filterButtons) {
        throw new BadRequest(`No filter buttons found for ${customerId}`)
      }

      const filters = []
      const keywords = []

      for (const button of buttonFilter) {
        // Find the filter button on customer and process it
        for (const filterButton of filterButtons) {
          if (filterButton.displayName === button) {
            filters.push(...filterButton.filter)
            keywords.push(...filterButton.keywords)
          }
        }
      }

      return { filters, keywords }
    } catch (error) {
      this.fastify.log.error(
        `Could not find filter button for ${customerId}.`,
        error.message,
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async requestDocuments(body: any) {
    const customer = this.req.customer
    const helixSearch = body.helixSearch || false
    const filter = body.filter || ''

    if (helixSearch) {
      const response = await this.getDocuments(
        customer,
        body.search,
        body.topN,
        filter,
      )

      return response
    } else {
      if (customer.aiSearch) {
        const searchEndpoint = customer.aiSearch.endpoint
        const indexName = customer.aiSearch.indexName
        const apiKey = customer.aiSearch.apiKey
        delete body.helixSearch
        const bodyJson = JSON.stringify(body)

        const response = await fetch(
          `${searchEndpoint}/indexes/${indexName}/docs/search?api-version=2024-07-01`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': apiKey,
            },
            body: bodyJson,
          },
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch from OpenAI: ${response.statusText}`)
        }

        const responseData = await response.json()

        return responseData
      } else {
        this.fastify.log.error(
          `Customer ${customer.name} doesn't have AI Search active.`,
        )
        throw new Error('AI Search is not configured for this customer')
      }
    }
  }

  private async getDocuments(
    customer: Customer,
    question: string,
    topN: number,
    filter: AzureAISearchFilterType,
    parentId?: string,
  ) {
    let spanId: string
    try {
      spanId = this.req.services.arize.initializeSpanProcessDocuments(
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
        await this.req.services.arize.setSpanOutputProcessDocumentsDirectIndex(
          spanId,
          csSearchData,
        )
        this.req.services.arize.finalizeSpan(spanId)

        return csSearchData.map((record) => record[0].metadata)
      } else {
        await this.req.services.arize.setSpanOutputProcessDocuments(
          spanId,
          csSearchData,
        )
        this.req.services.arize.finalizeSpan(spanId)

        return csSearchData.map((record) => record[0].metadata)
      }
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
      throw error
    }
  }
}
