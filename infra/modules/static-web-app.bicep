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

resource staticWebApp 'Microsoft.Web/staticSites@2025-03-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  tags: tags
  properties: {
    provider: 'GitHub'
    repositoryUrl: repositoryUrl
    branch: branch
    publicNetworkAccess: 'Enabled'
    allowConfigFileUpdates: true
    buildProperties: {
      appLocation: appLocation
      apiLocation: apiLocation
      outputLocation: outputLocation
      skipGithubActionWorkflowGeneration: skipGithubActionWorkflowGeneration
    }
  }
}

output staticWebAppName string = staticWebApp.name
output defaultHostname string = staticWebApp.properties.defaultHostname
