import { BingSearchResultResponse } from '../../customTypes'
import { InternalTool } from '../../models/types'
import BaseService from '../base'

export default class AzureBingService extends BaseService {
  public async search(
    query: string,
    internalTool: InternalTool,
    parentId?: string,
  ) {
    const q = this.buildQuery(query, internalTool)
    let resultString: string
    let spanId: string
    try {
      spanId = this.req.services.arize.initializeSpanBingSearchToolCall(
        q,
        parentId,
      )

      const results = await fetch(
        `${this.fastify.config.services.azure.bingUrl}/v7.0/search${q}`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.fastify.config.services.azure
              .bingApiKey as string,
          },
        },
      )
      const resultJson: BingSearchResultResponse = await results.json()
      const resultData = this.extractDataFromWebsiteSearch(resultJson)

      resultString = JSON.stringify(resultData)

      this.req.services.arize.setSpanOutputValue(spanId, resultString)
      this.req.services.arize.finalizeSpan(spanId)
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
    }

    await this.req.services.costTracking.trackToolCall(internalTool)

    return resultString
  }

  private buildQuery(query: string, gaiaTool: InternalTool) {
    let q = `?q=${query}&responseFilter=Webpages,News`

    if (gaiaTool.settings.bingSearch.language) {
      q = q.concat(`&mkt=${gaiaTool.settings.bingSearch.language}`)
    }

    if (gaiaTool.settings.bingSearch.numberRecords) {
      q = q.concat(`&count=${gaiaTool.settings.bingSearch.numberRecords}`)
    }

    return q
  }

  private extractDataFromWebsiteSearch(result: BingSearchResultResponse) {
    return result.webPages.value?.map((item) => {
      return {
        name: item.name,
        url: item.url,
        snippet: item.snippet,
        language: item.language,
      }
    })
  }
}
