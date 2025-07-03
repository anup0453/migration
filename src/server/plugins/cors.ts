import cors from '@fastify/cors'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function registerCors(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: false,
    credentials: true,
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    allowedHeaders: [
      'Accept',
      'Accept-Encoding',
      'Accept-Language',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin',
      'Access-Control-Request-Headers',
      'Content-Language',
      'Content-Type',
      'siemens-access-token',
      'Cookie',
      'Origin',
      'Source',
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Authorization',
      'snakeCase',
    ].join(', '),
    exposedHeaders: [
      'Accept-Encoding',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin',
      'Access-Control-Request-Headers',
      'Cache-Control',
      'Content-Type',
      'Content-Language',
      'Content-Disposition',
      'Expires',
      'siemens-access-token',
      'Last-Modified',
      'Origin',
      'Set-Cookie',
      'Source',
      'Vary',
      'snakeCase',
    ].join(', '),
  })
}
export const decorateCors = fp(registerCors)
