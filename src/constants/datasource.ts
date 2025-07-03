export enum DatasourceEnum {
  BLOB = 'azureBlobStorage',
  POLARION = 'polarion',
  SHAREPOINT = 'sharepoint',
  WEBSITE = 'website',
  API = 'api',
  WIKI = 'wiki',
}

export enum ParsingStatusEnum {
  priorityRestart = 'priorityRestart',
  queued = 'queued',
  processing = 'processing',
  error = 'error',
  processed = 'processed',
}

export enum TextSplitterStrategy {
  TOKEN = 'token',
  DELIMITER = 'delimiter',
}
