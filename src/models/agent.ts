import mongoose, { Schema } from 'mongoose'

import { AgentToolTypeEnum, AgentTypeEnum } from '../constants'
import {
  AgentDocument,
  AgentModel,
  AgentSchema as AgentSchemaType,
} from './types'

const AgentSchema: AgentSchemaType = new Schema(
  {
    apiKey: { required: true, type: String },
    bindTools: [
      {
        agentToolApiKey: { required: true, type: String },
        agentToolName: { required: true, type: String },
        description: { required: true, type: String },
        type: { enum: AgentToolTypeEnum, required: true, type: String },
      },
    ],
    description: { required: true, type: String },
    displayName: { required: true, type: String },
    isActive: { default: true, type: Boolean },
    iterationLimit: { required: true, type: Number },
    owner: { ref: 'Customer', required: true, type: Schema.Types.ObjectId },
    settings: {
      agentApiVersion: { required: true, type: String },
      agentDeploymentName: { required: true, type: String },
    },
    systemMessage: { required: true, type: String },
    type: { enum: AgentTypeEnum, required: true, type: String },
  },
  {
    collection: 'agent',
    timestamps: true,
  },
)

AgentSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type AgentProps = Partial<AgentDocument>

export const Agent: AgentModel = mongoose.model<AgentDocument, AgentModel>(
  'Agent',
  AgentSchema,
  'agent',
)
