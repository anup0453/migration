import { FastifyInstance } from 'fastify'

import { UserRoleEnum } from '../../constants'
import { IDefaultFilterQuery, IDefaultIdRequestParam } from '../../customTypes'
import { UserProps } from '../../models'
import { DefaultIdParam, getRequestBodySchema } from '../../schemas/default'
import { UserRequiredFields, UserSchema } from '../../schemas/schema'

export async function AdminUserController(fastify: FastifyInstance) {
  await fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

    fastify.route<{ Querystring: IDefaultFilterQuery }>({
      method: 'GET',
      url: '/',
      schema: {
        summary: 'Get all list of users',
        description: 'Get all list of users',
        tags: ['user'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.user.search(req.query),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'GET',
      url: '/:id',
      schema: {
        summary: 'Get a specific user',
        description: 'Get a specific user by id',
        tags: ['user'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.user.get(req.params.id),
    })

    fastify.route<{ Body: UserProps }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Create a user',
        description: 'This endpoint creates a new user.',
        tags: ['user'],
        body: getRequestBodySchema(UserSchema, 'create', UserRequiredFields),
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.user.upsert(req.body),
    })

    fastify.route<{ Params: IDefaultIdRequestParam; Body: UserProps }>({
      method: 'PATCH',
      url: '/:id',
      schema: {
        summary: 'Update a user',
        description: 'This endpoint updates a user by id.',
        tags: ['user'],
        body: UserSchema,
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.user.upsert(req.body, req.params.id),
    })
  })
}
