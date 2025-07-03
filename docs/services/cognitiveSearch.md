[Back](../../README.md)

# Cognitive Search Service Documentation

This service is responsible for handling operations related to Azure Cognitive Search (new name since 2023-11: AI Search).

## General remarks about Azure Cognitive Search / AI Search

### Indexes

- Every index is tied to a datasource (usually an Azure Blob Storage).
- Every index is tied to an indexer (the function that reads information from the data source and adds the extracted data to the index).
- Every index is tied to one customer of the pipeline.
- Every index can be queried by all users of the customer.

### Indexers

- Indexers are handling information extraction from datasources.
- Every indexer is tied to one skillset (more than one is by definition of Azure not possible).
- Every indexer can run on schedules and manually be triggered.
- The pipeline provides functions to manually run re-indexing/index-updates and resets of indexers.
- Re-setting an indexer does not update the index, it only resets the information about previous runs, so the next indexer run (manual or automatic) will re-read the entire datasource.

### Data sources

- For the time being, the pipeline expects datasources to be Azure Blob Storages.
- TODO: Data sources could also be Data Lake, CosmosDB, Azure SQL DBs or Azure Table Storages.

### Skillsets

- Skillsets are a set of functions that Azure runs during indexing processes.
- Examples for skillsets are: Data chunking, OCR, Translation.
- Skillsets can be defined independently from the indexers that use them.
- Every indexer has one attached skillset.

### Do's and Don'ts for Cognitive Search

**DO**

- add new indexes and datasources
- remove old or unused indexes, indexers and datasources (as all the three are connected, it only makes sense to delete all of them together)
- monitor quotas for single indexes as well as for the entire instance of CS. Both is very limited right now and might need a larger plan soon.

**DON'T**

- Change or delete skillsets that are tied to production indexers (changes will lead to unexpected results for customers using the skillset).
- Change or delete data sources that are tied to production indexers.
- Change or delete indexes that are in production use.
- Create lots of new customers in your local dev environment with production CS credentials: **the number of indexes per instance is limited**.

The local service includes the following methods:

## Method: createDataSourceConnection

This method creates a new data source connection for Azure Cognitive Search.

**Parameters:**

- `name`: The name of the data source connection.
- `containerConnectionString`: The connection string to the Azure Blob Storage container.
- `containerName`: The name of the Azure Blob Storage container.

**Returns:**

- The newly created data source connection.

## Method: createIndex

This method creates a new index in Azure Cognitive Search.

**Parameters:**

- `name`: The name of the index.
- `fields`: The fields to be included in the index. The fields are obtained from the `getDefaultIndexFields` method.

**Returns:**

- The newly created index.

## Method: deleteIndex

This method deletes an existing index in Azure Cognitive Search.

**Parameters:**

- `name`: The name of the index to be deleted.

**Returns:**

- The response from the Azure Cognitive Search service after the deletion operation.

## Method: listIndexes

This method lists all the indexes in the Azure Cognitive Search service.

**Returns:**

- A list of all indexes in the Azure Cognitive Search service.

Please note that this is a high-level overview of the service. For detailed implementation, refer to the source code.
