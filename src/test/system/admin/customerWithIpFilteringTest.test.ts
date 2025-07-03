import { IpFilteringMode } from '../../../constants'
import { updateCustomerIpFilterList } from '../../../server/plugins/scheduler/ipRestrictionList'
import { TestProps } from '../../customTypes/test'
import {
  correctIpV4Address,
  correctIpV4AddressUnderRange,
  customerData,
  customerIpFilteringSettings,
  wrongIPV4Address,
} from '../../mockData'

export const customerWithIpFilteringTest = async ({
  server,
  test,
  headers,
}: TestProps) => {
  let idNoDatasource: string

  const model_for_chat = process.env.TEST_MODEL_DEPLOYMENT_MODEL_NAME // it will be good to test AZURE_OPENAI_DEFAULT_ENGINE model here - but now init code is not reaching to any model from the list

  const gptBodyMessage = {
    messages: [
      {
        role: 'system',
        content: 'you are helpful ai assistant',
      },
      {
        role: 'user',
        content: '2+2=',
      },
    ],
    max_tokens: 50,
  }

  let userHeadersWithBearerToken_correctIpV4Address
  let userHeadersWithBearerToken_correctIpV4AddressUnderRange
  let userHeadersWithBearerToken_wrongIPV4Address

  await test.test(
    'Onboard a new customer WITHOUT a datasource and WITH IP restriction',
    async (test) => {
      const onboardingResponse = await server.inject({
        method: 'POST',
        url: `/v1/admin/customer/onboard`,
        headers,
        body: {
          ...customerData,
          ...{ name: 'IP-Filtering-Tests-ONBOARD-ONLY-NOT-IN-USE' },
        },
      })

      const body = JSON.parse(onboardingResponse.payload)

      test.hasProp(body, 'customer')

      const customer = body.customer

      idNoDatasource = customer._id.toString()

      test.equal(onboardingResponse.statusCode, 200)
      test.has(
        onboardingResponse.headers['content-type'],
        'application/json; charset=utf-8',
      )
      test.hasProp(customer, 'apiKeys')
      test.equal(customer.isActive, true)
      test.notOk(
        customer.internalStorage,
        'no internal storage because redacted customer',
      )
      test.notOk(customer.aiSearch, 'no aiSearch because redacted customer')
      test.equal(customer.ipFilteringSettings.whitelistedIpsArray.length, 0)
      test.equal(customer.ipFilteringSettings.isIpFilteringEnabled, false)
      test.equal(customer.ipFilteringSettings.blockingMode, IpFilteringMode.LOG)
    },
  )

  await test.test(
    'Onboard a new customer WITHOUT a datasource',
    async (test) => {
      const onboardingResponse = await server.inject({
        method: 'POST',
        url: `/v1/admin/customer/onboard`,
        headers,
        body: {
          ...customerData,
          ...{ name: 'IP-Filtering-Tests' },
        },
      })

      const body = JSON.parse(onboardingResponse.payload)

      test.hasProp(body, 'customer')

      const customer = body.customer

      userHeadersWithBearerToken_correctIpV4Address = {
        Authorization: 'Bearer ' + customer.apiKeys[0].key,
        'Content-Type': 'application/json',
        'x-forwarded-for': correctIpV4Address + ', 1.2.3.4:3214', // 1.2.3.4:3214 simulates here AzureAppGW
      }
      userHeadersWithBearerToken_correctIpV4AddressUnderRange = {
        Authorization: 'Bearer ' + customer.apiKeys[0].key,
        'Content-Type': 'application/json',
        'x-forwarded-for': correctIpV4AddressUnderRange + ', 1.2.3.4:3214', // 1.2.3.4:3214 simulates here AzureAppGW
      }
      userHeadersWithBearerToken_wrongIPV4Address = {
        Authorization: 'Bearer ' + customer.apiKeys[0].key,
        'Content-Type': 'application/json',
        'x-forwarded-for': wrongIPV4Address + ', 1.2.3.4:3214', // 1.2.3.4:3214 simulates here AzureAppGW
      }

      idNoDatasource = customer._id.toString()

      test.equal(onboardingResponse.statusCode, 200)
      test.has(
        onboardingResponse.headers['content-type'],
        'application/json; charset=utf-8',
      )
      test.hasProp(customer, 'apiKeys')
      test.equal(customer.isActive, true)
      test.notOk(
        customer.internalStorage,
        'no internal storage because redacted customer',
      )
      test.notOk(
        customer.aiSearch,
        'no aiSearch because customer does not have a datasource and would be redacted',
      )
    },
  )

  await test.test(
    'Update a customer with IPs restriction list',
    async (test) => {
      const response = await server.inject({
        method: 'PATCH',
        url: `/v1/admin/customer/${idNoDatasource}`,
        headers,
        body: customerIpFilteringSettings,
      })

      const update = JSON.parse(response.payload)

      test.equal(response.statusCode, 200)
      test.has(
        response.headers['content-type'],
        'application/json; charset=utf-8',
      )
      test.hasProp(update, 'ipFilteringSettings')
      test.equal(update.ipFilteringSettings.whitelistedIpsArray.length, 2)
      test.equal(update.ipFilteringSettings.isIpFilteringEnabled, true)
      test.equal(update.ipFilteringSettings.blockingMode, IpFilteringMode.BLOCK)

      await updateCustomerIpFilterList(server) //  Just pretend that scheduler run...
      test.not(
        server.config.customers.whitelistConfig[idNoDatasource],
        undefined,
      )
    },
  )

  await test.test('Check customer with wrong IPv4', async (test) => {
    const response = await server.inject({
      method: 'POST',
      url: '/openai/deployments/' + model_for_chat + '/chat/completions',
      headers: userHeadersWithBearerToken_wrongIPV4Address,
      body: gptBodyMessage,
    })

    test.equal(response.statusCode, 403)
  })

  await test.test(
    'Check customer with correct IPv4 - single IPv4 check',
    async (test) => {
      const response = await server.inject({
        method: 'POST',
        url: '/openai/deployments/' + model_for_chat + '/chat/completions',
        headers: userHeadersWithBearerToken_correctIpV4Address,
        body: gptBodyMessage,
      })

      test.equal(response.statusCode, 200)
    },
  )

  await test.test(
    'Check customer with correct IPv4 - range IPv4 check',
    async (test) => {
      const response = await server.inject({
        method: 'POST',
        url: '/openai/deployments/' + model_for_chat + '/chat/completions',
        headers: userHeadersWithBearerToken_correctIpV4AddressUnderRange,
        body: gptBodyMessage,
      })

      test.equal(response.statusCode, 200)
    },
  )

  test.end()
}
