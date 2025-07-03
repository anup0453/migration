import {
  BlobClient,
  BlobSASPermissions,
  BlobServiceClient,
  ContainerClient,
  ContainerSASPermissions,
} from '@azure/storage-blob'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { BadRequest } from 'http-errors'

import {
  DatasourceEnum,
  DirectoryEnum,
  ImportDocumentStatus,
  UploadDocumentType,
} from '../../constants'
import { Customer, Datasource, Import } from '../../models/types'
import { isEncoded } from '../../utils'
import BaseService from '../base'

export default class AzureBlobService extends BaseService {
  public async deleteFileFromContainer(
    connectionString: string,
    containerName: string,
    blobName: string,
  ) {
    dayjs.extend(utc)

    try {
      const containerClient = this.getContainerClient(
        connectionString,
        containerName,
      )
      const prefix = `${DirectoryEnum.chunks}/${blobName}`
      const blobs = containerClient.listBlobsFlat({ prefix })

      for await (const blob of blobs) {
        const blobClient = containerClient.getBlobClient(blob.name)
        await blobClient.deleteIfExists()
      }
    } catch (e) {
      this.fastify.log.error(e.message)
      throw e
    }
  }

  public async getFileURL(fileName: string, datasourceId: string) {
    const datasource = await this.fastify.models.datasource
      .findById(datasourceId)
      .exec()

    const importEntry = await this.fastify.models.import
      .findOne({
        urlFileName: fileName,
        datasource,
        status: ImportDocumentStatus.TRAINED,
      })
      .select('_id')
      .exec()

    if (!importEntry) {
      throw new BadRequest('File not found')
    }

    const importId = importEntry._id
    let result = ''

    const file = await this.fastify.models.import
      .findOne({ _id: importId, datasource })
      .exec()

    if (file) {
      if (datasource.type == DatasourceEnum.BLOB) {
        return await this.createSasToken(datasource, file)
      } else {
        // Check if already encoded
        if (isEncoded(file.filePath)) {
          result = file.filePath
        } else {
          const encodedUrl = encodeURI(file.filePath)

          result = encodedUrl
        }
      }
    }

    return result
  }

