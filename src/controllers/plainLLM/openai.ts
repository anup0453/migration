import { FastifyInstance, FastifyRequest } from 'fastify'

import { IChatRequestParams } from '../../customTypes'

export async function PlainLLMOpenAiController(fastify: FastifyInstance) {
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
      Params: { deploymentName: string }
      Querystring: {
        'api-version'?: string
      }
    }>({
      method: 'POST',
      url: '/:deploymentName/chat/completions',
      preHandler,
      handler: async (req, reply) => {
        const passedBody = structuredClone(req.body)
        const isStreaming = passedBody.stream === true
        const params = {
          engine: req.params.deploymentName,
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

    fastify.route<{
      Params: { deploymentName: string }
      Querystring: {
        'api-version'?: string
      }
    }>({
      method: 'POST',
      url: '/:deploymentName/embeddings',
      preHandler,
      handler: async (req) => {
        const passedBody = structuredClone(req.body)
        const params = {
          engine: req.params.deploymentName,
          apiVersion: req.query['api-version'],
        } as IChatRequestParams

        return await req.services.plainLLM.openAI.embeddings(passedBody, params)
      },
    })
  })
}
