const defaultPatterns = {
  email: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
  phone: '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b',
  ssn: '\\b\\d{3}-\\d{2}-\\d{4}\\b',
  credit_card: '\\b\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}\\b',
  ip_address: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b',
  gid: '\\b[Z](?:\\d{7}|[0-9A-Z]{6})\\b',
}

export function anonymizeText(text: string): string {
  let redacted = text

  const compiledPatterns = Object.fromEntries(
    Object.entries(defaultPatterns).map(([name, pattern]) => [
      name,
      new RegExp(pattern, 'g'),
    ]),
  )

  for (const [patternName, pattern] of Object.entries(compiledPatterns)) {
    redacted = redacted.replace(
      pattern,
      `[REDACTED_${patternName.toUpperCase()}]`,
    )
  }

  return redacted
}
