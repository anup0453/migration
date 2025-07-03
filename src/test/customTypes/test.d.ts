import { FastifyInstance } from 'fastify'

export interface TestProps {
  server: FastifyInstance
  test: Test<BuiltPlugins, TestBaseOpts> & BuiltPlugins
  headers: {
    [key: string]: string
  }
}
