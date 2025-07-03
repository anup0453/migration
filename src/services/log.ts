import { LevelWithSilentOrString } from 'pino'

import BaseService from './base'

export default class LogService extends BaseService {
  // With this service you can switch the log level of the server
  // available log levels are: 'fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'
  // silent: no logs
  // fatal: only fatal logs
  // error: fatal and error logs
  // warn: fatal, error and warn logs
  // info: fatal, error, warn and info logs
  // debug: fatal, error, warn, info and debug logs
  // trace: all logs
  public switchLogLevel(level: LevelWithSilentOrString) {
    const oldLevel = this.fastify.log.level
    this.fastify.log.level = 'info' // Otherwise the next line will not always be logged
    this.fastify.log.info(`Switching log level from ${oldLevel} to ${level}`)

    this.fastify.log.level = level

    return {
      success: true,
      message: `Log level switched from ${oldLevel} to ${level}`,
    }
  }
}
