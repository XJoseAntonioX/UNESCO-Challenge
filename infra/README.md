# Infrastructure Deployment

This folder contains the Azure infrastructure for VERIFIBOT. The deployment is
written in Bicep and organized with one orchestration file plus small service
modules.

The goal is to let another developer recreate the cloud environment, deploy the
frontend to Azure Static Web Apps, deploy the backend to Azure Container Apps,
and enable GitHub Actions to update the backend whenever code changes are pushed.

## What Gets Created

By default, `infra/main.bicep` deploys:

- Resource group: `unesco-services`
- Azure Static Web App for the Vite frontend
- Azure Container Registry for backend images
- Azure Container Apps managed environment
- Azure Container App for the FastAPI backend
- Log Analytics workspace for Container Apps logs
- Microsoft Foundry resource and default project
- Azure AI Search service
- Azure Cosmos DB for NoSQL account

Azure Key Vault is included as a module, but it is disabled by default until the
project needs it.

## Requirements

- Azure CLI installed
- Bicep support enabled in Azure CLI
- Access to the target Azure subscription
- Permission to create resources and role assignments
- A GitHub repository for the project

Log in first:

```powershell
az login
```

Check available subscriptions:

```powershell
az account list --output table
```

Select the subscription:

```powershell
az account set --subscription "<subscription-id-or-name>"
```

For this project, the current subscription ID is:

```text
6df3f8ce-cb5a-4511-a5dc-c91c703f3257
```

## Validate The Template

Before deploying, compile the Bicep file:

```powershell
az bicep build --file infra/main.bicep
```

This catches syntax and schema issues before Azure starts creating resources.

## Deploy The Infrastructure

Run this command from the repository root:

```powershell
az deployment sub create `
  --name MAIN `
  --location southcentralus `
  --template-file infra/main.bicep `
  --subscription "6df3f8ce-cb5a-4511-a5dc-c91c703f3257"
```

The `--location` value is the location where Azure stores the subscription-level
deployment metadata. The actual resource locations are controlled by parameters
inside `main.bicep`.

Current defaults:

```text
Resource group location: southcentralus
Static Web App location: centralus
```

If Azure says that deployment `MAIN` already exists in another location, either
use a new deployment name or delete the old deployment record. Deleting a
deployment record does not delete the resources it created.

Use a new deployment name:

```powershell
az deployment sub create `
  --name main-verifibot `
  --location southcentralus `
  --template-file infra/main.bicep `
  --subscription "6df3f8ce-cb5a-4511-a5dc-c91c703f3257"
```

Or delete the old deployment record:

```powershell
az deployment sub delete `
  --name MAIN `
  --subscription "6df3f8ce-cb5a-4511-a5dc-c91c703f3257"
```

Then rerun the deployment with `--name MAIN`.

## Optional Key Vault

Key Vault deployment is disabled by default:

```bicep
param deployKeyVault bool = false
```

This avoids deployment failures while the project does not need a vault. Azure
Key Vault names are globally unique, so placeholder names are often already used
or reserved by soft delete.

To deploy every service, including Azure Key Vault, pass a unique name:

```powershell
az deployment sub create `
  --name MAIN `
  --location southcentralus `
  --template-file infra/main.bicep `
  --subscription "6df3f8ce-cb5a-4511-a5dc-c91c703f3257" `
  --parameters deployKeyVault=true keyVaultName="<globally-unique-key-vault-name>"
```

If the Key Vault name was recently deleted, recover or purge the deleted vault
before reusing the name.

## Backend CI/CD Identity

The backend deployment workflow lives in:

```text
.github/workflows/backend-container-app.yml
```

That workflow needs permission to deploy to Azure. GitHub Actions cannot update
Azure Container Apps by itself; it needs a Microsoft Entra ID identity for
automation.

The recommended command creates:

- A Microsoft Entra ID application
- A service principal for that application
- An Azure RBAC role assignment scoped to the `unesco-services` resource group

It does not bypass Microsoft Entra ID. It creates an Entra ID identity that
GitHub Actions can use for automated deployments.

Create the service principal:

```powershell
az ad sp create-for-rbac `
  --name "github-unesco-verifibot-deploy" `
  --role contributor `
  --scopes "/subscriptions/6df3f8ce-cb5a-4511-a5dc-c91c703f3257/resourceGroups/unesco-services" `
  --sdk-auth
```

The command prints a JSON object. Copy the full JSON output and save it as a
GitHub repository secret:

```text
Repository Settings
Secrets and variables
Actions
New repository secret
Name: AZURE_CREDENTIALS
Value: <paste the JSON output>
```

The workflow uses this secret in the Azure login step. After that, every push to
`main` that changes files under `backend/` will build a new backend container
image, push it to Azure Container Registry, and update the Azure Container App.

## Frontend Deployment

The frontend is deployed to Azure Static Web Apps from:

```text
frontend/
```

The current Static Web Apps configuration is:

```text
App location: ./frontend
API location: empty
Output location: dist
Deployment authorization policy: GitHub
```

Because this project uses Vite, the output location must be `dist`, not `build`.

## Files

| File                                      | Service                          |
| ----------------------------------------- | -------------------------------- |
| `main.bicep`                              | Deployment orchestration         |
| `modules/resource-group.bicep`            | Azure Resource Group             |
| `modules/static-web-app.bicep`            | Azure Static Web Apps            |
| `modules/container-registry.bicep`        | Azure Container Registry         |
| `modules/container-app-environment.bicep` | Azure Container Apps Environment |
| `modules/container-app.bicep`             | Azure Container Apps backend     |
| `modules/key-vault.bicep`                 | Azure Key Vault                  |
| `modules/foundry.bicep`                   | Microsoft Foundry                |
| `modules/ai-search.bicep`                 | Azure AI Search                  |
| `modules/cosmos-nosql.bicep`              | Azure Cosmos DB for NoSQL        |
