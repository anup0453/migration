import mongoose, { Schema } from 'mongoose'

import { TranslationCostEnum } from '../constants'
import {
  TranslationDocument,
  TranslationModel,
  TranslationSchema as TranslationSchemaType,
} from './types'

const TranslationSchema: TranslationSchemaType = new Schema(
  {
    calcTotalPrice: Number,
    characterCount: { required: true, type: Number },
    chargedAt: Date,
    costType: { enum: Object.values(TranslationCostEnum), type: String },
    customer: {
      index: true,
      ref: 'Customer',
      required: true,
      type: Schema.Types.ObjectId,
    },
    datasource: {
      ref: 'Datasource',
      required: true,
      type: Schema.Types.ObjectId,
    },
    import: { ref: 'Import', required: true, type: Schema.Types.ObjectId },
    sourceLanguage: String,
    targetLanguage: String,
    usedModel: {
      ref: 'TranslationModelVersion',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    collection: 'translation',
    timestamps: true,
  },
)

TranslationSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type TranslationProps = Partial<TranslationDocument>

export const Translation: TranslationModel = mongoose.model<
  TranslationDocument,
  TranslationModel
>('Translation', TranslationSchema, 'translation')
