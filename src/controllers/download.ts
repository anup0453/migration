import { FastifyInstance, FastifyRequest } from 'fastify'

export async function DownloadController(fastify: FastifyInstance) {
  const preHandler = async (req: FastifyRequest) => {
    req.services.customer.preventAccessOfInactiveCustomer()
  }
  await fastify.register(async (fastify) => {
    fastify.addHook(
      'onRequest',
      fastify.auth([fastify.basicAuth, fastify.bearerAuth]),
    )

    fastify.route<{ Params: { fileName: string; datasourceId: string } }>({
      method: 'GET',
      url: '/:fileName/datasource/:datasourceId',
      schema: {
        summary: 'Access a file from a datasource',
        description:
          'This endpoint allows secure access with limited time to files from a data source.',
        tags: ['file'],
      },
      preHandler,
      handler: async (req) =>
        req.services.azure.blob.getFileURL(
          req.params.fileName,
          req.params.datasourceId,
        ),
    })
  })
}
