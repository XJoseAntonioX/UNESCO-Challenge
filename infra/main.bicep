targetScope = 'subscription'

metadata description = 'Deploys the UNESCO services resource group and supporting Azure services.'

@description('Name of the resource group to create or update.')
@minLength(1)
@maxLength(90)
param rgName string = 'unesco-services'

@description('Azure region for the resource group.')
param rgLocation string = 'southcentralus'

@description('Name of the Azure Static Web App to create or update.')
@minLength(2)
@maxLength(60)
param staticWebAppName string = 'unesco-verifibot'

@description('Azure region for the Azure Static Web App.')
param staticWebAppLocation string = 'centralus'

@description('GitHub repository URL connected to the Azure Static Web App.')
param staticWebAppRepositoryUrl string = 'https://github.com/XJoseAntonioX/UNESCO-Challenge'

@secure()
@description('GitHub repository token used by Azure to generate the Static Web Apps GitHub Actions workflow and secrets. Leave empty when using a manually managed workflow.')
param staticWebAppRepositoryToken string = ''

@description('GitHub branch used for Static Web App production deployments.')
param staticWebAppBranch string = 'main'

@description('Path to the frontend app from the repository root.')
param staticWebAppAppLocation string = './frontend'

@description('Path to the API app from the repository root. Leave empty when there is no Static Web Apps managed API.')
param staticWebAppApiLocation string = ''

@description('Path to the frontend build output from the app location.')
param staticWebAppOutputLocation string = 'dist'

@description('Name of the Azure Container Registry to create or update.')
@minLength(5)
@maxLength(50)
param containerRegistryName string = 'unescoverifibotacr'

@description('Name of the Azure Container Apps managed environment to create or update.')
@minLength(1)
@maxLength(60)
param containerAppEnvironmentName string = 'unesco-verifibot-env'

@description('Name of the Log Analytics workspace for Container Apps logs.')
@minLength(4)
@maxLength(63)
param logAnalyticsWorkspaceName string = 'unesco-verifibot-logs'

@description('Name of the backend Azure Container App to create or update.')
@minLength(1)
@maxLength(32)
param backendContainerAppName string = 'unesco-verifibot-api'

@description('Name of the backend user-assigned managed identity.')
@minLength(3)
@maxLength(128)
param backendManagedIdentityName string = 'unesco-verifibot-api-id'

@description('Initial backend container image. The GitHub Actions workflow replaces this with the built backend image.')
param backendContainerImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

@description('Container port exposed by the backend app.')
param backendTargetPort int = 8000

@description('Name of the Key Vault to create or update.')
@minLength(3)
@maxLength(24)
param keyVaultName string = 'service-secrets-1'

@description('Deploy the Azure Key Vault service.')
param deployKeyVault bool = false

@description('Name of the Microsoft Foundry resource to create or update.')
@minLength(2)
@maxLength(64)
param foundryName string = 'ai-models-challenge'

@description('Name of the default Microsoft Foundry project to create or update.')
@minLength(2)
@maxLength(64)
param foundryProjectName string = 'proj-default'

@description('Name of the Azure AI Search service to create or update.')
@minLength(2)
@maxLength(60)
param searchServiceName string = 'rag-search-challenge'

@description('Name of the Azure Cosmos DB for NoSQL account to create or update.')
@minLength(3)
@maxLength(44)
param cosmosAccountName string = 'cosmos-dev-challenge'

@description('Cosmos DB regional display name.')
param cosmosLocationName string = 'South Central US'

@description('Cosmos DB SQL database for application data.')
param cosmosDatabaseName string = 'unesco-db'

@description('Tags to apply to the resource group.')
param tags object = {}

module resourceGroupModule 'modules/resource-group.bicep' = {
  name: 'rg-${uniqueString(deployment().name, rgName, rgLocation)}'
  params: {
    rgName: rgName
    rgLocation: rgLocation
    tags: tags
  }
}

module keyVault 'modules/key-vault.bicep' = if (deployKeyVault) {
  name: 'kv-${uniqueString(deployment().name, rgName, keyVaultName, rgLocation)}'
  scope: resourceGroup(rgName)
  params: {
    keyVaultName: keyVaultName
    location: rgLocation
    tags: tags
  }
  dependsOn: [
    resourceGroupModule
  ]
}

module staticWebApp 'modules/static-web-app.bicep' = {
  name: 'swa-${uniqueString(deployment().name, rgName, staticWebAppName, rgLocation)}'
  scope: resourceGroup(rgName)
  params: {
    staticWebAppName: staticWebAppName
    location: staticWebAppLocation
    repositoryUrl: staticWebAppRepositoryUrl
    repositoryToken: staticWebAppRepositoryToken
    branch: staticWebAppBranch
    appLocation: staticWebAppAppLocation
    apiLocation: staticWebAppApiLocation
    outputLocation: staticWebAppOutputLocation
    tags: tags
  }
  dependsOn: [
    resourceGroupModule
  ]
}

