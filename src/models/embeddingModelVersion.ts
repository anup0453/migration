import mongoose, { Schema } from 'mongoose'

import {
  EmbeddingModelVersionDocument,
  EmbeddingModelVersionModel,
  EmbeddingModelVersionSchema as EmbeddingModelVersionSchemaType,
} from './types'

const EmbeddingModelVersionSchema: EmbeddingModelVersionSchemaType = new Schema(
  {
    description: { required: false, type: String },
    name: { required: true, type: String },
    pricePerToken: { required: true, type: Number },
    validFrom: { type: Date },
    validUntil: { type: Date },
  },
  {
    collection: 'embeddingModelVersion',
    timestamps: true,
  },
)

EmbeddingModelVersionSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type EmbeddingModelVersionProps = Partial<EmbeddingModelVersionDocument>

export const EmbeddingModelVersion: EmbeddingModelVersionModel = mongoose.model<
  EmbeddingModelVersionDocument,
  EmbeddingModelVersionModel
>('EmbeddingModelVersion', EmbeddingModelVersionSchema, 'embeddingModelVersion')
