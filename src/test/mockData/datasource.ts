export const datasourceBlobData = {
  displayName: 'My test datasource',
  frequency: '24h',
  settings: {
    azureBlobStorage: {
      connectionString: process.env.SYSTEMTEST_BLOB_STORAGE_CONNECTION_STRING,
      containerName: process.env.SYSTEMTEST_BLOB_STORAGE_CONTAINER_NAME,
    },
  },
}

export const datasourceWebsiteData = {
  displayName: 'My crawler test datasource',
  frequency: '24h',
  settings: {
    website: {
      rootUrl: 'https://en.wikipedia.org/wiki/Main_Page',
      urlWhiteList: [],
      recursionDepth: 3,
      useMarkdown: true,
    },
  },
}

export const datasourceWebsiteData2 = {
  displayName: 'My crawler test datasource2',
  frequency: '24h',
  settings: {
    website: {
      rootUrl: 'https://en.wikipedia.org/wiki/Main_Page',
      urlWhiteList: [],
      recursionDepth: 3,
      useMarkdown: true,
    },
  },
}
