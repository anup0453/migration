import mongoose, { Schema } from 'mongoose'

import { EmbeddingRequestType } from '../constants'
import {
  EmbeddingDocument,
  EmbeddingModel,
  EmbeddingSchema as EmbeddingSchemaType,
} from './types'

const EmbeddingSchema: EmbeddingSchemaType = new Schema(
  {
    calcTotalPrice: { required: true, type: Number },
    chargedAt: Date,
    customer: {
      index: true,
      ref: 'Customer',
      required: true,
      type: Schema.Types.ObjectId,
    },
    incomingTokenCount: { required: true, type: Number },
    numRequests: Number,
    type: {
      enum: Object.values(EmbeddingRequestType),
      type: String,
    },
    usedModel: {
      ref: 'EmbeddingModelVersion',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    collection: 'embedding',
    timestamps: true,
  },
)

EmbeddingSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type EmbeddingProps = Partial<EmbeddingDocument>

export const Embedding: EmbeddingModel = mongoose.model<
  EmbeddingDocument,
  EmbeddingModel
>('Embedding', EmbeddingSchema, 'embedding')
