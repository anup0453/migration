import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

import { LoadBalancerRegionEnum } from '../../constants'
import { randomNumberString, randomString } from '../../utils'

declare module 'fastify' {
  interface FastifyInstance {
    config: IConfig
  }
}

function transformConfig() {
  return {
    admin: {
      email: process.env.ADMIN_EMAIL,
      apiKey: process.env.ADMIN_APIKEY,
      customer: process.env.ADMIN_CUSTOMER,
    },
    baseUrl: process.env.BASE_URL,
    env: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
    port:
      process.env.NODE_ENV === 'test'
        ? parseInt(process.env.PORT_API || '') +
          parseInt(
            (process.env.TAP_CHILD_ID || '') + parseInt(randomNumberString(2)),
          )
        : parseInt(process.env.PORT_API || ''),
    database: {
      url:
        process.env.NODE_ENV === 'test'
          ? getTestDatabaseConnection(process.env.DATABASE)
          : process.env.DATABASE || '',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },

    paths: {
      files: process.env.FILE_PATH || '',
      workDir: process.env.WORK_DIR || '',
    },
    customers: {
      whitelistConfig: {},
    },
    services: {
      azure: {
        openAiLoadBalancer:
          parseInt(process.env.AZURE_OPENAI_API_LOAD_BALANCER) || 0,
        openAiDefaultEngine: process.env.AZURE_OPENAI_DEFAULT_ENGINE,
        internalBlobStorageConnectionString:
          process.env.AZURE_INTERNAL_BLOB_STORAGE_CONNECTION_STRING,
        embeddingDefaultEngine: process.env.AZURE_DEFAULT_EMBEDDING_MODEL,
        openAiInstances: {}, // empty per start
        supportedOpenAiModels: [],
        embeddingInstances: {}, // empty per start
        supportedEmbedddingModels: [],
        searchApiKey: process.env.AZURE_SEARCH_API_KEY || '',
        searchEndpoint: process.env.AZURE_SEARCH_ENDPOINT || '',
        searchIndex: process.env.AZURE_SEARCH_INDEX || '',
        searchIndexer: process.env.AZURE_SEARCH_INDEXER || '',
        searchIndexerPollDuration: +(
          process.env.AZURE_SEARCH_INDEXER_POLL_DURATION || '2000'
        ),
        translatorEndpoint: process.env.AZURE_TRANSLATOR_ENDPOINT || '',
        translatorApiKey: process.env.AZURE_TRANSLATOR_API_KEY || '',
        translatorLocation: process.env.AZURE_TRANSLATOR_LOCATION || '',
        tokenExpirationLimit: +(process.env.TOKEN_TIME_LIMIT || '3600000'),
        bingUrl: process.env.BING_URL || '',
        bingApiKey: process.env.BING_API_KEY || '',
      },
      default: {
        chunkSize: 2000,
        chunkOverlap: 15,
        topN: 4,
        translationActive: false,
        defaultLanguage: 'en',
        ocrActive: false,
        dynamicNActive: false,
        temperature: 0.2,
        maxResponseTokens: 1200,
        topP: 0.95,
        frequencyPenalty: 0,
        presencePenalty: 0,
        stop: null,
        historyCount: 10,
        loadBalancerRegion: LoadBalancerRegionEnum.EMEA,
        sourceLinkActive: false,
        tracingEnabled: false,
        defaultGptVersion: 'gpt-4o',
        sourceFilterActive: false,
        ignoreOpenAIParamsInBody: false,
        includeDateContext: true,
      },
      payAsYouGo: {
        url: process.env.PAY_AS_YOU_GO_URL || '',
        apiKey: process.env.PAY_AS_YOU_GO_API_KEY || '',
        serviceId: process.env.PAY_AS_YOU_GO_SERVICE_ID || 1,
      },
      arize: {
        endpoint: process.env.ARIZE_ENDPOINT,
        spaceId: process.env.ARIZE_SPACE_ID,
        apiKey: process.env.ARIZE_API_KEY,
        defaultProjectName: process.env.ARIZE_DEFAULT_PROJECT_NAME,
        env: process.env.ARIZE_ENV,
      },
    },
  }
}

function getTestDatabaseConnection(connectionString: string) {
  // Necessary as lint wrongly complains about this Regex with unused escapes
  // eslint-disable-next-line
  const pattern = /^(mongodb:\/\/|http:\/\/)([^\/]+)\/?([^?]*)(\?.*)?$/
  const match = connectionString.match(pattern)

  let connectionUrl = ''
  let databaseName = ''
  let params = ''

  if (match) {
    connectionUrl = `${match[1]}${match[2]}`
    databaseName = match[3] || ''
    params = match[4] || ''
  }

  return `${connectionUrl}/${databaseName}-test-${randomString(10)}${params}`
}

export type IConfig = ReturnType<typeof transformConfig>

async function decorate(fastify: FastifyInstance) {
  fastify.decorate('config', transformConfig())
}

export const decorateConfig = fp(decorate)
