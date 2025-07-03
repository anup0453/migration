import { FastifyInstance } from 'fastify'

import { UserRoleEnum } from '../../constants'
import { IChargeConfig } from '../../customTypes'
import { CustomChargeDocument } from '../../models/types'

export async function AdminChargeController(fastify: FastifyInstance) {
  await fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

    fastify.route<{ Body: IChargeConfig }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Start the charge run',
        description:
          'This endpoint starts the run of teh cahrging of customers',
        tags: ['charge', 'admin'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.charge.runCharging(req.body),
    })

    fastify.route<{ Body: CustomChargeDocument }>({
      method: 'POST',
      url: '/custom',
      schema: {
        summary: 'Create custon charge',
        description: 'This endpoint creates a custom charge',
        tags: ['custom charge', 'admin'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.charge.createCustomCharge(req.body),
    })
  })
}
