import mongoose, { Schema } from 'mongoose'

import {
  LargeLanguageModelVersionDocument,
  LargeLanguageModelVersionModel,
  LargeLanguageModelVersionSchema as LargeLanguageModelVersionSchemaType,
} from './types'

const LargeLanguageModelVersionSchema: LargeLanguageModelVersionSchemaType =
  new Schema(
    {
      description: { required: false, type: String },
      maxTokens: { required: false, type: Number },
      name: { required: true, type: String },
      pricePerIncomingToken: { required: true, type: Number },
      pricePerOutgoingToken: { required: true, type: Number },
      pricePerCachedOutgoingToken: { required: true, type: Number },
      validFrom: { type: Date },
      validUntil: { type: Date },
    },
    {
      collection: 'largeLanguageModelVersion',
      timestamps: true,
    },
  )

LargeLanguageModelVersionSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type LargeLanguageModelVersionProps =
  Partial<LargeLanguageModelVersionDocument>

export const LargeLanguageModelVersion: LargeLanguageModelVersionModel =
  mongoose.model<
    LargeLanguageModelVersionDocument,
    LargeLanguageModelVersionModel
  >(
    'LargeLanguageModelVersion',
    LargeLanguageModelVersionSchema,
    'largeLanguageModelVersion',
  )
