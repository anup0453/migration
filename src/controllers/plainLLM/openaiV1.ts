import { FastifyInstance, FastifyRequest } from 'fastify'

import { IChatRequestParams } from '../../customTypes'

export async function PlainLLMOpenAiV1Controller(fastify: FastifyInstance) {
  const preHandler = async (req: FastifyRequest) => {
    req.services.customer.preventAccessOfInactiveCustomer()
  }

  await fastify.register(async (fastify) => {
    fastify.addHook(
      'onRequest',
      fastify.auth([fastify.basicAuth, fastify.bearerAuth]),
    )
    fastify.route<{
      Body: { stream?: boolean }
      Querystring: {
        'api-version'?: string
      }
    }>({
      method: 'POST',
      url: '/',
      preHandler,
      handler: async (req, reply) => {
        const passedBody = structuredClone(req.body)
        const isStreaming = passedBody.stream === true
        const params = {
          apiVersion: req.query['api-version'],
        } as IChatRequestParams

        if (isStreaming) {
          return await req.services.plainLLM.openAI.stream(
            reply,
            passedBody,
            params,
          )
        } else {
          return await req.services.plainLLM.openAI.chat(passedBody, params)
        }
      },
    })
  })
}
