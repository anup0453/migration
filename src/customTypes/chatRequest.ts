import {
  ChatRequestType,
  EmbeddingRequestType,
  ModelTypeEnum,
} from '../constants'
import {
  EmbeddingModelVersion,
  LargeLanguageModelVersion,
} from '../models/types'

export interface IApiCallPrepParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
  engine?: string
  apiVersion?: string
  modelType: ModelTypeEnum
  stream: boolean
}

export interface IChatRequestParams {
  engine?: string
  apiVersion?: string
}

export interface ITrackChatRequestParams {
  gptModel: LargeLanguageModelVersion
  incomingTokenCount: number
  outgoingTokenCount: number
  incomingTokenCountDetails: IIncomingTokenCountDetails
  outgoingTokenCountDetails: IOutgoingTokenCountDetails
  type: ChatRequestType
}

export interface ITrackEmbeddingRequestParams {
  embeddingModel: EmbeddingModelVersion
  tokenCount: number
  type: EmbeddingRequestType
}

export interface IUsageData {
  gptModel: LargeLanguageModelVersion
  incomingTokenCount: number
  outgoingTokenCount: number
  incomingTokenCountDetails: IIncomingTokenCountDetails
  outgoingTokenCountDetails: IOutgoingTokenCountDetails
}
export interface IOutgoingTokenCountDetails {
  audio_tokens: number
  cached_tokens: number
}

export interface IIncomingTokenCountDetails {
  accepted_prediction_tokens: number
  audio_tokens: number
  reasoning_tokens: number
  rejected_prediction_tokens: number
}
