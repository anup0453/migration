import { FastifyInstance } from 'fastify'

import { UserRoleEnum } from '../../constants'
import {
  IDefaultFilterQuery,
  IDefaultIdRequestParam,
  IDefaultNameRequestParam,
} from '../../customTypes'
import { ModelDeployment } from '../../models/types'
import { DefaultIdParam } from '../../schemas/default'

export async function AdminModelDeploymentController(fastify: FastifyInstance) {
  await fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

    fastify.route<{ Querystring: IDefaultFilterQuery }>({
      method: 'GET',
      url: '/',
      schema: {
        summary: 'Get all modelDeployments',
        description: 'Get a list of all modelDeployments',
        tags: ['modelDeployment'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.modelDeployment.getAll(req.query),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'GET',
      url: '/:id',
      schema: {
        summary: 'Get a modelDeployment',
        description: 'Get a modelDeployment by id',
        tags: ['modelDeployment'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.modelDeployment.getById(req.params.id),
    })

    fastify.route<{ Params: IDefaultNameRequestParam }>({
      method: 'GET',
      url: '/name/:name',
      schema: {
        summary: 'Get modelDeployments',
        description: 'Get a modelDeployments by model name',
        tags: ['modelDeployment'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.modelDeployment.getByName(req.params.name),
    })

    fastify.route<{ Body: ModelDeployment }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Add a modelDeployment',
        description: 'Add a new modelDeployment',
        tags: ['modelDeployment'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.modelDeployment.create(req.body),
    })

    fastify.route<{ Params: IDefaultIdRequestParam; Body: ModelDeployment }>({
      method: 'PATCH',
      url: '/:id',
      schema: {
        summary: 'Update a modelDeployment',
        description: 'Add a new modelDeployment by id',
        tags: ['modelDeployment'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.modelDeployment.update(req.params.id, req.body),
    })

    fastify.route<{ Params: IDefaultIdRequestParam; Body: ModelDeployment }>({
      method: 'DELETE',
      url: '/:id',
      schema: {
        summary: 'Delete a modelDeployment',
        description: 'Delete a modelDeployment by id',
        tags: ['modelDeployment'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.modelDeployment.delete(req.params.id),
    })
  })
}
