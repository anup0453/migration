import { mapSeries } from 'bluebird'
import dayjs from 'dayjs'
import { BadRequest, Forbidden, NotFound } from 'http-errors'
import lodash from 'lodash'
import { DeleteResult, ObjectId } from 'mongodb'
import { UpdateResult } from 'mongoose'

import { FieldTypesEnum, IpFilteringMode, SkillsetNameEnum } from '../constants'
import { DefaultSystemMessageEnum } from '../constants/defaultValues'
import { ISearchQuery } from '../customTypes'
import { CustomerApiKeyProps, CustomerProps, DatasourceProps } from '../models'
import {
  Customer,
  CustomerApiKey,
  CustomerBillingDocument,
  CustomerDocument,
  CustomerFrontendSettingFilterButton,
  CustomerSubscriptionDocument,
  DatasourceDocument,
  SubscriptionDocument,
} from '../models/types'
import { randomString } from '../utils'
import BaseService from './base'

export default class CustomerService extends BaseService {
  public async search(params: ISearchQuery) {
    const queryFields = ['name', 'customerId']

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
      data: await this.fastify.models.customer
        .find(q.search)
        .limit(q.limit)
        .skip(q.offset)
        .sort(q.sort)
        .exec(),
      count: await this.fastify.models.customer.countDocuments(q.search).exec(),
    }
  }

  public async get(id: string) {
    const item = await this.fastify.models.customer.findById(id).exec()

    if (!item) {
      throw new NotFound(`Customer with id ${id} not found.`)
    }

    return item
  }

  public async getCustomerInfo(id: string): Promise<Partial<Customer>> {
    const customer = await this.fastify.models.customer.findById(id)
    const redactedCustomer = this.redactCustomer(customer.toObject())

    return redactedCustomer
  }

  public async getDatasourcesOfCustomer(customerId: string) {
    const customer = await this.fastify.models.customer
      .findById(customerId)
      .populate('datasources')
      .exec()

    return customer.datasources
  }

  public preventAccessOfInactiveCustomer() {
    if (!this.req.customer?.isActive && !this.isAdmin()) {
      throw new BadRequest('Customer is not active')
    }
  }

  private extractIpAddress(clientIp: string) {
    try {
      // facts:
      // - clientIp might be IPv4 or IPv6
      // - we need to check both
      let subClientIp =
        clientIp.lastIndexOf(':') > clientIp.lastIndexOf(']')
          ? clientIp.substring(0, clientIp.lastIndexOf(':'))
          : clientIp

      // and if that was IPv6 (I'm assuming it will be [addr]:port notation):
      if (subClientIp.startsWith('[') && subClientIp.endsWith(']')) {
        subClientIp = subClientIp.substring(1, subClientIp.length - 1)
      }

      return subClientIp
    } catch (error) {
      this.fastify.log.error('An error occurred during IP extraction: ', error)
      throw new Error('Failed to extract IP address')
    }
  }

  public filterCustomerIpAddresses() {
    try {
      if (
        this.req.customer.ipFilteringSettings?.isIpFilteringEnabled === true
      ) {
        const IP_FILTERING_MODE =
          this.req.customer.ipFilteringSettings.blockingMode.toString()

        const customerId = this.req.customer._id.toString()

        this.fastify.log.info(
          'IP Filtering enabled on customer: ' +
            customerId +
            ' , IP_FILTERING_MODE ' +
            IP_FILTERING_MODE,
        )

        if (this.req.headers['x-forwarded-for'] !== undefined) {
          // Extract Client IP from header
          const clientIpInXff = this.req.headers['x-forwarded-for']
            .toString()
            .split(',')[0] // In 'x-forwarded-for' clientIP should be always 1st
          this.fastify.log.debug('Client IP in XFF: ' + clientIpInXff)

          const clientIp = this.extractIpAddress(clientIpInXff)
          this.fastify.log.debug('Extracted Client IP (no port): ' + clientIp)

          // Main logic
          if (
            this.fastify.config.customers.whitelistConfig[customerId] ===
              undefined &&
            IP_FILTERING_MODE === IpFilteringMode.BLOCK
          ) {
            const message =
              'IP Filtering enabled on customer: ' +
              customerId +
              ' , and blockMode is set to: ' +
              IP_FILTERING_MODE +
              '. Requests will be blocked until whitelistConfig list will be updated by scheduler. That can take up to 30 minutes. Optionally change blocking mode to ' +
              IpFilteringMode.LOG
            this.fastify.log.warn(message)
            throw new Forbidden(message)
          } else if (
            this.fastify.config.customers.whitelistConfig[customerId] ===
              undefined &&
            IP_FILTERING_MODE === IpFilteringMode.LOG
          ) {
            const message =
              'IP Filtering enabled on customer: ' +
              customerId +
              ' , and blockMode is set to: ' +
              IP_FILTERING_MODE +
              '. Temporarily allowing requests to be finished.'
            this.fastify.log.warn(message)

            return
          } else if (
            this.fastify.config.customers.whitelistConfig[customerId].check(
              clientIp,
            ) ||
            this.fastify.config.customers.whitelistConfig[customerId].check(
              clientIp,
              'ipv6',
            )
          ) {
            this.fastify.log.debug(
              'IP matched! Allowing client to go through..',
            )

            return
          } else {
            const message =
              'IP Filtering is set to true on customer (' +
              customerId +
              '), and your IP address (' +
              clientIp +
              ') is not whitelisted'

            if (IP_FILTERING_MODE === IpFilteringMode.BLOCK)
              throw new Forbidden(message)
            else if (IP_FILTERING_MODE === IpFilteringMode.LOG)
              this.fastify.log.warn(
                '[IP_FILTERING_MODE is set to ' +
                  IP_FILTERING_MODE +
                  ']: ' +
                  message,
              )
          }
        } else {
          const message =
            'IP Filtering is set to true on customer (' +
            customerId +
            '), and request was not containing correct headers.'

          if (IP_FILTERING_MODE === IpFilteringMode.BLOCK)
            throw new BadRequest(message)
          else if (IP_FILTERING_MODE === IpFilteringMode.LOG)
            this.fastify.log.warn(
              '[IP_FILTERING_MODE is set to ' +
                IP_FILTERING_MODE +
                ']: ' +
                message +
                ' Missing x-forwarded-for header.',
            )
        }
      }
    } catch (error) {
      this.fastify.log.error('An error occurred during IP filtering: ', error)
      throw error
    }
  }

  private async create(obj: Customer) {
    const existing = await this.fastify.models.customer
      .findOne({ name: obj.name })
      .exec()

    if (existing) {
      return existing
    }

    const customer = new this.fastify.models.customer(obj)

    return await customer.save()
  }

  public async updateSettings(obj: CustomerProps['settings']) {
    const customerId = this.req.customer._id.toString()

    const customer = await this.fastify.models.customer
      .findById(customerId)
      .exec()

    if (!customer) {
      throw new NotFound(`Customer with id ${customerId} not found.`)
    }

    for (const key in obj) {
      if (obj[key] !== undefined) {
        customer.settings[key] = obj[key]
      }
    }

    await customer.save()

    const redactedCustomer = this.redactCustomer(customer.toObject())

    return redactedCustomer
  }

  public async updateFrontendSettings(data: CustomerProps, id?: string) {
    const customerId = id || data._id || this.req.customer._id.toString()

    const customer = await this.fastify.models.customer
      .findOne({ _id: customerId })
      .exec()

    if (!customer) {
      throw new NotFound(`Datasource with id ${customerId} not found.`)
    }

    data.frontendSettings?.filterButtons?.forEach((button) => {
      if (!button.fieldType) {
        throw new BadRequest(
          `Field type is required for filter button ${button.displayName}.`,
        )
      }

      if (button.fieldType === FieldTypesEnum.CHOICESET) {
        if (button.level === undefined) {
          throw new BadRequest(
            `The field level is required for filter button ${button.displayName} with field type ${FieldTypesEnum.CHOICESET}.`,
          )
        }

        if (!button.placeholder) {
          throw new BadRequest(
            `The field placeholder is required for filter button ${button.displayName} with field type ${FieldTypesEnum.CHOICESET}.`,
          )
        }
      }
    })

    // Recursively merge properties of source objects into a nested destination object with customizer
    const updatedData = lodash.mergeWith(
      customer.toObject(),
      data,
      this.customizer,
    )

    const updatedCustomer =
      await this.fastify.models.customer.findByIdAndUpdate(
        customer._id,
        { $set: updatedData },
        { new: true },
      )

    const redactedCustomer = this.redactCustomer(updatedCustomer.toObject())

    return redactedCustomer
  }

  public async update(obj: CustomerProps, id: string) {
    const uid = id || obj._id

    if (!uid) {
      throw new BadRequest(`Invalid id given.`)
    }

    const hasDatasources = !!obj.datasources?.length
    let datasources: Array<ObjectId | DatasourceDocument> = []

    const settings = obj.settings
    const ipFilteringSettings = obj.ipFilteringSettings
    delete obj.settings

    const customer = await this.fastify.models.customer
      .findOneAndUpdate({ _id: uid }, { $set: obj }, { new: true })
      .exec()

    if (hasDatasources) {
      datasources = await this.fastify.models.datasource.find({
        _id: { $in: obj.datasources },
      })

      if (!datasources?.length) {
        throw new BadRequest(`Invalid index ids given.`)
      }

      return await this.fastify.models.customer
        .findByIdAndUpdate(customer, { $set: { datasources } }, { new: true })
        .exec()
    }

    if (ipFilteringSettings !== undefined) {
      customer.ipFilteringSettings = ipFilteringSettings
    }

    // Recursively merge properties of source objects into a nested destination object with customizer
    const updatedData = lodash.mergeWith(
      customer.toObject(),
      settings,
      this.customizer,
    )

    const updatedCustomer =
      await this.fastify.models.customer.findByIdAndUpdate(
        customer._id,
        { $set: updatedData },
        { new: true },
      )

    const redactedCustomer = this.redactCustomer(updatedCustomer.toObject())

    return redactedCustomer
  }

  public getCustomerPrefix(customer: Customer) {
    const customerId = customer._id.toString()
    const customerNameNormalized = customer.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 12)
    const baseName = `${customerNameNormalized}-${customerId}`

    return baseName.toLowerCase()
  }

  public async onboard(data: Customer & { datasource?: DatasourceProps }) {
    // Create the customer
    const customerData = await this.buildCustomerData(data)
    let customer = await this.create(customerData)
    let containerCreated = false
    let datasource: DatasourceDocument | null = null

    // Create internal storage for customer
    const containerName = `${this.getCustomerPrefix(customer)}-container`
    await this.req.services.azure.blob.createContainer(
      containerName,
      this.fastify.config.services.azure.internalBlobStorageConnectionString,
    )

    customer.internalStorage = {
      connectionString:
        this.fastify.config.services.azure.internalBlobStorageConnectionString,
      containerName,
    }

    customer = await customer.save()

    try {
      if (data.datasource) {
        data.datasource.owner = customer
        const directIndex = data.aiSearch?.directIndex || false

        datasource = await this.req.services.datasource.create(
          data.datasource,
          directIndex,
        )

        // Only create container of external storage if it does not exist yet
        if (data.datasource.settings.azureBlobStorage) {
          const doesContainerExist =
            await this.req.services.azure.blob.doesContainerExist(
              data.datasource.settings.azureBlobStorage.containerName,
              data.datasource.settings.azureBlobStorage.connectionString,
            )

          if (!doesContainerExist) {
            await this.req.services.azure.blob.createContainer(
              data.datasource.settings.azureBlobStorage.containerName,
              data.datasource.settings.azureBlobStorage.connectionString,
            )

            // Save for later possible cleanup
            containerCreated = true
          }
        }

        // Find updated customer after datasource was added
        customer = await this.fastify.models.customer
          .findById(customer._id)
          .exec()
      }

      // Has to run after datasource creation to be able to determine the subscription type
      const hasDatasource = !!data.datasource

      customer.subscription = {
        isChargeable: true,
        type: await this.getSubscriptionType(hasDatasource),
        start: new Date(),
      } as CustomerSubscriptionDocument

      customer.billing = data.billing as CustomerBillingDocument

      await customer.save()

      const redactedCustomer = this.redactCustomer(customer.toObject())
      const redactedCustomerWithInitialApiKeys = {
        ...redactedCustomer,
        apiKeys: customer.apiKeys,
      }

      return datasource
        ? { customer: redactedCustomerWithInitialApiKeys, datasource }
        : { customer: redactedCustomerWithInitialApiKeys }
    } catch (error) {
      this.fastify.log.error(
        `Failed to onboard customer ${customer.name}`,
        error.message,
      )
      await this.cleanFailedOnboard(customer._id.toString(), containerCreated)
      throw error
    }
  }

  public async createCustomerAiSearchResources(
    customer: CustomerDocument,
    directIndex: boolean,
    skillsetName?: SkillsetNameEnum,
  ): Promise<CustomerDocument> {
    const customerPrefix = this.getCustomerPrefix(customer)
    const indexName = `${customerPrefix}-index`
    const indexerName = `${customerPrefix}-indexer`
    const datasourceName = `${customerPrefix}-datasource`
    const scoringProfileName = 'balanced_search'

    try {
      // Create the index
      await this.req.services.azure.cognitiveSearch.createIndex(
        indexName,
        skillsetName,
      )

      // Create the datasource connection to Azure BS - Internal Storage
      await this.req.services.azure.cognitiveSearch.createDataSourceConnection(
        datasourceName,
        customer.internalStorage.containerName,
        customer.internalStorage.connectionString,
      )

      // Create the indexer
      await this.req.services.azure.cognitiveSearch.createIndexer(
        indexerName,
        indexName,
        datasourceName,
        skillsetName,
      )

      return await customer
        .set({
          aiSearch: {
            endpoint: this.fastify.config.services.azure.searchEndpoint,
            apiKey: this.fastify.config.services.azure.searchApiKey,
            indexName,
            indexerName,
            datasourceName,
            scoringProfile: scoringProfileName,
            skillsetName: skillsetName,
            directIndex: directIndex,
          },
        })
        .save()
    } catch (error) {
      this.fastify.log.error(
        `Failed to create AI search resources for customer ${customer.name}`,
        error.message,
      )
      throw error
    }
  }

  private async getSubscriptionType(
    hasDatasource: boolean,
  ): Promise<SubscriptionDocument> {
    const q = hasDatasource ? { name: 'GAIA' } : { name: 'GAIA Light' }

    const type = await this.fastify.models.subscription.findOne(q).exec()

    if (!type) {
      throw new NotFound(`No valid subscription plan found.`)
    }

    return type
  }

  private async buildCustomerData(data: Customer) {
    const defaultValues = this.fastify.config.services.default
    const customerSettings: Customer['settings'] = {
      summarizeConversationSystemMessage:
        data.settings?.summarizeConversationSystemMessage ||
        DefaultSystemMessageEnum.SUMMARIZE_CONVERSATION,
      generateSearchQuerySystemMessage:
        data.settings?.generateSearchQuerySystemMessage ||
        DefaultSystemMessageEnum.GENERATE_SEARCH_QUERY,
      reactOnUserMessageSystemMessage:
        data.settings?.reactOnUserMessageSystemMessage ||
        DefaultSystemMessageEnum.REACT_ON_USER_MESSAGE,
      topN: data.settings?.topN || defaultValues.topN,

      dynamicNActive:
        data.settings?.dynamicNActive || defaultValues.dynamicNActive,
      temperature: data.settings?.temperature || defaultValues.temperature,
      maxResponseTokens:
        data.settings?.maxResponseTokens || defaultValues.maxResponseTokens,
      topP: data.settings?.topP || defaultValues.topP,
      frequencyPenalty:
        data.settings?.frequencyPenalty || defaultValues.frequencyPenalty,
      presencePenalty:
        data.settings?.presencePenalty || defaultValues.presencePenalty,
      stop: data.settings?.stop || defaultValues.stop,
      historyCount: data.settings?.historyCount || defaultValues.historyCount,
      loadBalancerRegion:
        data.settings?.loadBalancerRegion || defaultValues.loadBalancerRegion,
      sourceLinkActive:
        data.settings?.sourceLinkActive || defaultValues.sourceLinkActive,
      defaultGptVersion:
        data.settings?.defaultGptVersion || defaultValues.defaultGptVersion,
      sourceFilterActive:
        data.settings?.sourceFilterActive || defaultValues.sourceFilterActive,
      ignoreOpenAIParamsInBody:
        data.settings?.ignoreOpenAIParamsInBody ||
        defaultValues.ignoreOpenAIParamsInBody,
      includeDateContext:
        data.settings?.includeDateContext || defaultValues.includeDateContext,
      ...data.settings,
    }

    const ipFilteringSettings: Customer['ipFilteringSettings'] = {
      isIpFilteringEnabled:
        data.ipFilteringSettings?.isIpFilteringEnabled || false,
      blockingMode:
        data.ipFilteringSettings?.blockingMode || IpFilteringMode.LOG,
      whitelistedIpsArray: data.ipFilteringSettings?.whitelistedIpsArray || [],
    }

    const frontendSettings: Customer['frontendSettings'] = {
      welcomeSystemMessage:
        data.frontendSettings?.welcomeSystemMessage ||
        DefaultSystemMessageEnum.WELCOME,
      filterButtons:
        data.frontendSettings?.filterButtons?.map(
          (button: CustomerFrontendSettingFilterButton) => ({
            displayName: button.displayName || '',
            keywords: button.keywords || [],
            filter: button.filter || [],
            fieldType: button.fieldType || 'Default',
          }),
        ) || [],
    }

    const arizeSettings: Customer['arizeSettings'] = {
      projectName: data.arizeSettings?.projectName,
      spaceId: data.arizeSettings?.spaceId,
      apiKey: data.arizeSettings?.apiKey,
      tracingEnabled:
        data.arizeSettings?.tracingEnabled || defaultValues.tracingEnabled,
    }

    const aiSearchSettings: Customer['aiSearch'] = data.aiSearch
      ? { ...data.aiSearch }
      : undefined

    const apikey1 = this.getNewApiKey({ description: 'Initial api key 1' })
    const apikey2 = this.getNewApiKey({ description: 'Initial api key 2' })

    const customerData = {
      name: data.name,
      isActive: true,
      apiKeys: [apikey1, apikey2],
      datasources: [],
      settings: customerSettings,
      arizeSettings: arizeSettings,
      ipFilteringSettings: ipFilteringSettings,
      frontendSettings: frontendSettings,
      aiSearch: aiSearchSettings,
    } as Customer

    return customerData
  }

  public async purgeCustomer(
    id: string,
  ): Promise<Partial<Customer> | DeleteResult | null> {
    // Definition of purge:
    //
    //  only if env === development
    //  delete the customer and all its resources
    //
    //  if env !== development
    //  set isActive to false and end subscription at the end of the month
    //  and delete all aiSearch resources of teh customer and unset the DB fields

    try {
      const result = await this.fastify.models.customer
        .findByIdAndUpdate(
          id,
          {
            isActive: false,
            'subscription.end': dayjs().endOf('month').toDate(),
          },
          { new: true },
        )
        .exec()

      await this.purgeDatasources(id)

      await this.purgeInternalStorage(id)

      await this.purgeAiSearchResources(id)

      if (process.env.NODE_ENV !== 'production') {
        return await this.fastify.models.customer.deleteOne({ _id: id }).exec()
      }

      return this.redactCustomer(result.toObject())
    } catch (error) {
      this.fastify.log.error(`Failed to purge customer ${id}`, error.message)
      throw error
    }
  }

  private async purgeDatasources(customerId: string) {
    const customer = await this.get(customerId)

    for (const datasource of customer.datasources) {
      const datasourceId = datasource._id.toString()
      await this.req.services.datasource.purgeDatasource(datasourceId)
    }
  }

  private getNewApiKey(options?: {
    validFrom?: Date
    validTo?: Date
    description?: string
  }): CustomerApiKey {
    const today = new Date()
    const nextYear = new Date(today.setFullYear(today.getFullYear() + 1))

    return {
      _id: new ObjectId(),
      key: randomString(32),
      validFrom: options?.validFrom || new Date(),
      validTo: options?.validTo || nextYear,
      description: options?.description || 'API key',
    } as CustomerApiKey
  }

  private async purgeAiSearchResources(customerId: string) {
    const customer = await this.get(customerId)

    if (customer.aiSearch) {
      if (customer.aiSearch.indexerName) {
        try {
          await this.req.services.azure.cognitiveSearch.deleteIndexer(
            customer.aiSearch.indexerName,
          )
          await customer
            .set({ 'aiSearch.indexerName': null }, { strict: false })
            .save()
        } catch (error) {
          this.fastify.log.error(error)
        }
      }

      if (customer.aiSearch.datasourceName) {
        try {
          await this.req.services.azure.cognitiveSearch.deleteDataSourceConnection(
            customer.aiSearch.datasourceName,
          )
          await customer
            .set({ 'aiSearch.datasourceName': null }, { strict: false })
            .save()
        } catch (error) {
          this.fastify.log.error(error)
        }
      }

      if (customer.aiSearch.indexName) {
        try {
          await this.req.services.azure.cognitiveSearch.deleteIndex(
            customer.aiSearch.indexName,
          )
          await customer
            .set({ 'aiSearch.indexName': null }, { strict: false })
            .save()
        } catch (error) {
          this.fastify.log.error(error)
        }
      }

      await customer.set({ aiSearch: undefined }).save()
    }
  }

  private async purgeInternalStorage(customerId: string) {
    const customer = await this.get(customerId)

    try {
      if (customer.internalStorage) {
        try {
          await this.req.services.azure.blob.deleteContainer(
            customer.internalStorage.containerName,
            customer.internalStorage.connectionString,
          )
          await customer.set({ internalStorage: undefined }).save()
        } catch (error) {
          this.fastify.log.error(error)
        }
      }
    } catch (error) {
      this.fastify.log.error(
        `Failed to purge internal storage for customer ${customerId}`,
        error.message,
      )
      throw error
    }
  }

  public async cleanKnowledgebase(customerId: string) {
    const customer = await this.fastify.models.customer
      .findById(customerId)
      .populate('datasources')
      .exec()

    if (!customer) {
      throw new NotFound(`Customer with id ${customerId} not found.`)
    }

    try {
      await mapSeries(
        customer.datasources,
        async (datasource: DatasourceDocument) => {
          await this.req.services.datasource.purgeDatasource(
            datasource._id.toString(),
          )
        },
      )

      if (customer.aiSearch) {
        await this.req.services.azure.cognitiveSearch.cleanAiSearchResources({
          indexName: customer.aiSearch.indexName,
          indexerName: customer.aiSearch.indexerName,
        })
      }

      if (customer.internalStorage) {
        // Clean the internal storage
        await this.req.services.azure.blob.cleanInternalStorage(customer)
      }

      this.fastify.log.info(
        `Cleaned knowledgebase for customer ${customer.name}`,
      )

      return
    } catch (error) {
      this.fastify.log.error(
        `Failed to clean knowledgebase for customer ${customer.name}`,
        error.message,
      )
      throw error
    }
  }

  public async cleanFailedOnboard(
    customerId: string,
    containerCreated: boolean,
  ) {
    const customer = await this.fastify.models.customer
      .findById(customerId)
      .populate('datasources')
      .exec()

    if (!customer) {
      throw new NotFound(`Customer with id ${customerId} not found.`)
    }

    try {
      await mapSeries(
        customer.datasources,
        async (datasource: DatasourceDocument) => {
          await this.req.services.datasource.purgeDatasource(
            datasource._id.toString(),
          )
        },
      )

      if (customer.aiSearch) {
        await this.req.services.azure.cognitiveSearch.cleanAiSearchResources({
          indexName: customer.aiSearch.indexName,
          indexerName: customer.aiSearch.indexerName,
        })
      }

      if (customer.internalStorage) {
        await this.req.services.azure.blob.deleteInternalStorage(customer)
      }

      if (customer.datasources.length > 0 && containerCreated) {
        await this.req.services.azure.blob.deleteBlobStorage(
          customer.datasources[0].settings.azureBlobStorage.containerName,
          customer.datasources[0].settings.azureBlobStorage.connectionString,
        )
      }

      await this.fastify.models.customer.deleteOne({ _id: customerId }).exec()

      this.fastify.log.info(`Cleaned Customer ${customer.name}`)

      return
    } catch (error) {
      this.fastify.log.error(
        `Failed to clean customer ${customer.name}`,
        error.message,
      )
      throw error
    }
  }

  public getDefaultEmbeddingVersion() {
    const customerDefaultEmbeddingVersion =
      this.req.customer.settings.defaultEmbeddingVersion
    if (customerDefaultEmbeddingVersion) {
      return customerDefaultEmbeddingVersion
    } else {
      return this.fastify.config.services.azure.embeddingDefaultEngine
    }
  }

  public getDefaultGPTVersion() {
    const customerDefaultGptVersion =
      this.req.customer.settings.defaultGptVersion
    if (customerDefaultGptVersion) {
      return customerDefaultGptVersion
    } else {
      return this.fastify.config.services.azure.openAiDefaultEngine
    }
  }

  public async pause(customerId: string) {
    const customer = await this.fastify.models.customer
      .findById(customerId)
      .populate('datasources')
      .exec()

    if (customer.isActive === false) {
      throw new BadRequest('Customer is inactive')
    }

    const datasources = customer.datasources

    customer.subscription.paused = true
    customer.subscription.isChargeable = false
    customer.isActive = false
    await customer.save()

    await mapSeries(datasources, async (datasource: DatasourceDocument) => {
      datasource.isActive = false
      await datasource.save()
    })
  }

  public async unpause(customerId: string) {
    const customer = await this.fastify.models.customer
      .findById(customerId)
      .populate('datasources')
      .exec()

    const datasources = customer.datasources

    customer.subscription.paused = false
    customer.subscription.isChargeable = true
    customer.isActive = true
    await customer.save()

    await mapSeries(datasources, async (datasource: DatasourceDocument) => {
      datasource.isActive = true
      await datasource.save()
    })
  }

  public async createNewApiKey(
    apiKeyInfo: CustomerApiKeyProps,
    customerId: string,
  ) {
    const newApiKey = this.getNewApiKey(apiKeyInfo)
    await this.fastify.models.customer.findByIdAndUpdate(
      customerId,
      { $push: { apiKeys: newApiKey } },
      { new: true },
    )

    return newApiKey
  }

  public async deleteApiKeyById(
    id: string,
    customerId: string,
  ): Promise<UpdateResult> {
    const customer = await this.findCustomerById(customerId)
    const apiKey = this.findApiKeyById(id, customer)

    const updateResult = await this.fastify.models.customer
      .updateOne(
        { _id: customer._id },
        {
          $pull: { apiKeys: { _id: apiKey._id } },
        },
        { new: true },
      )
      .exec()

    return updateResult
  }

  public async getAllApiKeys(
    customerId: string,
  ): Promise<Partial<CustomerApiKey>[]> {
    const customer = await this.findCustomerById(customerId)

    return customer.apiKeys.toObject().map((apiKey: CustomerApiKey) => {
      return this.redactApiKey(apiKey)
    })
  }

  public async getApiKeyById(id: string, customerId: string) {
    const customer = await this.findCustomerById(customerId)
    const apiKey = this.findApiKeyById(id, customer)
    const apiKeyInfo = this.redactApiKey(apiKey)

    return apiKeyInfo
  }

  /* functions for redacting sensitive information */

  private redactApiKey(apiKey: CustomerApiKey): Partial<CustomerApiKey> {
    // eslint-disable-next-line
    const { key, ...rest } = apiKey

    return rest
  }

  private redactCustomer(customer: Customer): Partial<Customer> {
    // eslint-disable-next-line
    const { apiKeys, aiSearch, internalStorage, ...redactedCustomer } = customer

    return redactedCustomer
  }

  /* functions that retrieve either object or error */

  private async findCustomerById(
    customerId: string,
  ): Promise<CustomerDocument> {
    const customer = await this.fastify.models.customer
      .findById(customerId)
      .exec()

    if (!customer) {
      throw new NotFound(`Customer with id ${customerId} not found.`)
    }

    return customer
  }

  private findApiKeyById(
    id: string,
    customer: CustomerDocument,
  ): CustomerApiKey {
    const apiKeys = customer.apiKeys.toObject() as CustomerApiKey[]
    const apiKey = apiKeys.find(
      (apiKeyInfo) => apiKeyInfo._id.toString() === id,
    )

    if (!apiKey) {
      throw new NotFound(`API key with id ${id} not found.`)
    }

    return apiKey
  }
}
