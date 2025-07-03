import '../env'
import buildServer from './server'
import { logger } from './utils'

buildServer().catch((error) => logger.error(`Server Error: ${error}`))
