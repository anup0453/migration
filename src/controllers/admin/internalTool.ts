import { FastifyInstance } from 'fastify'

import { UserRoleEnum } from '../../constants'
import { IDefaultFilterQuery, IDefaultIdRequestParam } from '../../customTypes'
import { InternalToolProps } from '../../models'
import { DefaultIdParam } from '../../schemas/default'

export async function AdminInternalToolController(fastify: FastifyInstance) {
  await fastify.register(async (fastify) => {
    fastify.addHook(
      'onRequest',
      fastify.auth([fastify.basicAuth, fastify.bearerAuth]),
    )

    fastify.route<{ Querystring: IDefaultFilterQuery }>({
      method: 'GET',
      url: '/',
      schema: {
        summary: 'Get all Internal tools',
        description: 'Get a list of all Internal tools',
        tags: ['Internal tool'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.internalTool.search(req.query),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'GET',
      url: '/:id',
      schema: {
        summary: 'Get a specific Internal tool',
        description: 'Get a Internal tool by id',
        tags: ['Internal tool'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.internalTool.get(req.params.id),
    })

    fastify.route<{ Body: InternalToolProps & { prefix?: string } }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Create Internal tool',
        description: 'Add a new Internal tool',
        tags: ['Internal tool'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.internalTool.create(req.body),
    })

    fastify.route<{ Params: IDefaultIdRequestParam; Body: InternalToolProps }>({
      method: 'PATCH',
      url: '/:id',
      schema: {
        summary: 'Update a specific Internal tool',
        description: 'Update a Internal tool by id',
        tags: ['Internal tool'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.internalTool.update(req.body, req.params.id),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'DELETE',
      url: '/:id',
      schema: {
        summary: 'Delete a specific Internal tool',
        description: 'Delete a Internal tool by id',
        tags: ['Internal tool'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.internalTool.purgeInternalTool(req.params.id),
    })
  })
}
