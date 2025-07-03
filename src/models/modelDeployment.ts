import mongoose, { Schema } from 'mongoose'

import { LoadBalancerRegionEnum, ModelTypeEnum } from '../constants'
import {
  ModelDeploymentDocument,
  ModelDeploymentModel,
  ModelDeploymentSchema as ModelDeploymentSchemaType,
} from './types'

const ModelDeploymentSchema: ModelDeploymentSchemaType = new Schema(
  {
    deploymentName: { required: true, type: String },
    endpoint: { required: true, type: String },
    instanceName: { required: true, type: String },
    isPTU: { required: true, type: Boolean },
    key: { required: true, type: String },
    modelName: { required: true, type: String },
    modelVersion: { required: true, type: String },
    openAiVersion: { required: true, type: String },
    region: { enum: LoadBalancerRegionEnum, required: true, type: String },
    type: { enum: ModelTypeEnum, required: true, type: String },
  },
  {
    collection: 'modelDeployment',
    timestamps: true,
  },
)

ModelDeploymentSchema.index({ '$**': 1 }, { name: 'cosmos_wildcard' })

export type ModelDeploymentProps = Partial<ModelDeploymentDocument>

export const ModelDeployment: ModelDeploymentModel = mongoose.model<
  ModelDeploymentDocument,
  ModelDeploymentModel
>('ModelDeployment', ModelDeploymentSchema, 'modelDeployment')
