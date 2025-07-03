import { BadRequest, NotFound } from 'http-errors'
import lodash from 'lodash'
import { DeleteResult, UpdateResult } from 'mongodb'

import { ISearchQuery } from '../customTypes'
import { AgentProps } from '../models'
import { CustomerDocument } from '../models/types'
import { randomString } from '../utils'
import BaseService from './base'

export default class AgentService extends BaseService {
  public async getAgentsOfCustomer(customerId: string) {
    const agents = await this.fastify.models.agent
      .find({ owner: customerId })
      .exec()

    return agents
  }

  public async search(params: ISearchQuery) {
    const queryFields = ['displayName']

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
      data: await this.fastify.models.agent
        .find(q.search)
        .limit(q.limit)
        .skip(q.offset)
        .sort(q.sort)
        .exec(),
      count: await this.fastify.models.agent.countDocuments(q.search).exec(),
    }
  }

  public async get(agentId: string) {
    const customerId = this.req.customer?._id.toString()

    const isOwner = customerId
      ? await this.req.services.agent.isOwnerOfAgent(customerId, agentId)
      : false
    const isAdmin = this.isAdmin()

    if (!isOwner && !isAdmin) {
      throw new BadRequest(
        `Customer with id ${customerId} is not owner of agent with id ${agentId}.`,
      )
    }

    const item = await this.fastify.models.agent.findById(agentId).exec()

    if (!item) {
      throw new NotFound(`Agent with id ${agentId} not found.`)
    }

    return item
  }

  public async isOwnerOfAgent(customerId: string, agentId: string) {
    const agent = await this.fastify.models.agent
      .findOne({ _id: agentId, owner: customerId })
      .exec()
    if (!agent) {
      throw new NotFound(
        `Agent with id ${agentId} not found or not accessible by custumer.`,
      )
    }

    return true
  }

  public async create(obj: AgentProps) {
    const customer = (await this.fastify.models.customer
      .findById(obj.owner)
      .exec()) as CustomerDocument

    if (!customer) {
      throw new NotFound(`Cannot create agent as owner cannot be found.`)
    }

    const existingAgent = await this.fastify.models.agent
      .findOne({
        owner: customer._id,
        displayName: obj.displayName,
        type: obj.type,
        isActive: true,
      })
      .exec()

    if (existingAgent) {
      throw new Error(
        `Agent with name ${obj.displayName} for customer ${customer._id} already exists.`,
      )
    }

    const agent = await this.fastify.models.agent.create({
      owner: customer._id,
      displayName: obj.displayName,
      type: obj.type,
      description: obj.description,
      systemMessage: obj.systemMessage,
      iterationLimit: obj.iterationLimit,
      isActive: true,
      apiKey: randomString(32),
      bindTools: obj.bindTools,
      settings: obj.settings,
    })

    return agent
  }

  public async update(data: AgentProps, agentId: string) {
    const customerId = this.req.customer?._id.toString()

    const isOwner = customerId
      ? await this.req.services.agent.isOwnerOfAgent(customerId, agentId)
      : false
    const isAdmin = this.isAdmin()

    if (!isOwner && !isAdmin) {
      throw new BadRequest(
        `Customer with id ${customerId} is not owner of agent with id ${agentId}.`,
      )
    }

    const ds = await this.fastify.models.agent.findById(agentId).exec()

    if (!ds) {
      throw new NotFound(`Agent with id ${agentId} not found.`)
    }

    // Recursively merge properties of source objects into a nested destination object
    const updatedData = lodash.merge(ds.toObject(), data)

    return await this.fastify.models.agent.findByIdAndUpdate(
      ds._id,
      { $set: updatedData },
      { new: true },
    )
  }

  public async purgeAgent(
    agentId: string,
  ): Promise<UpdateResult | DeleteResult | null> {
    const customerId = this.req.customer?._id.toString()

    const isOwner = customerId
      ? await this.req.services.agent.isOwnerOfAgent(customerId, agentId)
      : false
    const isAdmin = this.isAdmin()

    if (!isOwner && !isAdmin) {
      throw new BadRequest(
        `Customer with id ${customerId} is not owner of agent with id ${agentId}.`,
      )
    }

    let result: UpdateResult | DeleteResult | null

    if (this.fastify.config.env === 'production') {
      this.fastify.log.warn(
        'No deletion of agents in production environment allowed.',
      )
      result = await this.fastify.models.agent
        .updateOne({ _id: agentId }, { isActive: false })
        .exec()
    } else {
      result = await this.fastify.models.agent
        .deleteOne({
          _id: agentId,
        })
        .exec()
    }

    return result
  }
}
