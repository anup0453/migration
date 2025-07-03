import { FastifyInstance } from 'fastify'

import { UserRoleEnum } from '../../constants'
import {
  IDefaultFilterQuery,
  IDefaultIdRequestParam,
  IDefaultNameRequestParam,
} from '../../customTypes'
import { TranslationModelVersion } from '../../models/types'
import { DefaultIdParam } from '../../schemas/default'

export async function AdminTranslationModelVersionController(
  fastify: FastifyInstance,
) {
  await fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

    fastify.route<{ Querystring: IDefaultFilterQuery }>({
      method: 'GET',
      url: '/',
      schema: {
        summary: 'Get all translationModelVersions',
        description: 'Get a list of all translationModelVersions',
        tags: ['translationModelVersion'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.translationModelVersion.getAll(req.query),
    })

    fastify.route({
      method: 'GET',
      url: '/latest',
      schema: {
        summary: 'Get all latest translationModelVersions',
        description: 'Get a list of all latest translationModelVersions',
        tags: ['translationModelVersion'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.translationModelVersion.getAllLatest(),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'GET',
      url: '/:id',
      schema: {
        summary: 'Get a translationModelVersion',
        description: 'Get a translationModelVersion by id',
        tags: ['translationModelVersion'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.translationModelVersion.getById(req.params.id),
    })

    fastify.route<{ Params: IDefaultNameRequestParam }>({
      method: 'GET',
      url: '/name/:name',
      schema: {
        summary: 'Get a translationModelVersion',
        description: 'Get a translationModelVersion by name',
        tags: ['translationModelVersion'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.translationModelVersion.getLatestByModelName(
          req.params.name,
        ),
    })

    fastify.route<{ Body: TranslationModelVersion }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Add a translationModelVersion',
        description: 'Add a new translationModelVersion version',
        tags: ['translationModelVersion'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.translationModelVersion.create(req.body),
    })
  })
}
