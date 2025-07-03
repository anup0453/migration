import mongoose, { Schema } from 'mongoose'

import {
  DatasourceEnum,
  ParsingStatusEnum,
  SharePointElementEnum,
  TextSplitterStrategy,
} from '../constants'
import {
  DatasourceDocument,
  DatasourceModel,
  DatasourceSchema as DatasourceSchemaType,
} from './types'

const DatasourceSchema: DatasourceSchemaType = new Schema(
  {
    chunkingPriority: Number,
    consecutiveErrors: { type: Number },
    displayName: String,
    forceCleanParsing: Boolean,
    frequency: { default: '24h', type: String },
    indexingStatus: { enum: ParsingStatusEnum, type: String },
    isActive: Boolean,
    keywords: [{ type: String }],
    lastIndexing: Date,
    owner: { ref: 'Customer', required: false, type: Schema.Types.ObjectId },
    settings: {
      chunkOverlap: Number,
      chunkSize: Number,
      defaultLanguage: String,
      delimiters: [{ type: String }],
      excludeByRegex: [{ type: String }],
      includeByRegex: [{ type: String }],
      ocrActive: Boolean,
      preventXMLToJSON: Boolean,
      sourceLinkActive: Boolean,
      textSplitterStrategy: { enum: TextSplitterStrategy, type: String },
      translationActive: Boolean,
      useMarkdown: Boolean,
      ...[DatasourceEnum.BLOB].reduce((acc, source) => {
        acc[source] = new Schema(
          {
            blobBaseUrl: String,
            blobSasToken: String,
            connectionString: { required: true, type: String },
            containerName: { required: true, type: String },
          },
          { _id: false },
        )

        return acc
      }, {}),
      ...[DatasourceEnum.WEBSITE].reduce((acc, source) => {
        acc[source] = new Schema(
          {
            contentCssSelectors: [{ required: true, type: String }],
            crawlCssSelectors: [{ required: true, type: String }],
            lazyLoadingEnforced: Boolean,
            recursionDepth: { required: true, type: Number },
            rootUrls: [{ required: true, type: String }],
            scrollableElementSelector: String,
            urlWhiteList: [{ type: String }],
          },
          { _id: false },
        )

        return acc
      }, {}),
      ...[DatasourceEnum.SHAREPOINT].reduce((acc, source) => {
        acc[source] = new Schema(
          {
            elements: [
              {
                enum: Object.values(SharePointElementEnum),
                required: true,
                type: String,
              },
            ],
            pageWhiteList: [{ type: String }], // url to page
            url: { required: true, type: String },
            whiteList: [{ type: String }], // name of list
            // other Sharepoint settings go here
          },
          { _id: false },
        )

        return acc
      }, {}),
      ...[DatasourceEnum.POLARION].reduce((acc, source) => {
        acc[source] = new Schema(
          {
            accessToken: { required: true, type: String },
            endpoint: { required: true, type: String },
            fields: [{ required: true, type: String }],
            project: { required: true, type: String },
            query: { required: true, type: String },
          },
          { _id: false },
        )

        return acc
      }, {}),
      ...[DatasourceEnum.API].reduce((acc, source) => {
        acc[source] = new Schema(
          {
            authorizationHeader: { required: false, type: String },
            endpoint: { required: true, type: String },
            excludeFields: [{ required: false, type: String }],
            extraHeaders: [
              {
                key: {
                  required: true,
                  type: String,
                },
                value: {
                  required: true,
                  type: String,
                },
              },
            ],
            fileNameField: { required: true, type: String },
            filePathField: { required: false, type: String },
            includeFields: [{ required: false, type: String }],
            payloadField: { required: false, type: String },
            updatedAtField: { required: false, type: String },
          },
          { _id: false },
        )

        return acc
      }, {}),
      ...[DatasourceEnum.WIKI].reduce((acc, source) => {
        acc[source] = new Schema(
          {
            baseUrl: { required: true, type: String },
          },
          { _id: false },
        )

        return acc
      }, {}),
    },
    type: { enum: DatasourceEnum, type: String },
  },
  {
    collection: 'datasource',
    timestamps: true,
  },
)

DatasourceSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type DatasourceProps = Partial<DatasourceDocument>

export const Datasource: DatasourceModel = mongoose.model<
  DatasourceDocument,
  DatasourceModel
>('Datasource', DatasourceSchema, 'datasource')
