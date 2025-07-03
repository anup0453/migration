import mongoose, { Mongoose } from 'mongoose'

import { models } from '../../models'
import { handleUnhandled } from '../../server/plugins/unhandled'
import { logger } from '../../utils'

export class ModelConnector {
  private _connection: Mongoose

  async initModels(mongo: string, username?: string, password?: string) {
    logger.info('Models connecting...')

    handleUnhandled([this.closeModels])

    const options: mongoose.ConnectOptions = {
      autoIndex: true,
      autoCreate: true,
    }

    if (process.env.NODE_ENV !== 'development') {
      options.ssl = true
      options.replicaSet = 'globaldb'
      options.retryWrites = false
    }

    if (username && password) {
      options.auth = { username, password }
    }

    this._connection =
      this._connection || (await mongoose.connect(mongo, options))

    if (!this._connection?.ConnectionStates.connected) {
      logger.error('Mongoose connection to MongoDB failed')
    }

    logger.info('Models connected')

    return models
  }

  async closeModels() {
    logger.info('Models disconnecting...')
    await this._connection.connection.close(true)
    this._connection = undefined
    logger.info('Models disconnected')
  }
}
