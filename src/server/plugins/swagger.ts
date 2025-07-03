import { SwaggerOptions } from '@fastify/swagger'
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui'

const protocol = process.env.BASE_URL.includes('https://') ? 'https' : 'http'
export const swaggerConfig: SwaggerOptions = {
  swagger: {
    info: {
      title: 'Siemens DI Bot GAIA',
      description: '',
      version: '1',
      contact: {
        name: 'Siemens AG',
        url: 'https://www.siemens.com',
      },
      license: {
        name: 'private',
      },
    },
    externalDocs: {
      url: 'https://swagger.io/docs/specification',
      description: 'Open API Documentation',
    },
    host: process.env.BASE_URL.replace('https://', '').replace('http://', ''),
    schemes: [protocol ? protocol : 'http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [],
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'api-key',
        in: 'header',
        description: 'Insert the API key of your customer',
      },
    },
    security: [{ apiKey: [] }],
  },
}
export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: '/v1/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: (_, __, next) => {
      next()
    },
    preHandler: (_, __, next) => {
      next()
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => swaggerObject,
  transformSpecificationClone: true,
}
