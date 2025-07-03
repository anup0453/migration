import { FastifyInstance } from 'fastify'

import {
  IChatCompletionBody,
  IChatRequestParams,
  IEmbeddingsBody,
  IEngineParams,
} from '../customTypes'

export async function OpenAiController(fastify: FastifyInstance) {
  const preHandler = async (req) => {
    await req.services.customer.preventAccessOfInactiveCustomer(),
      await req.services.customer.filterCustomerIpAddresses()
  }

  await fastify.register(async (fastify) => {
    fastify.addHook(
      'onRequest',
      fastify.auth([fastify.basicAuth, fastify.bearerAuth]),
    )
    fastify.route<{
      Params: IEngineParams
      Body: IChatCompletionBody
      Querystring: { snakeCase?: boolean; 'api-version'?: string }
    }>({
      method: 'POST',
      url: '/:deploymentName/chat/completions',
      schema: {
        summary: 'Get chat completion',
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
        tags: ['openai'],
      },
      preHandler,
      handler: async (req, reply) => {
        const passedBody = structuredClone(req.body)
        const isSnakeCaseByHeader =
          req.headers?.snakecase === 'true' ? true : false
        const isSnakeCaseByQuery = req.query?.snakeCase

        const params = {
          engine: req.params.deploymentName,
          apiVersion: req.query['api-version'],
        } as IChatRequestParams

        if (isSnakeCaseByQuery || isSnakeCaseByHeader) {
          passedBody.snakeCase = true
        }

        // Enforce the model to be null
        // If the user wants to provide the model via the body they have to use the other endpoint
        passedBody.model = null

        if (req.body.stream) {
          await req.services.azure.openai.stream(reply, passedBody, params)
          reply.raw.end()
        } else {
          return await req.services.azure.openai.chat(passedBody, params)
        }
      },
    }),
      fastify.route<{
        Params: IEngineParams
        Body: IEmbeddingsBody
        Querystring: { snakeCase?: boolean; 'api-version'?: string }
      }>({
        method: 'POST',
        url: '/:deploymentName/embeddings',
        schema: {
          summary: 'Get embeddings',
          description: 'Get embeddings',
          params: {
            type: 'object',
            properties: {
              deploymentName: {
                type: 'string',
                default: 'text-embedding-ada-002',
              },
            },
          },
          body: {
            type: 'object',
            properties: {
              input: {
                oneOf: [
                  { type: 'string' },
                  {
                    type: 'array',
                    items: { type: 'string' },
                  },
                ],
              },
            },
          },
          tags: ['openai'],
        },
        preHandler,
        handler: async (req) => {
          const params = {
            engine: req.params.deploymentName,
            apiVersion: req.query['api-version'],
          } as IChatRequestParams

          return await req.services.azure.openai.embedding(req.body, params)
        },
      })
  })
}
