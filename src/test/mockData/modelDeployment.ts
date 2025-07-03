export const llmModelDeploymentData = {
  instanceName: process.env.TEST_LLM_MODEL_DEPLOYMENT_INSTANCE_NAME,
  endpoint: process.env.TEST_LLM_MODEL_DEPLOYMENT_ENDPOINT,
  deploymentName: process.env.TEST_LLM_MODEL_DEPLOYMENT_DEPLOYMENT_NAME,
  modelName: process.env.TEST_LLM_MODEL_DEPLOYMENT_MODEL_NAME,
  modelVersion: process.env.TEST_LLM_MODEL_DEPLOYMENT_MODEL_VERSION,
  openAiVersion: process.env.TEST_LLM_MODEL_DEPLOYMENT_OPENAI_VERSION,
  isPTU: process.env.TEST_LLM_MODEL_DEPLOYMENT_IS_PTU,
  key: process.env.TEST_LLM_MODEL_DEPLOYMENT_KEY,
  region: process.env.TEST_LLM_MODEL_DEPLOYMENT_REGION,
  type: process.env.TEST_LLM_MODEL_DEPLOYMENT_TYPE,
}

// data for element that gets deleted
export const embeddingModelDeploymentData = {
  instanceName: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_INSTANCE_NAME,
  endpoint: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_ENDPOINT,
  deploymentName: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_DEPLOYMENT_NAME,
  modelName: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_MODEL_NAME,
  modelVersion: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_MODEL_VERSION,
  openAiVersion: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_OPENAI_VERSION,
  isPTU: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_IS_PTU,
  key: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_KEY,
  region: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_REGION,
  type: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_TYPE,
}

export const secondEmbeddingModelDeploymentData = {
  instanceName: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_INSTANCE_NAME + '2',
  endpoint: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_ENDPOINT + '2',
  deploymentName:
    process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_DEPLOYMENT_NAME + '2',
  modelName: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_MODEL_NAME,
  modelVersion: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_MODEL_VERSION,
  openAiVersion: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_OPENAI_VERSION,
  isPTU: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_IS_PTU,
  key: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_KEY,
  region: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_REGION,
  type: process.env.TEST_EMBEDDING_MODEL_DEPLOYMENT_TYPE,
}
