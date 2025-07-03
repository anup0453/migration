import { existsSync, mkdirSync } from 'fs-extra'

export function createFolderIfNotExists(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
}
