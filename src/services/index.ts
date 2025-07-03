import { FastifyInstance, FastifyRequest } from 'fastify'

import AgentService from './agent'
import ArizeService from './arize'
import AzureBlobService from './azure/blob'
import AzureCognitiveSearchService from './azure/cognitiveSearch'
import AzureOpenAiService from './azure/openai'
import ChargeService from './charge'
import CostTrackingService from './costTracking'
import CustomerService from './customer'
import DatasourceService from './datasource'
import FileService from './file'
import ImportService from './import'
import GaiaTool from './internalTool'
import AzureBingService from './internalTooling/bing'
import AzureSnowflakeService from './internalTooling/snowflake'
import KpiService from './kpi'
import LangchainEmbeddingService from './langchain/embedding'
import LangchainOpenAiService from './langchain/openai'
import Loadbalancer from './loadbalancer'
import LogService from './log'
import ModelDeploymentService from './modelDeployment'
import ModelVersionService from './modelVersion'
import PayAsYouGoService from './payAsYouGo'
import OpenAI from './plainLLM/openAI'
import UserService from './user'

export * from './internalTooling/bing'
export * from './azure/blob'
export * from './azure/cognitiveSearch'
export * from './azure/openai'
export * from './plainLLM/openAI'
export * from './import'
export * from './kpi'
export * from './customer'
export * from './costTracking'
export * from './langchain/embedding'
export * from './langchain/openai'
export * from './loadbalancer'
export * from './log'
export * from './internalTool'
export * from './modelDeployment'
export * from './internalTooling/snowflake'
export * from './charge'
export * from './arize'
export * from './agent'

export default function services(
  fastify: FastifyInstance,
  req: FastifyRequest,
) {
  return {
    azure: {
      blob: new AzureBlobService(fastify, req),
      cognitiveSearch: new AzureCognitiveSearchService(fastify, req),
      openai: new AzureOpenAiService(fastify, req),
    },
    tooling: {
      bing: new AzureBingService(fastify, req),
      snowflake: new AzureSnowflakeService(fastify, req),
    },
    plainLLM: {
      openAI: new OpenAI(fastify, req),
    },
    internalTool: new GaiaTool(fastify, req),
    customer: new CustomerService(fastify, req),
    datasource: new DatasourceService(fastify, req),
    file: new FileService(fastify, req),
    import: new ImportService(fastify, req),
    kpi: new KpiService(fastify, req),
    user: new UserService(fastify, req),
    costTracking: new CostTrackingService(fastify, req),
    payAsYouGo: new PayAsYouGoService(fastify),
    largeLanguageModelVersion: new ModelVersionService(
      fastify,
      req,
      'largeLanguageModelVersion',
    ),
    embeddingModelVersion: new ModelVersionService(
      fastify,
      req,
      'embeddingModelVersion',
    ),
    translationModelVersion: new ModelVersionService(
      fastify,
      req,
      'translationModelVersion',
    ),
    modelDeployment: new ModelDeploymentService(fastify, req),
    langchain: {
      embedding: new LangchainEmbeddingService(fastify, req),
      openai: new LangchainOpenAiService(fastify, req),
    },
    loadbalancer: new Loadbalancer(fastify, req),
    log: new LogService(fastify, req),
    charge: new ChargeService(fastify),
    arize: new ArizeService(fastify, req),
    agent: new AgentService(fastify, req),
  }
}
