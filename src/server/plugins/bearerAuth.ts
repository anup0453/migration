import { FastifyAuthFunction } from '@fastify/auth'
import { FastifyInstance, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { Unauthorized } from 'http-errors'

import { Customer, CustomerApiKeyDocument, User } from '../../models/types'

declare module 'fastify' {
  interface FastifyInstance {
    bearerAuth: FastifyAuthFunction
  }

  interface FastifyRequest {
    user?: User
    customer?: Customer
    authUsedAlready?: boolean
    customerId?: string
    errorLog?: {
      statusCode: number
      message: string
      code: string
      error: string
    }
  }
}

async function decorate(fastify: FastifyInstance) {
  fastify.decorate('bearerAuth', async (req: FastifyRequest) => {
    const key = extractKey(req.headers)
    await checkKey(fastify, req, { key })
  })
}

export async function checkKey(
  fastify: FastifyInstance,
  req: FastifyRequest,
  auth: {
    key: string // key can be either apiKey for customer or user
    email?: string // email only needs to be provided for user
  },
) {
  if (req.authUsedAlready) {
    throw new Unauthorized(req.authCombinedErrorMessage)
  }

  if (!auth.key) {
    throw new Unauthorized('Not authorized: Invalid credentials!')
  } else {
    req.authUsedAlready = true
  }

  try {
    let customer = await findCustomerByApiKey(fastify, auth.key)

    if (customer) {
      customer = await customer.populate('apiKeys')
      validateApiKey(customer, auth.key)
      req.customer = customer
      req.customerId = customer._id.toString()
      logCustomerRequest(fastify, req, customer)

      return
    }

    // Users can only use bearer auth
    // Customer can use basic and bearer auth
    if (!auth.email) {
      throw new Unauthorized('Not authorized: Invalid credentials!')
    }

    const user = await findUser(fastify, auth.email)
    if (!user || !(await user.verifyApiKey(auth.key))) {
      throw new Unauthorized('Not authorized: Invalid credentials!')
    }

    req.user = user
    logUserRequest(fastify, req, user)
  } catch (error) {
    req.authCombinedErrorMessage = error.message
    throw error
  }
}

export function extractKey(
  headers: FastifyRequest['headers'],
): string | undefined {
  const xApiKey = headers['x-api-key'] as string
  const apiKey = headers['api-key'] as string
  const bearerToken = headers['authorization'] as string

  if (xApiKey?.length && xApiKey !== 'undefined') {
    return xApiKey
  } else if (apiKey?.length && apiKey !== 'undefined') {
    return apiKey
  } else if (bearerToken?.length && bearerToken.startsWith('Bearer ')) {
    const bearerKey = bearerToken.replace('Bearer ', '')
    if (bearerKey !== 'undefined') {
      return bearerKey
    }
  }
}

export async function findCustomerByApiKey(
  fastify: FastifyInstance,
  key: string,
) {
  return fastify.models.customer
    .findOne({ isActive: true, 'apiKeys.key': key })
    .exec()
}

export function validateApiKey(customer: Customer, key: string) {
  const now = new Date()
  const apiKey = customer.apiKeys.find(
    (apiKey: CustomerApiKeyDocument) => apiKey.key === key,
  )

  if (!apiKey) {
    throw new Unauthorized('Not authorized: api key not found!')
  }

  if (apiKey.validFrom > now) {
    throw new Unauthorized('Not authorized: api key not valid yet!')
  }

  if (apiKey.validTo < now) {
    throw new Unauthorized('Not authorized: api key expired!')
  }
}

export function logCustomerRequest(
  fastify: FastifyInstance,
  req: FastifyRequest,
  customer: Customer,
) {
  fastify.log.debug({
    gaiaCustomerRequestLog: {
      reqId: req.id,
      customer_id: customer._id.toString(),
      customer_name: customer.name,
    },
  })
}

export async function findUser(fastify: FastifyInstance, email: string) {
  const user = await fastify.models.user.findOne({ email }).exec()

  return user
}

export function logUserRequest(
  fastify: FastifyInstance,
  req: FastifyRequest,
  user: User,
) {
  fastify.log.debug({
    gaiaUserRequestLog: {
      reqId: req.id,
      user_id: user._id.toString(),
      user_email: user.email,
    },
  })
}

export const decorateBearerAuth = fp(decorate)
