import { FastifyInstance, FastifyRequest } from 'fastify'

import { IDefaultFilterQuery, IDefaultIdRequestParam } from '../customTypes'
import { DatasourceProps } from '../models'
import { DefaultIdParam } from '../schemas/default'
import { DatasourceSchema } from '../schemas/schema'

export async function DatasourceController(fastify: FastifyInstance) {
  const preHandler = async (req: FastifyRequest) => {
    req.services.customer.preventAccessOfInactiveCustomer()
  }

  await fastify.register(async (fastify) => {
    fastify.addHook(
      'onRequest',
      fastify.auth([fastify.basicAuth, fastify.bearerAuth]),
    )

    fastify.route<{ Querystring: IDefaultFilterQuery }>({
      method: 'GET',
      url: '/',
      schema: {
        summary: 'Get all datasources of customer',
        description: 'Get a list of all datasources of the calling customer',
        tags: ['datasource'],
      },
      preHandler,
      handler: async (req) =>
        req.services.customer.getDatasourcesOfCustomer(
          req.customer._id.toString(),
        ),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'GET',
      url: '/:id',
      schema: {
        summary: 'Get a specific datasource of a customer',
        description: 'Get a datasources based on the calling customer id',
        tags: ['datasource'],
        params: DefaultIdParam,
      },
      preHandler,
      handler: async (req, reply) => {
        if (!validateCustomerDatasource(req)) {
          return reply.status(400).send({
            error:
              'Cannot GET datasource as the ID of datasource does not belong to customer',
          })
        }

        return req.services.datasource.get(req.params.id)
      },
    })

    fastify.route<{ Body: DatasourceProps }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Post a datasource for a calling customer',
        description: 'Post a datasource for a calling customer by id',
        tags: ['datasource'],
        body: {
          type: 'object',
          properties: {
            ...DatasourceSchema.definitions.Datasource.properties,
          },
        },
      },
      preHandler,
      handler: async (req) =>
        req.services.datasource.create({
          ...req.body,
          owner: req.customer._id,
        }),
    })

    fastify.route<{ Params: IDefaultIdRequestParam; Body: DatasourceProps }>({
      method: 'PATCH',
      url: '/:id',
      schema: {
        summary: 'Update a specific datasource of a calling customer',
        description: 'Update a datasource of a calling customer by id',
        tags: ['datasource'],
        params: DefaultIdParam,
        body: {
          type: 'object',
          properties: {
            ...DatasourceSchema.definitions.Datasource.properties,
          },
        },
      },
      preHandler,
      handler: async (req, reply) => {
        if (!validateCustomerDatasource(req)) {
          return reply.status(400).send({
            error:
              'Cannot PATCH datasource as the ID of datasource does not belong to customer',
          })
        }

        return req.services.datasource.update(req.body, req.params.id)
      },
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'DELETE',
      url: '/:id',
      schema: {
        summary: 'Delete a specific datasource of a calling customer',
        description: 'Delete a datasource by id of a calling customer',
        tags: ['datasource'],
        params: DefaultIdParam,
      },
      preHandler,
      handler: async (req, reply) => {
        if (!validateCustomerDatasource(req)) {
          return reply.status(400).send({
            error:
              'Cannot DELETE datasource as the ID of datasource does not belong to customer',
          })
        }

        return req.services.datasource.purgeDatasource(req.params.id)
      },
    })

    function validateCustomerDatasource(req: FastifyRequest): boolean {
      const { id } = req.params as IDefaultIdRequestParam
      const customerDSIds = req.customer.datasources.map((ds) => ds.toString())

      if (!customerDSIds.includes(id)) {
        return false
      }

      return true
    }
  })
}
