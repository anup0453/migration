import { ChatCompletions, ChatRequestMessageUnion } from '@azure/openai'

export interface ICompletionBody {
  prompt: string
  temperature?: number
  topN?: number
  stop?: string | string[]
  max_tokens?: number
  logprobs?: number
  echo?: boolean
  suffix?: string
  presence_penalty?: number
  frequency_penalty?: number
  user?: string
  best_of?: number
}

export interface IChatCompletions extends Omit<ChatCompletions, 'created'> {
  created?: number
  model?: string
  success?: boolean
  object?: string
}

export type IChatCompletionsSnakeCase = Omit<
  IChatCompletions,
  'usage, contentFilterResult'
>

export interface IChatCompletionBody {
  // OpenAI specific - https://platform.openai.com/docs/api-reference/chat
  messages: ChatRequestMessageUnion[]
  temperature?: number
  top_p?: number
  stop?: string | string[]
  max_tokens?: number
  presence_penalty?: number
  frequency_penalty?: number
  model?: string
  stream?: boolean
  tools?: []
  // GAIA specific
  internalTools?: string[]
  filter?: string[]
  keywords?: string[]
  filter_button?: string[]
  plainAOAI?: boolean
  topN?: number
  snakeCase?: boolean
  apiVersion?: string
}

export interface IOpenAiInstance {
  apiKey: string
  modelName: string
  instanceUrl: string
  instanceName: string
  deploymentName: string
  apiVersion: string
  isPtu: boolean
  region: string
}

export interface IOpenAiInstancesObject {
  [engine: string]: IOpenAiInstance[]
}

export interface IEngineParams {
  deploymentName: string
}

export interface IEmbeddingsBody {
  encoding_format: string
  input: string
  model: string
}

export interface IEmbeddingsResponse {
  object: 'list'
  data: {
    object: 'embedding'
    embedding: number[]
    index: number
  }[]
  model: string
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
}

// Todo: specify the type of the objects
export interface ISharedChatPrep {
  openAiRequestParams
  urlPlaceholderMap
  fileNameMap
  sourceIds
  snakeCase
  messages
  internalTools
  tools
  generatedQuestion
}
