export interface ISearchQuery {
  search?: string
  limit?: number
  offset?: number
  isActive?: boolean
  sort?: string
}

export interface ICustomerApIRequestParam {
  id: string
  customerId: string
}

export interface IDefaultIdRequestParam {
  id: string
}

export interface IDefaultNameRequestParam {
  name: string
}

export interface IDefaultFilterQuery {
  query?: string
  filter?: {
    [key: string]: unknown
  }
  select?: string
  sort?: string
  populate?: string
  limit?: number
  offset?: number
}

export interface IFindQuery {
  q: string
}

export interface IRecordSearchBody {
  manufacturer: string
  key: string
  searchTerm?: string
}
