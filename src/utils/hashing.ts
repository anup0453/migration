import { createHash } from 'crypto'

export function hashText(content) {
  const resultHash = createHash('md5')
  resultHash.update(content)

  return resultHash.digest('hex')
}
