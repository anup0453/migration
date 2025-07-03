import { BadRequest } from 'http-errors'

import { LoadBalancerRegionEnum, ModelTypeEnum } from '../constants'
import { IOpenAiInstance, IOpenAiInstancesObject } from '../customTypes'
import BaseService from './base'

export default class Loadbalancer extends BaseService {
  public async getInstance(
    engine: string,
    type: ModelTypeEnum,
  ): Promise<IOpenAiInstance> {
    let runCorrect = false
    let instancesAvailable = true
    let result = null
    let errorMessage = null
    do {
      try {
        result = await this.wrapGetInstance(engine, type)
        runCorrect = true
      } catch (error) {
        errorMessage = error.message

        // don't act upon it and let the do-while loop do its job

        switch (type) {
          case ModelTypeEnum.LLM:
            instancesAvailable =
              this.fastify.config.services.azure.openAiInstances[engine]
                ?.length > 0
            break
          case ModelTypeEnum.EMBEDDING:
            instancesAvailable =
              this.fastify.config.services.azure.embeddingInstances[engine]
                ?.length > 0
            break
          default:
            throw new BadRequest('Invalid model type')
        }
      }
    } while (!runCorrect && instancesAvailable)

    if (!result) {
      throw new BadRequest(`No valid AOAI instances available: ${errorMessage}`)
    }

    return result
  }

  private async wrapGetInstance(engine: string, type: ModelTypeEnum) {
    {
      let config: IOpenAiInstancesObject

      switch (type) {
        case ModelTypeEnum.LLM:
          config = this.fastify.config.services.azure.openAiInstances
          break
        case ModelTypeEnum.EMBEDDING:
          config = this.fastify.config.services.azure.embeddingInstances
          break
        default:
          throw new BadRequest('Invalid model type')
      }

      const region =
        this.req.customer.settings?.loadBalancerRegion &&
        Object.values(LoadBalancerRegionEnum).includes(
          this.req.customer.settings
            ?.loadBalancerRegion as LoadBalancerRegionEnum,
        )
          ? this.req.customer.settings?.loadBalancerRegion
          : LoadBalancerRegionEnum.WORLDWIDE

      let availableInstances = {}

      if (region === LoadBalancerRegionEnum.WORLDWIDE) {
        const availableRegions = Object.values(config)
        for (const entries of availableRegions) {
          const regionEntries = Object.entries(entries)
          for (const [eng, instances] of regionEntries) {
            if (!availableInstances[eng]) {
              availableInstances[eng] = []
            }

            availableInstances[eng] = availableInstances[eng].concat(instances)
          }
        }
      } else {
        availableInstances = config[region]
      }

      const usedEngine =
        engine && Object.keys(availableInstances)?.includes(engine)
          ? engine
          : null

      if (!usedEngine) {
        throw BadRequest(
          `The deploymentName ${engine} is not available in the selected region ${region}.`,
        )
      }

      const instances = availableInstances[usedEngine]

      if (!instances?.length) {
        throw new BadRequest('No valid AOAI instances available.')
      }

      if (instances.length === 1) {
        return instances[0]
      }

      const ptuInstance = instances.find((i) => i.isPtu)

      if (ptuInstance) {
        return ptuInstance
      }

      // random() equally shares the provision of random numbers, therefore it
      // automatically distributes round-robin
      return instances[Math.floor(Math.random() * instances.length)]
    }
  }

  public async removeInstance(
    instance: IOpenAiInstance,
    engine: string,
    type: ModelTypeEnum,
  ) {
    let instancesConfig: IOpenAiInstancesObject

    switch (type) {
      case ModelTypeEnum.LLM:
        instancesConfig = this.fastify.config.services.azure.openAiInstances
        break
      case ModelTypeEnum.EMBEDDING:
        instancesConfig = this.fastify.config.services.azure.embeddingInstances
        break
      default:
        throw new BadRequest('Invalid model type')
    }

    const instances = instancesConfig[instance.region][engine]
    const index = instances.findIndex(
      (i: IOpenAiInstance) =>
        i.deploymentName === instance.deploymentName &&
        i.instanceUrl === instance.instanceUrl,
    )
    if (index > -1) {
      instances.splice(index, 1)
      this.fastify.log.warn(
        'The following instance was removed from unreachable instances: ' +
          instance.deploymentName +
          ' - ' +
          instance.instanceUrl,
      )
    }
  }
}
