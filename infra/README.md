# Infrastructure Deployment

This folder contains the Bicep deployment for VERIFIBOT. It creates the Azure
resources used by the frontend, backend, and supporting services, then GitHub
Actions handles application deployments after code is pushed.

## Story In Short

First, deploy the Azure infrastructure with `infra/main.bicep`. Then connect
GitHub Actions to the new Azure resources with two secrets:

- `AZURE_STATIC_WEB_APPS_API_TOKEN` deploys the frontend to Azure Static Web Apps.
- `AZURE_CREDENTIALS` lets GitHub Actions deploy the backend to Azure Container Apps.

After that, normal pushes to `main` update the app:

- Changes in `frontend/**` trigger the Static Web Apps deployment.
- Changes in `backend/**` trigger the Container Apps deployment.
- Infrastructure changes still require running the Bicep deployment command.

## Resources

By default, the template creates:

- Resource group
- Azure Static Web App for the Vite frontend
- Azure Container Registry for backend images
- Azure Container Apps environment
- User-assigned managed identity for backend image pulls
- Azure Container App for the FastAPI backend
- `AcrPull` role assignment from the backend identity to ACR
- Log Analytics workspace
- Microsoft Foundry resource and project
- Azure AI Search service
- Azure Cosmos DB for NoSQL account

Azure Key Vault is included, but disabled by default.

## Login And Select Subscription

```powershell
az login
az account list --output table
az account set --subscription "<subscription-id>"
```

Validate the template before deploying:

```powershell
az bicep build --file infra/main.bicep
```

## Region Selection

For Mexico, start with:

```text
centralus
```

Good fallbacks are:

```text
westus2
eastus2
```

Two Azure errors are common during migration:

- `LocationNotAvailableForResourceType`: the resource type does not support that region.
- `RequestDisallowedByAzure`: the subscription policy blocks that region.

Use a region that is both supported by the resource type and allowed by the
subscription. For Azure Static Web Apps, Azure may reject regions such as
`eastus` or `westus` even when they look geographically reasonable. Use the
region list shown in the error message.

Cosmos DB uses a display name parameter. Keep it aligned with `rgLocation`:

```text
centralus -> Central US
westus2   -> West US 2
eastus2   -> East US 2
```

## Deploy Infrastructure

Basic deployment:

```powershell
az deployment sub create `
  --name MAIN `
  --location centralus `
  --template-file infra/main.bicep `
  --subscription "<subscription-id>" `
  --parameters rgLocation="centralus" staticWebAppLocation="centralus" cosmosLocationName="Central US"
```

If deploying to a new subscription while the old Azure resources still exist,
use unique names for globally reserved services:

```powershell
az deployment sub create `
  --name MAIN `
  --location westus2 `
  --template-file infra/main.bicep `
  --subscription "<subscription-id>" `
  --parameters `
    rgLocation="westus2" `
    staticWebAppLocation="westus2" `
    cosmosLocationName="West US 2" `
    containerRegistryName="<unique-acr-name>" `
    cosmosAccountName="<unique-cosmos-name>" `
    foundryName="<unique-foundry-name>" `
    searchServiceName="<unique-search-name>" `
    staticWebAppRepositoryToken="<github-repository-token>"
```

The following names are globally unique or DNS-like and commonly need new values
when moving subscriptions:

```text
containerRegistryName
cosmosAccountName
foundryName
searchServiceName
keyVaultName
```

Do not paste real tokens into source control or chat. If a token is exposed,
revoke it and create a new one.

## Static Web Apps

The frontend is a Vite app, so the build output must be `dist`:

```text
App location: ./frontend
API location: empty
Output location: dist
App artifact location: dist
Deployment authorization policy: GitHub
```

The Bicep module sets both `outputLocation` and the older
`appArtifactLocation` field to `dist`.

To let Azure create or repair the Static Web Apps GitHub workflow, pass a GitHub
repository token:

```powershell
--parameters staticWebAppRepositoryToken="<github-repository-token>"
```

The token must have permission to update repository contents, workflows, actions,
and secrets. This token belongs to GitHub, not Azure.

For ongoing frontend deployments, GitHub Actions needs:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN
```

Get it from:

```text
Azure Portal
Static Web App
Manage deployment token
```

Add it to GitHub:

```text
Repository Settings
Secrets and variables
Actions
New repository secret
Name: AZURE_STATIC_WEB_APPS_API_TOKEN
Value: <deployment token>
```

If you recreate the Static Web App in another subscription, replace this secret
with the token from the new Static Web App.

## Backend Container Apps

The backend workflow is:

```text
.github/workflows/backend-container-app.yml
```

It builds the Docker image from `backend/`, pushes it to ACR, and updates the
Azure Container App.

Create a service principal for GitHub Actions in the target subscription:

```powershell
az ad sp create-for-rbac `
  --name "github-unesco-verifibot-deploy" `
  --role contributor `
  --scopes "/subscriptions/<subscription-id>/resourceGroups/unesco-services" `
  --sdk-auth
```

Copy the full JSON output into GitHub:

```text
Repository Settings
Secrets and variables
Actions
New repository secret
Name: AZURE_CREDENTIALS
Value: <full JSON output>
```

This service principal is the deployment identity. The running Container App uses
a separate user-assigned managed identity to pull private images from ACR.

If `containerRegistryName` changes, update the backend workflow:

```yaml
ACR_NAME: <unique-acr-name>
```

## Optional Key Vault

Key Vault is disabled by default:

```bicep
param deployKeyVault bool = false
```

Enable it only when needed:

```powershell
az deployment sub create `
  --name MAIN `
  --location centralus `
  --template-file infra/main.bicep `
  --subscription "<subscription-id>" `
  --parameters deployKeyVault=true keyVaultName="<globally-unique-key-vault-name>"
```

## Troubleshooting

If Cosmos DB is left in a failed provisioning state, delete only that failed
Cosmos account and redeploy:

```powershell
az cosmosdb delete `
  --name "<cosmos-account-name>" `
  --resource-group "unesco-services" `
  --subscription "<subscription-id>" `
  --yes
```

If Static Web Apps is stuck on the default page, check:

- The Static Web Apps workflow exists in GitHub Actions.
- `AZURE_STATIC_WEB_APPS_API_TOKEN` points to the current Static Web App.
- The workflow uses `./frontend` and `dist`.

Do not delete the full environment for a frontend issue. Delete only the Static
Web App resource if it must be recreated.

## Files

| File                                      | Service                          |
| ----------------------------------------- | -------------------------------- |
| `main.bicep`                              | Deployment orchestration         |
| `modules/resource-group.bicep`            | Azure Resource Group             |
| `modules/static-web-app.bicep`            | Azure Static Web Apps            |
| `modules/container-registry.bicep`        | Azure Container Registry         |
| `modules/container-app-environment.bicep` | Azure Container Apps Environment |
| `modules/managed-identity.bicep`          | User-assigned managed identity   |
| `modules/container-app.bicep`             | Azure Container Apps backend     |
| `modules/acr-pull-role-assignment.bicep`  | AcrPull role assignment          |
| `modules/key-vault.bicep`                 | Azure Key Vault                  |
| `modules/foundry.bicep`                   | Microsoft Foundry                |
| `modules/ai-search.bicep`                 | Azure AI Search                  |
| `modules/cosmos-nosql.bicep`              | Azure Cosmos DB for NoSQL        |
