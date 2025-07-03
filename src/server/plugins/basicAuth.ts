import fastifyBasicAuth from '@fastify/basic-auth'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

import { Customer, User } from '../../models/types'
import { checkKey } from './bearerAuth'

declare module 'fastify' {
  interface FastifyRequest {
    user?: User
    customer?: Customer
    authUsedAlready?: boolean
    authCombinedErrorMessage?: string
    customerId?: string
  }
}

async function basicAuth(fastify: FastifyInstance) {
  await fastify.register(fastifyBasicAuth, {
    validate: async function (email, key, req) {
      await checkKey(fastify, req, { email, key })
    },
  })
}

export const decorateBasicAuth = fp(basicAuth)
