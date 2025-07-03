import { FastifyInstance } from 'fastify'

import { UserRoleEnum } from '../../constants'
import { IDefaultFilterQuery, IDefaultIdRequestParam } from '../../customTypes'
import { DatasourceProps } from '../../models'
import { DefaultIdParam } from '../../schemas/default'

export async function AdminDatasourceController(fastify: FastifyInstance) {
  await fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

    fastify.route<{ Querystring: IDefaultFilterQuery }>({
      method: 'GET',
      url: '/',
      schema: {
        summary: 'Get all datasources',
        description: 'Get a list of all datasources',
        tags: ['datasource'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.datasource.search(req.query),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'GET',
      url: '/:id',
      schema: {
        summary: 'Get a specific datasources',
        description: 'Get a datasources by id',
        tags: ['datasource'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.datasource.get(req.params.id),
    })

    fastify.route<{ Body: DatasourceProps & { prefix?: string } }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Create datasources',
        description: 'Add a new datasource',
        tags: ['datasource'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.datasource.create(req.body),
    })

    fastify.route<{ Params: IDefaultIdRequestParam; Body: DatasourceProps }>({
      method: 'PATCH',
      url: '/:id',
      schema: {
        summary: 'Update a specific datasource',
        description: 'Update a datasource by id',
        tags: ['datasource'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.datasource.update(req.body, req.params.id),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'DELETE',
      url: '/:id',
      schema: {
        summary: 'Delete a specific datasource',
        description: 'Delete a datasource by id',
        tags: ['datasource'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.datasource.purgeDatasource(req.params.id),
    })
  })
}
