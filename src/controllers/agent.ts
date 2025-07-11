import { FastifyInstance, FastifyRequest } from 'fastify'

import { IDefaultFilterQuery, IDefaultIdRequestParam } from '../customTypes'
import { AgentProps } from '../models'
import { DefaultIdParam } from '../schemas/default'

export async function AgentController(fastify: FastifyInstance) {
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
        summary: 'Get all Agents',
        description: 'Get a list of all Agents',
        tags: ['Agent'],
        hide: true,
      },
      preHandler,
      handler: async (req) =>
        req.services.agent.getAgentsOfCustomer(req.customer._id.toString()),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'GET',
      url: '/:id',
      schema: {
        summary: 'Get a specific Agent',
        description: 'Get an Agent by id',
        tags: ['Agent'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler,
      handler: async (req) => req.services.agent.get(req.params.id),
    })

    fastify.route<{ Body: AgentProps & { prefix?: string } }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Create Agent',
        description: 'Add a new Agent',
        tags: ['Agent'],
        hide: true,
      },
      preHandler,
      handler: async (req) =>
        req.services.agent.create({
          ...req.body,
          owner: req.customer._id,
        }),
    })

    fastify.route<{ Params: IDefaultIdRequestParam; Body: AgentProps }>({
      method: 'PATCH',
      url: '/:id',
      schema: {
        summary: 'Update a specific Agent',
        description: 'Update an Agent by id',
        tags: ['Agent'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler,
      handler: async (req) =>
        req.services.agent.update(req.body, req.params.id),
    })

    fastify.route<{ Params: IDefaultIdRequestParam }>({
      method: 'DELETE',
      url: '/:id',
      schema: {
        summary: 'Delete a specific Agent',
        description: 'Delete an Agent by id',
        tags: ['Agent'],
        params: DefaultIdParam,
        hide: true,
      },
      preHandler,
      handler: async (req) => req.services.agent.purgeAgent(req.params.id),
    })
  })
}
