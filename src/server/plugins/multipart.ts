import fastifyMultipart from '@fastify/multipart'
import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { BadRequest } from 'http-errors'

import { SupportedMimeTypesEnum } from '../../constants'
import { ExtendedMultipartFile } from '../../customTypes'

async function onFile(part: ExtendedMultipartFile) {
  const isSupported = (
    Object.values(SupportedMimeTypesEnum) as string[]
  ).includes(part.mimetype)

  if (!isSupported) throw new BadRequest(`${part.mimetype} is not supported`)

  const file = await part.toBuffer()

  if (part.filename) {
    const originalname = part.filename

    part.filename = `${dayjs().format('YYYY-MM-DD-HH-mm')}_${originalname}`
    part.originalname = originalname
    part.buffer = file
    part.size = file.byteLength
  }
}

async function multipart(fastify: FastifyInstance) {
  await fastify.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 10000,
      fieldSize: 10000,
      fields: 500,
      fileSize: 50 * 1024 * 1024,
      files: 100,
    },
    attachFieldsToBody: true,
    onFile,
  })
}

export const decorateMultipart = fp(multipart)
