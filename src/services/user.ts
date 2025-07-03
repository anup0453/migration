import { hashSync } from 'bcryptjs'
import { Forbidden, NotFound } from 'http-errors'
import { ObjectId } from 'mongodb'

import { UserRoleEnum } from '../constants'
import { ISearchQuery } from '../customTypes'
import { UserProps } from '../models'
import BaseService from './base'

export default class UserService extends BaseService {
  public async search(params: ISearchQuery) {
    const queryFields = ['email', 'firstname', 'lastname']

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
      data: await this.fastify.models.user
        .find(q.search)
        .limit(q.limit)
        .skip(q.offset)
        .sort(q.sort)
        .exec(),
      count: await this.fastify.models.user.countDocuments(q.search).exec(),
    }
  }

  public async get(id: string) {
    const item = await this.fastify.models.user.findById(id).exec()

    if (!item) {
      throw new NotFound(`User with id ${id} not found.`)
    }

    return item
  }

  public async upsert(obj: UserProps, id?: string) {
    const uid = id || obj._id || new ObjectId()

    const userDoc =
      (await this.fastify.models.user.findById(uid).exec()) ||
      new this.fastify.models.user()

    userDoc.set(obj)

    return await userDoc.save()
  }

  public async initDatabase() {
    const adminEmail = this.fastify.config.admin.email
    const adminKey = this.fastify.config.admin.apiKey

    const user = await this.fastify.models.user
      .findOne({ email: adminEmail })
      .lean()
      .exec()

    if (user) {
      return
    }

    await this.fastify.models.user.create({
      email: adminEmail,
      apiKey: hashSync(adminKey),
      role: 'superadmin',
    })
  }

  public hasAccess(targetRole: string) {
    let access = false

    switch (targetRole) {
      case UserRoleEnum.SUPERADMIN:
        access = this.req.user.role === UserRoleEnum.SUPERADMIN
        break
      case UserRoleEnum.ADMIN:
        access =
          this.req.user.role === UserRoleEnum.SUPERADMIN ||
          this.req.user.role === UserRoleEnum.ADMIN
        break
      case UserRoleEnum.SYSTEM:
        access =
          this.req.user.role === UserRoleEnum.SUPERADMIN ||
          this.req.user.role === UserRoleEnum.ADMIN ||
          this.req.user.role === UserRoleEnum.SYSTEM
        break
      case UserRoleEnum.USER:
        access = true
        break
      default:
        access = false
    }

    if (!access) {
      throw new Forbidden(
        `User ${this.req.user.email} does not have access to this resource.`,
      )
    }

    return access
  }
}
