import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

import { UserRoleEnum } from '../../constants'
import { ModelGenre, ModelPrice, ModelTokens } from '../../constants/model'

async function initApi(fastify: FastifyInstance) {
  if (!fastify.config.admin.email || !fastify.config.admin.apiKey) {
    throw new Error('Cannot init API: Missing admin credentials in the .env!')
  }

  const adminEmail = fastify.config.admin.email
  const adminKey = fastify.config.admin.apiKey

  const adminUser = await fastify.models.user
    .findOne({ email: adminEmail, role: UserRoleEnum.SUPERADMIN })
    .lean()
    .exec()

  if (adminUser) {
    return
  }

  await fastify.models.user.create({
    email: adminEmail,
    apiKey: adminKey,
    role: UserRoleEnum.SUPERADMIN,
  })
}

async function initCostTracking(fastify: FastifyInstance) {
  await initDefaultEmbeddingModel(
    fastify,
    defaultEmbeddingModelName,
    defaultEmbeddingTokenPrice,
  )
  await initDefaultGPTModel(
    fastify,
    defaultGPTModelName_1,
    defaultIncomingTokenPrice_1,
    defaultOutgoingTokenPrice_1,
  )
  await initDefaultGPTModel(
    fastify,
    defaultGPTModelName_2,
    defaultIncomingTokenPrice_2,
    defaultOutgoingTokenPrice_2,
  )
  await initDefaultGPTModel(
    fastify,
    defaultGPTModelName_3,
    defaultIncomingTokenPrice_3,
    defaultOutgoingTokenPrice_3,
  )

  await initDefaultGPTModel(
    fastify,
    defaultGPTModelName_4,
    defaultIncomingTokenPrice_4,
    defaultOutgoingTokenPrice_4,
  )

  await initDefaultTranslationModel(
    fastify,
    defaultTranslationModelName,
    defaultTranslationCharacterPrice,
  )
}

const defaultGPTModelName_1 = ModelGenre.GPT_35_16k
const defaultGPTModelName_2 = ModelGenre.GPT_4
const defaultGPTModelName_3 = ModelGenre.GPT_4
const defaultGPTModelName_4 = ModelGenre.GPT_4O
const defaultEmbeddingModelName = ModelGenre.ADA_002
const defaultTranslationModelName = ModelGenre.TRANSLATION

const defaultIncomingTokenPrice_1 = ModelPrice.GPT_35T_16k_INCOMING
const defaultOutgoingTokenPrice_1 = ModelPrice.GPT_35T_16k_OUTGOING
const defaultIncomingTokenPrice_2 = ModelPrice.GPT_4T_INCOMING
const defaultOutgoingTokenPrice_2 = ModelPrice.GPT_4T_OUTGOING
const defaultIncomingTokenPrice_3 = ModelPrice.GPT_4T_INCOMING
const defaultOutgoingTokenPrice_3 = ModelPrice.GPT_4T_OUTGOING
const defaultIncomingTokenPrice_4 = ModelPrice.GPT_4O_INCOMING
const defaultOutgoingTokenPrice_4 = ModelPrice.GPT_4O_OUTGOING
const defaultTranslationCharacterPrice = ModelPrice.TRANSLATION_CHARACTER
const defaultEmbeddingTokenPrice = ModelPrice.ADA_002_TOKEN

async function initDefaultGPTModel(
  fastify: FastifyInstance,
  modelName: string,
  incomingTokenPrice: number,
  outgoingTokenPrice: number,
) {
  const existingGPTModel = await fastify.models.largeLanguageModelVersion
    .findOne({
      name: modelName,
    })
    .lean()
    .exec()
  if (existingGPTModel) {
    return
  }

  let maxTokens: number

  if (modelName === ModelGenre.GPT_35_16k) {
    maxTokens = ModelTokens.GPT_35_16k_LIMIT
  } else if (modelName === ModelGenre.GPT_35) {
    maxTokens = ModelTokens.GPT_35_LIMIT
  } else if (
    modelName === ModelGenre.GPT_4T ||
    modelName === ModelGenre.GPT_4
  ) {
    // "GPT_4" - This is just because of the fact that current 'gpt-4' model is in fact "gpt-4-turbo" but, it's PTU, so we cannot change it before end of the month.
    maxTokens = ModelTokens.GPT_4T_LIMIT
  } else if (modelName === ModelGenre.GPT_4O) {
    maxTokens = ModelTokens.GPT_4O_LIMIT
  }

  return await fastify.models.largeLanguageModelVersion.create({
    name: modelName,
    description: `GPT model - ${modelName}`,
    pricePerIncomingToken: incomingTokenPrice,
    pricePerOutgoingToken: outgoingTokenPrice,
    pricePerCachedOutgoingToken: 0,
    maxTokens,
    validFrom: new Date(),
  })
}

async function initDefaultEmbeddingModel(
  fastify: FastifyInstance,
  modelName: string,
  price: number,
) {
  const existingEmbeddingModel = await fastify.models.embeddingModelVersion
    .findOne({
      name: modelName,
    })
    .lean()
    .exec()
  if (existingEmbeddingModel) {
    return
  }

  return await fastify.models.embeddingModelVersion.create({
    name: modelName,
    pricePerToken: price,
    description: 'Default Embedding model',
    validFrom: new Date(),
  })
}

async function initDefaultTranslationModel(
  fastify: FastifyInstance,
  modelName: string,
  price: number,
) {
  const existingTranslationModel = await fastify.models.translationModelVersion
    .findOne({
      name: modelName,
    })
    .lean()
    .exec()
  if (existingTranslationModel) {
    return
  }

  return await fastify.models.translationModelVersion.create({
    name: modelName,
    pricePerCharacter: price,
    description: 'Default Translation model',
    validFrom: new Date(),
  })
}

async function initSubscriptions(fastify: FastifyInstance): Promise<void> {
  const plans = [
    {
      name: 'GAIA',
      amount: 7500,
      periodInMonths: 12,
      validFrom: new Date('2023-10-01'),
      isActive: true,
      isDefault: true,
    },
    {
      name: 'GAIA Light',
      amount: 5400,
      periodInMonths: 12,
      validFrom: new Date('2023-10-01'),
      isActive: true,
    },
  ]

  const bulk = plans.map((plan) => ({
    updateOne: {
      filter: { name: plan.name },
      update: { $set: plan },
      upsert: true,
    },
  }))

  await fastify.models.subscription.bulkWrite(bulk)
}

export const decorateInitApi = fp(initApi)
export const decorateInitCostTracking = fp(initCostTracking)
export const decorateInitSubscriptions = fp(initSubscriptions)
