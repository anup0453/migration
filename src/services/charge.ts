import { mapSeries } from 'bluebird'
import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { ObjectId } from 'mongodb'

import { ChargesEnum } from '../constants'
import { IChargeConfig } from '../customTypes'
import {
  ChargeDocument,
  CustomCharge,
  CustomerDocument,
  SubscriptionDocument,
} from '../models/types'
import PayAsYouGoService from './payAsYouGo'

export default class ChargeService {
  protected readonly fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  public async runCharging(chargeConfig: IChargeConfig) {
    const results = []
    this.fastify.log.info('Charging scheduler is running.')

    const chargeAllCustomers = chargeConfig.allCustomers
    const customerIds = chargeConfig.customers.map((id) => new ObjectId(id))

    const subscriptionCondition = {
      'subscription.isChargeable': true,
      'subscription.start': { $lte: new Date() },
      'subscription.paused': { $ne: true },
    }

    const chargeConfigCondition = chargeAllCustomers
      ? {}
      : { _id: { $in: customerIds } }

    const customers = await this.fastify.models.customer
      .find({
        ...subscriptionCondition,
        ...chargeConfigCondition,
      })
      .populate('subscription.type')
      .exec()

    await mapSeries(customers, async (customer) => {
      const result = {
        customer: customer.name,
        customer_id: customer._id,
        chargeCreated: false,
        chargeUpdated: false,
        subscriptionCharged: false,
        payed: false,
        amount: 0,
        error: false,
      }
      results.push(result)

      if (customer.subscription?.end && customer.subscription?.isChargeable) {
        if (customer.subscription?.end < new Date()) {
          customer.subscription.isChargeable = false
        }
      }

      this.fastify.log.info(`Creating charges for customer ${customer.name}.`)

      try {
        // Make sure that the customer exists on Pay-as-you-go
        if (!customer.billing?.payAsYouGoId) {
          // But ignore, if there is no billing information on the customer's billing settings yet

          const missingReferenceBillingInfo =
            !customer.billing ||
            !customer.billing?.orgId ||
            !customer.billing?.reference

          const missingPspBillingInfo =
            !customer.billing ||
            !customer.billing?.orgId ||
            !customer.billing?.psp

          if (missingPspBillingInfo && missingReferenceBillingInfo) {
            const errorMessage = `Insufficient billing information for customer ${customer.name}.`

            throw new Error(errorMessage)
          }

          const paymentDuplicate = await this.fastify.models.customer
            .findOne({
              $or: [
                {
                  $and: [
                    { 'billing.orgId': { $exists: true } },
                    { 'billing.orgId': customer.billing.orgId },
                    { 'billing.psp': { $exists: true } },
                    { 'billing.psp': customer.billing.psp },
                    { 'billing.payAsYouGoId': { $exists: true } },
                  ],
                },
                {
                  $and: [
                    { 'billing.orgId': { $exists: true } },
                    { 'billing.orgId': customer.billing.orgId },
                    { 'billing.reference': { $exists: true } },
                    { 'billing.reference': customer.billing.reference },
                    { 'billing.payAsYouGoId': { $exists: true } },
                  ],
                },
              ],
            })
            .exec()

          if (paymentDuplicate) {
            customer.billing.payAsYouGoId =
              paymentDuplicate.billing.payAsYouGoId
          } else {
            customer.billing = await this.createPayAsYouGoCustomer(
              this.fastify,
              customer,
            )
          }

          await customer.save()
        }

        let lastClosedCharge
        let charge
        const lastOpenCharge = await this.fastify.models.charge
          .findOne({ customer, chargedAt: { $exists: false } })
          .sort({ createdAt: -1 })
          .exec()

        if (lastOpenCharge) {
          // If there is an open charge we can continue with it
          charge = lastOpenCharge
        } else {
          // Use last open charge (open or charged)
          lastClosedCharge = await this.fastify.models.charge
            .findOne({ customer, chargedAt: { $exists: true } })
            .sort({ createdAt: -1 })
            .exec()

          charge = new this.fastify.models.charge({
            customer,
            amount: 0,
            from: lastClosedCharge
              ? lastClosedCharge.to
              : customer.subscription.start,
          })
          result.chargeCreated = true
        }

        const chargedAt = new Date()

        const plannedNextChargeDate =
          customer.subscription.nextChargedAt ||
          this.getNextChargeDate(customer)
        const needsSubscriptionCharge = !!(
          !customer.subscription.lastChargedAt ||
          chargedAt > plannedNextChargeDate
        )

        // Subscription fee
        charge.amount += needsSubscriptionCharge
          ? customer.subscription.type?.amount
          : 0

        if (needsSubscriptionCharge) {
          result.subscriptionCharged = true
          charge.items = this.addOrUpdateItem(charge.items, {
            type: `${ChargesEnum.SUBSCRIPTION_FEE}`,
            quantity: 1,
            amount: customer.subscription?.type?.amount || 0,
          })
        }

        // AI usage
        const chatRequests = await this.fastify.models.chatRequest.aggregate([
          {
            $match: {
              customer: customer._id,
              chargedAt: { $exists: false },
            },
          },
          {
            $group: {
              _id: null,
              totalCalcPrice: { $sum: '$calcTotalPrice' },
              count: { $sum: 1 },
            },
          },
        ])
        charge.amount += chatRequests?.[0]?.totalCalcPrice || 0
        charge.items = this.addOrUpdateItem(charge.items, {
          type: `${ChargesEnum.CHAT_REQUESTS}`,
          quantity: chatRequests?.[0]?.count || 0,
          amount: chatRequests?.[0]?.totalCalcPrice || 0,
        })

        const toolCalls = await this.fastify.models.internalToolCall.aggregate([
          {
            $match: {
              customer: customer._id,
              chargedAt: { $exists: false },
            },
          },
          {
            $group: {
              _id: null,
              totalCalcPrice: { $sum: '$calcTotalPrice' },
              count: { $sum: '$count' },
            },
          },
        ])
        charge.amount += toolCalls?.[0]?.totalCalcPrice || 0
        charge.items = this.addOrUpdateItem(charge.items, {
          type: `${ChargesEnum.INTERNAL_TOOL_CALLS}`,
          quantity: toolCalls?.[0]?.count || 0,
          amount: toolCalls?.[0]?.totalCalcPrice || 0,
        })

        // embeddings usage
        const embeddings = await this.fastify.models.embedding.aggregate([
          {
            $match: {
              customer: customer._id,
              chargedAt: { $exists: false },
            },
          },
          {
            $group: {
              _id: null,
              totalCalcPrice: { $sum: '$calcTotalPrice' },
              count: { $sum: 1 },
            },
          },
        ])
        charge.amount += embeddings?.[0]?.totalCalcPrice || 0
        charge.items = this.addOrUpdateItem(charge.items, {
          type: `${ChargesEnum.EMBEDDINGS}`,
          quantity: embeddings?.[0]?.count || 0,
          amount: embeddings?.[0]?.totalCalcPrice || 0,
        })

        // translation usage
        const translations = await this.fastify.models.translation.aggregate([
          {
            $match: {
              customer: customer._id,
              chargedAt: { $exists: false },
            },
          },
          {
            $group: {
              _id: null,
              totalCalcPrice: { $sum: '$calcTotalPrice' },
              count: { $sum: 1 },
            },
          },
        ])
        charge.amount += translations?.[0]?.totalCalcPrice || 0
        charge.items = this.addOrUpdateItem(charge.items, {
          type: `${ChargesEnum.TRANSLATIONS}`,
          quantity: translations?.[0]?.count || 0,
          amount: translations?.[0]?.totalCalcPrice || 0,
        })

        // manual/custom charges
        const custom = await this.fastify.models.customCharge.aggregate([
          {
            $match: {
              customer: customer._id,
              chargedAt: { $exists: false },
              chargeableAt: { $lte: chargedAt },
            },
          },
          {
            $group: {
              _id: null,
              totalCalcPrice: { $sum: '$calcTotalPrice' },
              count: { $sum: 1 },
            },
          },
        ])
        charge.amount += custom?.[0]?.totalCalcPrice || 0
        charge.items = this.addOrUpdateItem(charge.items, {
          type: `${ChargesEnum.CUSTOM}`,
          quantity: custom?.[0]?.count || 0,
          amount: custom?.[0]?.totalCalcPrice || 0,
        })

        await customer.save()

        // Do not create a charge or a bill, if no amount would be due
        if (charge.amount === 0) {
          result.chargeCreated = false
          result.chargeUpdated = false
          result.subscriptionCharged = false
          throw new Error('No charges to create.')
        }

        await charge.save()
        result.chargeUpdated = true
        result.amount = charge.amount

        // Create a bill on pay-as-you-go,
        // IF NODE_ENV is production OR the test API is connected
        // AND the amount is larger than 50 € OR the customer's subscription will end

        const hasMinimumCharge = charge.amount >= 50
        const isProduction = process.env.NODE_ENV === 'production'
        const isTest = process.env.PAY_AS_YOU_GO_URL.includes('test')
        const subscriptionWillEnd =
          customer.subscription?.end &&
          customer.subscription?.end < dayjs().add(1, 'month').toDate()

        if (
          (isProduction || isTest) &&
          (hasMinimumCharge || subscriptionWillEnd)
        ) {
          charge.to = chargedAt
          await charge.save()

          charge = await this.createPayAsYouGoBill(this.fastify, charge)
          result.payed = true
        }

        // -------------------------------------------------------------------------------
        // Point of no return -> if teh charging goes over this point we can not revert it
        // -------------------------------------------------------------------------------

        // Set all items as charged that were included in this charge
        const chargeQuery = { customer, chargedAt: { $exists: false } }

        try {
          await this.fastify.models.chatRequest.updateMany(chargeQuery, {
            $set: { chargedAt },
          })
        } catch (e) {
          const errorMessage = `Charging chatRequests for ${customer.name} failed : ${e.message}`
          throw new Error(errorMessage)
        }

        try {
          await this.fastify.models.internalToolCall.updateMany(chargeQuery, {
            $set: { chargedAt },
          })
        } catch (e) {
          const errorMessage = `Charging toolCalls for ${customer.name} failed : ${e.message}`
          throw new Error(errorMessage)
        }

        try {
          await this.fastify.models.embedding.updateMany(chargeQuery, {
            $set: { chargedAt },
          })
        } catch (e) {
          const errorMessage = `Charging embedding for ${customer.name} failed : ${e.message}`
          throw new Error(errorMessage)
        }

        try {
          await this.fastify.models.translation.updateMany(chargeQuery, {
            $set: { chargedAt },
          })
        } catch (e) {
          const errorMessage = `Charging translation for ${customer.name} failed : ${e.message}`
          throw new Error(errorMessage)
        }

        try {
          await this.fastify.models.customCharge.updateMany(
            {
              customer,
              chargedAt: { $exists: false },
              chargeableAt: { $lte: chargedAt },
            },
            { $set: { chargedAt } },
          )
        } catch (e) {
          const errorMessage = `Charging customerCharge for ${customer.name} failed : ${e.message}`
          throw new Error(errorMessage)
        }

        // Is only setting the charging time of the subscription not of consumption cost in general
        // Info about last charge can always be retrieved from the entries in the collection
        if (needsSubscriptionCharge) {
          customer.subscription.lastChargedAt = chargedAt
          customer.subscription.nextChargedAt = dayjs(
            this.getNextChargeDate(customer),
          ).toDate()
        }

        await customer.save()

        this.fastify.log.info(`Charges for customer ${customer.name} created.`)

        return true
      } catch (e) {
        this.fastify.log.error(
          `Something went wrong on the scheduled charging: ${e.message}`,
        )
        result.error = e.message
      }
    })

    return {
      results,
    }
  }

