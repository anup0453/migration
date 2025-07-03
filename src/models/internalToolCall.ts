import mongoose, { Schema } from 'mongoose'

import {
  InternalToolCallDocument,
  InternalToolCallModel,
  InternalToolCallSchema as InternalToolCallSchemaType,
} from './types'

const collectionName = 'internalToolCall'

const InternalToolCallSchema: InternalToolCallSchemaType = new Schema(
  {
    calcTotalPrice: Number,
    chargedAt: Date,
    numRequests: { required: true, type: Number },
    customer: {
      index: true,
      ref: 'Customer',
      required: true,
      type: Schema.Types.ObjectId,
    },
    internalTool: {
      ref: 'Datasource',
      required: false,
      type: Schema.Types.ObjectId,
    },
  },
  {
    collection: collectionName,
    timestamps: true,
  },
)

InternalToolCallSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type InternalToolCallProps = Partial<InternalToolCallDocument>

export const InternalToolCall: InternalToolCallModel = mongoose.model<
  InternalToolCallDocument,
  InternalToolCallModel
>('InternalToolCall', InternalToolCallSchema, collectionName)
