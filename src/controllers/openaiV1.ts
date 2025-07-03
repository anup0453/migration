import { FastifyInstance } from 'fastify'

import { IChatCompletionBody, IChatRequestParams } from '../customTypes'

export async function OpenAiV1Controller(fastify: FastifyInstance) {
  const preHandler = async (req) => {
    req.services.customer.preventAccessOfInactiveCustomer()
  }

  await fastify.register(async (fastify) => {
    fastify.addHook(
      'onRequest',
      fastify.auth([fastify.basicAuth, fastify.bearerAuth]),
    )
    fastify.route<{
      Body: IChatCompletionBody
      Querystring: { snakeCase?: boolean; 'api-version'?: string }
    }>({
      method: 'POST',
      url: '/',
      schema: {
        summary: 'Get chat completions',
        description: 'Get chat completions',
        params: {
          type: 'object',
          properties: {
            deploymentName: {
              type: 'string',
              default: 'gpt-4o',
            },
          },
        },
        body: {
          type: 'object',
          properties: {
            messages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role: {
                    type: 'string',
                    enum: ['system', 'user', 'assistant', 'tool'],
                  },
                  content: { type: 'string' },
                },
              },
            },
            system_message: { type: 'string' },
            temperature: { type: 'number', minimum: 0, maximum: 1 },
            top_p: { type: 'number', minimum: 0, maximum: 1 },
            max_tokens: { type: 'number' },
            n: { type: 'number' },
            stop: { type: 'array', items: { type: 'string' } },
            presence_penalty: { type: 'number', minimum: 0, maximum: 1 },
            frequency_penalty: { type: 'number', minimum: 0, maximum: 1 },
            model: { type: 'string' },
            snakeCase: { type: 'boolean', default: false },
            internalTools: {
              type: 'array',
              items: { type: 'string' },
              default: [],
            },
            tools: { type: 'array', default: [] },
            filter: { type: 'array', items: { type: 'string' }, default: [] },
            keywords: { type: 'array', items: { type: 'string' }, default: [] },
            filter_button: {
              type: 'array',
              items: { type: 'string' },
              default: [],
            },
            plainAOAI: {
              type: 'boolean',
              default: false,
            },
          },
        },
        tags: ['chat'],
      },
      preHandler,
      handler: async (req) => {
        const passedBody = structuredClone(req.body)
        const isSnakeCaseByHeader =
          req.headers?.snakecase === 'true' ? true : false
        const isSnakeCaseByQuery = req.query?.snakeCase
        const params = {
          apiVersion: req.query['api-version'],
        } as IChatRequestParams

        if (isSnakeCaseByQuery || isSnakeCaseByHeader) {
          passedBody.snakeCase = true
        }

        return await req.services.azure.openai.chat(passedBody, params)
      },
    })
  })
}