module containerRegistry 'modules/container-registry.bicep' = {
  name: 'acr-${uniqueString(deployment().name, rgName, containerRegistryName, rgLocation)}'
  scope: resourceGroup(rgName)
  params: {
    registryName: containerRegistryName
    location: rgLocation
    tags: tags
  }
  dependsOn: [
    resourceGroupModule
  ]
}

module containerAppEnvironment 'modules/container-app-environment.bicep' = {
  name: 'cae-${uniqueString(deployment().name, rgName, containerAppEnvironmentName, rgLocation)}'
  scope: resourceGroup(rgName)
  params: {
    environmentName: containerAppEnvironmentName
    logAnalyticsWorkspaceName: logAnalyticsWorkspaceName
    location: rgLocation
    tags: tags
  }
  dependsOn: [
    resourceGroupModule
  ]
}

module backendManagedIdentity 'modules/managed-identity.bicep' = {
  name: 'id-${uniqueString(deployment().name, rgName, backendManagedIdentityName, rgLocation)}'
  scope: resourceGroup(rgName)
  params: {
    location: rgLocation
    identityName: backendManagedIdentityName
    tags: tags
  }
}

module backendAcrPullRole 'modules/acr-pull-role-assignment.bicep' = {
  name: 'acr-pull-${uniqueString(deployment().name, rgName, backendContainerAppName, containerRegistryName)}'
  scope: resourceGroup(rgName)
  params: {
    registryName: containerRegistry.outputs.registryName
    principalId: backendManagedIdentity.outputs.principalId
  }
}

module backendContainerApp 'modules/container-app.bicep' = {
  name: 'aca-${uniqueString(deployment().name, rgName, backendContainerAppName, rgLocation)}'
  scope: resourceGroup(rgName)
  params: {
    containerAppName: backendContainerAppName
    location: rgLocation
    environmentId: containerAppEnvironment.outputs.environmentId
    identityId: backendManagedIdentity.outputs.identityId
    image: backendContainerImage
    registryServer: containerRegistry.outputs.loginServer
    targetPort: backendTargetPort
    tags: tags
  }
  dependsOn: [
    backendAcrPullRole
  ]
}

module foundry 'modules/foundry.bicep' = {
  name: 'foundry-${uniqueString(deployment().name, rgName, foundryName, rgLocation)}'
  scope: resourceGroup(rgName)
  params: {
    foundryName: foundryName
    projectName: foundryProjectName
    location: rgLocation
    tags: tags
  }
  dependsOn: [
    resourceGroupModule
  ]
}

module searchService 'modules/ai-search.bicep' = {
  name: 'search-${uniqueString(deployment().name, rgName, searchServiceName, rgLocation)}'
  scope: resourceGroup(rgName)
  params: {
    searchServiceName: searchServiceName
    location: rgLocation
    tags: tags
  }
  dependsOn: [
    resourceGroupModule
  ]
}

module cosmosDb 'modules/cosmos-nosql.bicep' = {
  name: 'cosmos-${uniqueString(deployment().name, rgName, cosmosAccountName, rgLocation)}'
  scope: resourceGroup(rgName)
  params: {
    accountName: cosmosAccountName
    location: rgLocation
    locationName: cosmosLocationName
    databaseName: cosmosDatabaseName
    tags: tags
  }
  dependsOn: [
    resourceGroupModule
  ]
}

output resourceGroupName string = resourceGroupModule.outputs.resourceGroupName
output resourceGroupLocation string = resourceGroupModule.outputs.resourceGroupLocation
output staticWebAppName string = staticWebApp.outputs.staticWebAppName
output staticWebAppDefaultHostname string = staticWebApp.outputs.defaultHostname
output containerRegistryName string = containerRegistry.outputs.registryName
output containerRegistryLoginServer string = containerRegistry.outputs.loginServer
output containerAppEnvironmentName string = containerAppEnvironment.outputs.environmentName
output backendManagedIdentityName string = backendManagedIdentityName
output backendContainerAppName string = backendContainerApp.outputs.containerAppName
output backendContainerAppFqdn string = backendContainerApp.outputs.latestRevisionFqdn
output keyVaultName string = deployKeyVault ? keyVault!.outputs.keyVaultName : ''
output keyVaultUri string = deployKeyVault ? keyVault!.outputs.keyVaultUri : ''
output foundryName string = foundry.outputs.foundryName
output foundryProjectName string = foundry.outputs.projectName
output searchServiceName string = searchService.outputs.searchServiceName
output cosmosAccountName string = cosmosDb.outputs.accountName
output cosmosDatabaseName string = cosmosDb.outputs.databaseName
