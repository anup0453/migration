import { FastifyInstance, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

import services from '../../services'

declare module 'fastify' {
  interface FastifyRequest {
    services: ReturnType<typeof services>
  }
}

export type Services = ReturnType<typeof services>

async function decorate(fastify: FastifyInstance) {
  // Initiate a new services instance for each request
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    request.services = services(fastify, request)
  })
}

export const decorateServices = fp(decorate)
