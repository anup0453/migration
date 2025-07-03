import { FastifyInstance } from 'fastify'
import mongoose from 'mongoose'
import tap from 'tap'

import buildServer from '../server'
import { populateDatabase } from './mockData'
import * as tests from './system'

let server: FastifyInstance

tap.pass('OK')

tap
  .test('', async (test) => {
    server = await buildServer()

    await populateDatabase(server)

    const adminHeaders = {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.ADMIN_EMAIL + ':' + process.env.ADMIN_APIKEY,
        ).toString('base64'),
      'Content-Type': 'application/json',
    }

    test.teardown(async () => {
      // Fallback, if for any reason, the env is not set to 'test', so that your db is not gone
      if (process.env.NODE_ENV === 'test') {
        await mongoose.connection.db.dropDatabase()
      }

      await server.close()
    })

    // Create Model Deploment - Admin

    await test.test(
      '[ Admin Model Deployment ]',
      async (t) =>
        await tests.modelDeploymentTest({
          server,
          test: t,
          headers: adminHeaders,
        }),
    )

    // Client Tests

    await test.test(
      '[ Client Customer ]',
      async (t) =>
        await tests.clientCustomerTest({
          server,
          test: t,
          headers: adminHeaders,
        }),
    )

    await test.test(
      '[ Client Datasource ]',
      async (t) =>
        await tests.clientDatasourceTest({
          server,
          test: t,
          headers: adminHeaders,
        }),
    )

    await test.test(
      '[ Client KPI ]',
      async (t) =>
        await tests.clientKpiTest({
          server,
          test: t,
          headers: adminHeaders,
        }),
    )

    // Admin Tests

    await test.test(
      '[ Admin Ping ]',
      async (t) =>
        await tests.pingTest({ server, test: t, headers: adminHeaders }),
    )
    await test.test(
      '[ Admin Ping Root ]',
      async (t) =>
        await tests.pingRootTest({ server, test: t, headers: adminHeaders }),
    )
    await test.test(
      '[ Admin Customer ]',
      async (t) =>
        await tests.customerTest({ server, test: t, headers: adminHeaders }),
    )
    await test.test(
      '[ Admin Customer - with IP Restriction ]',
      async (t) =>
        await tests.customerWithIpFilteringTest({
          server,
          test: t,
          headers: adminHeaders,
        }),
    )
    await test.test(
      '[ Admin Datasource ]',
      async (t) =>
        await tests.datasourceTest({ server, test: t, headers: adminHeaders }),
    )
    await test.test(
      '[ Admin Model Versions ]',
      async (t) =>
        await tests.modelVersionTest({
          server,
          test: t,
          headers: adminHeaders,
        }),
    )
    await test.test(
      '[ Admin Index ]',
      async (t) =>
        await tests.indexTest({ server, test: t, headers: adminHeaders }),
    )

    await test.test(
      '[ Admin KPI ]',
      async (t) =>
        await tests.adminKpiTest({
          server,
          test: t,
          headers: adminHeaders,
        }),
    )

    // Has to be last test, as it destroy the user in the end
    await test.test(
      '[ Admin User ]',
      async (t) =>
        await tests.userTest({ server, test: t, headers: adminHeaders }),
    )

    test.end()
  })
  .catch(async (e) => {
    tap.threw(e)
  })
