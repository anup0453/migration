import { FastifyInstance } from 'fastify'

export async function AISearchController(fastify: FastifyInstance) {
  const preHandler = async (req) => {
    req.services.customer.preventAccessOfInactiveCustomer()
  }

  await fastify.register(async (fastify) => {
    fastify.addHook(
      'onRequest',
      fastify.auth([fastify.basicAuth, fastify.bearerAuth]),
    )
    fastify.route({
      method: 'POST',
      url: '/getRecords',
      preHandler,
      handler: async (req) => {
        const passedBody = structuredClone(req.body)

        return await req.services.azure.cognitiveSearch.requestDocuments(
          passedBody,
        )
      },
    })
  })
}
