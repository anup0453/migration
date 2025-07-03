import { path } from 'app-root-path'
import { execSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { readJsonSync } from 'fs-extra'
import camelCase from 'lodash/camelCase'
import { join, resolve } from 'path'
import prettier from 'prettier'
import * as TJS from 'typescript-json-schema'
import yargs from 'yargs'

import '../../env'
import { logger } from '../utils'
import { ModelConnector } from './helper/models'

const modelConnector = new ModelConnector()

const cleanSchema = (str: string): string => {
  return str
    .replace(
      /"\$ref":"[A-Za-z]+#\/definitions\/Types\.ObjectId"/g,
      '"type":"string"',
    )
    .replace(
      /"\$ref":"[A-Za-z]+#\/definitions\/Types\.ObjectId\.+[a-z0-9]+"/g,
      '"type":"string"',
    )
    .replace(/<+[a-zA-Z]+>+/g, (match) => match.replace(/<|>/g, ''))
    .replace(
      /:\{"type":"number"\}/g,
      ':{"anyOf":[{"type":"number"},{"type":"null"}]}',
    ) // Inifinity is null in JSON.
    .replace(/\.+[a-z0-9]+"/g, '"') // remove unique names
}

const pascalCase = (str: string): string => {
  str = camelCase(str)

  return str.charAt(0).toUpperCase() + str.slice(1)
}

const createSchema = async () => {
  const { force } = await yargs
    .option('force', {
      alias: 'f',
      type: 'boolean',
      description: 'Force schema creation',
      boolean: true,
    })
    .parse()

  if (!force) {
    const nameCommand = execSync(`git diff --name-only`).toString()
    if (!nameCommand.includes('src/models/')) {
      logger.info(
        '\nNo models were changed, assuming no schema changes.\nUse -f to force schema creation.\n',
      )

      return
    }
  }

  const normalizedPath = path.replace(/\\/g, '/')

  const settings: TJS.PartialArgs = {
    required: false,
    noExtraProps: true,
    uniqueNames: true,
    id: '--schema-id--',
  }
  const requiredSettings: TJS.PartialArgs = {
    required: true,
    noExtraProps: true,
    uniqueNames: true,
  }

  const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true,
  }

  const program = TJS.getProgramFromFiles(
    [
      resolve(join('src', 'models', 'types', 'index.ts')),
      resolve(join('src', 'models', 'types', 'extra.ts')),
    ],
    compilerOptions,
  )
  const generator = TJS.buildGenerator(program, settings)
  const requiredGenerator = TJS.buildGenerator(program, requiredSettings)
  const models = await modelConnector.initModels(process.env.DATABASE)
  const modelList = Object.keys(models)
    .map((n) => [n, camelCase(`search_${n}`), camelCase(`upload_${n}`)])
    .flat()

  logger.info('Generating schema for models:', modelList)

  let text = ''
  for (const model of modelList) {
    const symbolList = generator.getSymbols(pascalCase(model))
    const reqSymbolList = requiredGenerator.getSymbols(pascalCase(model))
    const symbol = symbolList.find((s) =>
      s.fullyQualifiedName.includes(normalizedPath),
    )
    const reqSymbol = reqSymbolList.find((s) =>
      s.fullyQualifiedName.includes(normalizedPath),
    )

    if (!symbol || !reqSymbol) {
      continue // doesn't exist
    }
    const schema = generator.getSchemaForSymbol(symbol.name, true)
    const required =
      requiredGenerator.getSchemaForSymbol(reqSymbol.name, true).required || []

    for (const key in schema?.definitions) {
      if (key.startsWith('Types.ObjectId.')) {
        delete schema.definitions[key]
      }
    }
    if (schema?.required) {
      delete schema.required
    }
    if (model.startsWith('search')) {
      delete schema.properties.data['items'].required
    }

    text += `export const ${pascalCase(model)}Schema = ${JSON.stringify(
      schema,
    ).replace(/--schema-id--/g, pascalCase(model))}\n\n`
    text += `export const ${pascalCase(model)}RequiredFields = ${JSON.stringify(
      required.filter((f) => !['_id'].includes(f)),
    )}\n\n`
  }

  const prettierConfig = readJsonSync(join(process.cwd(), '.prettierrc.json'))
  const formattedContent = prettier.format(cleanSchema(text), {
    ...prettierConfig,
    parser: 'babel-ts',
  })

  if (!existsSync(join('src', 'schemas'))) {
    mkdirSync(join('src', 'schemas'), { recursive: true })
  }

  writeFileSync(join('src', 'schemas', 'schema.ts'), formattedContent, 'utf8')
}

createSchema()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error(err)
    process.exit(1)
  })
  .finally(() => modelConnector.closeModels())
