import { TestProps } from '../../customTypes/test'
import {
  customerData,
  datasourceBlobData,
  datasourceWebsiteData,
} from '../../mockData'

export const datasourceTest = async ({ server, test, headers }: TestProps) => {
  let id: string
  let ownerId: string

  await test.test('Create a new blob datasource', async (test) => {
    const customerResponse = await server.inject({
      method: 'POST',
      url: `/v1/admin/customer/onboard`,
      headers,
      body: customerData,
    })

    const onboardingBody = JSON.parse(customerResponse.payload)

    test.hasProp(onboardingBody, 'customer')

    const owner = onboardingBody.customer

    ownerId = owner._id

    const response = await server.inject({
      method: 'POST',
      url: `/v1/admin/datasource`,
      headers,
      body: { ...datasourceBlobData, ...{ owner: ownerId } },
    })

    const datasourceBody = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.hasProp(datasourceBody, 'settings')
    test.equal(datasourceBody.displayName, datasourceBlobData.displayName)
  })

  await test.test('Create a new website datasource', async (test) => {
    const response = await server.inject({
      method: 'POST',
      url: `/v1/admin/datasource`,
      headers,
      body: { ...datasourceWebsiteData, ...{ owner: ownerId } },
    })

    const body = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.hasProp(body, 'settings')
    test.equal(body.displayName, datasourceWebsiteData.displayName)
  })

  await test.test('List all datasources', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/datasource`,
      headers,
    })

    const body = JSON.parse(response.payload)

    id = body.data[0]._id

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.hasProp(body, 'data')
    test.equal(body.data.length, 2)
    test.equal(body.success, true)
    test.equal(body.count, 2)
  })

  await test.test('Get single datasource', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/datasource/${id}`,
      headers,
    })

    const datasource = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(datasource._id, id)
  })

  await test.test('Update a datasource', async (test) => {
    const displayName = `My new datasource renamed`

    const response = await server.inject({
      method: 'PATCH',
      url: `/v1/admin/datasource/${id}`,
      headers,
      body: {
        displayName,
      },
    })

    const body = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(body.displayName, displayName)
  })

  await test.test('Delete a datasource', async (test) => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/v1/admin/datasource/${id}`,
      headers,
    })

    const body = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(body.acknowledged, true)
    test.equal(body.deletedCount, 1)
    test.equal(body.success, true)

    await server.inject({
      method: 'DELETE',
      url: `/v1/admin/customer/${ownerId}`,
      headers,
    })
  })

  test.end()
}
