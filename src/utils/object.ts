import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import mapKeys from 'lodash/mapKeys'
import mapValues from 'lodash/mapValues'
import snakeCase from 'lodash/snakeCase'

export function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : ''

    if (typeof obj[k] === 'object' && obj[k] !== null) {
      Object.assign(acc, flattenObject(obj[k], pre + k))
    } else {
      acc[pre + k] = obj[k]
    }

    return acc
  }, {})
}

export function transformKeysToSnakeCase(obj: unknown) {
  if (isArray(obj)) {
    return obj.map(transformKeysToSnakeCase)
  } else if (isObject(obj) && !isFunction(obj)) {
    return mapValues(
      mapKeys(obj, (value, key) => snakeCase(key)),
      transformKeysToSnakeCase,
    )
  }

  return obj
}
