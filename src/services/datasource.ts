import { BadRequest, NotFound } from 'http-errors'
import lodash from 'lodash'
import { DeleteResult, UpdateResult } from 'mongodb'

import { DatasourceEnum, SkillsetNameEnum } from '../constants'
import { ISearchQuery } from '../customTypes'
import { DatasourceProps } from '../models'
import { CustomerDocument } from '../models/types'
import BaseService from './base'

export default class DatasourceService extends BaseService {
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
      data: await this.fastify.models.datasource
        .find(q.search)
        .limit(q.limit)
        .skip(q.offset)
        .sort(q.sort)
        .exec(),
      count: await this.fastify.models.datasource
        .countDocuments(q.search)
        .exec(),
    }
  }

  public async get(id: string) {
    const item = await this.fastify.models.datasource.findById(id).exec()

    if (!item) {
      throw new NotFound(`Datasource with id ${id} not found.`)
    }

    return item
  }

  public async create(obj: DatasourceProps, directIndex?: boolean) {
    try {
      let customer = (await this.fastify.models.customer
        .findById(obj.owner)
        .exec()) as CustomerDocument

      let blobSasToken = null

      if (!customer) {
        throw new NotFound(
          `Cannot create datasource as owner ${obj.owner} cannot be found.`,
        )
      }

      if (!obj?.settings) {
        throw new BadRequest(
          `Cannot create datasource as settings are missing.`,
        )
      }

      const type = this.determineDatasourceType(obj)

      const defaultValues = this.fastify.config.services.default

      const ds = await this.fastify.models.datasource.create({
        displayName: obj.displayName,
        type,
        isActive: true,
        frequency: obj.frequency || '24h',
        settings: {
          ...obj.settings,
          chunkSize: obj.settings?.chunkSize || defaultValues.chunkSize,
          chunkOverlap:
            obj.settings?.chunkOverlap || defaultValues.chunkOverlap,
          translationActive:
            obj.settings?.translationActive || defaultValues.translationActive,
          defaultLanguage:
            obj.settings?.defaultLanguage || defaultValues.defaultLanguage,
          ocrActive: obj.settings?.ocrActive || defaultValues.ocrActive,
        },
        owner: obj.owner,
        chunkingPriority: obj.chunkingPriority || 0,
        keywords: obj.keywords || [],
        consecutiveErrors: 0,
      })

      customer.datasources.push(ds)
      await customer.save()

      const dsResponse = ds.toObject()

      const skillsetName =
        (customer?.aiSearch?.skillsetName as SkillsetNameEnum) ||
        SkillsetNameEnum.EMBEDDING_RELATIVEPATH_SKILL

      if (
        !customer?.aiSearch?.indexName ||
        !customer?.aiSearch?.indexerName ||
        !customer?.aiSearch?.datasourceName
      ) {
        customer =
          await this.req.services.customer.createCustomerAiSearchResources(
            customer,
            directIndex,
            skillsetName,
          )
      }

      if (type === DatasourceEnum.BLOB) {
        if (!obj.settings.azureBlobStorage?.connectionString) {
          await this.fastify.models.datasource.deleteOne({ _id: ds._id })
          throw new Error(
            `Invalid Blob connection string: ${obj.settings.azureBlobStorage.connectionString}. Please use a valid connection string.`,
          )
        }
        if (!obj.settings.azureBlobStorage?.containerName) {
          await this.fastify.models.datasource.deleteOne({ _id: ds._id })
          throw new Error(
            `Invalid containerName: ${obj.settings.azureBlobStorage.containerName}. Please use a valid containerName.`,
          )
        }

        // Create BS container for the customer
        await this.req.services.azure.blob.createContainer(
          obj.settings.azureBlobStorage.containerName,
          obj.settings.azureBlobStorage.connectionString,
        )

        blobSasToken = await this.req.services.azure.blob.createSasToken(ds)
        dsResponse.settings.azureBlobStorage.blobSasToken = blobSasToken
      }

      return dsResponse
    } catch (error) {
      throw new Error(
        `Error creating datasource ${obj.displayName}: ${error.message}`,
      )
    }
  }

  public async update(data: DatasourceProps, id: string) {
    const customerId = this.req.customer?._id.toString()

    const isOwner = customerId
      ? await this.req.services.datasource.isOwnerOfDatasource(customerId, id)
      : false
    const isAdmin = this.isAdmin()

    if (!isOwner && !isAdmin) {
      throw new BadRequest(
        `Customer with id ${customerId} is not owner of datasource with id ${id}.`,
      )
    }

    const ds = await this.fastify.models.datasource.findById(id).exec()

    if (!ds) {
      throw new NotFound(`Datasource with id ${id} not found.`)
    }

    // Recursively merge properties of source objects into a nested destination object with customizer
    const updatedData = lodash.mergeWith(ds.toObject(), data, this.customizer)

    return await this.fastify.models.datasource.findByIdAndUpdate(
      ds._id,
      { $set: updatedData },
      { new: true },
    )
  }

  public async isOwnerOfDatasource(customerId: string, datasourceId: string) {
    const datasource = await this.fastify.models.datasource
      .findOne({ _id: datasourceId, owner: customerId })
      .exec()
    if (!datasource) {
      throw new NotFound(
        `Datasource with id ${datasourceId} not found or not accessible by custumer.`,
      )
    }

    return true
  }

  public determineDatasourceType(data: DatasourceProps): DatasourceEnum {
    let foundDataSourceType = false
    let type = null
    const possibleDatasourceTypes = Object.values(DatasourceEnum)

    for (const datasourceType of possibleDatasourceTypes) {
      if (datasourceType in data.settings) {
        type = datasourceType
        foundDataSourceType = true
      }
    }
    if (!foundDataSourceType) {
      throw new BadRequest(`Invalid datasource type.`)
    }

    return type as DatasourceEnum
  }

  public async purgeDatasource(
    datasourceId: string,
  ): Promise<UpdateResult | DeleteResult | null> {
    let result: UpdateResult | DeleteResult | null

    const customerId = this.req.customer?._id.toString()

    const isOwner = customerId
      ? await this.req.services.datasource.isOwnerOfDatasource(
          customerId,
          datasourceId,
        )
      : false
    const isAdmin = this.isAdmin()

    if (!isOwner && !isAdmin) {
      throw new BadRequest(
        `Customer with id ${customerId} is not owner of datasource with id ${datasourceId}.`,
      )
    }

    await this.req.services.import.purgeImportsOfDatasource(datasourceId)

    const datasource = await this.fastify.models.datasource
      .findById(datasourceId)
      .exec()
    const ownerId = datasource.owner.toString()

    if (this.fastify.config.env === 'production') {
      this.fastify.log.warn(
        'No deletion of datasources in production environment allowed.',
      )
      result = await this.fastify.models.datasource
        .updateOne({ _id: datasourceId }, { isActive: false })
        .exec()
    } else {
      result = await this.fastify.models.datasource
        .deleteOne({ _id: datasourceId })
        .exec()
    }

    await this.removeDatasourceFromOwner(ownerId, datasourceId)

    return result
  }

  private async removeDatasourceFromOwner(
    customerId: string,
    datasourceId: string,
  ) {
    await this.fastify.models.customer.findByIdAndUpdate(customerId, {
      $pull: { datasources: datasourceId },
    })
  }
}
