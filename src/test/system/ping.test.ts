import { TestProps } from '../customTypes/test'

export const pingTest = async ({ server, test, headers }: TestProps) => {
  await test.test('Send ping (no auth)', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1`,
      headers,
    })

    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(response.statusCode, 200)
    test.same(JSON.parse(response.payload), {
      success: true,
      message: 'API /v1 is running',
    })
  })

  test.end()
}

export const pingRootTest = async ({ server, test, headers }: TestProps) => {
  await test.test('Send ping (no auth)', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/`,
      headers,
    })

    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(response.statusCode, 200)
    test.same(JSON.parse(response.payload), {
      success: true,
      message: 'App-Root is available',
    })
  })

  test.end()
}
