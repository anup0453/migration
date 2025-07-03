import mongoose, { Schema } from 'mongoose'

import {
  TranslationModelVersionDocument,
  TranslationModelVersionModel,
  TranslationModelVersionSchema as TranslationModelVersionSchemaType,
} from './types'

const TranslationModelVersionSchema: TranslationModelVersionSchemaType =
  new Schema(
    {
      description: { required: false, type: String },
      name: { required: true, type: String },
      pricePerCharacter: { required: true, type: Number },
      validFrom: { type: Date },
      validUntil: { type: Date },
    },
    {
      collection: 'translationModelVersion',
      timestamps: true,
    },
  )

TranslationModelVersionSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type TranslationModelVersionProps =
  Partial<TranslationModelVersionDocument>

export const TranslationModelVersion: TranslationModelVersionModel =
  mongoose.model<TranslationModelVersionDocument, TranslationModelVersionModel>(
    'TranslationModelVersion',
    TranslationModelVersionSchema,
    'translationModelVersion',
  )
