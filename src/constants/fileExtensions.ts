export enum SupportedFileExtensionsEnum {
  TXT = '.txt',
  DOCX = '.docx',
  XLSX = '.xlsx',
  PPTX = '.pptx',
  PDF = '.pdf',
  HTML = '.html',
  CSV = '.csv',
  MD = '.md',
  XLS = '.xls',
  NUMBERS = '.numbers',
  JSON = '.json',
  RTF = '.rtf',
  XML = '.xml',
  ASPX = '.aspx',
  YAML = '.yaml',
  YML = '.yml',
  PROPERTIES = '.properties',
  CONFIG = '.config',
}

export const supportedFileExtensions = Object.values(
  SupportedFileExtensionsEnum,
)
