import mongoose, { Query, Schema } from 'mongoose'

import {
  ImportDocumentStatus,
  ImportDocumentType,
  UploadDocumentType,
} from '../constants'
import { setArchived } from './helpers/query'
import {
  ImportDocument,
  ImportModel,
  ImportSchema as ImportSchemaType,
} from './types'

const ImportSchema: ImportSchemaType = new Schema(
  {
    archiveDate: Date,
    azureFileId: String,
    chunkFiles: [String],
    contentHash: String,
    datasource: { ref: 'Datasource', type: Schema.Types.ObjectId },
    extractedAt: Date,
    extractionLog: String,
    fileName: { required: true, type: String },
    filePath: String,
    index: String,
    isArchived: { index: true, type: Boolean },
    mimeType: String,
    status: { enum: Object.values(ImportDocumentStatus), type: String },
    type: { enum: Object.values(ImportDocumentType), type: String },
    uploadType: { enum: Object.values(UploadDocumentType), type: String },
    urlFileName: String,
  },
  {
    collection: 'import',
    timestamps: true,
  },
)

ImportSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

/**
 * hooks
 */
async function appendDefaultWhere<DocType>(this: Query<DocType, ImportModel>) {
  setArchived.call(this)
}

ImportSchema.pre(
  [
    'distinct',
    'find',
    'findOne',
    'findOneAndDelete',
    'findOneAndReplace',
    'findOneAndUpdate',
    'countDocuments',
  ],
  appendDefaultWhere,
)

export type ImportProps = Partial<ImportDocument>

export const Import: ImportModel = mongoose.model<ImportDocument, ImportModel>(
  'Import',
  ImportSchema,
  'import',
)
