import mongoose, { Schema } from 'mongoose'

import { ChatRequestType } from '../constants/chatRequest'
import {
  ChatRequestDocument,
  ChatRequestModel,
  ChatRequestSchema as ChatRequestSchemaType,
} from './types'

const collectionName = 'chatRequest'

const ChatRequestSchema: ChatRequestSchemaType = new Schema(
  {
    calcTotalPrice: Number,
    chargedAt: Date,
    customer: {
      index: true,
      ref: 'Customer',
      required: true,
      type: Schema.Types.ObjectId,
    },
    incomingTokenCount: { required: true, type: Number }, // chatGPT output -> input to helixAI
    incomingTokenCountDetails: new Schema(
      {
        acceptedPredictionTokens: Number,
        reasoningTokens: Number,
        audioTokens: Number,
        rejectedPredictionTokens: Number,
      },
      { _id: false },
    ),
    numRequests: Number,
    outgoingTokenCount: { required: true, type: Number }, // chatGPT input -> output from helixAI
    outgoingTokenCountDetails: new Schema(
      {
        audioTokens: Number,
        cachedTokens: Number,
      },
      { _id: false },
    ),
    type: { enum: Object.values(ChatRequestType), type: String },
    usedGPTModel: {
      ref: 'LargeLanguageModelVersion',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    collection: collectionName,
    timestamps: true,
  },
)

ChatRequestSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type ChatRequestProps = Partial<ChatRequestDocument>

export const ChatRequest: ChatRequestModel = mongoose.model<
  ChatRequestDocument,
  ChatRequestModel
>('ChatRequest', ChatRequestSchema, collectionName)
