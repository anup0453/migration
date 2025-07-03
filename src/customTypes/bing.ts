export type BingSearchResultResponse = {
  _type: string
  queryContext: {
    originalQuery: string
  }
  webPages: {
    webSearchUrl: string
    totalEstimatedMatches?: number
    value?: {
      id: string
      name: string
      url: string
      displayUrl: string
      snippet: string
      dateLastCrawled: string
      language: string
      isNavigational: boolean
    }[]
  }
}

export type BingSearchFilterQuery = {
  queryString: string
  language?: string // e.g. 'de-DE' or 'en-US'
  count?: number // default 10, max 50
  date?: 'Day' | 'Week' | 'Month'
}
