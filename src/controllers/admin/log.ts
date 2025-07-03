import { FastifyInstance } from 'fastify'

import { UserRoleEnum } from '../../constants'

export async function AdminLogController(fastify: FastifyInstance) {
  await fastify.register(async (fastify) => {
    fastify.addHook('onRequest', fastify.auth([fastify.basicAuth]))

    fastify.route<{ Body: { level: string } }>({
      method: 'POST',
      url: '/level',
      schema: {
        summary: 'Switch the leg level',
        description: 'Switch the log level to a specified level.',
        tags: ['log'],
        hide: true,
      },
      preHandler: async (req) =>
        req.services.user.hasAccess(UserRoleEnum.SUPERADMIN),
      handler: async (req) => req.services.log.switchLogLevel(req.body.level),
    })
  })
}
