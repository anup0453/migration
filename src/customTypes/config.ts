export interface IConfig {
  baseUrl?: string
  database: {
    url: string
    user?: string
    password?: string
  }
  env?: string
  paths?: {
    [key: string]: string
  }
  port?: number
  services: {
    [name: string]: {
      [key: string]: string
    }
  }
}
