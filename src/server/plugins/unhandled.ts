import { map } from 'bluebird'
import isNil from 'lodash/isNil'

import { logger } from '../../utils'

export function handleUnhandled(fns?: CallableFunction[]) {
  process.on('unhandledRejection', async (err) => {
    try {
      if (!isNil(fns)) await map(fns, (fn) => fn())
    } catch (error) {
      logger.fatal('Could not finish cleanup!')
      logger.fatal(error)
    }
    logger.fatal('Unhandled Rejection!')
    logger.fatal(err)
    process.exit(1)
  })
}