  public async createContainer(
    containerName: string,
    connectionString: string,
  ) {
    try {
      if (!containerName || !connectionString) {
        return
      }
      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString)
      const containerClient =
        blobServiceClient.getContainerClient(containerName)
      const exists = await containerClient.exists({
        tracingOptions: {},
      })

      if (exists) {
        this.fastify.log.warn(
          `No need for creation, container "${containerName}" already exists.`,
        )

        return
      }

      return await blobServiceClient.createContainer(containerName)
    } catch (e) {
      this.fastify.log.error(
        `Failed to create container ${containerName}`,
        e.message,
      )

      throw new BadRequest(e.message)
    }
  }

  public async doesContainerExist(
    containerName: string,
    connectionString: string,
  ) {
    try {
      if (!containerName || !connectionString) {
        return
      }
      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString)
      const containerClient =
        blobServiceClient.getContainerClient(containerName)
      const exists = await containerClient.exists({
        tracingOptions: {},
      })

      return exists
    } catch (e) {
      this.fastify.log.error(
        `Failed to check if container ${containerName} exists`,
        e.message,
      )

      throw new BadRequest(e.message)
    }
  }

  public async deleteContainer(
    containerName: string,
    connectionString: string,
  ) {
    try {
      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString)

      return await blobServiceClient.deleteContainer(containerName, {
        tracingOptions: {},
      })
    } catch (e) {
      this.fastify.log.error(e.message)

      throw new BadRequest(e.message)
    }
  }

  private getContainerClientByDatasource(
    datasource: Datasource,
  ): ContainerClient {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      datasource.settings.azureBlobStorage.connectionString,
    )
    const containerClient = blobServiceClient.getContainerClient(
      datasource.settings.azureBlobStorage.containerName,
    )

    return containerClient
  }

  private getInternalContainerClientByDatasource(
    customer: Customer,
  ): ContainerClient {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      customer.internalStorage.connectionString,
    )
    const containerClient = blobServiceClient.getContainerClient(
      customer.internalStorage.containerName,
    )

    return containerClient
  }

  private getContainerClient(
    connectionString: string,
    containerName: string,
  ): ContainerClient {
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)

    return containerClient
  }

  public async cleanInternalStorage(customer: Customer) {
    const containerName = customer.internalStorage.containerName
    const connectionString = customer.internalStorage.connectionString

    try {
      await this.cleanContainer(connectionString, containerName)
    } catch (e) {
      this.fastify.log.error(e.message)
      throw e
    }
  }

  public async cleanBlobStorage(datasource: Datasource) {
    const containerName = datasource.settings.azureBlobStorage.containerName
    const connectionString =
      datasource.settings.azureBlobStorage.connectionString

    try {
      await this.cleanContainer(connectionString, containerName)
    } catch (e) {
      this.fastify.log.error(e.message)
      throw e
    }
  }

  public async deleteInternalStorage(customer: Customer) {
    const containerName = customer.internalStorage.containerName
    const connectionString = customer.internalStorage.connectionString

    try {
      await this.deleteContainer(containerName, connectionString)
    } catch (e) {
      this.fastify.log.error(e.message)
      throw e
    }
  }

  public async deleteBlobStorage(
    containerName: string,
    connectionString: string,
  ) {
    try {
      await this.deleteContainer(containerName, connectionString)
    } catch (e) {
      this.fastify.log.error(e.message)
      throw e
    }
  }

  private async cleanContainer(
    connectionString: string,
    containerName: string,
  ) {
    const containerClient = this.getContainerClient(
      connectionString,
      containerName,
    )

    for await (const blob of containerClient.listBlobsFlat()) {
      await containerClient.deleteBlob(blob.name)
    }
  }

  public async createSasToken(datasource: Datasource, file?: Import) {
    try {
      const customer = await this.fastify.models.customer
        .findOne({ _id: datasource.owner })
        .exec()
      const externalContainer = this.getContainerClientByDatasource(datasource)
      const internalContainer =
        this.getInternalContainerClientByDatasource(customer)
      let blobClient: BlobClient
      let sasToken: string
      const isManual =
        file?.uploadType === UploadDocumentType.MANUAL ? true : false

      if (file && !isManual) {
        blobClient = externalContainer.getBlobClient(file.fileName)

        // Temporary access key with specific permissions that can be given to clients who need to access resources in the storage account
        sasToken = await blobClient.generateSasUrl({
          permissions: BlobSASPermissions.parse('r'),
          expiresOn: new Date(
            Date.now() +
              this.fastify.config.services.azure.tokenExpirationLimit,
          ), // default is set for one hour
        })
      } else if (file && isManual) {
        const filePath = `pipeline_chunks/${datasource._id.toString()}/${
          file.fileName
        }`
        blobClient = internalContainer.getBlobClient(filePath)
        sasToken = await blobClient.generateSasUrl({
          permissions: BlobSASPermissions.parse('r'),
          expiresOn: new Date(
            Date.now() +
              this.fastify.config.services.azure.tokenExpirationLimit,
          ), // default is set for one hour
        })
      } else {
        const oneYearFromNow = new Date()
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

        sasToken = await externalContainer.generateSasUrl({
          permissions: ContainerSASPermissions.parse('racwdl'),
          expiresOn: oneYearFromNow, // default is set for one year
        })

        await this.fastify.models.datasource
          .findOneAndUpdate(
            { _id: datasource._id },
            {
              'settings.azureBlobStorage.blobBaseUrl': externalContainer.url,
              'settings.azureBlobStorage.blobSasToken': sasToken,
            },
          )
          .exec()
      }

      return sasToken
    } catch (error) {
      this.fastify.log.error(error.message)
      throw error
    }
  }
}
