import { getType } from 'mime'

import {
  ImageMimeTypesEnum,
  OfficeMimeTypesEnum,
  PdfMimeTypesEnum,
  SpreadsheetMimeTypesEnum,
  SupportedMimeTypesEnum,
  XMLTypesEnum,
} from '../constants'
import BaseService from './base'

export default class FileService extends BaseService {
  public getFileType(filePath: string) {
    const mimeType = getType(filePath)
    const isSupported = (
      Object.values(SupportedMimeTypesEnum) as string[]
    ).includes(mimeType)
    const isOffice = (Object.values(OfficeMimeTypesEnum) as string[]).includes(
      mimeType,
    )
    const isSpreadsheet = (
      Object.values(SpreadsheetMimeTypesEnum) as string[]
    ).includes(mimeType)
    const isImage = (Object.values(ImageMimeTypesEnum) as string[]).includes(
      mimeType,
    )
    const isXML = (Object.values(XMLTypesEnum) as string[]).includes(mimeType)

    const isPdf = mimeType === PdfMimeTypesEnum.PDF

    return {
      mimeType: mimeType || 'unknown',
      isPdf,
      isSpreadsheet,
      isImage,
      isSupported,
      isOffice,
      isXML,
    }
  }
}
