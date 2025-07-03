import { FastifyInstance, FastifyRequest } from 'fastify'

import { Customer, Datasource, InternalTool } from '../models/types'

export default class BaseService {
  protected readonly fastify: FastifyInstance
  protected readonly req: FastifyRequest
  protected _datasource: Datasource
  protected _customer: Customer
  protected _tools: InternalTool[]

  constructor(fastify: FastifyInstance, req: FastifyRequest) {
    this.fastify = fastify
    this.req = req
  }

  protected isAdmin() {
    return this.req.user?.role === 'superadmin'
  }

  protected async getAllDataSources() {
    const activeDatasources = []

    for (const datasourceId of this.req.customer.datasources) {
      const datasource = await this.fastify.models.datasource
        .findById(datasourceId)
        .exec()
      if (datasource && datasource.isActive) {
        activeDatasources.push(datasource)
      }
    }

    if (activeDatasources.length === 0) {
      return
    }

    return activeDatasources
  }

  // Customizer function to replace arrays instead of merging them
  protected customizer(objValue, srcValue) {
    if (Array.isArray(objValue)) {
      return srcValue
    }
  }
}
