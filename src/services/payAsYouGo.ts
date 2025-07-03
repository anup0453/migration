import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { BadRequest, NotFound } from 'http-errors'
import fetch from 'node-fetch'

import { PayAsYouGoError } from '../customTypes'
import {
  ChargeDocument,
  CustomerBilling,
  CustomerBillingDocument,
  CustomerDocument,
} from '../models/types'
import { currencyFormat } from '../utils'

export default class PayAsYouGoService {
  protected readonly fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  private async sendRequest(endpoint: string, method?: string, body?: unknown) {
    const url = `${this.fastify.config.services.payAsYouGo?.url}/${
      endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    }`
    let data = undefined
    if (body) {
      data = body as BodyInit
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.fastify.config.services.payAsYouGo?.apiKey,
        },
        method: method || 'GET',
        ...(data ? { body: JSON.stringify(data) } : {}),
      })

      const json = await response.json()

      if (json?._embedded?.errors?.length) {
        this.fastify.log.error(
          `There was at least one error on Pay-as-you-go: ${json._embedded.errors
            .map((e: PayAsYouGoError) => e.message)
            .join(', ')}`,
        )
      }

      return { response: json, status: response.status }
    } catch (e) {
      this.fastify.log.error(e.message)

      return e
    }
  }

  public async createCustomer(customer: CustomerDocument) {
    const endpoint = `services/${this.fastify.config.services.payAsYouGo.serviceId.toString()}/customers`

    if (!customer.billing) {
      throw new BadRequest(
        `Customer ${customer.name} is missing billing information to be onboarded properly.`,
      )
    }

    const body = {
      billing: {
        ...(customer.billing.position
          ? { position: customer.billing.position }
          : {}),
        ...(customer.billing.orgId ? { orgId: customer.billing.orgId } : {}),
        ...(customer.billing.reference
          ? { reference: customer.billing.reference }
          : {}),
        ...(customer.billing.psp ? { psp: customer.billing.psp } : {}),
      },
      name: customer.name,
    }

    const { response } = await this.sendRequest(endpoint, 'POST', body)

    if (!response.id) {
      throw new BadRequest(
        `Creation of customer ${customer.name} failed on pay-as-you-go with the following message: ${response.error}`,
      )
    }

    customer.billing.payAsYouGoId = response.id

    return await customer.save()
  }

  public async getCustomer(customer: CustomerDocument) {
    if (!customer.billing?.payAsYouGoId) {
      this.fastify.log.warn(
        `Customer with id ${customer._id.toString()} is not created at Pay-as-you-go yet.`,
      )

      return null
    }

    const endpoint = `customers/${customer.billing.payAsYouGoId}`

    const { response } = await this.sendRequest(endpoint)

    return response
  }

  public async updateCustomer(
    customer: CustomerDocument,
    data: CustomerBilling,
  ) {
    if (!customer.billing?.payAsYouGoId) {
      this.fastify.log.warn(
        `Customer with id ${customer._id.toString()} is not created at Pay-as-you-go yet.`,
      )

      return null
    }

    const endpoint = `customers/${customer.billing.payAsYouGoId}`

    const body = {
      billing: {
        position: data.position || customer.billing.position,
        orgId: data.orgId || customer.billing.orgId,
        reference: data.reference || customer.billing.reference,
        psp: data.psp || customer.billing.psp,
      },
      name: customer.name,
    }

    const { response } = await this.sendRequest(endpoint, 'PATCH', body)

    customer.billing = {
      position: response.billing.position,
      orgId: response.billing.orgId,
      reference: response.billing.reference,
      psp: response.billing.psp,
    } as CustomerBillingDocument

    return await customer.save()
  }

  public async createBillFromCharge(charge: ChargeDocument) {
    const customer = await this.fastify.models.customer.findById(
      charge.customer,
    )

    if (!customer) {
      throw new NotFound(
        `The customer with id ${
          charge.customer
        }, attached to charge ${charge._id.toString()} not found.`,
      )
    }

    const endpoint = `customers/${customer.billing.payAsYouGoId}/bills`

    const remarks = charge.items.map(
      (i) => `${i.type}: Qty - ${i.quantity}, € ${currencyFormat(i.amount)}`,
    )
    remarks.push(`customerId: € ${customer._id.toString()}`)

    const endTime = charge.to || dayjs().toDate()
    const body = {
      // Important: Pay-as-you-go is expecting Cents, we are calculating in EUR
      amount: Math.round(charge.amount * 100),
      remarks,
      startTime:
        charge.from ||
        customer.subscription?.start ||
        dayjs('2024-01-01').toDate(),
      endTime,
    }

    const { response } = await this.sendRequest(endpoint, 'POST', body)

    charge.payAsYouGoId = response.id
    charge.chargedAt = endTime

    return await charge.save()
  }

  public async chargeBill(chargeId: string) {
    const charge = await this.fastify.models.charge.findById(chargeId).exec()

    if (!charge) {
      throw new NotFound(`No valid charge with id ${chargeId} found.`)
    }

    const endpoint = `bills/${charge.payAsYouGoId}/transfer-to-sap`

    const { response } = await this.sendRequest(endpoint, 'POST', {})

    charge.payAsYouGoStatus = response.desiredState
    charge.chargedAt = new Date()

    return await charge.save()
  }

  public async getBill(chargeId: string) {
    const charge = await this.fastify.models.charge.findById(chargeId).exec()

    if (!charge) {
      throw new NotFound(`No valid charge with id ${chargeId} found.`)
    }

    const endpoint = `bills/${charge.payAsYouGoId}`

    const { response } = await this.sendRequest(endpoint)

    return response
  }

  public async listBills() {
    const endpoint = `services/${this.fastify.config.services.payAsYouGo.serviceId.toString()}/bills`

    const { response } = await this.sendRequest(endpoint)

    return response
  }

  public async deleteBill(chargeId: string) {
    const charge = await this.fastify.models.charge.findById(chargeId).exec()

    if (!charge) {
      throw new NotFound(`No valid charge with id ${chargeId} found.`)
    }

    const endpoint = `bills/${charge.payAsYouGoId}`

    const { response } = await this.sendRequest(endpoint, 'DELETE')

    if (response) {
      charge.payAsYouGoId = undefined
      charge.payAsYouGoStatus = undefined
      charge.chargedAt = undefined

      return await charge.save()
    }

    return false
  }

  public async isValidateBilling(billingData: CustomerBilling) {
    const endpoint = `billing/validate`

    const { status } = await this.sendRequest(endpoint, 'POST', billingData)

    return status === 204
  }
}
