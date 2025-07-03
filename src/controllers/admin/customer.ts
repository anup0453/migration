import { FastifyInstance } from 'fastify'

import { UserRoleEnum } from '../../constants'
import {
  ICustomerApIRequestParam,
  IDefaultFilterQuery,
  IDefaultIdRequestParam,
} from '../../customTypes'
import {
  CustomerApiKeyProps,
  CustomerProps,
  DatasourceProps,
} from '../../models'
import { Customer } from '../../models/types'
import { DefaultIdParam } from '../../schemas/default'
import { CustomerSchema } from '../../schemas/schema'

export async function AdminCustomerController(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

  fastify.route<{ Querystring: IDefaultFilterQuery }>({
    method: 'GET',
    url: '/',
    schema: {
      summary: 'Get all customers',
      description: 'Get a list of all customers',
      tags: ['customer'],
      hide: true,
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) => req.services.customer.search(req.query),
  })

  fastify.route<{ Params: IDefaultIdRequestParam }>({
    method: 'GET',
    url: '/:id',
    schema: {
      summary: 'Get a customer',
      description: 'Get a customer by id',
      tags: ['customer'],
      params: DefaultIdParam,
      hide: true,
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) => req.services.customer.get(req.params.id),
  })

  fastify.route<{
    Body: Customer & { datasource?: DatasourceProps }
  }>({
    method: 'POST',
    url: '/onboard',
    schema: {
      summary: 'Onboard a new customer',
      description: 'Onboard a new customer',
      tags: ['customer'],
      hide: true,
    },
    preHandler: async (req) => req.services.user.hasAccess(UserRoleEnum.SYSTEM),
    handler: async (req) => req.services.customer.onboard(req.body),
  })

  fastify.route<{ Params: IDefaultIdRequestParam; Body: CustomerProps }>({
    method: 'PATCH',
    url: '/:id',
    schema: {
      summary: 'Update a customer',
      description: 'Update a customer by id',
      tags: ['customer'],
      params: DefaultIdParam,
      body: CustomerSchema,
      hide: true,
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) =>
      req.services.customer.update(req.body, req.params.id),
  })

  fastify.route<{ Params: IDefaultIdRequestParam; Body: CustomerProps }>({
    method: 'PATCH',
    url: '/frontendSettings/:id',
    schema: {
      summary: 'Update frontend settings',
      description: 'Update frontend settings by customer id',
      tags: ['customer'],
      params: DefaultIdParam,
      body: CustomerSchema,
      hide: true,
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) =>
      req.services.customer.updateFrontendSettings(req.body, req.params.id),
  })

  fastify.route<{ Params: IDefaultIdRequestParam }>({
    method: 'DELETE',
    url: '/:id',
    schema: {
      summary: 'Delete a customer',
      description:
        'Delete a customer by id (production: inactivated, other envs: entirely removed including Azure Indexer and Index)',
      tags: ['customer'],
      params: DefaultIdParam,
      hide: true,
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) => req.services.customer.purgeCustomer(req.params.id),
  })

  fastify.route<{ Params: IDefaultIdRequestParam }>({
    method: 'PATCH',
    url: '/:id/pause',
    schema: {
      summary: 'Pause a customer',
      description: 'Pause a customer by id',
      tags: ['customer'],
      hide: true,
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) => req.services.customer.pause(req.params.id),
  })

  fastify.route<{ Params: IDefaultIdRequestParam }>({
    method: 'PATCH',
    url: '/:id/unpause',
    schema: {
      summary: 'Unpause a customer',
      description: 'Unpause a customer by id',
      tags: ['customer'],
      hide: true,
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) => req.services.customer.unpause(req.params.id),
  })

  fastify.route<{
    Body: CustomerApiKeyProps
    Params: IDefaultIdRequestParam
  }>({
    method: 'POST',
    url: '/:id/apiKey',
    schema: {
      summary: 'Create a new api key for a customer',
      description: 'Create a new api key for a customer',
      tags: ['customer'],
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) =>
      req.services.customer.createNewApiKey(req.body, req.params.id),
  })

  fastify.route<{ Params: ICustomerApIRequestParam }>({
    method: 'DELETE',
    url: '/:customerId/apiKey/:id',
    schema: {
      summary: 'Create a new api key for a customer',
      description: 'Create a new api key for a customer',
      tags: ['customer'],
      params: DefaultIdParam,
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) =>
      req.services.customer.deleteApiKeyById(
        req.params.id,
        req.params.customerId,
      ),
  })

  fastify.route<{ Params: IDefaultIdRequestParam }>({
    method: 'GET',
    url: '/:id/apiKey',
    schema: {
      summary: 'Get a list of all api keys of a customer',
      description: 'Get a list of all api keys of a customer',
      tags: ['customer'],
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) => req.services.customer.getAllApiKeys(req.params.id),
  })

  fastify.route<{ Params: ICustomerApIRequestParam }>({
    method: 'GET',
    url: '/:customerId/apiKey/:id',
    schema: {
      summary: 'Get a list of all api keys of a customer',
      description: 'Get a list of all api keys of a customer',
      tags: ['customer'],
      params: DefaultIdParam,
    },
    preHandler: async (req) =>
      req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
    handler: async (req) =>
      req.services.customer.getApiKeyById(req.params.id, req.params.customerId),
  })
}
