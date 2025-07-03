import auth from '@fastify/auth'
import compress from '@fastify/compress'
import fastifyHelmet from '@fastify/helmet'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import { NotFound } from 'http-errors'
import defaults from 'lodash/defaults'
import pino from 'pino'
import pretty from 'pino-pretty'
import { parse } from 'qs'

import '../../env'
import { HelixAiError } from '../customTypes'
import {
  decorateBasicAuth,
  decorateBearerAuth,
  decorateConfig,
  decorateCors,
  decorateInitApi,
  decorateInitCostTracking,
  decorateInitSubscriptions,
  decorateInitTracing,
  decorateIpFilterRefreshScheduler,
  decorateModelDeploymentScheduler,
  decorateModels,
  decorateMongoose,
  decorateMultipart,
  decorateServices,
  handleUnhandled,
  swaggerConfig,
  swaggerUiConfig,
} from './plugins'
import { routes } from './routes'

handleUnhandled()

const stream = pretty({
  levelFirst: true,
  colorize: true,
  translateTime: 'HH:MM:ss Z',
  ignore: 'pid, hostname',
})

const xff_serializer = {
  req: (req) => ({
    method: req.method,
    url: req.url,
    hostname: req.hostname,
    remoteAddress: req.remoteAddress,
    remotePort: req.remotePort,
    headers: {
      xff: req.headers['x-forwarded-for'] || '',
      forwarded: req.headers['forwarded'] || '',
    },
  }),
}

const buildServer = async () => {
  let debugLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info'
  if (process.env.NODE_ENV === 'test') {
    debugLevel = 'silent'
  }
  const server = fastify({
    logger: pino(
      {
        name: 'GATEWAY-LOG',
        level: debugLevel,
        redact: [
          'err.response.request.headers', // it may contain "api-key" !
          'err.response.request.body', // it may contain user question
        ],
        serializers:
          process.env.PINO_ENABLE_XFF_HEADER_LOGGING === 'true'
            ? xff_serializer
            : {},
      },
      process.env.PINO_RAW_LOGGING_ENABLED === 'true' ? null : stream,
    ),
    disableRequestLogging: true,
    querystringParser: (str) => parse(str, { strictNullHandling: true }),
  })

  /* set success status to all responses */
  server.addHook('preSerialization', async (request, reply, payload) => {
    defaults(payload, { success: true })

    return payload
  })

  /* set error handlers */
  server.setErrorHandler((error: HelixAiError, request, reply) => {
    const statusCode: number = error.statusCode || error.status || 500

    if (statusCode.toString().startsWith('4')) {
      // 4xx errors are client errors
      request.log.info(error)
    } else {
      // 5xx errors are server errors
      request.log.error(error)
    }

    reply
      .status(statusCode)
      .send({
        ...error,
        success: false,
      })
      .then(
        () => {
          null
        },
        (err) => {
          server.log.error(err)
        },
      )
  })

  /* catch unmatched routes and return 404 */
  server.setNotFoundHandler(function (req, reply) {
    reply.send(new NotFound(`No such endpoint: ${req.url}`)).then(
      () => {
        null
      },
      (err) => {
        server.log.error(err)
      },
    )
  })

  await server.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  })

  await server.register(decorateConfig)
  await server.register(compress)

  // Disable validation of schemas used in swagger
  // Reason: circular dependencies between schemas
  server.setValidatorCompiler(() => () => true)

  await server.register(swagger, swaggerConfig)
  await server.register(swaggerUi, swaggerUiConfig)
  await server.register(auth)

  await server.register(decorateServices)
  await server.register(decorateMongoose, () => {
    return { mongo: server.config.database.url }
  })
  await server.register(decorateModels)
  await server.register(decorateMultipart)
  await server.register(decorateCors)
  await server.register(decorateBasicAuth)
  await server.register(decorateBearerAuth, { addHook: false })
  await server.register(routes)
  await server.register(decorateInitApi)
  await server.register(decorateModelDeploymentScheduler)
  await server.register(decorateIpFilterRefreshScheduler)
  await server.register(decorateInitCostTracking)
  await server.register(decorateInitSubscriptions)
  await server.register(decorateInitTracing)

  server.ready((err) => {
    if (err) {
      throw err
    }
    server.swagger()
  })

  try {
    server
      .listen({
        port: parseInt(process.env.PORT as string) || 7000,
        host: '0.0.0.0',
      })
      .catch(server.log.error)
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }

  return server
}

export default buildServer
