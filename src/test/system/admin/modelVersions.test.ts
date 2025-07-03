import { TestProps } from '../../customTypes/test'

const newLLMRequestBody = {
  name: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_MODEL_NAME,
  description: 'Test LLM  model',
  pricePerIncomingToken: 0.00003,
  pricePerOutgoingToken: 0.00003,
  pricePerCachedOutgoingToken: 0.00002,
  maxTokens: 1000,
}

const newEBMRequestBody = {
  name: 'anyEBM',
  description: 'Test embedding model',
  pricePerToken: 0.00003,
}

const newTLMRequestBody = {
  name: 'anyTLM',
  description: 'Test translation model',
  pricePerCharacter: 0.00003,
}

export const modelVersionTest = async ({
  server,
  test,
  headers,
}: TestProps) => {
  await testModelVersion(
    server,
    test,
    headers,
    'largeLanguageModelVersion',
    newLLMRequestBody,
  )
  await testModelVersion(
    server,
    test,
    headers,
    'embeddingModelVersion',
    newEBMRequestBody,
  )
  await testModelVersion(
    server,
    test,
    headers,
    'translationModelVersion',
    newTLMRequestBody,
  )

  test.end()
}

async function testModelVersion(
  server,
  test,
  headers,
  collectionName: string,
  requestBody,
) {
  let id: string
  let name: string
  await test.test(`Create new ${collectionName}`, async (test) => {
    // Check creation of a new model that is the first version of itself
    const responseInitialVersion = await server.inject({
      method: 'POST',
      url: `/v1/admin/${collectionName}`,
      headers,
      body: requestBody,
    })

    test.equal(responseInitialVersion.statusCode, 200)
    test.has(
      responseInitialVersion.headers['content-type'],
      'application/json; charset=utf-8',
    )

    const responseBodyInitialVersion = JSON.parse(
      responseInitialVersion.payload,
    )
    test.hasProp(responseBodyInitialVersion, 'newVersion')
    test.hasProp(responseBodyInitialVersion, 'previousVersion')
    test.hasProp(responseBodyInitialVersion.newVersion, 'validFrom')
    test.notHas(responseBodyInitialVersion.previousVersion, 'validUntil')

    // Check now what happens when a second version of the model is created (same name)

    const responseSecondVersion = await server.inject({
      method: 'POST',
      url: `/v1/admin/${collectionName}`,
      headers,
      body: requestBody,
    })

    test.equal(responseSecondVersion.statusCode, 200)
    test.has(
      responseSecondVersion.headers['content-type'],
      'application/json; charset=utf-8',
    )

    const responseBodySecondVersion = JSON.parse(responseSecondVersion.payload)
    test.hasProp(responseBodySecondVersion, 'newVersion')
    test.hasProp(responseBodySecondVersion, 'previousVersion')
    test.hasProp(responseBodySecondVersion.newVersion, 'validFrom')
    // Check that the previous version has a validUntil date
    test.hasProp(responseBodySecondVersion.previousVersion, 'validUntil')

    id = responseBodyInitialVersion.newVersion._id
    name = responseBodyInitialVersion.newVersion.name
  })

  await test.test(`Get ${collectionName} by id`, async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/${collectionName}/${id}`,
      headers,
    })

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )

    const responseBody = JSON.parse(response.payload)
    test.equal(responseBody._id, id)
  })

  await test.test(`Get ${collectionName} by name`, async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/${collectionName}/name/${name}`,
      headers,
    })

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )

    const responseBody = JSON.parse(response.payload)
    test.equal(responseBody.name, name)
  })
}
