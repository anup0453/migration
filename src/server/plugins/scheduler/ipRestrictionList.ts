import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import * as ipAddrJs from 'ipaddr.js'
import * as net from 'net'
import { schedule } from 'node-cron'

async function decorate(fastify: FastifyInstance) {
  // IMPORTANT: The polling of schedulers will never allow a SIGTERM for automated tests
  // Therefore this needs to be inactive on system and unit test environments
  if (process.env.NODE_ENV === 'test') {
    return
  }

  // One initial run on startup
  await updateCustomerIpFilterList(fastify)
  const scheduleTimer = process.env.IP_FILTER_REFRESH_SCHEDULE_TIMER
    ? process.env.IP_FILTER_REFRESH_SCHEDULE_TIMER
    : ' */30 * * * *'

  schedule(scheduleTimer, async () => {
    await updateCustomerIpFilterList(fastify)
  })
}

export async function updateCustomerIpFilterList(fastify: FastifyInstance) {
  fastify.log.info(`Refresh IP Filter lists per customer.`)

  const customersWithIpFilteringEnabled = await fastify.models.customer.find({
    'ipFilteringSettings.isIpFilteringEnabled': true,
  })

  for (let index = 0; index < customersWithIpFilteringEnabled.length; index++) {
    const currentCustomer = customersWithIpFilteringEnabled[index]
    const currentCustomerId = currentCustomer._id.toString()
    const whitelist = new net.BlockList()
    const whitelistedIpFromMongo =
      currentCustomer.ipFilteringSettings.whitelistedIpsArray

    whitelist.addAddress('127.0.0.1') // Azure Health Check is 127.0.0.1 - adding just in case

    for (let i = 0; i < whitelistedIpFromMongo.length; i++) {
      const ip = whitelistedIpFromMongo[i]
      try {
        // IP v4
        if (ipAddrJs.IPv4.isIPv4(ip)) {
          fastify.log.debug(
            'customer[' + currentCustomerId + ']: valid IPv4: ' + ip,
          )
          whitelist.addAddress(ip)
        } else if (ipAddrJs.IPv4.isValidCIDR(ip)) {
          fastify.log.debug(
            'customer[' + currentCustomerId + ']: valid CIDR IPv4: ' + ip,
          )
          const ipParts = ip.split('/')
          const ipPrefix = parseInt(ipParts[1])
          const ipBase = ipParts[0]
          whitelist.addSubnet(ipBase, ipPrefix)
        }
        // IP v6
        else if (ipAddrJs.IPv6.isIPv6(ip)) {
          fastify.log.debug(
            'customer[' + currentCustomerId + ']: valid IPv6: ' + ip,
          )
          whitelist.addAddress(ip, 'ipv6')
        } else if (ipAddrJs.IPv6.isValidCIDR(ip)) {
          fastify.log.debug(
            'customer[' + currentCustomerId + ']: valid CIDR IPv6: ' + ip,
          )
          const ipParts = ip.split('/')
          const ipPrefix = parseInt(ipParts[1])
          const ipBase = ipParts[0]
          whitelist.addSubnet(ipBase, ipPrefix, 'ipv6')
        } else {
          fastify.log.warn(
            "Can't match value to valid IP or CIDR: '" +
              ip +
              "', for customer '" +
              currentCustomerId +
              "'",
          )
        }
      } catch (error) {
        fastify.log.warn(
          "Cannot validate IP/Range for value '" +
            ip +
            "', for customer '" +
            currentCustomerId +
            "', message: " +
            error.message,
        )
      }
    }
    fastify.config.customers.whitelistConfig[currentCustomerId] = whitelist
  }
}

export const decorateIpFilterRefreshScheduler = fp(decorate)
