import { ManipulateType } from 'dayjs'

export interface IKpiRequest {
  // date string
  from?: string
  // date string
  to?: string
  // should graph axis data be delivered along with the aggregation data
  graph?: boolean
  // aggregation scale timeframe, default is 'auto'
  scale?: 'day' | 'month' | 'year' | 'auto'
  // comma separated strings or an array of strings of aggregations that should be sent
  type?: string | AggregationType[]
  // string of a customer _id
  customer?: string
}

export interface IKpiResponse extends Omit<IKpiRequest, 'graph' | 'scale'> {
  graphData?: GraphData
  aggregationData?: {
    [key: string]: {
      count: number
      value: number
    }
  }
  total: number
}

type GraphData = {
  [key: string]: {
    axis: string[]
    values: number[]
  }
}

export interface IKpiDataType {
  from: Date
  to: Date
  scale: ManipulateType
  type: string
}

export type AggregationType =
  | 'total'
  | 'chatRequest'
  | 'subscription'
  | 'translation'
  | 'embedding'
  | 'customCharge'
  | 'internalToolCall'
