import pino from 'pino'
import pretty from 'pino-pretty'

const stream = pretty({
  levelFirst: true,
  colorize: true,
  translateTime: 'HH:MM:ss Z',
  ignore: 'pid, hostname',
})

export const logger = pino(
  {
    name: 'GATEWAY-LOG',
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  },
  stream,
)
