import {
  OpenInferenceSpanKind,
  SemanticConventions,
} from '@arizeai/openinference-semantic-conventions'
import {
  ChatRequestAssistantMessage,
  ChatRequestSystemMessage,
  ChatRequestUserMessage,
} from '@azure/openai'
import { Metadata } from '@grpc/grpc-js'
import { BaseMessage } from '@langchain/core/messages'
import { DynamicTool } from '@langchain/core/tools'
import { Span, SpanStatusCode, trace } from '@opentelemetry/api'
import opentelemetry from '@opentelemetry/api'
import { OTLPTraceExporter as GrpcOTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'

import { ArizeSpanTypeEnum, ChatRequestType, RoleEnum } from '../constants'
import {
  IChatBody,
  IChatCompletions,
  IChatCompletionsSnakeCase,
  IEmbeddingsResponse,
} from '../customTypes'
import { anonymizeText } from '../utils'
import BaseService from './base'

export default class ArizeService extends BaseService {
  private spanMap: Map<string, Span> = new Map() // Map of spanId to Span
  private spanNameMap: Map<string, string> = new Map() // Map of spanId to spanName

  private tracer = trace.getTracer('dice-server', '0.1.0')

  // This is where I got the idea from: https://opentelemetry.io/docs/languages/js/instrumentation/#creating-nested-spans-with-sdk-trace-base
  private startSpan(name: string, parentId?: string): string {
    let span: Span

    if (parentId) {
      const parentSpan = this.getSpanById(parentId)

      const ctx = opentelemetry.trace.setSpan(
        opentelemetry.context.active(),
        parentSpan,
      )
      span = this.tracer.startSpan(name, undefined, ctx)
    } else {
      span = this.tracer.startSpan(name)
    }

    const id = span.spanContext().spanId
    this.spanMap.set(id, span)
    this.spanNameMap.set(id, name)
    this.setDefaultSpanAttributes(id)
    this.ensureCorrectExporter(id)

    return id
  }

  private getSpanById(id: string): Span {
    return this.spanMap.get(id)
  }

  // Initialize Span functions --------------------------------------------------------------------

  public initializeSpanChatChain(question: string, parentId?: string): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(ArizeSpanTypeEnum.CHAT_CHAIN, parentId)
    const span = this.getSpanById(id)
    span.setAttributes({
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]:
        OpenInferenceSpanKind.CHAIN,
    })
    const filteredOutput = anonymizeText(question)
    this.setFilteredInputValueAttr(span, filteredOutput)

    return id
  }

  public initializeSpanFinalAnswer(
    question: string,
    parentId?: string,
  ): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(ArizeSpanTypeEnum.FINAL_ANSWER, parentId)
    const span = this.getSpanById(id)
    span.setAttributes({
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]: OpenInferenceSpanKind.LLM,
    })
    const filteredInput = anonymizeText(question)
    this.setLlmInputsAttrs(span, [{ role: 'user', content: filteredInput }])

    return id
  }

  public initializeSpanGenerateQuestion(
    historyMessage: string,
    userInput: string,
    parentId?: string,
  ): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(ArizeSpanTypeEnum.GENERATE_QUESTION, parentId)
    const span = this.getSpanById(id)

    span.setAttributes({
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]: OpenInferenceSpanKind.LLM,
    })
    this.setLlmInputsAttrs(span, [{ role: 'user', content: historyMessage }])
    this.setFilteredInputValueAttr(span, userInput)

    return id
  }

  public initializeSpanProcessDocuments(
    question: string,
    parentId?: string,
  ): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(ArizeSpanTypeEnum.PROCESS_DOCUMENTS, parentId)
    const span = this.getSpanById(id)

    span.setAttributes({
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]:
        OpenInferenceSpanKind.RETRIEVER,
      'customer.index.name': this.req.customer.aiSearch.indexName,
    })
    this.setFilteredInputValueAttr(span, question)

    return id
  }

  public initializeSpanRetrievedRecord(
    question: string,
    parentId?: string,
  ): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(ArizeSpanTypeEnum.RETRIEVED_RECORDS, parentId)
    const span = this.getSpanById(id)
    span.setAttributes({
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]:
        OpenInferenceSpanKind.CHAIN,
    })
    this.setFilteredInputValueAttr(span, question)

    return id
  }

  public initializeSpanGenerateHistory(
    chatData: IChatBody,
    parentId?: string,
  ): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(ArizeSpanTypeEnum.GENERATE_HISTORY, parentId)
    const span = this.getSpanById(id)
    const history = chatData.history
    this.setLlmInputsAttrs(span, history)
    span.setAttributes({
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]: OpenInferenceSpanKind.LLM,
    })

    return id
  }

  public initializeSpanSourcelinkReplacement(
    content: string,
    fileNames: Map<string, string>,
    urls: Map<string, string>,
    parentId?: string,
  ): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(
      ArizeSpanTypeEnum.SOURCELINK_REPLACEMENT,
      parentId,
    )
    const span = this.getSpanById(id)

    span.setAttributes({
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]:
        OpenInferenceSpanKind.GUARDRAIL,
    })

    for (const id of urls.keys()) {
      span.setAttribute(
        `SourceLinks.${id}`,
        JSON.stringify({
          url: urls.get(id),
          fileName: fileNames.get(id),
        }),
      )
    }
    this.setFilteredInputValueAttr(span, content)

    return id
  }

  public initializeSpanEmbedding(
    input: string | string[],
    _openAiEmbeddingEngine: string,
    parentId?: string,
  ): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }

    const id = this.startSpan(ArizeSpanTypeEnum.EMBEDDING, parentId)
    const span = this.getSpanById(id)
    span.setAttributes({
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]:
        OpenInferenceSpanKind.EMBEDDING,
      [`${SemanticConventions.EMBEDDING_EMBEDDINGS}.0.${SemanticConventions.EMBEDDING_MODEL_NAME}`]:
        _openAiEmbeddingEngine,
      [`${SemanticConventions.EMBEDDING_EMBEDDINGS}.0.${SemanticConventions.EMBEDDING_TEXT}`]:
        input,
    })
    this.setFilteredInputValueAttr(span, input)

    return id
  }

  public initializeSpanChatRequest(
    type: ChatRequestType,
    messages: Array<
      | ChatRequestUserMessage
      | ChatRequestAssistantMessage
      | ChatRequestSystemMessage
    >,
    options: {
      maxTokens?: number
      temperature?: number
      topP?: number
      frequencyPenalty?: number
      presencePenalty?: number
      stop?: string[]
      internalTools?: DynamicTool[]
      tools?: DynamicTool[]
    },
    _openAiEngine: string,
    parentId?: string,
  ): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(ArizeSpanTypeEnum.CHAT_REQUEST, parentId)
    const span = this.getSpanById(id)
    const inputMessageContent = messages[messages.length - 1][
      'content'
    ] as string
    for (const message of messages) {
      if (message.role === RoleEnum.system) {
        this.setLlmInputsAttrs(span, [
          { role: 'System Message', content: message.content },
        ])
      }
      if (message.role === RoleEnum.assistant) {
        this.setLlmInputsAttrs(span, [
          { role: 'assistant', content: message.content },
        ])
      } else {
        if (message.role === RoleEnum.user) {
          this.setLlmInputsAttrs(span, [
            { role: 'user', content: message.content },
          ])
        }
      }
    }
    this.setFilteredInputValueAttr(span, inputMessageContent)

    span.setAttributes({
      Type: type,
      'Model Name': _openAiEngine,
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]: OpenInferenceSpanKind.LLM,
      [SemanticConventions.METADATA]: JSON.stringify(options),
      [SemanticConventions.LLM_INVOCATION_PARAMETERS]: JSON.stringify(options),
    })

    return id
  }

  public initializeSpanChatRequestWithInternalTools(
    messages: BaseMessage[],
    _openAiEngine: string,
    parentId?: string,
  ): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(
      ArizeSpanTypeEnum.CHAT_REQUEST_WITH_INTERNAL_TOOLS,
      parentId,
    )
    const span = this.getSpanById(id)
    span.setAttributes({
      'Model Name': _openAiEngine,
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]:
        OpenInferenceSpanKind.AGENT,
    })
    this.setLlmInputsAttrs(span, messages)

    return id
  }

  public initializeSpanBingSearchToolCall(
    query: string,
    parentId?: string,
  ): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(ArizeSpanTypeEnum.BING_SEARCH_TOOL_CALL, parentId)
    const span = this.getSpanById(id)
    span.setAttributes({
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]: OpenInferenceSpanKind.TOOL,
    })
    this.setFilteredInputValueAttr(span, query)

    return id
  }

  public initializeSpanSnowflakeToolCall(rows, parentId?: string): string {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const id = this.startSpan(ArizeSpanTypeEnum.SNOWFLAKE_TOOL_CALL, parentId)
    const span = this.getSpanById(id)
    span.setAttributes({
      [SemanticConventions.OPENINFERENCE_SPAN_KIND]: OpenInferenceSpanKind.TOOL,
    })
    this.setFilteredInputValueAttr(span, rows)

    return id
  }

  // Set Span functions --------------------------------------------------------------------

  public setSpanOutputFinalAnswer(id: string, completions) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    const filteredCompletions = structuredClone(completions)
    const messages = [
      {
        role: 'assistant',
        content: filteredCompletions.choices[0].message.content,
      },
    ]
    this.setLlmOutputAttrs(span, messages)
  }

  public setSpanOutputChatChain(
    id: string,
    completions: IChatCompletions | IChatCompletionsSnakeCase,
  ) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    const filteredOutput = anonymizeText(completions.choices[0].message.content)
    span.setAttributes({ [SemanticConventions.SESSION_ID]: completions.id })
    span.setAttributes({
      [SemanticConventions.OUTPUT_VALUE]: filteredOutput,
    })
  }

  public async setSpanOutputProcessDocuments(id: string, records) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    try {
      records.forEach((record, i) => {
        const document = record[0]
        const score = record[1]
        const finalMetadata = {
          score: score,
          rerankerScore: document.metadata.rerankerScore,
          document: {
            title: document.metadata.document.title,
            relative_path: document.metadata.document.relative_path,
            datasource_id: document.metadata.document.datasource_id,
            container_name: document.metadata.document.container_name,
          },
        }
        span.setAttributes({
          [`${SemanticConventions.RETRIEVAL_DOCUMENTS}.${i}.${SemanticConventions.DOCUMENT_ID}`]:
            document.metadata.document.file_name ||
            document.metadata.document.title,
          [`${SemanticConventions.RETRIEVAL_DOCUMENTS}.${i}.${SemanticConventions.DOCUMENT_CONTENT}`]:
            anonymizeText(document.pageContent),
          [`${SemanticConventions.RETRIEVAL_DOCUMENTS}.${i}.${SemanticConventions.DOCUMENT_SCORE}`]:
            score,
          [`${SemanticConventions.RETRIEVAL_DOCUMENTS}.${i}.${SemanticConventions.DOCUMENT_METADATA}`]:
            JSON.stringify(finalMetadata),
        })
      })
    } catch (error) {
      console.error('Error formatting tracing output:', error)
      throw error
    }
  }

  public async setSpanOutputProcessDocumentsDirectIndex(id: string, records) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    try {
      records.forEach((record, i) => {
        const document = record[0]
        const score = record[1]
        const finalMetadata = {
          score: score,
          rerankerScore: document.metadata.rerankerScore,
          document: {
            title: document.metadata.document.title,
            filename: document.metadata.document.filename,
            relative_path: document.metadata.document.relative_path,
            akamai_path: document.metadata.document.akamai_path,
            category: document.metadata.document.category,
            mlfb_codes: document.metadata.document.mlfb_codes,
          },
        }
        span.setAttributes({
          [`${SemanticConventions.RETRIEVAL_DOCUMENTS}.${i}.${SemanticConventions.DOCUMENT_ID}`]:
            document.metadata.document.filename || document.metadata.document.title,
          [`${SemanticConventions.RETRIEVAL_DOCUMENTS}.${i}.${SemanticConventions.DOCUMENT_CONTENT}`]:
            anonymizeText(document.pageContent),
          [`${SemanticConventions.RETRIEVAL_DOCUMENTS}.${i}.${SemanticConventions.DOCUMENT_SCORE}`]:
            score,
          [`${SemanticConventions.RETRIEVAL_DOCUMENTS}.${i}.${SemanticConventions.DOCUMENT_METADATA}`]:
            JSON.stringify(finalMetadata),
        })
      })
    } catch (error) {
      console.error('Error formatting tracing output:', error)
      throw error
    }
  }

  public setSpanOutputRetrievedRecord(id: string, sourceLink) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    const formattedRecords = sourceLink.records
      .split('<context')
      .filter((c) => c.trim())
      .map((context) => {
        const citationId = context.match(/citationId='(\d+)'/)?.[1] || 'unknown'
        const fileId = context.match(/fileId='([^']+)'/)?.[1] || ''
        const content = context.match(/>(.*?)<\/context>/s)?.[1] || 'No content'
        const filteredContent = anonymizeText(content)

        return `
  ----------------------------------------
  Citation ID: ${citationId}
  ${fileId ? `File ID: ${fileId}\n` : ''}
  Content: 
  ${filteredContent}
  ----------------------------------------\n`
      })

    // Now join the resolved results
    const finalOutput = formattedRecords.join('\n')

    this.setFilteredOutputValueAttr(span, finalOutput)
  }

  public setSpanOutputGenerateHistory(
    id: string,
    history: Array<
      | ChatRequestUserMessage
      | ChatRequestAssistantMessage
      | ChatRequestSystemMessage
    >,
    summary: string,
  ) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    this.setLlmOutputAttrs(span, history)
    this.setFilteredOutputValueAttr(span, summary)
  }

  public setSpanOutputEmbedding(id: string, queryVector?: IEmbeddingsResponse) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    span.setAttributes({
      [`${SemanticConventions.EMBEDDING_EMBEDDINGS}.0.${SemanticConventions.EMBEDDING_VECTOR}`]:
        queryVector.data[0].embedding,
    })
  }

  public async setSpanOutputChatRequest(id: string, response) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    const messages = [
      {
        role: 'assistant',
        content: response.choices[0].message.content,
      },
    ]
    this.setLlmOutputAttrs(span, messages)

    await this.setLLMUsage(id, response)
  }

  public setSpanOutputValue(id: string, result: string) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    this.setFilteredOutputValueAttr(span, result)
  }

  public setSpanInvocationParameters(id: string, parameters) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    span.setAttributes({
      [SemanticConventions.LLM_INVOCATION_PARAMETERS]: parameters,
    })
  }

  public setDefaultSpanAttributes(id: string) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    span.setAttributes({
      'Customer name': this.req.customer.name,
      Environment: this.fastify.config.services.arize.env,
      [SemanticConventions.USER_ID]: this.req.customer._id.toString(),
    })
  }

  // Status and finalize Span functions --------------------------------------------------------------------

  public setErrorSpanStatus(id: string, error: Error) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    const spanName = this.spanNameMap.get(id)
    if (span) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
      span.end()
      this.fastify.log.error(
        `Failed to trace ${spanName} Request for ${this.req.customer.name}`,
        error.message,
      )
      this.spanMap.delete(id)
      this.spanNameMap.delete(id)
    } else {
      this.fastify.log.error(
        `Failed to trace ${spanName} Request for ${this.req.customer.name}`,
        error.message,
      )
    }
  }

  public finalizeSpan(id: string) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    if (span) {
      span.setStatus({ code: SpanStatusCode.OK })
      span.end()
      this.spanMap.delete(id)
      this.spanNameMap.delete(id)
    } else {
      this.fastify.log.error(
        `Failed to trace Request for ${this.req.customer.name}`,
      )
    }
  }

  private setLlmInputsAttrs(span: Span, messages): void {
    this.setLlmAttributes(
      span,
      messages,
      SemanticConventions.LLM_INPUT_MESSAGES,
    )
  }
  private setLlmOutputAttrs(span: Span, messages): void {
    this.setLlmAttributes(
      span,
      messages,
      SemanticConventions.LLM_OUTPUT_MESSAGES,
    )
  }

  private setLlmAttributes(
    span: Span,
    messages,
    semanticConvent: string,
  ): void {
    const filteredMessages = this.filterMessages(messages)

    filteredMessages.forEach((msg, idx) => {
      span.setAttribute(
        `${semanticConvent}.${idx}.${SemanticConventions.MESSAGE_ROLE}`,
        msg.role,
      )
      span.setAttribute(
        `${semanticConvent}.${idx}.${SemanticConventions.MESSAGE_CONTENT}`,
        msg.content || '',
      )
    })
  }

  private setFilteredValueAttribute(
    span: Span,
    value: string | string[],
    semanticConvention: string,
  ): void {
    // value can be string or string[]
    // anonimize all of them
    // as result I want a string or string[] just in anonymized form
    let filteredValue: string | string[]

    if (typeof value === 'string') {
      filteredValue = anonymizeText(value)
    } else {
      filteredValue = value.map((v) => anonymizeText(v))
    }

    span.setAttribute(semanticConvention, filteredValue)
  }

  private setFilteredOutputValueAttr(span: Span, value: string): void {
    this.setFilteredValueAttribute(
      span,
      value,
      SemanticConventions.OUTPUT_VALUE,
    )
  }

  private setFilteredInputValueAttr(
    span: Span,
    value: string | string[],
  ): void {
    this.setFilteredValueAttribute(span, value, SemanticConventions.INPUT_VALUE)
  }

  private filterMessages(messages) {
    return messages.map((msg) => {
      return {
        role: msg.role,
        content: anonymizeText(msg.content),
      }
    })
  }

  public async setLLMUsage(id: string, completion) {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }
    const span = this.getSpanById(id)
    const totalCost =
      await this.req.services.plainLLM.openAI.getCostOfCompletion(completion)
    span.setAttributes({
      [SemanticConventions.LLM_TOKEN_COUNT_PROMPT]:
        completion.usage.prompt_tokens,
      [SemanticConventions.LLM_TOKEN_COUNT_TOTAL]:
        completion.usage.total_tokens,
      [SemanticConventions.LLM_TOKEN_COUNT_COMPLETION]:
        completion.usage.completion_tokens,
      ['Total Cost']: totalCost,
    })
  }

  // Define the span processor and exporter for each customer settings
  private ensureCorrectExporter(spanId: string): void {
    if (!this.req.customer.arizeSettings?.tracingEnabled) {
      return
    }

    try {
      const span = this.getSpanById(spanId)
      if (!span) {
        return
      }

      // Cast to any to access internal properties --> Didnt find another way
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anySpan = span as any

      const settings = this.req.customer.arizeSettings
      const spaceId =
        settings?.spaceId || this.fastify.config.services.arize.spaceId
      const apiKey =
        settings?.apiKey || this.fastify.config.services.arize.apiKey
      const projectName =
        settings?.projectName ||
        this.fastify.config.services.arize.defaultProjectName

      if (anySpan.resource && anySpan.resource._attributes) {
        anySpan.resource._attributes.model_id = projectName
        if (anySpan.resource._syncAttributes) {
          anySpan.resource._syncAttributes.model_id = projectName
        }
      }

      const metadata = new Metadata()
      metadata.set('space_id', spaceId)
      metadata.set('api_key', apiKey)

      const newExporter = new GrpcOTLPTraceExporter({
        url: this.fastify.config.services.arize.endpoint,
        metadata,
      })

      const newProcessor = new BatchSpanProcessor(newExporter, {
        exportTimeoutMillis: 60000,
        maxQueueSize: 4096,
        maxExportBatchSize: 2000,
      })

      if (
        !anySpan._spanProcessor ||
        !Array.isArray(anySpan._spanProcessor._spanProcessors)
      ) {
        this.fastify.log.warn(
          'Could not access span processors for customer-specific configuration',
        )

        return
      }

      let consoleProcessor = undefined
      for (const processor of anySpan._spanProcessor._spanProcessors) {
        if (
          processor._exporter &&
          processor._exporter.constructor &&
          processor._exporter.constructor.name === 'ConsoleSpanExporter'
        ) {
          consoleProcessor = processor
          break
        }
      }

      anySpan._spanProcessor._spanProcessors = consoleProcessor
        ? [consoleProcessor, newProcessor]
        : [newProcessor]
    } catch (error) {
      this.fastify.log.error('Error configuring span exporter', error)
    }
  }
}
