[Back](../../README.md)

# OpenAI Service Documentation

This service is responsible for handling operations related to OpenAI.

## General remarks and features

### Azure OpenAI limitations

- Azure OpenAI has very strict quotas, these need to be monitored closely.
- As of today (2023-11-28) we only use `GPT-35-turbo` and `ada` (pure text extraction) as models. An update might be sensible soon.

### Azure OpenAI and Load Balancer

The project requires Azure OpenAI. It provides a load balancer to handle a high load on Azure OpenAI requests that would
otherwise exceed the allowed tokens per minute.

To make use of the loadbalancer add multiple instances of Azure OpenAI via .env as follows:

```
AZURE_OPENAI_API_VERSION='used_API_version' # same for all instances in use
AZURE_OPENAI_API_URL_1='url for instance 1'
AZURE_OPENAI_API_KEY_1='api key for instance 1'
AZURE_OPENAI_API_ENGINE_1='deployment name for instance 1'
AZURE_OPENAI_API_URL_2='url for instance 2'
AZURE_OPENAI_API_KEY_2='api key for instance 2'
AZURE_OPENAI_API_ENGINE_2='deployment name for instance 2'
.
.
.
```

The load balancer is running all incoming requests in round-robin principle. Any more sophisticated strategy can be
applied in the BaseService.

The pipeline's OpenAI service includes the following methods:

## Method: chat

This method sends a chat message to the OpenAI API and retrieves the response.

**Parameters:**

- `body`: An object of type `IChatCompletionBody` which includes the message content, history, and maximum tokens.

**Returns:**

- The response from the OpenAI API, which includes the AI-generated message.

The method works as follows:

1. It extracts the last message from the `body.messages` array and uses it as the current message to be sent to the OpenAI API.
2. It finds a system message from the `body.messages` array. If no system message is found, it uses a default system message.
3. It calls the `getAndSummarizeIfRequired` method to get the summarized version of the chat history if required.
4. It adds the system message as the first message in the `messages` array.
5. It calls the OpenAI API with the `messages` array and the API engine.
6. If the OpenAI API does not return any choices, it throws an `InternalServerError`.

Please note that this is a high-level overview of the service. For detailed implementation, refer to the source code.
