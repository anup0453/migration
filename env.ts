import appRootPath from 'app-root-path'
import dotenv from 'dotenv'
import { existsSync } from 'fs'

// TODO: check if can be simplified -> isn't  it always .env independent of the environment ?
dotenv.config({
  debug: process.env.NODE_ENV === 'development',
  path: existsSync(`${appRootPath.path}/.env.${process.env.NODE_ENV}`)
    ? `${appRootPath.path}/.env.${process.env.NODE_ENV}`
    : `${appRootPath.path}/.env`,
})
