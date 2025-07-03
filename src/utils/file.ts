export function isEncoded(uri) {
  uri = uri || ''

  return uri !== decodeURIComponent(uri)
}
