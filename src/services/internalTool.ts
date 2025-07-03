import { DynamicTool } from '@langchain/core/tools'
import { NotFound } from 'http-errors'
import lodash from 'lodash'
import { DeleteResult, UpdateResult } from 'mongodb'

import { InternalToolEnum, InternalToolPrice } from '../constants'
import { IChatCompletionBody, ISearchQuery } from '../customTypes'
import { InternalToolProps } from '../models'
import { InternalTool } from '../models/types'
import BaseService from './base'

export default class InternalToolService extends BaseService {
  public async search(params: ISearchQuery) {
    const queryFields = ['name']

    const q = {
      search: {},
      limit: params?.limit || 25,
      offset: params?.offset || 0,
      sort: params?.sort || 'updatedAt',
    }

    if (params?.search) {
      const queryRegex = new RegExp(params.search, 'i')
      q.search['$or'] = queryFields.map((s) => ({ [s]: queryRegex }))
    }

    return {
      data: await this.fastify.models.internalTool
        .find(q.search)
        .limit(q.limit)
        .skip(q.offset)
        .sort(q.sort)
        .exec(),
      count: await this.fastify.models.internalTool
        .countDocuments(q.search)
        .exec(),
    }
  }

  public async get(id: string) {
    const item = await this.fastify.models.internalTool.findById(id).exec()

    if (!item) {
      throw new NotFound(`Tool with id ${id} not found.`)
    }

    return item
  }

  public async create(obj: InternalToolProps) {
    const customer = await this.fastify.models.customer
      .findById(obj.owner)
      .exec()

    if (!customer) {
      throw new NotFound(
        `Cannot create tool as owner ${obj.owner} cannot be found.`,
      )
    }

    const type = this.determineInternalToolType(obj)

    const existingInternalTool = await this.fastify.models.internalTool
      .findOne({
        owner: obj.owner,
        displayName: obj.displayName,
        type: type,
        isActive: true,
      })
      .exec()

    if (existingInternalTool) {
      throw new Error(
        `Tool with name ${obj.displayName} for customer ${obj.owner} already exists.`,
      )
    }

    const internalTool = await this.fastify.models.internalTool.create({
      displayName: obj.displayName,
      type,
      description: obj.description,
      settings: obj.settings,
      isActive: true,
      owner: obj.owner,
    })

    customer.internalTools.push(internalTool)
    await customer.save()

    return internalTool
  }

  public async update(data: InternalToolProps, id: string) {
    const ds = await this.fastify.models.internalTool.findById(id).exec()

    if (!ds) {
      throw new NotFound(`Tool with id ${id} not found.`)
    }

    // Recursively merge properties of source objects into a nested destination object
    const updatedData = lodash.merge(ds.toObject(), data)

    return await this.fastify.models.internalTool.findByIdAndUpdate(
      ds._id,
      { $set: updatedData },
      { new: true },
    )
  }

  public async isOwnerOfInternalTool(customerId: string, toolId: string) {
    const internalTool = await this.fastify.models.internalTool
      .findOne({
        _id: toolId,
        owner: customerId,
      })
      .exec()
    if (!internalTool) {
      throw new NotFound(
        `Tool with id ${toolId} not found or not accessible by custumer.`,
      )
    }

    return true
  }

  public determineInternalToolType(data: InternalToolProps) {
    if (data.settings[InternalToolEnum.BING]) {
      return InternalToolEnum.BING
    } else if (data.settings[InternalToolEnum.SNOWFLAKE]) {
      return InternalToolEnum.SNOWFLAKE
    }
  }

  public async purgeInternalTool(
    toolId: string,
  ): Promise<UpdateResult | DeleteResult | null> {
    let result: UpdateResult | DeleteResult | null

    const internalTool = await this.fastify.models.internalTool
      .findById(toolId)
      .exec()
    const customerId = internalTool.owner.toString()

    if (this.fastify.config.env === 'production') {
      this.fastify.log.warn(
        'No deletion of tools in production environment allowed.',
      )
      result = await this.fastify.models.internalTool
        .updateOne({ _id: toolId }, { isActive: false })
        .exec()
    } else {
      result = await this.fastify.models.internalTool
        .deleteOne({
          _id: toolId,
        })
        .exec()
    }

    await this.removeInternalToolFromCustomer(customerId, toolId)

    return result
  }

  private async removeInternalToolFromCustomer(
    customerId: string,
    toolId: string,
  ) {
    await this.fastify.models.customer.findByIdAndUpdate(customerId, {
      $pull: { tools: toolId },
    })
  }

  public async prepareInternalTools(
    body: IChatCompletionBody,
    parentId?: string,
  ): Promise<DynamicTool[]> {
    //get active tools from customer
    const activeCustomerInternalTools = []

    for (const toolId of this.req.customer.internalTools) {
      const internalTool = await this.fastify.models.internalTool
        .findById(toolId)
        .exec()
      if (internalTool && internalTool.isActive) {
        activeCustomerInternalTools.push(internalTool)
      }
    }

    if (activeCustomerInternalTools.length === 0) {
      return
    }

    //filter tools according to the request
    const filteredTools = activeCustomerInternalTools.filter((tool) =>
      body.internalTools.includes(tool.displayName),
    )

    return filteredTools.map((tool) =>
      this.getInternalToolFunctionFromName(tool, parentId),
    )
  }

  private getInternalToolFunctionFromName(
    internalTool: InternalTool,
    parentId?: string,
  ) {
    // If we add more functions later, they can be added here

    const bingSearch = new DynamicTool({
      name: InternalToolEnum.BING,
      tags: [internalTool.displayName],
      description: internalTool.description,
      func: async (input: string) => {
        return this.req.services.tooling.bing.search(
          input,
          internalTool,
          parentId,
        )
      },
    })

    const snowflake = new DynamicTool({
      name: InternalToolEnum.SNOWFLAKE,
      tags: [internalTool.displayName],
      description: internalTool.description,
      func: async (sqlQuery) => {
        return this.req.services.tooling.snowflake.getSqlResults(
          sqlQuery,
          internalTool,
          parentId,
        )
      },
    })

    const internalTools = {
      bingSearch: bingSearch,
      snowflake: snowflake,
    }

    const selectedTool = internalTools[internalTool.type] || undefined

    return selectedTool
  }

  public async getUnitPrice(toolId: string) {
    let unitPrice = 0

    const internalTool = await this.fastify.models.internalTool.findById(toolId)
    switch (internalTool.type) {
      case InternalToolEnum.BING:
        unitPrice = InternalToolPrice.BING
        break
      case InternalToolEnum.SNOWFLAKE:
        unitPrice = InternalToolPrice.SNOWFLAKE
        break
    }

    return unitPrice
  }
}
