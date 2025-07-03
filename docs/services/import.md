[Back](../../README.md)

# File Import Service Documentation

This service is responsible for handling file import operations. It includes the following methods:

## Method: saveRequestFiles

This method saves the files from the request.

**Returns:**

- An array of saved files.

If no files are uploaded, it throws a `NotFound` error.

## Method: parseReqBody

This method parses the request body.

**Parameters:**

- `fields`: The fields from the file object.

**Returns:**

- The parsed data.

## Method: chunkFile

This method chunks the file into smaller parts.

**Parameters:**

- `filename`: The name of the file.
- `path`: The path where the file is located.
- `type`: The type of the file.

**Returns:**

- An array of chunks.

## Method: upload

This method uploads a chunk to Azure Blob Storage.

**Parameters:**

- `chunk`: The chunk to be uploaded.
- `name`: The name of the chunk.

If the upload fails, it sets the document status to `FAILED` and throws an `InternalServerError`.

## Method: resetIndexer

This method resets the indexer in Azure Cognitive Search.

**Parameters:**

- `indexer`: The indexer to be reset.

After all chunks are uploaded and the indexer is reset, it sets the document status to `TRAINED`.

Please note that this is a high-level overview of the service. For detailed implementation, refer to the source code.
