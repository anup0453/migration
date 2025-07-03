import { FastifyInstance } from 'fastify'

export async function populateDatabase(server: FastifyInstance) {
  await addSubscriptions(server)

  return
}

async function addSubscriptions(server: FastifyInstance) {
  const plans = [
    {
      name: 'GAIA',
      amount: 7500,
      periodInMonths: 12,
      validFrom: new Date('2023-10-01'),
      isActive: true,
      isDefault: true,
    },
    {
      name: 'GAIA Light',
      amount: 5400,
      periodInMonths: 12,
      validFrom: new Date('2023-10-01'),
      isActive: true,
    },
  ]

  const bulk = plans.map((plan) => ({
    updateOne: {
      filter: { name: plan.name },
      update: { $set: plan },
      upsert: true,
    },
  }))

  return await server.models.subscription.bulkWrite(bulk)
}
