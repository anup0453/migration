import { DeleteResult } from 'mongodb'

import { ModelTypeEnum } from '../constants'
import { IDefaultFilterQuery } from '../customTypes'
import { ModelDeployment } from '../models/types'
import { updateModelConfigs } from '../server/plugins/scheduler/modelDeployment'
import BaseService from './base'

export default class ModelDeploymentService extends BaseService {
  public async getAll(query: IDefaultFilterQuery): Promise<ModelDeployment[]> {
    return await this.fastify.models.modelDeployment.find(query)
  }
  public async update(
    id: string,
    body: ModelDeployment,
  ): Promise<ModelDeployment> {
    const deployment = await this.fastify.models.modelDeployment
      .findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
      .exec()

    await updateModelConfigs(this.fastify, deployment.type as ModelTypeEnum)

    return deployment
  }
  public async create(body: ModelDeployment): Promise<ModelDeployment> {
    const existingDeployment =
      await this.fastify.models.modelDeployment.findOne({
        deploymentName: body.deploymentName,
        endpoint: body.endpoint,
      })

    if (existingDeployment) {
      throw new Error(
        `Duplicate model deployment (deploymentName, endpoint) -> Id: ${existingDeployment._id}`,
      )
    }

    const deployment = await this.fastify.models.modelDeployment.create(body)
    await updateModelConfigs(this.fastify, deployment.type as ModelTypeEnum)

    return deployment
  }
  public async getByName(name: string): Promise<ModelDeployment[]> {
    return await this.fastify.models.modelDeployment.find({ modelName: name })
  }
  public async getById(id: string): Promise<ModelDeployment | null> {
    return await this.fastify.models.modelDeployment.findById(id)
  }

  public async delete(id: string): Promise<DeleteResult> {
    const deployment = await this.fastify.models.modelDeployment
      .deleteOne({ _id: id })
      .exec()
    await updateModelConfigs(this.fastify, ModelTypeEnum.LLM)
    await updateModelConfigs(this.fastify, ModelTypeEnum.EMBEDDING)

    return deployment
  }
}
