import { FastifyInstance, FastifyRequest } from 'fastify'

import BaseService from './base'

export default class ModelVersionService extends BaseService {
  protected readonly fastifyModel

  constructor(
    fastify: FastifyInstance,
    req: FastifyRequest,
    collectionName: string,
  ) {
    super(fastify, req)
    this.fastifyModel = fastify.models[collectionName]
  }

  public async getById(id: string) {
    return await this.fastifyModel.findById(id)
  }

  public async getLatestByModelName(modelName: string) {
    return await this.fastifyModel.findOne({
      name: modelName,
      validUntil: { $exists: false },
    })
  }

  public async getAll(query) {
    return await this.fastifyModel.find(query)
  }

  public async getAllLatest() {
    return await this.fastifyModel.distinct('name', {
      sort: { createdAt: -1 },
    })
  }

  public async create(modelVersion) {
    const previousVersion = await this.fastifyModel.findOne(
      {
        name: modelVersion.name,
      },
      null,
      { sort: { createdAt: -1 } },
    )

    const date = new Date()
    const newVersion = await this.fastifyModel.create({
      ...modelVersion,
      validFrom: date,
    })

    if (previousVersion) {
      previousVersion.validUntil = date
      await previousVersion.save()
    }

    return { newVersion, previousVersion }
  }
}
