import mongoose, { Schema } from 'mongoose'

import { ChargeTypeEnum } from '../constants'
import {
  ChargeDocument,
  ChargeModel,
  ChargeSchema as ChargeSchemaType,
} from './types'

const ChargeSchema: ChargeSchemaType = new Schema(
  {
    amount: Number,
    chargedAt: Date,
    customer: {
      index: true,
      ref: 'Customer',
      required: true,
      type: Schema.Types.ObjectId,
    },
    from: Date,
    items: [
      new Schema({
        amount: Number,
        chargeType: { enum: Object.values(ChargeTypeEnum), type: String },
        description: String,
        quantity: Number,
        type: String,
      }),
    ],
    payAsYouGoId: Number,
    payAsYouGoStatus: String,
    to: Date,
  },
  {
    collection: 'charge',
    timestamps: true,
  },
)

ChargeSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type ChargeProps = Partial<ChargeDocument>

export const Charge: ChargeModel = mongoose.model<ChargeDocument, ChargeModel>(
  'Charge',
  ChargeSchema,
  'charge',
)
