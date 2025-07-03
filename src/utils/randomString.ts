export function randomNumberString(length: number): string {
  let result = ''

  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10)
  }

  return result
}

export function randomString(length: number): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }

  return result
}
