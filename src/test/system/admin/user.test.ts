import { compareSync, hashSync } from 'bcryptjs'

import { TestProps } from '../../customTypes/test'

const newUserRequestBody = {
  firstname: 'User',
  lastname: 'Test',
  role: 'superadmin',
  departments: [],
  email: 'user@test.ai',
  apiKey: 'U$3rT3st!@#',
  isActive: true,
  customer: '5up3r4dm1n',
}

export const userTest = async ({ server, test, headers }: TestProps) => {
  let id: string

  await test.test('Create a new user', async (test) => {
    const response = await server.inject({
      method: 'POST',
      url: `/v1/admin/user`,
      headers,
      body: newUserRequestBody,
    })

    const body = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )

    test.equal(body.firstname, newUserRequestBody.firstname)
    test.equal(body.lastname, newUserRequestBody.lastname)
    test.equal(body.role, newUserRequestBody.role)
    test.hasProp(body, 'departments')
    test.equal(body.email, newUserRequestBody.email)
    test.hasProp(body, 'apiKey')
    test.ok(
      compareSync(
        newUserRequestBody.apiKey,
        hashSync(newUserRequestBody.apiKey),
      ),
    )
    test.equal(body.isActive, true)
  })

  await test.test('List all users', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/user`,
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

  await test.test('Get single user', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/user/${id}`,
      headers,
    })

    const body = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(body._id, id)
  })

  await test.test('Update a user', async (test) => {
    const lastname = 'My new test lastname'
    const newApiKey = 'MyN3wT3st!@#'

    const response = await server.inject({
      method: 'PATCH',
      url: `/v1/admin/user/${id}`,
      headers,
      body: {
        lastname,
        apiKey: newApiKey,
      },
    })

    const update = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.has(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    )
    test.equal(update.lastname, lastname)
  })

  await test.test('Test updated user with new API Key', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/user`,
      headers: {
        ...headers,
        ...{
          Authorization:
            'Basic ' +
            Buffer.from(
              newUserRequestBody.email + ':' + newUserRequestBody.apiKey,
            ).toString('base64'),
        },
      },
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

  test.end()
}
