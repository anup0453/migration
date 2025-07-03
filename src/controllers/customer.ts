import { FastifyInstance } from 'fastify'

import { IDefaultIdRequestParam } from '../customTypes'
import {
  CustomerApiKeyProps,
  CustomerProps,
  CustomerSettingsProps,
} from '../models'
import { DefaultIdParam } from '../schemas/default'
import { CustomerSchema } from '../schemas/schema'

export async function CustomerController(fastify: FastifyInstance) {
  const preHandler = async (req) => {
    req.services.customer.preventAccessOfInactiveCustomer()
  }

  await fastify.register(async (fastify) => {
    fastify.addHook(
      'onRequest',
      fastify.auth([fastify.basicAuth, fastify.bearerAuth]),
    )

    fastify.route({
      method: 'GET',
      url: '/',
      schema: {
        summary: 'Get a customer by calling user id',
        description: 'Get a customer by calling user id',
        tags: ['customer'],
      },
      preHandler,
      handler: async (req) =>
        req.services.customer.getCustomerInfo(req.customer._id.toString()),
    })

    fastify.route({
      method: 'POST',
      url: '/clean',
      schema: {
        summary: 'Clean a customer by calling user id',
        description: 'Clean a customer by calling user id',
        tags: ['customer'],
      },
      preHandler,
      handler: async (req) =>
        req.services.customer.cleanKnowledgebase(req.customer._id.toString()),
    })

    fastify.route<{
      Body: CustomerSettingsProps
    }>({
      method: 'PATCH',
      url: '/settings',
      schema: {
        summary: "Update a customer's settings",
        description: "Update a customer's settings by calling user id",
        tags: ['customer'],
        body: CustomerSchema.definitions.Customer.properties.settings,
      },
      preHandler,
      handler: async (req) => req.services.customer.updateSettings(req.body),
    })

    fastify.route<{
      Body: CustomerProps
    }>({
      method: 'PATCH',
      url: '/frontendSettings',
      schema: {
        summary: 'Update frontend settings',
        description: 'Update frontend settings by calling user id',
        tags: ['customer'],
        body: CustomerSchema.definitions.Customer.properties.frontendSettings,
      },
      preHandler,
      handler: async (req) =>
        req.services.customer.updateFrontendSettings(req.body),
    })

    fastify.route({
      method: 'DELETE',
      url: '/',
      schema: {
        summary: 'Delete a customer by calling user id',
        description:
          'Delete a customer by calling user id (production: inactivated, other envs: entirely removed including Azure Indexer and Index)',
        tags: ['customer'],
      },
      preHandler,
      handler: async (req) =>
        req.services.customer.purgeCustomer(req.customer._id.toString()),
    })

    fastify.route<{
      Body: CustomerApiKeyProps
    }>({
      method: 'POST',
      url: '/apiKey',
      schema: {
        summary: 'Create a new api key for a customer',
        description: 'Create a new api key for a customer',
        tags: ['customer'],
      },
      preHandler,
      handler: async (req) =>
        req.services.customer.createNewApiKey(
          req.body,
          req.customer._id.toString(),
        ),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'DELETE',
      url: '/apiKey/:id',
      schema: {
        summary: 'Create a new api key for a customer',
        description: 'Create a new api key for a customer',
        tags: ['customer'],
        params: DefaultIdParam,
      },
      preHandler,
      handler: async (req) =>
        req.services.customer.deleteApiKeyById(
          req.params.id,
          req.customer._id.toString(),
        ),
    })

    fastify.route({
      method: 'GET',
      url: '/apiKey',
      schema: {
        summary: 'Get a list of all api keys of a customer',
        description: 'Get a list of all api keys of a customer',
        tags: ['customer'],
      },
      preHandler,
      handler: async (req) =>
        req.services.customer.getAllApiKeys(req.customer._id.toString()),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'GET',
      url: '/apiKey/:id',
      schema: {
        summary: 'Get a list of all api keys of a customer',
        description: 'Get a list of all api keys of a customer',
        tags: ['customer'],
        params: DefaultIdParam,
      },
      preHandler,
      handler: async (req) =>
        req.services.customer.getApiKeyById(
          req.params.id,
          req.customer._id.toString(),
        ),
    })
  })
}
