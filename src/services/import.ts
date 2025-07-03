import { mapSeries } from 'bluebird'
import { NotFound } from 'http-errors'

import { ImportDocumentStatus, UploadDocumentType } from '../constants'
import BaseService from './base'

export default class ImportService extends BaseService {
  public async setRemoved(id: string) {
    const doc = await this.fastify.models.import.findById(id).exec()

    if (!doc) {
      throw new NotFound('No import document found')
    }

    return await doc.set({ status: ImportDocumentStatus.REMOVED }).save()
  }

  public async getAllTrained(ds: string) {
    const result = await this.fastify.models.import
      .find({ datasource: ds, status: ImportDocumentStatus.TRAINED })
      .exec()

    return result
  }

  public async getByName(name: string) {
    return await this.fastify.models.import.findOne({ name }).exec()
  }

  public async purgeImportsOfDatasource(datasourceId: string) {
    // Delete only for owner
    // Todo: When shared datasource is implemented, we need to do this for all using the datasource
    // get owner of datasource that is embedded
    const datasource = await this.fastify.models.datasource
      .findById(datasourceId)
      .populate('owner')
      .exec()
    const owner = datasource.owner

    if (!owner) {
      this.fastify.log.warn(
        `No owner for datasource with id ${datasourceId} found.`,
      )
    }

    await this.req.services.azure.blob.deleteFileFromContainer(
      owner.internalStorage.connectionString,
      owner.internalStorage.containerName,
      datasourceId,
    )

    await this.fastify.models.import
      .updateMany(
        { datasource: datasourceId },
        {
          $set: { status: ImportDocumentStatus.REMOVED },
        },
      )
      .exec()
  }

  public async purgeManualImportsOfCustomer(customerId: string) {
    const customer = await this.fastify.models.customer
      .findById(customerId)
      .exec()

    const manualImportsQuery = {
      datasource: { $in: customer.datasources },
      status: ImportDocumentStatus.TRAINED,
      uploadType: UploadDocumentType.MANUAL,
    }

    const manualImports = await this.fastify.models.import
      .find(manualImportsQuery)
      .exec()

    await mapSeries(manualImports, async (importDoc) => {
      await this.req.services.azure.blob.deleteFileFromContainer(
        customer.internalStorage.connectionString,
        customer.internalStorage.containerName,
        importDoc.fileName,
      )
    })

    await this.fastify.models.import
      .updateMany(manualImportsQuery, {
        $set: { status: ImportDocumentStatus.REMOVED },
      })
      .exec()
  }
}
