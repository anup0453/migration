import { FastifyInstance } from 'fastify'

import { IKpiRequest, UserRoleEnum } from '../../constants'

export async function AdminKpiController(fastify: FastifyInstance) {
  await fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

    fastify.route<{ Querystring: IKpiRequest }>({
      method: 'GET',
      url: '/',
      schema: {
        summary: "Get the current tenant's usage KPI",
        description: "This endpoint provides the current tenant's usage KPI.",
        tags: ['kpi', 'admin'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) =>
        req.services.kpi.getCustomerAggregations(req.query),
    })
  })
}
