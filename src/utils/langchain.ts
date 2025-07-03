import {
  AzureAISearchConfig,
  AzureAISearchFilterType,
  AzureAISearchVectorStore,
} from '@langchain/community/vectorstores/azure_aisearch'
import { BaseCallbackHandler } from '@langchain/core/callbacks/base'
import { Document } from '@langchain/core/documents'
import type { EmbeddingsInterface } from '@langchain/core/embeddings'
import { Serialized } from '@langchain/core/load/serializable'
import { BaseMessage } from '@langchain/core/messages'
import { LLMResult } from '@langchain/core/outputs'
import { AgentAction } from 'langchain/agents'

import { getTokenCount } from '../utils'

export class GAIAAzureAISearchVectorStore extends AzureAISearchVectorStore {
  constructor(embeddings: EmbeddingsInterface, config: AzureAISearchConfig) {
    super(embeddings, config)

    const DEFAULT_FIELD_CONTENT_VECTOR = 'contentVector'

    AzureAISearchVectorStore.prototype.semanticHybridSearchVectorWithScore =
      async function (
        query: string,
        queryVector?: number[],
        n?: number,
        filter?: AzureAISearchFilterType,
      ): Promise<[Document, number][]> {
        const vector = queryVector ?? (await this.embeddings.embedQuery(query))
        await this.initPromise
        const { results: searchResults } = await this.client.search(query, {
          queryType: 'semantic',
          semanticSearchOptions: {
            configurationName: 'default',
          },
          top: n,
          vectorSearchOptions: {
            queries: [
              {
                kind: 'vector',
                fields: [DEFAULT_FIELD_CONTENT_VECTOR],
                vector: vector,
                k: 150,
                exhaustive: true,
              },
            ],
          },
          hybridSearch: {
            maxTextRecallSize: 1000, // allows to control the number of BM25-ranked documents fed into the hybrid ranking model
            countAndFacetMode: 'countRetrievableResults', // determines how document counts and facets are reported for the BM25-ranked results
          },
          filter: filter.filterExpression,
        })

        const result = []
        for await (const item of searchResults) {
          const document = new Document({
            metadata: item,
            pageContent: item.document.content,
          })

          if (item.score > 0.01 && item.rerankerScore > 1.0) {
            result.push([document, item.score, item.rerankerScore]) // item.score -> Score from the vector search (varies between -1 and 1). Reranker score -> Score from the semantic search (varies between 0 and 4).
          }
        }

        return result
      }
  }
}

export class ChatModelCallbackHandler extends BaseCallbackHandler {
  name = 'ChatModelCallbackHandler'

  prompt_tokens = 0
  completion_tokens = 0

  constructor() {
    super()
    this.awaitHandlers = true
  }

  override async handleChatModelStart?(
    llm: Serialized,
    messages: BaseMessage[][],
  ) {
    for (const message of messages) {
      for (const m of message) {
        const content = m.content.toString()
        this.prompt_tokens += getTokenCount(content)
      }
    }
  }

  override async handleLLMEnd?(output: LLMResult) {
    for (const message of output.generations) {
      for (const m of message) {
        const content = m.text.toString()
        this.completion_tokens += getTokenCount(content)
      }
    }
  }
}

export class ToolsCallbackHandler extends BaseCallbackHandler {
  name = 'ToolsCallbackHandler'

  constructor() {
    super()
    this.awaitHandlers = true
  }

  prompt_tokens = 0
  completion_tokens = 0

  override async handleAgentAction(action: AgentAction) {
    this.completion_tokens += getTokenCount(action.toolInput['input'])
  }
}
