import { randomNumberString } from '../../../utils'
import { TestProps } from '../../customTypes/test'

const newIndexRequestBody = {
  name: `c-3-systemtest-index-${randomNumberString(4)}`,
  connectionString: process.env.SYSTEMTEST_BLOB_STORAGE_CONNECTION_STRING,
  containerName: process.env.SYSTEMTEST_BLOB_STORAGE_CONTAINER_NAME,
  apiKey: process.env.ADMIN_APIKEY,
}

export const indexTest = async ({ server, test, headers }: TestProps) => {
  await test.test('Create a new index', async (test) => {
    const response = await server.inject({
      method: 'POST',
      url: `/v1/admin/azure/index`,
      headers,
      body: {
        name: newIndexRequestBody.name,
      },
    })

    const body = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(body.success, true)
    test.equal(body.name, newIndexRequestBody.name)
  })

  await test.test('List all indexes', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/azure/index`,
      headers,
    })

    const body = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.hasProp(body, 'data')
    test.ok(body.data.length >= 1)
    test.equal(body.success, true)
    test.ok(body.count >= 1)
  })

  await test.test('Find a single index by name', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/azure/index/${newIndexRequestBody.name}`,
      headers,
    })

    const body = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(body.name, newIndexRequestBody.name)
  })

  await test.test('Delete an index', async (test) => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/v1/admin/azure/index/${newIndexRequestBody.name}`,
      headers,
    })

    test.equal(response.statusCode, 200)
    // void response
    test.equal(response.headers['content-type'], undefined)
  })

  test.end()
}
