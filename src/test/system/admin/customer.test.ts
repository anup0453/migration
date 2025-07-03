import { TestProps } from '../../customTypes/test'
import {
  customerData,
  datasourceBlobData,
  datasourceWebsiteData,
} from '../../mockData'

export const customerTest = async ({ server, test, headers }: TestProps) => {
  let idWithoutDatasource: string
  let idWithDatasource: string

  await test.test(
    'Onboard a new customer INCLUDING a datasource',
    async (test) => {
      const onboardingResponse = await server.inject({
        method: 'POST',
        url: `/v1/admin/customer/onboard`,
        headers,
        body: { ...customerData, ...{ datasource: datasourceBlobData } },
      })

      const body = JSON.parse(onboardingResponse.payload)

      test.hasProp(body, 'customer')
      test.hasProp(body, 'datasource')

      const customer = body.customer

      idWithDatasource = customer._id.toString()

      test.equal(onboardingResponse.statusCode, 200)
      test.has(
        onboardingResponse.headers['content-type'],
        'application/json; charset=utf-8',
      )
      test.hasProp(customer, 'apiKeys')
      test.equal(customer.name, customerData.name)
      test.equal(customer.isActive, true)
      test.hasProp(customer, 'datasources')
      test.notOk(
        customer.internalStorage,
        'no internal storage because redacted customer',
      )
      test.notOk(customer.aiSearch, 'no aiSearch because redacted customer')
      test.equal(customer.datasources.length, 1)
    },
  )

  await test.test(
    'Onboard a new customer WITHOUT a datasource',
    async (test) => {
      const name = 'Test-without-ds'
      const onboardingResponse = await server.inject({
        method: 'POST',
        url: `/v1/admin/customer/onboard`,
        headers,
        body: {
          ...customerData,
          ...{ name },
        },
      })

      const body = JSON.parse(onboardingResponse.payload)

      test.hasProp(body, 'customer')

      const customer = body.customer

      idWithoutDatasource = customer._id.toString()

      test.equal(onboardingResponse.statusCode, 200)
      test.has(
        onboardingResponse.headers['content-type'],
        'application/json; charset=utf-8',
      )
      test.hasProp(customer, 'apiKeys')
      test.equal(customer.name, name)
      test.equal(customer.isActive, true)
      test.equal(customer.datasources.length, 0)
      test.notOk(
        customer.internalStorage,
        'no internal storage because redacted customer',
      )
      test.notOk(
        customer.aiSearch,
        'no AI Search Index as the customer does not have a datasource yet',
      )
    },
  )

  await test.test('Delete a customer with a datasource', async (test) => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/v1/admin/customer/${idWithDatasource}`,
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

  await test.test(
    'Onboard a new customer INCLUDING a website datasource',
    async (test) => {
      const onboardingResponse = await server.inject({
        method: 'POST',
        url: `/v1/admin/customer/onboard`,
        headers,
        body: { ...customerData, ...{ datasource: datasourceWebsiteData } },
      })

      const body = JSON.parse(onboardingResponse.payload)

      test.hasProp(body, 'customer')
      test.hasProp(body, 'datasource')

      const customer = body.customer

      idWithDatasource = customer._id.toString()

      test.equal(onboardingResponse.statusCode, 200)
      test.has(
        onboardingResponse.headers['content-type'],
        'application/json; charset=utf-8',
      )
      test.hasProp(customer, 'apiKeys')
      test.equal(customer.name, customerData.name)
      test.equal(customer.isActive, true)
      test.hasProp(customer, 'datasources')
      test.notOk(
        customer.internalStorage,
        'no internal storage because redacted customer',
      )
      test.notOk(customer.aiSearch, 'no aiSearch because redacted customer')
      test.equal(customer.datasources.length, 1)
    },
  )

  await test.test('List all customers', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/customer`,
      headers,
    })

    const body = JSON.parse(response.payload)

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

  await test.test('Get single customer with datasource', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/customer/${idWithDatasource}`,
      headers,
    })

    const customer = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(customer._id, idWithDatasource)
    test.equal(customer.datasources.length, 1)
  })

  await test.test('Get single customer without datasource', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/customer/${idWithoutDatasource}`,
      headers,
    })

    const customer = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(customer._id, idWithoutDatasource)
    test.equal(customer.datasources.length, 0)
  })

  await test.test('Update a customer', async (test) => {
    const name = 'My new test name'

    const response = await server.inject({
      method: 'PATCH',
      url: `/v1/admin/customer/${idWithDatasource}`,
      headers,
      body: {
        name,
      },
    })

    const update = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(update.name, name)
  })

  await test.test('Delete a customer without a datasource', async (test) => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/v1/admin/customer/${idWithoutDatasource}`,
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

  await test.test('Delete a customer with a datasource', async (test) => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/v1/admin/customer/${idWithDatasource}`,
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
