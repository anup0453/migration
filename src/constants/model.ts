export enum ModelGenre {
  GPT_35_16k = 'gpt-35-turbo-16k',
  GPT_35 = 'gpt-35-turbo',
  GPT_4T = 'gpt-4-turbo',
  GPT_4 = 'gpt-4',
  GPT_4O = 'gpt-4o',
  ADA_002 = 'text-embedding-ada-002',
  TRANSLATION = 'translation',
}

export enum ModelTokens {
  GPT_35_16k_LIMIT = 16000,
  GPT_35_LIMIT = 4096,
  GPT_4T_LIMIT = 128000,
  GPT_4O_LIMIT = 128000,
}

// SEE https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/ for details
export enum ModelPrice {
  GPT_35T_16k_INCOMING = 0.0000015, // 0613
  GPT_35T_16k_OUTGOING = 0.0000005, // 0613
  GPT_35T_INCOMING = 0.0000019, // 1106
  GPT_35T_OUTGOING = 0.000001, // 1106
  GPT_4T_INCOMING = 0.000028, // 1106-Preview
  GPT_4T_OUTGOING = 0.00001, // 1106-Preview
  GPT_4O_INCOMING = 0.000014,
  GPT_4O_OUTGOING = 0.000047,
  ADA_002_TOKEN = 0.00000093, // 0.00093 EUR per 1000 tokens -> https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/
  TRANSLATION_CHARACTER = 0.009261, // 0.9261€ per 1.000.000 chars -> https://azure.microsoft.com/en-us/pricing/details/cognitive-services/translator/
}
