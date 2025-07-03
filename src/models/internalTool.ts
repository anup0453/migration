import mongoose, { Schema } from 'mongoose'

import { InternalToolEnum } from '../constants'
import {
  InternalToolDocument,
  InternalToolModel,
  InternalToolSchema as InternalToolSchemaType,
} from './types'

const InternalToolSchema: InternalToolSchemaType = new Schema(
  {
    description: String,
    displayName: String,
    isActive: Boolean,
    owner: { ref: 'Customer', required: false, type: Schema.Types.ObjectId },
    settings: {
      ...[InternalToolEnum.BING].reduce((acc, source) => {
        acc[source] = new Schema(
          {
            language: { required: true, type: String },
            numberRecords: { required: true, type: Number },
          },
          { _id: false },
        )

        return acc
      }, {}),
      ...[InternalToolEnum.SNOWFLAKE].reduce((acc, source) => {
        acc[source] = new Schema(
          {
            account: { required: true, type: String },
            customerPrivateKey: { required: true, type: String },
            database: { required: true, type: String },
            passphrase: { required: true, type: String },
            role: { required: true, type: String },
            table: [{ required: true, type: String }],
            username: { required: true, type: String },
            warehouse: { required: true, type: String },
          },
          { _id: false },
        )

        return acc
      }, {}),
    },
    type: { enum: InternalToolEnum, type: String },
  },
  {
    collection: 'internalTool',
    timestamps: true,
  },
)

InternalToolSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type InternalToolProps = Partial<InternalToolDocument>

export const InternalTool: InternalToolModel = mongoose.model<
  InternalToolDocument,
  InternalToolModel
>('InternalTool', InternalToolSchema, 'internalTool')
