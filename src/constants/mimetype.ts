export enum OtherMimeTypesEnum {
  HTML = 'text/html',
  JSON = 'application/json',
  MARKDOWN = 'text/markdown',
  TXT = 'text/plain',
  CSV = 'text/csv',
  XHTML = 'application/xhtml+xml',
}

export enum OfficeMimeTypesEnum {
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  OCTET_STREAM = 'application/octet-stream',
  ODT = 'application/vnd.oasis.opendocument.text',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}

export enum XMLTypesEnum {
  XML = 'application/xml',
}

export enum SpreadsheetMimeTypesEnum {
  NUMBERS = 'application/vnd.apple.numbers',
  ODS = 'application/vnd.oasis.opendocument.spreadsheet',
  RTF = 'application/rtf',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export enum LegacyOfficeMimeTypesEnum {
  DOC = 'application/msword',
  PPT = 'application/mspowerpoint',
}

export enum PdfMimeTypesEnum {
  PDF = 'application/pdf',
  XPDF = 'application/x-pdf',
  BZPDF = 'application/x-bzpdf',
  GZPDF = 'application/x-gzpdf',
}

export enum ImageMimeTypesEnum {
  BMP = 'image/bmp',
  GIF = 'image/gif',
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  TIFF = 'image/tiff',
}

export const SupportedMimeTypesEnum = {
  ...PdfMimeTypesEnum,
  ...OtherMimeTypesEnum,
  ...ImageMimeTypesEnum,
  ...OfficeMimeTypesEnum,
  ...SpreadsheetMimeTypesEnum,
  ...XMLTypesEnum,
} as const
