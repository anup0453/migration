import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import mongoose, { Mongoose } from 'mongoose'

declare module 'fastify' {
  interface FastifyInstance {
    mongoose: Mongoose
  }
}

export const decorateMongoose = fp(async function decorateMongoose(
  fastify: FastifyInstance,
) {
  const opts =
    fastify.config.database.user && fastify.config.database.password
      ? {
          auth: {
            username: fastify.config.database.user,
            password: fastify.config.database.password,
          },
          retryWrites: false,
        }
      : {}

  await mongoose.connect(fastify.config.database.url, opts)

  fastify.decorate('mongoose', mongoose)

  fastify.addHook('onClose', (instance, done) => {
    instance.mongoose
      .disconnect()
      .then(() => done())
      .catch((err) => {
        instance.log.error(err)
        done()
      })
  })
})
