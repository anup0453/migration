import { FastifyInstance } from 'fastify'

import { SkillsetNameEnum, UserRoleEnum } from '../../constants'

export async function AdminAzureController(fastify: FastifyInstance) {
  await fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

    fastify.route<{
      Body: {
        name: string
        indexer?: string
        datasource?: string
        skillsetName?: SkillsetNameEnum
      }
    }>({
      method: 'POST',
      url: '/index',
      schema: {
        summary: 'Azure AI Search index creation',
        description: 'Create an Azure AI Search Index',
        tags: ['index', 'admin'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.azure.cognitiveSearch.createIndex(
          req.body.name,
          req.body.skillsetName,
          req.body.indexer,
          req.body.datasource,
        ),
    })

    fastify.route<{ Body: { name: string } }>({
      method: 'GET',
      url: '/index',
      schema: {
        summary:
          'List all Azure AI Search indexes from the active AI Search instance',
        description: 'List all Azure AI Search Indexes',
        tags: ['Azure'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.azure.cognitiveSearch.listIndexes(),
    })

    fastify.route<{ Params: { name: string } }>({
      method: 'GET',
      url: '/index/:name',
      schema: {
        summary: 'Find one Azure AI Search index by name',
        description: 'Find an Azure AI Search Index by its name',
        tags: ['Azure'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.azure.cognitiveSearch.findOneIndexByName(req.params.name),
    })

    fastify.route<{
      Params: { name: string }
      Body?: { indexer?: string; datasourceConnection: string }
    }>({
      method: 'DELETE',
      url: '/index/:name',
      schema: {
        summary: 'Delete an index including its indexer',
        description:
          'Delete an index on a given AI Search Index including indexer',
        tags: ['Azure'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => {
        if (req.body?.indexer) {
          await req.services.azure.cognitiveSearch.deleteIndexer(
            req.body.indexer,
          )
        }

        if (req.body?.datasourceConnection) {
          await req.services.azure.cognitiveSearch.deleteDataSourceConnection(
            req.body.datasourceConnection,
          )
        }

        return await req.services.azure.cognitiveSearch.deleteIndex(
          req.params.name,
        )
      },
    })

    fastify.route<{
      Body: {
        name: string
        index: string
        datasource: string
        skillsetName: SkillsetNameEnum
      }
    }>({
      method: 'POST',
      url: '/indexer',
      schema: {
        summary: 'Create an indexer',
        description: 'Create an indexer on a given AI Search Index',
        tags: ['Azure'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.azure.cognitiveSearch.createIndexer(
          req.body.name,
          req.body.index,
          req.body.datasource,
          req.body.skillsetName,
        ),
    })

    fastify.route<{ Params: { name: string } }>({
      method: 'GET',
      url: '/indexer/:name',
      schema: {
        summary: 'Run an indexer',
        description: 'Run an indexer on a given AI Search Index',
        tags: ['Azure'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.azure.cognitiveSearch.runIndexer(req.params.name),
    })
  })
}
