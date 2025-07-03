import { TestProps } from '../../customTypes/test'
import {
  customerData,
  customerData2,
  datasourceBlobData,
  datasourceWebsiteData,
  datasourceWebsiteData2,
} from '../../mockData'

export const clientDatasourceTest = async ({
  server,
  test,
  headers,
}: TestProps) => {
  let userHeadersWithCustomerApiKey
  let userHeadersWithAnotherCustomerApiKey
  let websiteDatasourceId

  // Onboarding of customer with datasource is done by admin/system
  // All other operations are done by the customer with the customer api key
  await test.test(
    'Create a customer with a azure blob datasource - Admin',
    async (test) => {
      const onboardingResponse = await server.inject({
        method: 'POST',
        url: `/v1/admin/customer/onboard`,
        headers,
        body: { ...customerData, ...{ datasource: datasourceBlobData } },
      })

      const body = JSON.parse(onboardingResponse.payload)

      test.hasProp(body, 'customer')

      const customer = body.customer

      userHeadersWithCustomerApiKey = {
        Authorization:
          'Basic ' +
          Buffer.from('' + ':' + customer.apiKeys[0].key).toString('base64'),
        'Content-Type': 'application/json',
      }

      test.equal(onboardingResponse.statusCode, 200)
      test.equal(customer.name, customerData.name)
    },
  )

  // Onboarding second customer
  await test.test(
    'Create another customer with a azure blob datasource - Admin',
    async (test) => {
      const onboardingResponse = await server.inject({
        method: 'POST',
        url: `/v1/admin/customer/onboard`,
        headers,
        body: { ...customerData2, ...{ datasource: datasourceWebsiteData2 } },
      })

      const body = JSON.parse(onboardingResponse.payload)

      test.hasProp(body, 'customer')

      const customer = body.customer

      userHeadersWithAnotherCustomerApiKey = {
        Authorization:
          'Basic ' +
          Buffer.from('' + ':' + customer.apiKeys[0].key).toString('base64'),
        'Content-Type': 'application/json',
      }

      test.equal(onboardingResponse.statusCode, 200)
      test.equal(customer.name, customerData2.name)
    },
  )

  await test.test(
    'Create new datasource (website) - Client with customer api key',
    async (test) => {
      const response = await server.inject({
        method: 'POST',
        url: `/v1/datasource`,
        headers: userHeadersWithCustomerApiKey,
        body: datasourceWebsiteData,
      })

      const datasource = JSON.parse(response.payload)
      websiteDatasourceId = datasource._id.toString()

      test.equal(response.statusCode, 200)
      test.hasProp(datasource, 'settings')
      test.hasProp(datasource.settings, 'website')
    },
  )

  await test.test(
    'List all datasources - Client with customer api key',
    async (test) => {
      const response = await server.inject({
        method: 'GET',
        url: `/v1/datasource`,
        headers: userHeadersWithCustomerApiKey,
      })

      const datasources = JSON.parse(response.payload)

      test.equal(response.statusCode, 200)
      test.equal(datasources.length, 2)
    },
  )

  await test.test(
    'Get datasource by id - Client with customer api key',
    async (test) => {
      const response = await server.inject({
        method: 'GET',
        url: `/v1/datasource/${websiteDatasourceId}`,
        headers: userHeadersWithCustomerApiKey,
      })

      const datasources = JSON.parse(response.payload)

      test.equal(response.statusCode, 200)
      test.equal(datasources._id.toString(), websiteDatasourceId)
    },
  )

  // Test fetch datasource by ID when APIKEY of another customer is passed.
  await test.test(
    'Get datasource by id - Client with customer2 api key',
    async (test) => {
      const response = await server.inject({
        method: 'GET',
        url: `/v1/datasource/${websiteDatasourceId}`,
        headers: userHeadersWithAnotherCustomerApiKey,
      })

      test.equal(response.statusCode, 400)
      test.has(JSON.parse(response.payload), {
        success: true,
        error:
          'Cannot GET datasource as the ID of datasource does not belong to customer',
      })
    },
  )

  // PATCH datasource by another customer apiKey
  await test.test(
    'Update datasource by id - Client with customer2 api key',
    async (test) => {
      const response = await server.inject({
        method: 'PATCH',
        url: `/v1/datasource/${websiteDatasourceId}`,
        headers: userHeadersWithAnotherCustomerApiKey,
        body: { frequency: '42h' },
      })

      test.equal(response.statusCode, 400)
      test.has(JSON.parse(response.payload), {
        success: true,
        error:
          'Cannot PATCH datasource as the ID of datasource does not belong to customer',
      })
    },
  )

  // PATCH datasource by correct customer apiKey
  await test.test(
    'Update datasource by id - Client with customer api key',
    async (test) => {
      const response = await server.inject({
        method: 'PATCH',
        url: `/v1/datasource/${websiteDatasourceId}`,
        headers: userHeadersWithCustomerApiKey,
        body: { frequency: '42h' },
      })

      const datasource = JSON.parse(response.payload)

      test.equal(response.statusCode, 200)
      test.equal(datasource.frequency, '42h')
    },
  )

  // Delete Datasource by ID when APIkey of Another customer is provided.

  await test.test(
    'Delete datasource by id - Client with customer2 api key',
    async (test) => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/datasource/${websiteDatasourceId}`,
        headers: userHeadersWithAnotherCustomerApiKey,
      })

      test.equal(response.statusCode, 400)
      test.has(JSON.parse(response.payload), {
        success: true,
        error:
          'Cannot DELETE datasource as the ID of datasource does not belong to customer',
      })
    },
  )

  // Delete Datasource by Id with correct customer api key.
  await test.test(
    'Delete datasource by id - Client with customer api key',
    async (test) => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/datasource/${websiteDatasourceId}`,
        headers: userHeadersWithCustomerApiKey,
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
    },
  )

  // Cleanup of previously added customer
  await test.test(
    'Delete customer by api key - Client with customer api key',
    async (test) => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/customer`,
        headers: userHeadersWithCustomerApiKey,
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
    },
  )

  // Cleanup of previously added customer2
  await test.test(
    'Delete customer2 by api key - Client with customer2 api key',
    async (test) => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/v1/customer`,
        headers: userHeadersWithAnotherCustomerApiKey,
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
    },
  )

  test.end()
}
