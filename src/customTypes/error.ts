import { FastifyError } from 'fastify'

export type HelixAiError = FastifyError & {
  status: number // Add the new field 'status'
}
