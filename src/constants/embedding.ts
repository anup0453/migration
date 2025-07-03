export enum EmbeddingRequestType {
  INDEXATION = 'indexation', // during the chunking process
  REQUEST = 'request', // during the chat request process
  MANUAL = 'manual', // manually embedding request by the user
  PLAIN = 'plain', // plain embedding request
}
