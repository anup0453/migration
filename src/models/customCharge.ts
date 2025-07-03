import mongoose, { Schema } from 'mongoose'

import {
  CustomChargeDocument,
  CustomChargeModel,
  CustomChargeSchema as CustomChargeSchemaType,
} from './types'

const CustomChargeSchema: CustomChargeSchemaType = new Schema(
  {
    calcTotalPrice: Number,
    chargeableAt: Date,
    chargedAt: Date,
    customer: {
      index: true,
      ref: 'Customer',
      required: true,
      type: Schema.Types.ObjectId,
    },
    description: String,
  },
  {
    collection: 'customCharge',
    timestamps: true,
  },
)

CustomChargeSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type CustomChargeProps = Partial<CustomChargeDocument>

export const CustomCharge: CustomChargeModel = mongoose.model<
  CustomChargeDocument,
  CustomChargeModel
>('CustomCharge', CustomChargeSchema, 'customCharge')
