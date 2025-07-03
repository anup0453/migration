import { FastifyInstance } from 'fastify'

import { UserRoleEnum } from '../../constants'
import {
  IDefaultFilterQuery,
  IDefaultIdRequestParam,
  IDefaultNameRequestParam,
} from '../../customTypes'
import { EmbeddingModelVersion } from '../../models/types'
import { DefaultIdParam } from '../../schemas/default'

export async function AdminEmbeddingModelVersionController(
  fastify: FastifyInstance,
) {
  await fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

    fastify.route<{ Querystring: IDefaultFilterQuery }>({
      method: 'GET',
      url: '/',
      schema: {
        summary: 'Get all embeddingModelVersions',
        description: 'Get a list of all embeddingModelVersions',
        tags: ['embeddingModelVersion'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.embeddingModelVersion.getAll(req.query),
    })

    fastify.route({
      method: 'GET',
      url: '/latest',
      schema: {
        summary: 'Get all latest embeddingModelVersions',
        description: 'Get a list of all latest embeddingModelVersions',
        tags: ['embeddingModelVersion'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.embeddingModelVersion.getAllLatest(),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'GET',
      url: '/:id',
      schema: {
        summary: 'Get a embeddingModelVersion',
        description: 'Get a embeddingModelVersion by id',
        tags: ['embeddingModelVersion'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.embeddingModelVersion.getById(req.params.id),
    })

    fastify.route<{ Params: IDefaultNameRequestParam }>({
      method: 'GET',
      url: '/name/:name',
      schema: {
        summary: 'Get a embeddingModelVersion',
        description: 'Get a embeddingModelVersion by name',
        tags: ['embeddingModelVersion'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.embeddingModelVersion.getLatestByModelName(
          req.params.name,
        ),
    })

    fastify.route<{ Body: EmbeddingModelVersion }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Add a embeddingModelVersion',
        description: 'Add a new embeddingModelVersion version',
        tags: ['embeddingModelVersion'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.embeddingModelVersion.create(req.body),
    })
  })
}
