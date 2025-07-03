import dayjs, { ManipulateType } from 'dayjs'
import { FastifyInstance, FastifyRequest } from 'fastify'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import sumBy from 'lodash/sumBy'
import { ObjectId } from 'mongodb'

import {
  AggregationType,
  IKpiDataType,
  IKpiRequest,
  IKpiResponse,
} from '../constants'
import BaseService from './base'

export default class KpiService extends BaseService {
  protected readonly chargingModels: AggregationType[]
  protected filterCustomer: { [key: string]: string } | object

  constructor(fastify: FastifyInstance, req: FastifyRequest) {
    super(fastify, req)

    this.chargingModels = [
      'chatRequest',
      'internalToolCall',
      'customCharge',
      'embedding',
      'subscription',
      'translation',
      'total',
    ]
  }

  public async getCustomerAggregations(requestData: IKpiRequest) {
    this.filterCustomer = requestData.customer
      ? { customer: new ObjectId(requestData.customer) }
      : {}
    const types = this.createTypeArray(requestData.type)

    const response: IKpiResponse = {
      from: requestData.from,
      to: requestData.to,
      total: 0,
      type: types,
      aggregationData: {},
      graphData: {},
    }

    for await (const type of types) {
      if (type !== 'total') {
        const { graphData, aggregation } = await this.singleAggregationData(
          requestData,
          type,
        )

        if (requestData.graph) {
          response.graphData[type] = graphData
        }

        response.aggregationData[type] = aggregation
      }
    }

    if (types.includes('total')) {
      response.total =
        sumBy(Object.values(response.aggregationData).flat(), 'value') || 0
    }

    return response
  }

  private async singleAggregationData(
    requestData: IKpiRequest,
    type: AggregationType,
  ) {
    const data = this.transformRequestInformation(requestData, type)
    const grouping = this.buildTimeGroup(
      data.from,
      data.to,
      '$createdAt',
      data.scale,
    )

    const query = [
      {
        $match: {
          ...(this.isAdmin()
            ? this.filterCustomer
            : { customer: this.req.customer._id }),
          createdAt: {
            $gte: data.from,
            $lte: data.to,
          },
          unchargeable: { $ne: true }, // e.g. was added for embeddings that could not be charged because it was the users fault
        },
      },
      grouping,
      { $sort: { _id: 1 } },
    ]

    const aggregation = await this.fastify.models[type].aggregate(query)

    return requestData.graph
      ? { graphData: this.prepareGraphResponse(data, aggregation), aggregation }
      : { aggregation }
  }

  private getScale(from: Date, to: Date): ManipulateType {
    let timeframe: ManipulateType
    const fromTime = from.getTime()
    const toTime = to.getTime()

    const days = (toTime - fromTime) / (1000 * 60 * 60 * 24)

    if (days < 1) {
      timeframe = 'hour'
    } else if (days < 2) {
      timeframe = 'day'
    } else if (days < 8) {
      timeframe = 'week'
    } else if (days < 700) {
      timeframe = 'month'
    } else {
      timeframe = 'year'
    }

    return timeframe
  }

  private buildTimeGroup(
    from: Date,
    to: Date,
    dateField = '$from',
    timeframe?: ManipulateType,
  ) {
    const tf = timeframe || this.getScale(from, to)

    let dateString = '%H:%M'

    if (tf === 'hour') {
      dateString = '%Y-%m-%d %H:00'
    } else if (tf === 'day') {
      dateString = '%Y-%m-%d'
    } else if (tf === 'week') {
      dateString = '%Y-%U'
    } else if (tf === 'month') {
      dateString = '%Y-%m'
    } else if (tf === 'year') {
      dateString = '%Y'
    }

    const group = {
      $group: {
        _id: { $dateToString: { format: dateString, date: dateField } },
        value: { $sum: '$calcTotalPrice' },
        count: { $sum: { $ifNull: ['$numRequests', 1] } }, // summing either $numRequests or just 1
      },
    }

    return group
  }

  private getMinDateTime(input: string) {
    let date: Date

    if (!isNaN(Date.parse(input))) {
      date = new Date(input)

      if (input.match(/^\d{4}$/)) {
        return dayjs(date).startOf('year').toDate()
      } else if (input.match(/^\d{4}-\d{2}$/)) {
        return dayjs(date).startOf('month').toDate()
      } else if (input.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dayjs(date).startOf('day').toDate()
      } else if (input.match(/^\d{4}-\d{2}-\d{2}T\d{2}$/)) {
        return dayjs(date).startOf('hour').toDate()
      } else if (input.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
        return dayjs(date).startOf('minute').toDate()
      } else if (input.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
        return dayjs(date).startOf('second').toDate()
      } else {
        return date
      }
    } else {
      throw new Error('Invalid date format')
    }
  }

  private getMaxDateTime(input) {
    let date: Date

    if (!isNaN(Date.parse(input))) {
      date = new Date(input)

      if (input.match(/^\d{4}$/)) {
        return dayjs(date).endOf('year').toDate()
      } else if (input.match(/^\d{4}-\d{2}$/)) {
        return dayjs(date).endOf('month').toDate()
      } else if (input.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dayjs(date).endOf('day').toDate()
      } else if (input.match(/^\d{4}-\d{2}-\d{2}T\d{2}$/)) {
        return dayjs(date).endOf('hour').toDate()
      } else if (input.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
        return dayjs(date).endOf('minute').toDate()
      } else if (input.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
        return dayjs(date).endOf('second').toDate()
      } else {
        return date
      }
    } else {
      throw new Error('Invalid date format')
    }
  }

  private transformRequestInformation(
    data: IKpiRequest,
    type: AggregationType,
  ): IKpiDataType {
    const from = data.from
      ? this.getMinDateTime(data.from)
      : dayjs('2023-10-01').startOf('day').toDate()
    const to = data.to
      ? this.getMaxDateTime(data.to)
      : dayjs().endOf('day').toDate()

    return {
      from,
      to,
      scale: data.scale
        ? (data.scale as ManipulateType)
        : this.getScale(from, to),
      type,
    }
  }

  private createTypeArray(type?: string | string[]) {
    const typeArray =
      type && isString(type)
        ? type.split(',')
        : isArray(type)
        ? type
        : ['total']

    return typeArray.filter((t: AggregationType): t is AggregationType =>
      this.chargingModels.includes(t),
    )
  }

  private fillMissingAggregations(
    data: { _id: string; value: number }[],
    period = 12,
    timeframe: ManipulateType,
  ) {
    let first = dayjs()
      .subtract(period, timeframe)
      .startOf(timeframe)
      .format('YYYY-MM')
    const last = dayjs().endOf('month').format('YYYY-MM')
    const arr = [first]

    while (first < last) {
      first = dayjs(first).add(1, timeframe).format('YYYY-MM')
      arr.push(first)
    }

    return arr.map((date) => {
      return data.find((d) => d._id === date) || { _id: date, value: 0 }
    })
  }

  private prepareGraphResponse(
    data: IKpiDataType,
    aggregation: { _id: string; value: number }[],
  ) {
    const period = dayjs(data.to).diff(dayjs(data.from), data.scale)
    const addMissing = this.fillMissingAggregations(
      aggregation,
      period,
      data.scale,
    )

    const values = addMissing.map((a) => a.value)
    const axis = addMissing.map((a) => a._id)

    return {
      title: `${data.type[0].toUpperCase()}${data.type.slice(1)}`,
      values,
      axis,
    }
  }
}
