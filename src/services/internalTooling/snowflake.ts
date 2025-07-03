import * as crypto from 'crypto'
import * as snowflake from 'snowflake-sdk'

import { InternalTool } from '../../models/types'
import BaseService from '../base'

export default class AzureSnowflakeService extends BaseService {
  private async getPrivateKey(internalTool: InternalTool) {
    const { customerPrivateKey, passphrase } = internalTool.settings.snowflake
    const privateKeyObject = crypto.createPrivateKey({
      key: customerPrivateKey,
      format: 'pem',
      passphrase: passphrase,
    })

    return privateKeyObject.export({ format: 'pem', type: 'pkcs8' }).toString()
  }

  private async createConnection(tool: InternalTool) {
    const privateKey = await this.getPrivateKey(tool)

    return snowflake.createConnection({
      account: tool.settings.snowflake.account,
      username: tool.settings.snowflake.username,
      authenticator: 'SNOWFLAKE_JWT',
      privateKey: privateKey,
      warehouse: tool.settings.snowflake.warehouse,
      database: tool.settings.snowflake.database,
      role: tool.settings.snowflake.role,
    })
  }

  private async connect(connection: snowflake.Connection): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          this.fastify.log.error('Unable to connect: ' + err.message)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  private async disconnect(connection: snowflake.Connection): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.destroy((err) => {
        if (err) {
          this.fastify.log.error('Unable to disconnect: ' + err.message)
          reject(err)
        } else {
          this.fastify.log.debug('Successfully disconnected from Snowflake.')
          resolve()
        }
      })
    })
  }

  private async executeQuery(connection: snowflake.Connection, query: string) {
    return new Promise((resolve, reject) => {
      connection.execute({
        sqlText: query,
        complete: (err, stmt, rows) => {
          if (err) {
            this.fastify.log.error('Failed to execute query: ' + err.message)
            reject(err)
          } else {
            resolve(rows)
          }
        },
      })
    })
  }

  public async getSchemaDefinition(internalTool: InternalTool, table: string) {
    const connection = await this.createConnection(internalTool)
    try {
      await this.connect(connection)
      const query = `SELECT GET_DDL('TABLE', '${table}') as RESULT`
      const rows = await this.executeQuery(connection, query)

      return rows[0].RESULT
    } catch (error) {
      this.fastify.log.error('An error occurred getting the schema:', error)
      throw error
    } finally {
      await this.disconnect(connection)
    }
  }

  public async getSqlResults(
    input: string,
    internalTool: InternalTool,
    parentId?: string,
  ) {
    const connection = await this.createConnection(internalTool)

    try {
      await this.connect(connection)
      const rows = await this.executeQuery(connection, input)

      await this.req.services.costTracking.trackToolCall(internalTool)

      const result = await this.getSql(rows, parentId)

      return result
    } catch (error) {
      this.fastify.log.error('An error occurred:', error)
      throw error
    } finally {
      await this.disconnect(connection)
    }
  }

  public async getSql(rows, parentId?: string) {
    let spanId: string
    try {
      spanId = this.req.services.arize.initializeSpanSnowflakeToolCall(
        rows,
        parentId,
      )
      const result = JSON.stringify(rows)
      this.req.services.arize.setSpanOutputValue(spanId, result)
      this.req.services.arize.finalizeSpan(spanId)

      return result
    } catch (error) {
      this.req.services.arize.setErrorSpanStatus(spanId, error)
    }
  }
}
