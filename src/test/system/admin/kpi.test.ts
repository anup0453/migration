import { TestProps } from '../../customTypes/test'

export const adminKpiTest = async ({ server, test, headers }: TestProps) => {
  await test.test('Get KPI data - Admin', async (test) => {
    const response = await server.inject({
      method: 'GET',
      url: `/v1/admin/kpi`,
      headers,
      query: {
        from: '2023-01-01',
        to: '2023-12-31',
        scale: 'month',
        type: 'total,chatRequest',
      },
    })

    const kpiData = JSON.parse(response.payload)

    test.equal(response.statusCode, 200)
    test.hasProp(kpiData, 'total')
    test.hasProp(kpiData, 'aggregationData')
    test.hasProp(kpiData.aggregationData, 'chatRequest')
    test.hasProp(kpiData, 'graphData')
  })

  test.end()
}
