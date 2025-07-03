import { BadRequest } from 'http-errors'
import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'

const methodTypes = [
  'search',
  'get',
  'create',
  'update',
  'delete',
  'object',
  'upload',
]

export const DefaultIdParam = {
  type: 'object',
  properties: {
    id: {
      anyOf: [{ type: 'string' }, { type: 'number' }],
    },
  },
}

export const DefaultTypeParam = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
  },
}

export const DefaultQuerystring = {
  type: 'object',
  properties: {
    query: {
      type: 'string',
    },
    filter: {
      type: 'object',
      additionalProperties: true,
    },
    select: {
      type: 'string',
    },
    sort: {
      type: 'string',
    },
    populate: { $ref: '#/definitions/populate' },
    limit: {
      type: 'number',
    },
    offset: {
      type: 'number',
    },
    filters: {
      type: 'object',
      additionalProperties: true,
    },
  },
  definitions: {
    populate: {
      anyOf: [
        { type: 'null' },
        { type: 'string' },
        { type: 'object', additionalProperties: true },
        { type: 'array', items: { $ref: '#/definitions/populate' } },
      ],
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
}

export const ModelCsvDownloadRequiredFields = ['model', 'fields']

export function getRequestBodySchema(
  schema,
  methodType: 'create' | 'search' | 'get' | 'update' | 'delete' | 'object',
  requiredFields?: string[],
  asArray = false,
) {
  if (methodType === 'create' && !requiredFields) {
    throw new BadRequest('Required fields for CreationSchema missing')
  }

  if (!methodTypes.includes(methodType)) {
    throw new BadRequest('JSON Schema Error: No valid method type given.')
  }

  if (asArray) {
    const newSchema = cloneDeep(schema)

    return getRequestBodySchema(
      {
        $id: newSchema.$id,
        type: 'array',
        definitions: newSchema.definitions,
        items: omit(newSchema, ['$id', 'definitions']),
      },
      methodType,
      requiredFields,
    )
  }

  switch (methodType) {
    case 'search':
    case 'get':
    case 'delete':
      return undefined
    case 'create':
      return {
        type: 'object',
        ...schema,
        required: requiredFields,
      }
    case 'update':
    default:
      return schema
  }
}

export function getResponseBodySchema(schema, methodType: string) {
  if (!methodTypes.includes(methodType)) {
    throw new BadRequest('JSON Schema Error: No valid method type given.')
  }
  switch (methodType) {
    case 'search':
      return {
        type: 'object',
        $id: schema.$id,
        definitions: schema.definitions,
        properties: {
          data: {
            type: 'array',
            items: omit(schema, ['$id', 'definitions']),
          },
          count: {
            type: 'number',
          },
          success: {
            type: 'boolean',
          },
        },
      }
    case 'upload':
      return {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: schema,
          },
          success: {
            type: 'boolean',
          },
        },
      }
    case 'object':
    case 'get':
    case 'create':
    case 'update':
    case 'delete':
    default:
      return schema
  }
}
