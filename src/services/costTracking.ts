import {
  ITrackChatRequestParams,
  ITrackEmbeddingRequestParams,
} from '../customTypes/chatRequest'
import {
  EmbeddingModelVersion,
  InternalTool,
  LargeLanguageModelVersion,
} from '../models/types'
import BaseService from './base'

export default class CostTrackingService extends BaseService {
  public async trackChatRequest(params: ITrackChatRequestParams) {
    const calcTotalPrice = this.calculateChatRequestCost(
      params.gptModel,
      params.incomingTokenCount,
      params.outgoingTokenCount,
      params.outgoingTokenCountDetails.cached_tokens,
    )

    const startOfDay = new Date().setHours(0, 0, 0, 0)
    const endOfDay = new Date().setHours(23, 59, 59, 999)

    return await this.fastify.models.chatRequest.findOneAndUpdate(
      {
        createdAt: { $gte: startOfDay, $lt: endOfDay },
        customer: this.req.customerId,
        chargedAt: { $exists: false },
        type: params.type,
      },
      {
        $inc: {
          incomingTokenCount: params.incomingTokenCount,
          'incomingTokenCountDetails.acceptedPredictionTokens':
            params.incomingTokenCountDetails.accepted_prediction_tokens,
          'incomingTokenCountDetails.audioTokens':
            params.incomingTokenCountDetails.audio_tokens,
          'incomingTokenCountDetails.reasoningTokens':
            params.incomingTokenCountDetails.reasoning_tokens,
          'incomingTokenCountDetails.rejectedPredictionTokens':
            params.incomingTokenCountDetails.rejected_prediction_tokens,
          outgoingTokenCount: params.outgoingTokenCount,
          'outgoingTokenCountDetails.audioTokens':
            params.outgoingTokenCountDetails.audio_tokens,
          'outgoingTokenCountDetails.cachedTokens':
            params.outgoingTokenCountDetails.cached_tokens,
          calcTotalPrice,
          numRequests: 1,
        },
        $setOnInsert: {
          usedGPTModel: params.gptModel._id,
        },
      },
      { upsert: true, new: true },
    )
  }

  public async trackEmbedding(params: ITrackEmbeddingRequestParams) {
    const calcTotalPrice = this.calculateEmbeddingRequestCost(
      params.embeddingModel,
      params.tokenCount,
    )

    const startOfDay = new Date().setHours(0, 0, 0, 0)
    const endOfDay = new Date().setHours(23, 59, 59, 999)

    return await this.fastify.models.embedding.findOneAndUpdate(
      {
        createdAt: { $gte: startOfDay, $lt: endOfDay },
        customer: this.req.customerId,
        chargedAt: { $exists: false },
        type: params.type,
      },
      {
        $inc: {
          outgoingTokenCount: params.tokenCount,
          calcTotalPrice: calcTotalPrice,
          numRequests: 1,
        },
        $setOnInsert: {
          usedModel: params.embeddingModel._id,
        },
      },
      { upsert: true, new: true },
    )
  }

  public async trackToolCall(internalTool: InternalTool) {
    const internalToolId = internalTool._id.toString()

    const startOfDay = new Date().setHours(0, 0, 0, 0)
    const endOfDay = new Date().setHours(23, 59, 59, 999)

    const unitPrice = await this.req.services.internalTool.getUnitPrice(
      internalToolId,
    )

    return await this.fastify.models.internalToolCall.findOneAndUpdate(
      {
        createdAt: { $gte: startOfDay, $lt: endOfDay },
        customer: this.req.customerId,
        chargedAt: { $exists: false },
      },
      {
        $inc: {
          numRequests: 1,
          calcTotalPrice: unitPrice,
        },
        $setOnInsert: {
          internalTool: internalToolId,
        },
      },
      { upsert: true, new: true },
    )
  }

  public calculateEmbeddingRequestCost(
    embeddingModel: EmbeddingModelVersion,
    tokenCount: number,
  ) {
    const pricePerIncomingToken = embeddingModel.pricePerToken
    const calcTotalPrice = tokenCount * pricePerIncomingToken

    return calcTotalPrice
  }

  public calculateChatRequestCost(
    gptModel: LargeLanguageModelVersion,
    incomingTokenCount: number,
    outgoingTokenCount: number,
    cachedOutgoingTokenCount: number,
  ) {
    const uncachedOutgoingTokenCount =
      outgoingTokenCount - cachedOutgoingTokenCount

    const pricePerIncomingToken = gptModel.pricePerIncomingToken || 0
    const pricePerOutgoingToken = gptModel.pricePerOutgoingToken || 0
    const pricePerCachedOutgoingToken =
      gptModel.pricePerCachedOutgoingToken || 0

    const calcTotalPrice =
      incomingTokenCount * pricePerIncomingToken +
      uncachedOutgoingTokenCount * pricePerOutgoingToken +
      cachedOutgoingTokenCount * pricePerCachedOutgoingToken

    return calcTotalPrice
  }
}
