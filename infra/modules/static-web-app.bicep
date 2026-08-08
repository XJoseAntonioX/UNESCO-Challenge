targetScope = 'resourceGroup'

metadata description = 'Creates or updates an Azure Static Web App for the frontend.'

@description('Name of the Azure Static Web App to create or update.')
@minLength(2)
@maxLength(60)
param staticWebAppName string

@description('Azure region for the Azure Static Web App.')
param location string

@description('GitHub repository URL connected to the Azure Static Web App.')
param repositoryUrl string

@secure()
@description('GitHub repository token used by Azure to generate the GitHub Actions workflow and secrets. Leave empty when using a manually managed workflow.')
param repositoryToken string = ''

@description('GitHub branch used for production deployments.')
param branch string = 'main'

@description('Path to the frontend app from the repository root.')
param appLocation string = './frontend'

@description('Path to the API app from the repository root. Leave empty when there is no Static Web Apps managed API.')
param apiLocation string = ''

@description('Path to the frontend build output from the app location.')
param outputLocation string = 'dist'

@description('GitHub Actions workflow generation behavior.')
param skipGithubActionWorkflowGeneration bool = false

@description('Tags to apply to the Azure Static Web App.')
param tags object = {}

var staticWebAppProperties = union({
  provider: 'GitHub'
  repositoryUrl: repositoryUrl
  branch: branch
  publicNetworkAccess: 'Enabled'
  allowConfigFileUpdates: true
  buildProperties: {
    appLocation: appLocation
    apiLocation: apiLocation
    appArtifactLocation: outputLocation
    githubActionSecretNameOverride: 'AZURE_STATIC_WEB_APPS_API_TOKEN'
    outputLocation: outputLocation
    skipGithubActionWorkflowGeneration: skipGithubActionWorkflowGeneration
  }
}, empty(repositoryToken) ? {} : {
  repositoryToken: repositoryToken
})

resource staticWebApp 'Microsoft.Web/staticSites@2025-03-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  tags: tags
  properties: staticWebAppProperties
}

output staticWebAppName string = staticWebApp.name
output defaultHostname string = staticWebApp.properties.defaultHostname
