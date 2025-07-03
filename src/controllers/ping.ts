import { FastifyInstance } from 'fastify'

export async function PingController(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      summary: 'Azure health check',
      description:
        'This endpoint can be used to check if your overall backend is responding.',
      tags: ['ping'],
      response: {
        200: {
          description: 'General App Health-Check',
          type: 'object',
          properties: {
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
        },
      },
    },
    handler: async () => {
      const response = {
        success: true,
        message: 'App-Root is available',
      }

      return response
    },
  })

  fastify.route({
    method: 'GET',
    url: '/v1',
    schema: {
      summary: 'API health check',
      description:
        'This endpoint can be used to check if your backend routes are responding.',
      tags: ['ping'],
      response: {
        200: {
          description: 'API Health-Check',
          type: 'object',
          properties: {
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
        },
      },
    },
    handler: async () => {
      const response = {
        success: true,
        message: 'API /v1 is running',
      }

      return response
    },
  })
}
