import { MultipartFile } from '@fastify/multipart'

export interface ExtendedMultipartFile extends MultipartFile {
  originalname?: string
  size?: number
  buffer?: Buffer
  filepath?: string
}

export interface IFileImportData {
  target?: string
}
