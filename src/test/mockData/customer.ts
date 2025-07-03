import { IpFilteringMode } from '../../constants'

export const customerData = {
  name: 'System Tests',
  isActive: true,
  departments: [],
  settings: {
    translationActive: false,
    sourceLinkActive: true,
    ocrActive: false,
  },
  subscription: {
    isChargeable: false,
    start: new Date(),
  },
  billing: {
    psp: 'any_psp',
    orgId: 'an_org_id',
  },
}

export const customerData2 = {
  name: 'System Tests 2',
  isActive: true,
  departments: [],
  settings: {
    translationActive: false,
    sourceLinkActive: true,
    ocrActive: false,
  },
  subscription: {
    isChargeable: false,
    start: new Date(),
  },
  billing: {
    psp: 'any_psp',
    orgId: 'an_org_id',
  },
}

export const customerIpFilteringSettings = {
  ipFilteringSettings: {
    isIpFilteringEnabled: true,
    whitelistedIpsArray: ['10.0.0.1', '10.0.1.1/23'],
    blockingMode: IpFilteringMode.BLOCK,
  },
}

export const correctIpV4Address = '10.0.0.1:3213'
export const correctIpV4AddressUnderRange = '10.0.1.250:3213'
export const wrongIPV4Address = '21.0.0.1:3213'
