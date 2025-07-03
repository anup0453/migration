import { compareSync } from 'bcryptjs'
import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

import {
  FieldTypesEnum,
  IpFilteringMode,
  LoadBalancerRegionEnum,
  SkillsetNameEnum,
} from '../constants'
import { randomString } from '../utils'
import {
  CustomerApiKeyDocument,
  CustomerDocument,
  CustomerModel,
  CustomerSchema as CustomerSchemaType,
} from './types'

const CustomerSchema: CustomerSchemaType = new Schema(
  {
    aiSearch: new Schema(
      {
        apiKey: String,
        datasourceName: String,
        directIndex: Boolean,
        endpoint: String,
        indexerName: String,
        indexingStatus: String,
        indexName: String,
        lastIndexing: Date,
        scoringProfile: String,
        skillsetName: { enum: SkillsetNameEnum, type: String },
      },
      { _id: false },
    ),
    apiKeys: [
      new Schema(
        {
          description: { required: true, type: String },
          key: { required: true, type: String },
          validFrom: { required: true, type: Date },
          validTo: { required: true, type: Date },
        },
        { _id: true },
      ),
    ],
    arizeSettings: new Schema(
      {
        apiKey: String,
        projectName: String,
        spaceId: String,
        tracingEnabled: { required: true, type: Boolean },
      },
      { _id: false },
    ),
    billing: new Schema(
      {
        orgId: String,
        payAsYouGoId: Number,
        position: String,
        psp: String,
        reference: String,
      },
      { _id: false },
    ),
    datasources: [{ ref: 'Datasource', type: Schema.Types.ObjectId }],
    frontendSettings: new Schema(
      {
        filterButtons: [
          new Schema(
            {
              displayName: { required: true, type: String },
              fieldType: {
                enum: FieldTypesEnum,
                required: true,
                type: String,
              },
              filter: [{ required: false, type: String }],
              isMultiSelect: { required: false, type: Boolean },
              keywords: [{ required: false, type: String }],
              level: { required: false, type: Number },
              placeholder: { required: false, type: String },
            },
            { _id: false },
          ),
        ],
        hintTextButtonText: String,
        historyResetMessage: String,
        termsOfUseText: String,
        welcomeSystemMessage: String,
      },
      { _id: false },
    ),
    internalStorage: {
      connectionString: String,
      containerName: String,
    },
    internalTools: [
      {
        ref: 'InternalTool',
        type: Schema.Types.ObjectId,
      },
    ],
    ipFilteringSettings: new Schema(
      {
        blockingMode: {
          enum: Object.values(IpFilteringMode),
          type: String,
        },
        isIpFilteringEnabled: Boolean,
        whitelistedIpsArray: [{ type: String }],
      },
      { _id: false },
    ),
    isActive: Boolean,
    name: { required: true, type: String, unique: true },
    settings: new Schema({
      defaultEmbeddingVersion: String,
      defaultGptVersion: String,
      dynamicNActive: Boolean,
      frequencyPenalty: Number,
      generateSearchQuerySystemMessage: String,
      historyCount: Number,
      ignoreOpenAIParamsInBody: Boolean,
      includeDateContext: Boolean,
      loadBalancerRegion: {
        enum: Object.values(LoadBalancerRegionEnum),
        type: String,
      },
      maxResponseTokens: Number,
      presencePenalty: Number,
      reactOnUserMessageSystemMessage: String,
      sourceFilterActive: Boolean,
      sourceLinkActive: Boolean,
      sourceLinkInstructionSystemMessage: String,
      stop: [{ type: String }],
      summarizeConversationSystemMessage: String,
      temperature: Number,
      topN: Number,
      topP: Number,
    }),
    subscription: new Schema(
      {
        end: Date,
        isChargeable: Boolean,
        lastChargedAt: Date,
        nextChargedAt: Date,
        paused: Boolean,
        start: Date,
        type: { ref: 'Subscription', type: Schema.Types.ObjectId },
      },
      { _id: false },
    ),
    type: String,
  },
  {
    collection: 'customer',
    timestamps: true,
  },
)

CustomerSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

CustomerSchema.pre(
  'save',
  async function (this: CustomerDocument, next: CallableFunction) {
    if (this.isNew && this.apiKeys.length === 0) {
      const today = new Date()
      const nextYear = new Date(today.setFullYear(today.getFullYear() + 1))
      this.apiKeys.push({
        _id: new ObjectId(),
        description: 'Initial API key',
        key: randomString(32),
        validFrom: new Date(),
        validTo: nextYear,
      })
    }

    if (!this.isModified('apiKeys')) {
      return next()
    }
  },
)

CustomerSchema.methods.verifyApiKey = async function (
  key: string,
): Promise<boolean> {
  const customer = await mongoose
    .model<CustomerDocument, CustomerModel>('Customer')
    .findById(this._id)
    .select('apiKeys')
    .exec()

  const now = new Date()
  const apiKeys =
    customer?.apiKeys
      ?.filter((key) => key.validFrom > now)
      .map((key) => key.key) || []

  return apiKeys.some((apiKey) => compareSync(key, apiKey))
}

export type CustomerApiKeyProps = CustomerApiKeyDocument
export type CustomerBillingProps = CustomerProps['billing']
export type CustomerFrontendSettingsProps = CustomerProps['frontendSettings']
export type CustomerProps = Partial<CustomerDocument>
export type CustomerSettingsProps = CustomerProps['settings']

export const Customer: CustomerModel = mongoose.model<
  CustomerDocument,
  CustomerModel
>('Customer', CustomerSchema, 'customer')
