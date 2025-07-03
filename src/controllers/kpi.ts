import { FastifyInstance } from 'fastify'

import { IKpiRequest } from '../constants'

export async function KpiController(fastify: FastifyInstance) {
  await fastify.register(async (fastify) => {
    fastify.addHook(
      'onRequest',
      fastify.auth([fastify.basicAuth, fastify.bearerAuth]),
    )

    fastify.route<{ Querystring: IKpiRequest }>({
      method: 'GET',
      url: '/',
      schema: {
        summary: "Get the current tenant's usage KPI",
        description: "This endpoint provides the current tenant's usage KPI.",
        tags: ['kpi'],
        querystring: {
          type: 'object',
          properties: {
            from: {
              type: 'string',
              format: 'date-time',
              default: '2024-10-01',
            },
            to: { type: 'string', format: 'date-time', default: '2025-10-01' },
            scale: {
              type: 'string',
              enum: ['day', 'week', 'month', 'year'],
              default: 'month',
            },
            type: {
              type: 'string',
              default:
                'total,chatRequest,subscription,translation,embedding,customCharge',
            },
          },
          required: ['from', 'to', 'scale', 'type'],
        },
      },
      handler: async (req) =>
        req.services.kpi.getCustomerAggregations(req.query),
    })
  })
}
