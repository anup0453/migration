import { Metadata } from '@grpc/grpc-js'
import { OTLPTraceExporter as GrpcOTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
// Arize specific
import { Resource } from '@opentelemetry/resources'
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  SpanProcessor,
} from '@opentelemetry/sdk-trace-base'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function initTracing(fastify: FastifyInstance) {
  const metadata = new Metadata()
  const spaceId = fastify.config.services.arize.spaceId
  const apiKey = fastify.config.services.arize.apiKey
  const defaultProjectName = fastify.config.services.arize.defaultProjectName

  metadata.set('space_id', spaceId)
  metadata.set('api_key', apiKey)

  const spanProcessors = [
    new BatchSpanProcessor(
      new GrpcOTLPTraceExporter({
        url: fastify.config.services.arize.endpoint,
        metadata,
      }),
      {
        exportTimeoutMillis: 60000,
        maxQueueSize: 4096,
        maxExportBatchSize: 2000,
      },
    ),
  ] as SpanProcessor[]

  if (
    ['development', 'local'].includes(fastify.config.services.arize.env) &&
    fastify.config.env !== 'test'
  ) {
    spanProcessors.push(new SimpleSpanProcessor(new ConsoleSpanExporter()))
  }

  const provider = new NodeTracerProvider({
    resource: new Resource({ model_id: defaultProjectName }),
    spanProcessors,
  })

  provider.register()

  fastify.log.info('OpenInference initialized')
}

export const decorateInitTracing = fp(initTracing)
