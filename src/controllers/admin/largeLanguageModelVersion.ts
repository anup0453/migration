import { FastifyInstance } from 'fastify'

import { UserRoleEnum } from '../../constants'
import {
  IDefaultFilterQuery,
  IDefaultIdRequestParam,
  IDefaultNameRequestParam,
} from '../../customTypes'
import { LargeLanguageModelVersion } from '../../models/types'
import { DefaultIdParam } from '../../schemas/default'

export async function AdminLargeLanguageModelVersionController(
  fastify: FastifyInstance,
) {
  await fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

    fastify.route<{ Querystring: IDefaultFilterQuery }>({
      method: 'GET',
      url: '/',
      schema: {
        summary: 'Get all largeLanguageModelVersions',
        description: 'Get a list of all largeLanguageModelVersions',
        tags: ['largeLanguageModelVersion'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.largeLanguageModelVersion.getAll(req.query),
    })

    fastify.route({
      method: 'GET',
      url: '/latest',
      schema: {
        summary: 'Get all latest largeLanguageModelVersions',
        description: 'Get a list of all latest largeLanguageModelVersions',
        tags: ['largeLanguageModelVersion'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.largeLanguageModelVersion.getAllLatest(),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'GET',
      url: '/:id',
      schema: {
        summary: 'Get a largeLanguageModelVersion',
        description: 'Get a largeLanguageModelVersion by id',
        tags: ['largeLanguageModelVersion'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.largeLanguageModelVersion.getById(req.params.id),
    })

    fastify.route<{ Params: IDefaultNameRequestParam }>({
      method: 'GET',
      url: '/name/:name',
      schema: {
        summary: 'Get a largeLanguageModelVersion',
        description: 'Get a largeLanguageModelVersion by name',
        tags: ['largeLanguageModelVersion'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.largeLanguageModelVersion.getLatestByModelName(
          req.params.name,
        ),
    })

    fastify.route<{ Body: LargeLanguageModelVersion }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Add a largeLanguageModelVersion',
        description: 'Add a new largeLanguageModelVersion version',
        tags: ['largeLanguageModelVersion'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.largeLanguageModelVersion.create(req.body),
    })
  })
}
