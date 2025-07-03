import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

import { models } from '../../models'

declare module 'fastify' {
  interface FastifyInstance {
    models: typeof models
  }
}

export type Models = typeof models

async function decorate(fastify: FastifyInstance) {
  fastify.decorate('models', models)
}

export const decorateModels = fp(decorate)
