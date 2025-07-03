# Siemens DI Bot GAIA

This API is managing creation, handling and setup of gateway accesses to different custom Azure OpenAI indexes with custom data.

## Prerequisites

### Windows

- Download and install Node.js version 22.14.0
  (download .msi file here: https://nodejs.org/download/release/v22.14.0)

- Optional: install [nvm](https://github.com/nvm-sh/nvm) if you use several versions of Node.js

- Download and install mongodb version 7.x
  (https://www.mongodb.com/try/download/community)

- Azure cli
  (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)

### Unix

- Download and install Node.js version 18.x (latest v18)

- Optional: install [nvm](https://github.com/nvm-sh/nvm) if you use several versions of Node.js

- Download and install MongoDB (7.x is working fine)

- Azure cli
  (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)

## Configuration

- Copy `.env.template` and rename your copy to `.env`

**Remark: The env management supports stage-specific .env files, so `.env.development` would be first choice for a local environment called `development`. Only if it does not find that, it will go for a .env file with no extension.**

## Installation

**Install yarn**

`npm i -g yarn`

**Install dependencies**

`yarn install`

**Run dev mode (works in Windows and on Linux)**

`yarn dev`

**Build for production**

`yarn build`

**Build for Azure**

`yarn build:all`

**Initalize model deployments locally**

To initialize model deployments locally, follow these steps:

1. Run your gateway-code with `yarn dev`.
2. Make sure azure-cli is installed on your machine.
3. Adjust the command: `.\initModelDeployments.ps1 -baseUrl <BASEURL> -token "<BASE-64-ENCODED-TOKEN>" -environment <ENVIRONMENT>` by replacing the values. Pay special attention to what is not in String.
   - **BASEURL** by the Base-URL where your local app is listening to, for example "http://localhost:7000".
   - **BASE-64-ENCODED-TOKEN** by the Base 64-encoded admin token (I usually copy it from the Postman header of the 'create Customer' request).
   - **ENVIRONEMTN** by one of the environments dev, stage or prod
   - Example: `.\initModelDeployments.ps1 -baseUrl http://localhost:7000 -token "Basic wefhowefowhfowhfowhfoweh" -environment dev`
4. Execute the modified command in your terminal.
5. Check you local MongoDB if the table "modelDeployment" got created and is filled with model deployments.

### Azure WebApp Configuration and GitHub Workflows

Each azure environment (note eg. `.dev.` in file name) with github workflow is using files:

- .env_azure_config.dev.json
- .env_azure_config.stage.json
- .env_azure_config.prod.json

Each of these files is an input for az cli command that is patching Azure WebApp.

Note that there are special notation for secrets. This is `@Microsoft.KeyVault(SecretUri=https://app-gaia-dev-kv.vault.azure.net/secrets/ADMIN-EMAIL/`. With this value, secret is not stored on AzureWebApp directly, but it's being kept in Azure KeyVault under more strict control. Ref: https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references?tabs=azure-cli#source-app-settings-from-key-vault

Anytime you need to use new secret in config, add it first to all 3 (dev/stage/prod) AKVs, and then simply reference it with above notation.

Managed Identities are used to auth requests against AKV. These have "Key Vault Secrets User" role assigned.

## Repo dependencies

### Database

Data is stored in NoSQL. In any other stage than local developmentthis handled by using Azure CosmosDB MongoDB connector.

**Remark: Azure Cosmos DB is currently (2023-11-25) tied to MongoDB version 4.2.**

### NodeJS

The project is running in Node 18.18.2.

## API Flow and Features

- All incoming requests are handles by defined controllers, which can be found in `src/controllers`.
- Controllers do not hold any logic but user access management.
- Controllers point to functions in services, which perform the actual work.

## Azure

This service heavily relies on Azure resources.

Deeper knowledge about the way, these resources are integrated can be found here:

- [Azure OpenAI](docs/services/openAi.md)
- [Azure AI Search (previously known as Cognitive Search)](docs/services/cognitiveSearch.md)
- [CosmosDb](docs/cosmosDb.md)

## User Access

Detailed user mangement and user access rights can be found [here](docs/services/users.md).

## Customer Management

Customers are the organisational unit for tenants. Details about the handling can be found [here](docs/services/customers.md).

## Gateway Hotfix deployment

There is a way to do quick hotfix deployment for production environment. This is usefull in situation where "develop" or "release" branches have alreay some changes we don't want to push directly to prod following "normal" dev->stage->prod process. See more details [here](docs/processes/hotfix.md)

## AI Training and Finetuning

There are multiple ways to add data to the Pipeline, respectively to the current user's index:

1. Via API: using the `POST /v1/import` endpoints for files or URLs. See [Import](docs/services/import.md) for more information.
2. Via Blob Storage: direct file upload into the attached blob storage and running the indexer (or wait for the scheduled updates.). See [Import](docs/services/import.md) for more information.

## Worst case scenarios

- CosmosDB MongoDB restore -> can be found [here](docs/processes/DR-cosmosDb.md)
- Infrastructure restore -> can be found [here](docs/processes/DR-infra.md)
  - NOTE: AI Search -> as of today there is no "restore" mechanism for data inside AI search (https://learn.microsoft.com/en-us/azure/search/search-reliability#back-up-and-restore-alternatives): ![alt text](docs\processes\files\DR.AISearch.Restore.Note.PNG)
- ChatBot Frontends -> instructuon to restore frontends can be found here -> https://github.siemens.cloud/OpenAIatDI/di-bot-chat/tree/main/infra
