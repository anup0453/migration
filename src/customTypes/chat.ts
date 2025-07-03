import {
  ChatRequestAssistantMessage,
  ChatRequestSystemMessage,
  ChatRequestToolMessage,
  ChatRequestUserMessage,
} from '@azure/openai'

export interface IChatBody {
  msg:
    | ChatRequestAssistantMessage
    | ChatRequestUserMessage
    | ChatRequestToolMessage
    | ChatRequestSystemMessage
  history?: Array<
    | ChatRequestUserMessage
    | ChatRequestAssistantMessage
    | ChatRequestSystemMessage
  >
  tokenLimit?: number
  topN?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: [string]
  plainAOAI: boolean
  stream: boolean
}
