import { FastifyInstance } from 'fastify'

import { AdminAgentController } from '../controllers/admin/agent'
import { AdminAzureController } from '../controllers/admin/azure'
import { AdminChargeController } from '../controllers/admin/charge'
import { AdminCustomerController } from '../controllers/admin/customer'
import { AdminDatasourceController } from '../controllers/admin/datasource'
import { AdminEmbeddingModelVersionController } from '../controllers/admin/embeddingModelVersion'
import { AdminInternalToolController } from '../controllers/admin/internalTool'
import { AdminKpiController } from '../controllers/admin/kpi'
import { AdminLargeLanguageModelVersionController } from '../controllers/admin/largeLanguageModelVersion'
import { AdminLogController } from '../controllers/admin/log'
import { AdminModelDeploymentController } from '../controllers/admin/modelDeployment'
import { AdminTranslationModelVersionController } from '../controllers/admin/translationModelVersion'
import { AdminUserController } from '../controllers/admin/user'
import { AgentController } from '../controllers/agent'
import { AISearchController } from '../controllers/aiSearch'
import { CustomerController } from '../controllers/customer'
import { DatasourceController } from '../controllers/datasource'
import { DownloadController } from '../controllers/download'
import { KpiController } from '../controllers/kpi'
import { OpenAiController } from '../controllers/openai'
import { OpenAiV1Controller } from '../controllers/openaiV1'
import { PingController } from '../controllers/ping'
import { PlainLLMOpenAiController } from '../controllers/plainLLM/openai'
import { PlainLLMOpenAiV1Controller } from '../controllers/plainLLM/openaiV1'

declare module 'fastify' {
  interface FastifyRequest {
    siemensToken?: string
  }
}

/**
 * Registers all route controllers
 * @param fastify: FastifyInstance
 */
export async function routes(fastify: FastifyInstance) {
  fastify.addHook('onError', async (req, reply, error) => {
    req.errorLog = {
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
      error: error.name,
    }
  })

  // TODO: Create an own plugin for this and the registration of pino
  fastify.addHook('onRequest', async (req) => {
    fastify.log.info(
      {
        reqId: req.id,
        reqBaseInfo: {
          url: req.url,
          method: req.method,
          hostname: req.hostname,
        },
      },
      'request received',
    )
  })

  fastify.addHook('onResponse', (req, reply, done) => {
    let reqInfo: {
      reqId: string
      responseTime: number
      reqBaseInfo: { url: string; method: string; hostname: string }
      customer?: { id: string; name: string }
      user?: { id: string; email: string }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body?: any // Can be really anything
      errorInfo?: {
        statusCode: number
        message: string
        code: string
        error: string
      }
    } = {
      reqId: req.id,
      responseTime: reply.elapsedTime,
      reqBaseInfo: { url: req.url, method: req.method, hostname: req.hostname },
    }

    if (req.customer) {
      reqInfo = {
        ...reqInfo,
        customer: {
          id: req.customer._id.toString(),
          name: req.customer.name,
        },
      }
    }

    if (req.user) {
      reqInfo = {
        ...reqInfo,
        user: { id: req.user._id.toString(), email: req.user.email },
      }
    }

    if (fastify.log.level === 'debug') {
      reqInfo = { ...reqInfo, body: req.body }
    }

    if (reply.statusCode !== 200) {
      reqInfo = {
        ...reqInfo,
        errorInfo: req.errorLog,
      }
    }

    if (reply.statusCode >= 500) {
      req.log.error(reqInfo, 'request completed with error')
    } else if (reply.statusCode >= 400) {
      req.log.warn(reqInfo, 'request completed with error')
    } else {
      req.log.info(reqInfo, 'request completed')
    }
    done()
  })

  /**
   * Admin routes
   */
  await fastify.register(AdminAzureController, { prefix: '/v1/admin/azure' })
  await fastify.register(AdminCustomerController, {
    prefix: '/v1/admin/customer',
  })
  await fastify.register(AdminDatasourceController, {
    prefix: '/v1/admin/datasource',
  })
  await fastify.register(AdminInternalToolController, {
    prefix: '/v1/admin/internalTool',
  })
  await fastify.register(AdminUserController, { prefix: '/v1/admin/user' })
  await fastify.register(AdminEmbeddingModelVersionController, {
    prefix: '/v1/admin/embeddingModelVersion',
  })
  await fastify.register(AdminLargeLanguageModelVersionController, {
    prefix: '/v1/admin/largeLanguageModelVersion',
  })
  await fastify.register(AdminTranslationModelVersionController, {
    prefix: '/v1/admin/translationModelVersion',
  })
  await fastify.register(AdminModelDeploymentController, {
    prefix: '/v1/admin/modelDeployment',
  })
  await fastify.register(AdminKpiController, { prefix: '/v1/admin/kpi' })
  await fastify.register(AdminLogController, { prefix: '/v1/admin/log' })
  await fastify.register(AdminChargeController, { prefix: '/v1/admin/charge' })
  await fastify.register(AdminAgentController, { prefix: '/v1/admin/agent' })

  /**
   * User routes
   */
  await fastify.register(PingController, { prefix: '/' })
  // No versioning for now, as we try to get as close as possible to the
  // original API structure of AOAI
  await fastify.register(OpenAiController, { prefix: '/openai/deployments' })
  await fastify.register(OpenAiV1Controller, { prefix: '/v1/chat/completions' })
  await fastify.register(CustomerController, { prefix: '/v1/customer' })
  await fastify.register(KpiController, { prefix: '/v1/kpi' })
  await fastify.register(DownloadController, { prefix: '/v1/download' })
  await fastify.register(DatasourceController, { prefix: '/v1/datasource' })
  await fastify.register(AISearchController, { prefix: '/v1/aiSearch' })
  //plainLLM API routes
  await fastify.register(PlainLLMOpenAiV1Controller, {
    prefix: '/plainLLM/openai/v1/chat/completions',
  })
  await fastify.register(PlainLLMOpenAiController, {
    prefix: '/plainLLM/openai/openai/deployments',
  })
  await fastify.register(AgentController, { prefix: '/v1/agent' })
}
