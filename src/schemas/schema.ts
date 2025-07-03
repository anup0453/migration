export const AgentSchema = {
  description:
    'Lean version of AgentDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `AgentDocument.toObject()`. To avoid conflicts with model names, use the type alias `AgentObject`.\n```\nconst agentObject = agent.toObject();\n```',
  type: 'object',
  properties: {
    apiKey: { type: 'string' },
    bindTools: {
      type: 'array',
      items: {
        description:
          'Lean version of AgentBindToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `AgentDocument.toObject()`.\n```\nconst agentObject = agent.toObject();\n```',
        type: 'object',
        properties: {
          agentToolApiKey: { type: 'string' },
          agentToolName: { type: 'string' },
          description: { type: 'string' },
          type: { enum: ['bing', 'rag'], type: 'string' },
          _id: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    description: { type: 'string' },
    displayName: { type: 'string' },
    isActive: { type: 'boolean' },
    iterationLimit: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    owner: {
      anyOf: [
        { type: 'string' },
        {
          $ref: 'Agent#/definitions/Customer',
          description:
            'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
        },
      ],
    },
    settings: {
      type: 'object',
      properties: {
        agentApiVersion: { type: 'string' },
        agentDeploymentName: { type: 'string' },
      },
      additionalProperties: false,
    },
    systemMessage: { type: 'string' },
    type: { enum: ['custom', 'react'], type: 'string' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'Agent#/definitions/ArrayBuffer' },
        { $ref: 'Agent#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': { $ref: 'Agent#/definitions/SharedArrayBuffer' },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'Agent#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'Agent#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'Agent#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Agent',
}

export const AgentRequiredFields = [
  'apiKey',
  'bindTools',
  'description',
  'displayName',
  'iterationLimit',
  'owner',
  'settings',
  'systemMessage',
  'type',
]

export const ChargeSchema = {
  description:
    'Lean version of ChargeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `ChargeDocument.toObject()`. To avoid conflicts with model names, use the type alias `ChargeObject`.\n```\nconst chargeObject = charge.toObject();\n```',
  type: 'object',
  properties: {
    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    chargedAt: { type: 'string', format: 'date-time' },
    customer: {
      anyOf: [
        { type: 'string' },
        {
          $ref: 'Charge#/definitions/Customer',
          description:
            'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
        },
      ],
    },
    from: { type: 'string', format: 'date-time' },
    items: {
      type: 'array',
      items: {
        description:
          'Lean version of ChargeItemDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `ChargeDocument.toObject()`.\n```\nconst chargeObject = charge.toObject();\n```',
        type: 'object',
        properties: {
          amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
          chargeType: { enum: ['oneTime', 'recurring'], type: 'string' },
          description: { type: 'string' },
          quantity: { anyOf: [{ type: 'number' }, { type: 'null' }] },
          type: { type: 'string' },
          _id: { type: 'string' },
        },
        additionalProperties: false,
      },
    },
    payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    payAsYouGoStatus: { type: 'string' },
    to: { type: 'string', format: 'date-time' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'Charge#/definitions/ArrayBuffer' },
        { $ref: 'Charge#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': { $ref: 'Charge#/definitions/SharedArrayBuffer' },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'Charge#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'Charge#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'Charge#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Charge',
}

export const ChargeRequiredFields = ['customer', 'items']

export const ChatRequestSchema = {
  description:
    'Lean version of ChatRequestDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `ChatRequestDocument.toObject()`. To avoid conflicts with model names, use the type alias `ChatRequestObject`.\n```\nconst chatrequestObject = chatrequest.toObject();\n```',
  type: 'object',
  properties: {
    calcTotalPrice: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    chargedAt: { type: 'string', format: 'date-time' },
    customer: {
      anyOf: [
        { type: 'string' },
        {
          $ref: 'ChatRequest#/definitions/Customer',
          description:
            'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
        },
      ],
    },
    incomingTokenCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    incomingTokenCountDetails: {
      description:
        'Lean version of ChatRequestIncomingTokenCountDetailDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `ChatRequestDocument.toObject()`.\n```\nconst chatrequestObject = chatrequest.toObject();\n```',
      type: 'object',
      properties: {
        acceptedPredictionTokens: {
          anyOf: [{ type: 'number' }, { type: 'null' }],
        },
        reasoningTokens: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        audioTokens: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        rejectedPredictionTokens: {
          anyOf: [{ type: 'number' }, { type: 'null' }],
        },
      },
      additionalProperties: false,
    },
    numRequests: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    outgoingTokenCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    outgoingTokenCountDetails: {
      description:
        'Lean version of ChatRequestOutgoingTokenCountDetailDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `ChatRequestDocument.toObject()`.\n```\nconst chatrequestObject = chatrequest.toObject();\n```',
      type: 'object',
      properties: {
        audioTokens: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        cachedTokens: { anyOf: [{ type: 'number' }, { type: 'null' }] },
      },
      additionalProperties: false,
    },
    type: { enum: ['external', 'internal', 'plain'], type: 'string' },
    usedGPTModel: {
      anyOf: [
        { type: 'string' },
        {
          description:
            'Lean version of LargeLanguageModelVersionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `LargeLanguageModelVersionDocument.toObject()`. To avoid conflicts with model names, use the type alias `LargeLanguageModelVersionObject`.\n```\nconst largelanguagemodelversionObject = largelanguagemodelversion.toObject();\n```',
          type: 'object',
          properties: {
            description: { type: 'string' },
            maxTokens: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            name: { type: 'string' },
            pricePerIncomingToken: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            pricePerOutgoingToken: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            pricePerCachedOutgoingToken: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            validFrom: { type: 'string', format: 'date-time' },
            validUntil: { type: 'string', format: 'date-time' },
            _id: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          additionalProperties: false,
        },
      ],
    },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'ChatRequest#/definitions/ArrayBuffer' },
        { $ref: 'ChatRequest#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'ChatRequest#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'ChatRequest#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'ChatRequest#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'ChatRequest#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'ChatRequest',
}

export const ChatRequestRequiredFields = [
  'customer',
  'incomingTokenCount',
  'outgoingTokenCount',
  'usedGPTModel',
]

export const CustomChargeSchema = {
  description:
    'Lean version of CustomChargeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomChargeDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomChargeObject`.\n```\nconst customchargeObject = customcharge.toObject();\n```',
  type: 'object',
  properties: {
    calcTotalPrice: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    chargeableAt: { type: 'string', format: 'date-time' },
    chargedAt: { type: 'string', format: 'date-time' },
    customer: {
      anyOf: [
        { type: 'string' },
        {
          $ref: 'CustomCharge#/definitions/Customer',
          description:
            'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
        },
      ],
    },
    description: { type: 'string' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'CustomCharge#/definitions/ArrayBuffer' },
        { $ref: 'CustomCharge#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'CustomCharge#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'CustomCharge#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'CustomCharge#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'CustomCharge#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'CustomCharge',
}

export const CustomChargeRequiredFields = ['customer']

export const CustomerSchema = {
  $ref: 'Customer#/definitions/Customer',
  description:
    'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'Customer#/definitions/ArrayBuffer' },
        { $ref: 'Customer#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': { $ref: 'Customer#/definitions/SharedArrayBuffer' },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'Customer#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'Customer#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'Customer#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Customer',
}

export const CustomerRequiredFields = []

export const SearchCustomerSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        $ref: 'SearchCustomer#/definitions/Customer',
        description:
          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      },
    },
    count: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    success: { type: 'boolean' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'SearchCustomer#/definitions/ArrayBuffer' },
        { $ref: 'SearchCustomer#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'SearchCustomer#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'SearchCustomer#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'SearchCustomer#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'SearchCustomer#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'SearchCustomer',
}

export const SearchCustomerRequiredFields = ['count', 'data']

export const DatasourceSchema = {
  $ref: 'Datasource#/definitions/Datasource',
  description:
    'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'Datasource#/definitions/ArrayBuffer' },
        { $ref: 'Datasource#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': { $ref: 'Datasource#/definitions/SharedArrayBuffer' },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'Datasource#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'Datasource#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'Datasource#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Datasource',
}

export const DatasourceRequiredFields = []

export const EmbeddingSchema = {
  description:
    'Lean version of EmbeddingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `EmbeddingDocument.toObject()`. To avoid conflicts with model names, use the type alias `EmbeddingObject`.\n```\nconst embeddingObject = embedding.toObject();\n```',
  type: 'object',
  properties: {
    calcTotalPrice: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    chargedAt: { type: 'string', format: 'date-time' },
    customer: {
      anyOf: [
        { type: 'string' },
        {
          $ref: 'Embedding#/definitions/Customer',
          description:
            'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
        },
      ],
    },
    incomingTokenCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    numRequests: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    type: {
      enum: ['indexation', 'manual', 'plain', 'request'],
      type: 'string',
    },
    usedModel: {
      anyOf: [
        { type: 'string' },
        {
          description:
            'Lean version of EmbeddingModelVersionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `EmbeddingModelVersionDocument.toObject()`. To avoid conflicts with model names, use the type alias `EmbeddingModelVersionObject`.\n```\nconst embeddingmodelversionObject = embeddingmodelversion.toObject();\n```',
          type: 'object',
          properties: {
            description: { type: 'string' },
            name: { type: 'string' },
            pricePerToken: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            validFrom: { type: 'string', format: 'date-time' },
            validUntil: { type: 'string', format: 'date-time' },
            _id: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          additionalProperties: false,
        },
      ],
    },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'Embedding#/definitions/ArrayBuffer' },
        { $ref: 'Embedding#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': { $ref: 'Embedding#/definitions/SharedArrayBuffer' },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'Embedding#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'Embedding#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'Embedding#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Embedding',
}

export const EmbeddingRequiredFields = [
  'calcTotalPrice',
  'customer',
  'incomingTokenCount',
  'usedModel',
]

export const EmbeddingModelVersionSchema = {
  description:
    'Lean version of EmbeddingModelVersionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `EmbeddingModelVersionDocument.toObject()`. To avoid conflicts with model names, use the type alias `EmbeddingModelVersionObject`.\n```\nconst embeddingmodelversionObject = embeddingmodelversion.toObject();\n```',
  type: 'object',
  properties: {
    description: { type: 'string' },
    name: { type: 'string' },
    pricePerToken: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    validFrom: { type: 'string', format: 'date-time' },
    validUntil: { type: 'string', format: 'date-time' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'EmbeddingModelVersion#/definitions/ArrayBuffer' },
        { $ref: 'EmbeddingModelVersion#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'EmbeddingModelVersion#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'EmbeddingModelVersion',
}

export const EmbeddingModelVersionRequiredFields = ['name', 'pricePerToken']

export const ImportSchema = {
  description:
    'Lean version of ImportDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `ImportDocument.toObject()`. To avoid conflicts with model names, use the type alias `ImportObject`.\n```\nconst importObject = import.toObject();\n```',
  type: 'object',
  properties: {
    archiveDate: { type: 'string', format: 'date-time' },
    azureFileId: { type: 'string' },
    chunkFiles: { type: 'array', items: { type: 'string' } },
    contentHash: { type: 'string' },
    datasource: {
      anyOf: [
        { type: 'string' },
        {
          $ref: 'Import#/definitions/Datasource',
          description:
            'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
        },
      ],
    },
    extractedAt: { type: 'string', format: 'date-time' },
    extractionLog: { type: 'string' },
    fileName: { type: 'string' },
    filePath: { type: 'string' },
    index: { type: 'string' },
    isArchived: { type: 'boolean' },
    mimeType: { type: 'string' },
    status: {
      enum: [
        'failed',
        'pending',
        'removed',
        'trained',
        'training',
        'untrained',
        'untraining',
        'uploaded',
      ],
      type: 'string',
    },
    type: { enum: ['file', 'website'], type: 'string' },
    uploadType: { enum: ['crawler', 'manual', 'pipeline'], type: 'string' },
    urlFileName: { type: 'string' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'Import#/definitions/ArrayBuffer' },
        { $ref: 'Import#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': { $ref: 'Import#/definitions/SharedArrayBuffer' },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'Import#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'Import#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'Import#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Import',
}

export const ImportRequiredFields = ['chunkFiles', 'fileName']

export const InternalToolSchema = {
  $ref: 'InternalTool#/definitions/InternalTool',
  description:
    'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'InternalTool#/definitions/ArrayBuffer' },
        { $ref: 'InternalTool#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'InternalTool#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'InternalTool#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'InternalTool#/definitions/InternalTool',
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'InternalTool#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    InternalTool: {
      description:
        'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
      type: 'object',
      properties: {
        description: { type: 'string' },
        displayName: { type: 'string' },
        isActive: { type: 'boolean' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'InternalTool#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            bingSearch: {
              description:
                'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
              type: 'object',
              properties: {
                language: { type: 'string' },
                numberRecords: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
              },
              additionalProperties: false,
            },
            snowflake: {
              description:
                'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
              type: 'object',
              properties: {
                account: { type: 'string' },
                customerPrivateKey: { type: 'string' },
                database: { type: 'string' },
                passphrase: { type: 'string' },
                role: { type: 'string' },
                table: { type: 'array', items: { type: 'string' } },
                username: { type: 'string' },
                warehouse: { type: 'string' },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'InternalTool',
}

export const InternalToolRequiredFields = []

export const InternalToolCallSchema = {
  description:
    'Lean version of InternalToolCallDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolCallDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolCallObject`.\n```\nconst internaltoolcallObject = internaltoolcall.toObject();\n```',
  type: 'object',
  properties: {
    calcTotalPrice: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    chargedAt: { type: 'string', format: 'date-time' },
    numRequests: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    customer: {
      anyOf: [
        { type: 'string' },
        {
          $ref: 'InternalToolCall#/definitions/Customer',
          description:
            'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
        },
      ],
    },
    internalTool: {
      anyOf: [
        { type: 'string' },
        {
          $ref: 'InternalToolCall#/definitions/Datasource',
          description:
            'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
        },
      ],
    },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'InternalToolCall#/definitions/ArrayBuffer' },
        { $ref: 'InternalToolCall#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'InternalToolCall#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'InternalToolCall#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'InternalToolCall#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'InternalToolCall#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'InternalToolCall',
}

export const InternalToolCallRequiredFields = ['customer', 'numRequests']

export const LargeLanguageModelVersionSchema = {
  description:
    'Lean version of LargeLanguageModelVersionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `LargeLanguageModelVersionDocument.toObject()`. To avoid conflicts with model names, use the type alias `LargeLanguageModelVersionObject`.\n```\nconst largelanguagemodelversionObject = largelanguagemodelversion.toObject();\n```',
  type: 'object',
  properties: {
    description: { type: 'string' },
    maxTokens: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    name: { type: 'string' },
    pricePerIncomingToken: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    pricePerOutgoingToken: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    pricePerCachedOutgoingToken: {
      anyOf: [{ type: 'number' }, { type: 'null' }],
    },
    validFrom: { type: 'string', format: 'date-time' },
    validUntil: { type: 'string', format: 'date-time' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'LargeLanguageModelVersion#/definitions/ArrayBuffer' },
        { $ref: 'LargeLanguageModelVersion#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'LargeLanguageModelVersion#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'LargeLanguageModelVersion',
}

export const LargeLanguageModelVersionRequiredFields = [
  'name',
  'pricePerCachedOutgoingToken',
  'pricePerIncomingToken',
  'pricePerOutgoingToken',
]

export const MigrationSchema = {
  description:
    'Lean version of MigrationDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `MigrationDocument.toObject()`. To avoid conflicts with model names, use the type alias `MigrationObject`.\n```\nconst migrationObject = migration.toObject();\n```',
  type: 'object',
  properties: {
    indexName: { type: 'string' },
    name: { type: 'string' },
    object: { type: 'string' },
    status: { enum: ['completed', 'failed', 'running'], type: 'string' },
    type: { enum: ['AI SEARCH', 'DATABASE'], type: 'string' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'Migration#/definitions/ArrayBuffer' },
        { $ref: 'Migration#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': { $ref: 'Migration#/definitions/SharedArrayBuffer' },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Migration',
}

export const MigrationRequiredFields = ['name', 'status', 'type']

export const ModelDeploymentSchema = {
  description:
    'Lean version of ModelDeploymentDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `ModelDeploymentDocument.toObject()`. To avoid conflicts with model names, use the type alias `ModelDeploymentObject`.\n```\nconst modeldeploymentObject = modeldeployment.toObject();\n```',
  type: 'object',
  properties: {
    deploymentName: { type: 'string' },
    endpoint: { type: 'string' },
    instanceName: { type: 'string' },
    isPTU: { type: 'boolean' },
    key: { type: 'string' },
    modelName: { type: 'string' },
    modelVersion: { type: 'string' },
    openAiVersion: { type: 'string' },
    region: {
      enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
      type: 'string',
    },
    type: { enum: ['embedding', 'llm'], type: 'string' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'ModelDeployment#/definitions/ArrayBuffer' },
        { $ref: 'ModelDeployment#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'ModelDeployment#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'ModelDeployment',
}

export const ModelDeploymentRequiredFields = [
  'deploymentName',
  'endpoint',
  'instanceName',
  'isPTU',
  'key',
  'modelName',
  'modelVersion',
  'openAiVersion',
  'region',
  'type',
]

export const SubscriptionSchema = {
  description:
    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
  type: 'object',
  properties: {
    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    isActive: { type: 'boolean' },
    isDefault: { type: 'boolean' },
    name: { type: 'string' },
    periodInMonths: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    validFrom: { type: 'string', format: 'date-time' },
    validTo: { type: 'string', format: 'date-time' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'Subscription#/definitions/ArrayBuffer' },
        { $ref: 'Subscription#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'Subscription#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Subscription',
}

export const SubscriptionRequiredFields = ['name']

export const TranslationSchema = {
  description:
    'Lean version of TranslationDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `TranslationDocument.toObject()`. To avoid conflicts with model names, use the type alias `TranslationObject`.\n```\nconst translationObject = translation.toObject();\n```',
  type: 'object',
  properties: {
    calcTotalPrice: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    characterCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    chargedAt: { type: 'string', format: 'date-time' },
    costType: { enum: ['detection', 'translation'], type: 'string' },
    customer: {
      anyOf: [
        { type: 'string' },
        {
          $ref: 'Translation#/definitions/Customer',
          description:
            'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
        },
      ],
    },
    datasource: {
      anyOf: [
        { type: 'string' },
        {
          $ref: 'Translation#/definitions/Datasource',
          description:
            'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
        },
      ],
    },
    import: {
      anyOf: [
        { type: 'string' },
        {
          description:
            'Lean version of ImportDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `ImportDocument.toObject()`. To avoid conflicts with model names, use the type alias `ImportObject`.\n```\nconst importObject = import.toObject();\n```',
          type: 'object',
          properties: {
            archiveDate: { type: 'string', format: 'date-time' },
            azureFileId: { type: 'string' },
            chunkFiles: { type: 'array', items: { type: 'string' } },
            contentHash: { type: 'string' },
            datasource: {
              anyOf: [
                { type: 'string' },
                {
                  $ref: 'Translation#/definitions/Datasource',
                  description:
                    'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
                },
              ],
            },
            extractedAt: { type: 'string', format: 'date-time' },
            extractionLog: { type: 'string' },
            fileName: { type: 'string' },
            filePath: { type: 'string' },
            index: { type: 'string' },
            isArchived: { type: 'boolean' },
            mimeType: { type: 'string' },
            status: {
              enum: [
                'failed',
                'pending',
                'removed',
                'trained',
                'training',
                'untrained',
                'untraining',
                'uploaded',
              ],
              type: 'string',
            },
            type: { enum: ['file', 'website'], type: 'string' },
            uploadType: {
              enum: ['crawler', 'manual', 'pipeline'],
              type: 'string',
            },
            urlFileName: { type: 'string' },
            _id: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          additionalProperties: false,
        },
      ],
    },
    sourceLanguage: { type: 'string' },
    targetLanguage: { type: 'string' },
    usedModel: {
      anyOf: [
        { type: 'string' },
        {
          description:
            'Lean version of TranslationModelVersionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `TranslationModelVersionDocument.toObject()`. To avoid conflicts with model names, use the type alias `TranslationModelVersionObject`.\n```\nconst translationmodelversionObject = translationmodelversion.toObject();\n```',
          type: 'object',
          properties: {
            description: { type: 'string' },
            name: { type: 'string' },
            pricePerCharacter: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            validFrom: { type: 'string', format: 'date-time' },
            validUntil: { type: 'string', format: 'date-time' },
            _id: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          additionalProperties: false,
        },
      ],
    },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'Translation#/definitions/ArrayBuffer' },
        { $ref: 'Translation#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'Translation#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
    Customer: {
      description:
        'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
      type: 'object',
      properties: {
        aiSearch: {
          description:
            'Lean version of CustomerAiSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            datasourceName: { type: 'string' },
            directIndex: { type: 'boolean' },
            endpoint: { type: 'string' },
            indexerName: { type: 'string' },
            indexingStatus: { type: 'string' },
            indexName: { type: 'string' },
            lastIndexing: { type: 'string', format: 'date-time' },
            scoringProfile: { type: 'string' },
            skillsetName: {
              enum: [
                'embedding-skillset',
                'embeddings-relativepath-skillset',
                'extract-relative-path',
              ],
              type: 'string',
            },
          },
          additionalProperties: false,
        },
        apiKeys: {
          type: 'array',
          items: {
            description:
              'Lean version of CustomerApiKeyDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
            type: 'object',
            properties: {
              description: { type: 'string' },
              key: { type: 'string' },
              validFrom: { type: 'string', format: 'date-time' },
              validTo: { type: 'string', format: 'date-time' },
              _id: { type: 'string' },
            },
            additionalProperties: false,
          },
        },
        arizeSettings: {
          description:
            'Lean version of CustomerArizeSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            apiKey: { type: 'string' },
            projectName: { type: 'string' },
            spaceId: { type: 'string' },
            tracingEnabled: { type: 'boolean' },
          },
          additionalProperties: false,
        },
        billing: {
          description:
            'Lean version of CustomerBillingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            orgId: { type: 'string' },
            payAsYouGoId: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            position: { type: 'string' },
            psp: { type: 'string' },
            reference: { type: 'string' },
          },
          additionalProperties: false,
        },
        datasources: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                $ref: 'Translation#/definitions/Datasource',
                description:
                  'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              },
            ],
          },
        },
        frontendSettings: {
          description:
            'Lean version of CustomerFrontendSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            filterButtons: {
              type: 'array',
              items: {
                description:
                  'Lean version of CustomerFrontendSettingFilterButtonDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerFrontendSettingDocument.toObject()`.\n```\nconst customerfrontendsettingObject = customerfrontendsetting.toObject();\n```',
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  fieldType: { enum: ['ChoiceSet', 'Default'], type: 'string' },
                  filter: { type: 'array', items: { type: 'string' } },
                  isMultiSelect: { type: 'boolean' },
                  keywords: { type: 'array', items: { type: 'string' } },
                  level: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                  placeholder: { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            hintTextButtonText: { type: 'string' },
            historyResetMessage: { type: 'string' },
            termsOfUseText: { type: 'string' },
            welcomeSystemMessage: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalStorage: {
          type: 'object',
          properties: {
            connectionString: { type: 'string' },
            containerName: { type: 'string' },
          },
          additionalProperties: false,
        },
        internalTools: {
          type: 'array',
          items: {
            anyOf: [
              { type: 'string' },
              {
                description:
                  'Lean version of InternalToolDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`. To avoid conflicts with model names, use the type alias `InternalToolObject`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  displayName: { type: 'string' },
                  isActive: { type: 'boolean' },
                  owner: {
                    anyOf: [
                      { type: 'string' },
                      {
                        $ref: 'Translation#/definitions/Customer',
                        description:
                          'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
                      },
                    ],
                  },
                  settings: {
                    type: 'object',
                    properties: {
                      bingSearch: {
                        description:
                          'Lean version of InternalToolSettingsBingSearchDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          language: { type: 'string' },
                          numberRecords: {
                            anyOf: [{ type: 'number' }, { type: 'null' }],
                          },
                        },
                        additionalProperties: false,
                      },
                      snowflake: {
                        description:
                          'Lean version of InternalToolSettingsSnowflakeDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `InternalToolDocument.toObject()`.\n```\nconst internaltoolObject = internaltool.toObject();\n```',
                        type: 'object',
                        properties: {
                          account: { type: 'string' },
                          customerPrivateKey: { type: 'string' },
                          database: { type: 'string' },
                          passphrase: { type: 'string' },
                          role: { type: 'string' },
                          table: { type: 'array', items: { type: 'string' } },
                          username: { type: 'string' },
                          warehouse: { type: 'string' },
                        },
                        additionalProperties: false,
                      },
                    },
                    additionalProperties: false,
                  },
                  type: { enum: ['bingSearch', 'snowflake'], type: 'string' },
                  _id: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
                additionalProperties: false,
              },
            ],
          },
        },
        ipFilteringSettings: {
          description:
            'Lean version of CustomerIpFilteringSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            blockingMode: { enum: ['block', 'log'], type: 'string' },
            isIpFilteringEnabled: { type: 'boolean' },
            whitelistedIpsArray: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
        },
        isActive: { type: 'boolean' },
        name: { type: 'string' },
        settings: {
          description:
            'Lean version of CustomerSettingDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            defaultEmbeddingVersion: { type: 'string' },
            defaultGptVersion: { type: 'string' },
            dynamicNActive: { type: 'boolean' },
            frequencyPenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            generateSearchQuerySystemMessage: { type: 'string' },
            historyCount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            ignoreOpenAIParamsInBody: { type: 'boolean' },
            includeDateContext: { type: 'boolean' },
            loadBalancerRegion: {
              enum: ['americas', 'apac', 'emea', 'none', 'worldwide'],
              type: 'string',
            },
            maxResponseTokens: {
              anyOf: [{ type: 'number' }, { type: 'null' }],
            },
            presencePenalty: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            reactOnUserMessageSystemMessage: { type: 'string' },
            sourceFilterActive: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            sourceLinkInstructionSystemMessage: { type: 'string' },
            stop: { type: 'array', items: { type: 'string' } },
            summarizeConversationSystemMessage: { type: 'string' },
            temperature: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topN: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            topP: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            _id: { type: 'string' },
          },
          additionalProperties: false,
        },
        subscription: {
          description:
            'Lean version of CustomerSubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`.\n```\nconst customerObject = customer.toObject();\n```',
          type: 'object',
          properties: {
            end: { type: 'string', format: 'date-time' },
            isChargeable: { type: 'boolean' },
            lastChargedAt: { type: 'string', format: 'date-time' },
            nextChargedAt: { type: 'string', format: 'date-time' },
            paused: { type: 'boolean' },
            start: { type: 'string', format: 'date-time' },
            type: {
              anyOf: [
                { type: 'string' },
                {
                  description:
                    'Lean version of SubscriptionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `SubscriptionDocument.toObject()`. To avoid conflicts with model names, use the type alias `SubscriptionObject`.\n```\nconst subscriptionObject = subscription.toObject();\n```',
                  type: 'object',
                  properties: {
                    amount: { anyOf: [{ type: 'number' }, { type: 'null' }] },
                    isActive: { type: 'boolean' },
                    isDefault: { type: 'boolean' },
                    name: { type: 'string' },
                    periodInMonths: {
                      anyOf: [{ type: 'number' }, { type: 'null' }],
                    },
                    validFrom: { type: 'string', format: 'date-time' },
                    validTo: { type: 'string', format: 'date-time' },
                    _id: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
          additionalProperties: false,
        },
        type: { type: 'string' },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
    Datasource: {
      description:
        'Lean version of DatasourceDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`. To avoid conflicts with model names, use the type alias `DatasourceObject`.\n```\nconst datasourceObject = datasource.toObject();\n```',
      type: 'object',
      properties: {
        chunkingPriority: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        consecutiveErrors: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        displayName: { type: 'string' },
        forceCleanParsing: { type: 'boolean' },
        frequency: { type: 'string' },
        indexingStatus: {
          enum: [
            'error',
            'priorityRestart',
            'processed',
            'processing',
            'queued',
          ],
          type: 'string',
        },
        isActive: { type: 'boolean' },
        keywords: { type: 'array', items: { type: 'string' } },
        lastIndexing: { type: 'string', format: 'date-time' },
        owner: {
          anyOf: [
            { type: 'string' },
            {
              $ref: 'Translation#/definitions/Customer',
              description:
                'Lean version of CustomerDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `CustomerDocument.toObject()`. To avoid conflicts with model names, use the type alias `CustomerObject`.\n```\nconst customerObject = customer.toObject();\n```',
            },
          ],
        },
        settings: {
          type: 'object',
          properties: {
            chunkOverlap: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            chunkSize: { anyOf: [{ type: 'number' }, { type: 'null' }] },
            defaultLanguage: { type: 'string' },
            delimiters: { type: 'array', items: { type: 'string' } },
            excludeByRegex: { type: 'array', items: { type: 'string' } },
            includeByRegex: { type: 'array', items: { type: 'string' } },
            ocrActive: { type: 'boolean' },
            preventXMLToJSON: { type: 'boolean' },
            sourceLinkActive: { type: 'boolean' },
            textSplitterStrategy: {
              enum: ['delimiter', 'token'],
              type: 'string',
            },
            translationActive: { type: 'boolean' },
            useMarkdown: { type: 'boolean' },
            azureBlobStorage: {
              description:
                'Lean version of DatasourceSettingsAzureBlobStorageDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                blobBaseUrl: { type: 'string' },
                blobSasToken: { type: 'string' },
                connectionString: { type: 'string' },
                containerName: { type: 'string' },
              },
              additionalProperties: false,
            },
            website: {
              description:
                'Lean version of DatasourceSettingsWebsiteDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                contentCssSelectors: {
                  type: 'array',
                  items: { type: 'string' },
                },
                crawlCssSelectors: { type: 'array', items: { type: 'string' } },
                lazyLoadingEnforced: { type: 'boolean' },
                recursionDepth: {
                  anyOf: [{ type: 'number' }, { type: 'null' }],
                },
                rootUrls: { type: 'array', items: { type: 'string' } },
                scrollableElementSelector: { type: 'string' },
                urlWhiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            sharepoint: {
              description:
                'Lean version of DatasourceSettingsSharepointDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                elements: {
                  type: 'array',
                  items: { enum: ['lists', 'pages'], type: 'string' },
                },
                pageWhiteList: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' },
                whiteList: { type: 'array', items: { type: 'string' } },
              },
              additionalProperties: false,
            },
            polarion: {
              description:
                'Lean version of DatasourceSettingsPolarionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                endpoint: { type: 'string' },
                fields: { type: 'array', items: { type: 'string' } },
                project: { type: 'string' },
                query: { type: 'string' },
              },
              additionalProperties: false,
            },
            api: {
              description:
                'Lean version of DatasourceSettingsApiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: {
                authorizationHeader: { type: 'string' },
                endpoint: { type: 'string' },
                excludeFields: { type: 'array', items: { type: 'string' } },
                extraHeaders: {
                  type: 'array',
                  items: {
                    description:
                      'Lean version of DatasourceSettingsApiExtraHeaderDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceSettingsApiDocument.toObject()`.\n```\nconst datasourcesettingsapiObject = datasourcesettingsapi.toObject();\n```',
                    type: 'object',
                    properties: {
                      key: { type: 'string' },
                      value: { type: 'string' },
                    },
                    additionalProperties: false,
                  },
                },
                fileNameField: { type: 'string' },
                filePathField: { type: 'string' },
                includeFields: { type: 'array', items: { type: 'string' } },
                payloadField: { type: 'string' },
                updatedAtField: { type: 'string' },
              },
              additionalProperties: false,
            },
            wiki: {
              description:
                'Lean version of DatasourceSettingsWikiDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `DatasourceDocument.toObject()`.\n```\nconst datasourceObject = datasource.toObject();\n```',
              type: 'object',
              properties: { baseUrl: { type: 'string' } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        type: {
          enum: [
            'api',
            'azureBlobStorage',
            'polarion',
            'sharepoint',
            'website',
            'wiki',
          ],
          type: 'string',
        },
        _id: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'Translation',
}

export const TranslationRequiredFields = [
  'characterCount',
  'customer',
  'datasource',
  'import',
  'usedModel',
]

export const TranslationModelVersionSchema = {
  description:
    'Lean version of TranslationModelVersionDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `TranslationModelVersionDocument.toObject()`. To avoid conflicts with model names, use the type alias `TranslationModelVersionObject`.\n```\nconst translationmodelversionObject = translationmodelversion.toObject();\n```',
  type: 'object',
  properties: {
    description: { type: 'string' },
    name: { type: 'string' },
    pricePerCharacter: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    validFrom: { type: 'string', format: 'date-time' },
    validUntil: { type: 'string', format: 'date-time' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'TranslationModelVersion#/definitions/ArrayBuffer' },
        { $ref: 'TranslationModelVersion#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': {
          $ref: 'TranslationModelVersion#/definitions/SharedArrayBuffer',
        },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'TranslationModelVersion',
}

export const TranslationModelVersionRequiredFields = [
  'name',
  'pricePerCharacter',
]

export const UserSchema = {
  description:
    'Lean version of UserDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `UserDocument.toObject()`. To avoid conflicts with model names, use the type alias `UserObject`.\n```\nconst userObject = user.toObject();\n```',
  type: 'object',
  properties: {
    apiKey: { type: 'string' },
    departments: { type: 'array', items: { type: 'string' } },
    email: { type: 'string' },
    firstname: { type: 'string' },
    isActive: { type: 'boolean' },
    lastname: { type: 'string' },
    role: { type: 'string' },
    _id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'User#/definitions/ArrayBuffer' },
        { $ref: 'User#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': { $ref: 'User#/definitions/SharedArrayBuffer' },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'User',
}

export const UserRequiredFields = ['departments', 'email']

export const SearchUserSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        description:
          'Lean version of UserDocument\n\nThis has all Mongoose getters & functions removed. This type will be returned from `UserDocument.toObject()`. To avoid conflicts with model names, use the type alias `UserObject`.\n```\nconst userObject = user.toObject();\n```',
        type: 'object',
        properties: {
          apiKey: { type: 'string' },
          departments: { type: 'array', items: { type: 'string' } },
          email: { type: 'string' },
          firstname: { type: 'string' },
          isActive: { type: 'boolean' },
          lastname: { type: 'string' },
          role: { type: 'string' },
          _id: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        additionalProperties: false,
      },
    },
    count: { anyOf: [{ type: 'number' }, { type: 'null' }] },
    success: { type: 'boolean' },
  },
  additionalProperties: false,
  definitions: {
    ArrayBufferLike: {
      anyOf: [
        { $ref: 'SearchUser#/definitions/ArrayBuffer' },
        { $ref: 'SearchUser#/definitions/SharedArrayBuffer' },
      ],
    },
    ArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@toStringTag@25': { type: 'string' },
      },
      additionalProperties: false,
    },
    SharedArrayBuffer: {
      type: 'object',
      properties: {
        byteLength: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        '__@species@474': { $ref: 'SearchUser#/definitions/SharedArrayBuffer' },
        '__@toStringTag@25': { type: 'string', const: 'SharedArrayBuffer' },
      },
      additionalProperties: false,
    },
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'SearchUser',
}

export const SearchUserRequiredFields = ['count', 'data']
