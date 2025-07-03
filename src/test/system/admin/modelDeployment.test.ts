import { TestProps } from '../../customTypes/test'
import {
  embeddingModelDeploymentData,
  llmModelDeploymentData,
  secondEmbeddingModelDeploymentData,
} from '../../mockData'

export const modelDeploymentTest = async ({
  server,
  test,
  headers,
}: TestProps) => {
  let idOfEmbeddingModelDeployment: string

  await test.test('Add llm model deployment', async (test) => {
    const response = await server.inject({
      method: 'POST',
      url: `/v1/admin/modelDeployment`,
      headers,
      body: { ...llmModelDeploymentData },
    })

    test.equal(response.statusCode, 200)
  })

  await test.test('Add embedding model deployment', async (test) => {
    const response = await server.inject({
      method: 'POST',
      url: `/v1/admin/modelDeployment`,
      headers,
      body: { ...embeddingModelDeploymentData },
    })

    test.equal(response.statusCode, 200)
  })

  await test.test(
    'Add llm model deployment (for later deletion)',
    async (test) => {
      const response = await server.inject({
        method: 'POST',
        url: `/v1/admin/modelDeployment`,
        headers,
        body: { ...secondEmbeddingModelDeploymentData },
      })

      const data = JSON.parse(response.payload)
      idOfEmbeddingModelDeployment = data._id

      test.equal(response.statusCode, 200)
    },
  )

  await test.test('Get all model deployments', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/modelDeployment`,
      headers,
    })

    const data = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.equal(data.length, 3)
  })

  await test.test('Get llm model deployments by name', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/modelDeployment/name/${secondEmbeddingModelDeploymentData.modelName}`,
      headers,
    })

    const data = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.equal(data.length, 2)
  })

  await test.test('Get llm model deployments by id', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/modelDeployment/${idOfEmbeddingModelDeployment}`,
      headers,
    })

    const data = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.equal(data._id, idOfEmbeddingModelDeployment)
  })

  await test.test('Update llm model deployment by id', async (test) => {
    const response = await server.inject({
      method: 'PATCH',
      url: `/v1/admin/modelDeployment/${idOfEmbeddingModelDeployment}`,
      headers,
      body: { endpoint: 'new-endpoint' },
    })

    const data = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.equal(data.endpoint, 'new-endpoint')
  })

  await test.test('Delete llm model deployment by id', async (test) => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/v1/admin/modelDeployment/${idOfEmbeddingModelDeployment}`,
      headers,
    })

    const deletion = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(deletion.acknowledged, true)
    test.equal(deletion.deletedCount, 1)
    test.equal(deletion.success, true)
  })

  test.end()
}
