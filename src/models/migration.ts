import mongoose, { Schema } from 'mongoose'

import {
  MigrationDocumentStatus,
  MigrationDocumentType,
} from '../constants/migration'
import {
  MigrationDocument,
  MigrationModel,
  MigrationSchema as MigrationSchemaType,
} from './types'

const MigrationSchema: MigrationSchemaType = new Schema(
  {
    indexName: { required: false, type: String },
    name: { required: true, type: String },
    object: { type: Schema.Types.ObjectId },
    status: {
      enum: Object.values(MigrationDocumentStatus),
      required: true,
      type: String,
    },
    type: {
      enum: Object.values(MigrationDocumentType),
      required: true,
      type: String,
    },
  },
  {
    collection: 'migration',
    strict: false,
    timestamps: true,
  },
)

MigrationSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type Migrationprops = Partial<MigrationDocument>

export const Migration: MigrationModel = mongoose.model<
  MigrationDocument,
  MigrationModel
>('Migration', MigrationSchema, 'migration')
