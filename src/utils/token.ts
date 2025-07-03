import { get_encoding } from 'tiktoken'

export function getTokenCount(text: string): number {
  const encoding = get_encoding('cl100k_base')
  const tokenCount = encoding.encode(text).length

  return tokenCount
}
