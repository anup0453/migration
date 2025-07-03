import { Customer, Datasource, User } from '.'

export type SearchUser = {
  data: User[]
  count: number
  success?: boolean
}

export type SearchCustomer = {
  data: Customer[]
  count: number
  success?: boolean
}

export type SearchDatasoruce = {
  data: Datasource[]
  count: number
  success?: boolean
}

export type SharepointListItem = {
  id: string
  lastModifiedDateTime: string
  webUrl: string
  contentType: { name: string }
  fields: { [key: string]: any }
}

export type SharepointPageItem = {
  id: string
  lastModifiedDateTime: string
  webUrl: string
  name: string
  contentType: { name: string }
}

export type WebpartsContent = {
  id: string
  innerHtml: string
}