  public async createCustomCharge(customCharge: CustomCharge) {
    const customerId = customCharge.customer
    const customer = await this.fastify.models.customer
      .findById(customerId)
      .exec()

    if (!customer) {
      throw new Error(`Customer with id ${customerId} not found.`)
    }

    const charge = await this.fastify.models.customCharge.create(customCharge)

    return charge
  }

  private addOrUpdateItem(
    items: ChargeDocument['items'],
    newItem: { amount: number; quantity: number; type: string },
  ) {
    const index = items.findIndex((item) => item.type === newItem.type)

    if (index !== -1) {
      items[index].amount += newItem.amount
      items[index].quantity += newItem.quantity
    } else {
      items.push(newItem)
    }

    return items
  }

  private async createPayAsYouGoBill(
    fastify: FastifyInstance,
    charge: ChargeDocument,
  ) {
    try {
      const service = new PayAsYouGoService(fastify)

      return await service.createBillFromCharge(charge)
    } catch (e) {
      this.fastify.log.error(
        `Error when trying to create bill on Pay-as-you-go: ${e.message}.`,
      )
    }
  }

  private async createPayAsYouGoCustomer(
    fastify: FastifyInstance,
    customer: CustomerDocument,
  ) {
    const service = new PayAsYouGoService(fastify)

    const payAsYouGoCustomer = await service.createCustomer(customer)

    return payAsYouGoCustomer.billing
  }

  private getFiscalYearStart(current?: boolean) {
    // Important: If hours become relevant for charging, dates need to be
    // calculated in UTC
    const subtract = current ? 1 : 0

    return dayjs()
      .subtract(subtract, 'year')
      .set('month', 9)
      .set('date', 1)
      .startOf('day')
      .toDate()
  }

  private getNextChargeDate(customer: CustomerDocument) {
    const subscriptionType = customer.subscription.type as SubscriptionDocument

    if (!customer.subscription.lastChargedAt) {
      return this.getFiscalYearStart(true)
    }

    const nextChargeDate = dayjs(customer.subscription.lastChargedAt)
      .add(subscriptionType.periodInMonths, 'month')
      .set('date', 1)
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .toDate()

    return nextChargeDate
  }
}
