import { mapSeries } from 'bluebird'
import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { schedule } from 'node-cron'

import { ModelTypeEnum } from '../../../constants'
import { IOpenAiInstance, IOpenAiInstancesObject } from '../../../customTypes'
import { ModelDeployment } from '../../../models/types'

async function decorate(fastify: FastifyInstance) {
  // IMPORTANT: The polling of schedulers will never allow a SIGTERM for automated tests
  // Therefore this needs to be inactive on system and unit test environments
  if (process.env.NODE_ENV === 'test') {
    return
  }

  // One initial run on startup
  await updateModelConfigs(fastify, ModelTypeEnum.LLM)
  await updateModelConfigs(fastify, ModelTypeEnum.EMBEDDING)
  const scheduleTimer = process.env.MODEL_DEPLOYMENT_REFRESH_SCHEDULE_TIMER
    ? process.env.MODEL_DEPLOYMENT_REFRESH_SCHEDULE_TIMER
    : '* * * * *'
  // TODO: Cache this value in the config for 10 mins and just then reach out to DB
  // We set this to 1 min because of token per **minute** limit

  schedule(scheduleTimer, async () => {
    await updateModelConfigs(fastify, ModelTypeEnum.LLM)
  })
  schedule(scheduleTimer, async () => {
    await updateModelConfigs(fastify, ModelTypeEnum.EMBEDDING)
  })
}

export async function updateModelConfigs(
  fastify: FastifyInstance,
  type: ModelTypeEnum,
) {
  fastify.log.debug(`Refresh ${type} model deployments.`)
  let result
  switch (type) {
    case ModelTypeEnum.LLM:
      result = await getModelConfigs(fastify, type)
      fastify.config.services.azure.openAiInstances = result.config
      fastify.config.services.azure.supportedOpenAiModels = [
        ...result.supportedModels,
      ]
      break
    case ModelTypeEnum.EMBEDDING:
      result = await getModelConfigs(fastify, type)
      fastify.config.services.azure.embeddingInstances = result.config
      fastify.config.services.azure.supportedEmbedddingModels = [
        ...result.supportedModels,
      ]
      break
  }
}

async function getModelConfigs(
  fastify: FastifyInstance,
  type: ModelTypeEnum,
): Promise<{ config: IOpenAiInstancesObject; supportedModels: Set<string> }> {
  const config = {}

  const modelDeployments = await fastify.models.modelDeployment.find({
    type,
  })
  const supportedModels = new Set<string>()

  if (modelDeployments) {
    await mapSeries(
      modelDeployments,
      async (modelDeployment: ModelDeployment) => {
        const region = modelDeployment.region

        if (!config[region]) {
          config[region] = {}
        }

        if (!config[region][modelDeployment.modelName]) {
          config[region][modelDeployment.modelName] = []
        }

        const instance: IOpenAiInstance = {
          apiVersion: modelDeployment.openAiVersion,
          apiKey: modelDeployment.key,
          instanceUrl: modelDeployment.endpoint,
          instanceName: modelDeployment.instanceName,
          modelName: modelDeployment.modelName,
          deploymentName: modelDeployment.deploymentName,
          isPtu: modelDeployment.isPTU,
          region: modelDeployment.region,
        }

        config[region][modelDeployment.modelName].push(instance)
        supportedModels.add(modelDeployment.deploymentName)
      },
    )
  }

  return { config, supportedModels }
}

export const decorateModelDeploymentScheduler = fp(decorate)
