import mongoose, { Schema } from 'mongoose'

import {
  SubscriptionDocument,
  SubscriptionModel,
  SubscriptionSchema as SubscriptionSchemaType,
} from './types'

const SubscriptionSchema: SubscriptionSchemaType = new Schema(
  {
    amount: Number,
    isActive: Boolean,
    isDefault: Boolean,
    name: { required: true, type: String },
    periodInMonths: Number,
    validFrom: Date,
    validTo: Date,
  },
  {
    collection: 'subscription',
    timestamps: true,
  },
)

SubscriptionSchema.pre(
  'save',
  async function (this: SubscriptionDocument, next: CallableFunction) {
    const existing = await mongoose
      .model<SubscriptionDocument, SubscriptionModel>('Subscription')
      .findOne({ isDefault: true })
      .lean()
      .exec()

    if (this.isNew && !existing) {
      this.isDefault = true
    }

    return next()
  },
)

SubscriptionSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type SubscriptionProps = Partial<SubscriptionDocument>

export const Subscription: SubscriptionModel = mongoose.model<
  SubscriptionDocument,
  SubscriptionModel
>('Subscription', SubscriptionSchema, 'subscription')
