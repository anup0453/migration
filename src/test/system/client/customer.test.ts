import { TestProps } from '../../customTypes/test'
import { customerData, datasourceBlobData } from '../../mockData'

export const clientCustomerTest = async ({
  server,
  test,
  headers,
}: TestProps) => {
  let newCustomerId: string
  let userHeadersWithCustomerApiKey
  let userHeadersWithBearerToken
  let userHeadersWithApiKeyHeader
  // Model used to execute "chat" tests
  const model_for_chat = process.env.TEST_MODEL_DEPLOYMENT_MODEL_NAME // it will be good to test AZURE_OPENAI_DEFAULT_ENGINE model here - but now init code is not reaching to any model from the list

  // Onboarding of customer is done by admin/system
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

      userHeadersWithBearerToken = {
        Authorization: 'Bearer ' + customer.apiKeys[0].key,
        'Content-Type': 'application/json',
      }

      userHeadersWithApiKeyHeader = {
        'api-key': customer.apiKeys[0].key,
        'Content-Type': 'application/json',
      }

      newCustomerId = customer._id.toString()

      test.equal(onboardingResponse.statusCode, 200)
      test.equal(customer.name, customerData.name)
      test.equal(customer.billing.psp, customerData.billing.psp)
      test.equal(customer.billing.orgId, customerData.billing.orgId)
    },
  )

  await test.test(
    'Get customer - Client with customer api key',
    async (test) => {
      const response = await server.inject({
        method: 'GET',
        url: `/v1/customer`,
        headers: userHeadersWithCustomerApiKey,
        body: { ...customerData, ...{ datasource: datasourceBlobData } },
      })

      const customer = JSON.parse(response.payload)

      test.equal(response.statusCode, 200)
      test.equal(customer._id, newCustomerId)
      test.hasProp(customer, 'datasources')
    },
  )

  await test.test(
    'Update customer - Client with customer api key',
    async (test) => {
      const response = await server.inject({
        method: 'PATCH',
        url: `/v1/customer/settings`,
        headers: userHeadersWithCustomerApiKey,
        body: { topN: 42 },
      })

      const customer = JSON.parse(response.payload)

      test.equal(response.statusCode, 200)
      test.equal(customer._id, newCustomerId)
      test.equal(customer.settings.topN, 42)
    },
  )

  // Few chats tests
  await test.test('Chat with default model - Basic Auth', async (test) => {
    const response = await server.inject({
      method: 'POST',
      url: '/openai/deployments/' + model_for_chat + '/chat/completions',
      headers: userHeadersWithCustomerApiKey,
      body: {
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant and help users to find things.',
          },
          { role: 'user', content: 'Who is werner from siemens?' },
        ],
        temperature: 0.5,
        n: 3,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 50,
        stop: null,
      },
    })

    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(response.statusCode, 200)
    test.has(JSON.parse(response.payload), {
      success: true,
      object: 'chat.completion',
      choices: [],
    })
  })

  await test.test('Chat with default model - Bearer Token', async (test) => {
    const response = await server.inject({
      method: 'POST',
      url: '/openai/deployments/' + model_for_chat + '/chat/completions',
      headers: userHeadersWithBearerToken,
      body: {
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant and help users to find things.',
          },
          { role: 'user', content: 'Who is werner from siemens?' },
        ],
        temperature: 0.5,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 50,
        stop: null,
      },
    })

    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(response.statusCode, 200)
    test.has(JSON.parse(response.payload), {
      success: true,
      object: 'chat.completion',
      choices: [],
    })
  })

  await test.test(
    'Chat with default model - "api-key" header test',
    async (test) => {
      const response = await server.inject({
        method: 'POST',
        url: '/openai/deployments/' + model_for_chat + '/chat/completions',
        headers: userHeadersWithApiKeyHeader,
        body: {
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant and help users to find things.',
            },
            { role: 'user', content: 'Who is werner from siemens?' },
          ],
          temperature: 0.5,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0,
          max_tokens: 50,
          stop: null,
        },
      })

      test.has(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      )
      test.equal(response.statusCode, 200)
      test.has(JSON.parse(response.payload), {
        success: true,
        object: 'chat.completion',
        choices: [],
      })
    },
  )

  await test.test(
    'Chat with default model - no headers passed - expected is 401',
    async (test) => {
      const response = await server.inject({
        method: 'POST',
        url: '/openai/deployments/' + model_for_chat + '/chat/completions',
        headers: {},
        body: {
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant and help users to find things.',
            },
            { role: 'user', content: 'Who is werner from siemens?' },
          ],
          temperature: 0.5,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0,
          max_tokens: 50,
          stop: null,
        },
      })

      test.has(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      )
      test.equal(response.statusCode, 401)
    },
  )

  // Cleanup of previously added customer
  await test.test(
    'Delete a customer - Client with customer api key',
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

  test.end()
}
