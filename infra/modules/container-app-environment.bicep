targetScope = 'resourceGroup'

metadata description = 'Creates or updates an Azure Container Apps managed environment.'

@description('Name of the Azure Container Apps managed environment to create or update.')
@minLength(1)
@maxLength(60)
param environmentName string

@description('Name of the Log Analytics workspace for Container Apps logs.')
@minLength(4)
@maxLength(63)
param logAnalyticsWorkspaceName string

@description('Azure region for the Container Apps environment and Log Analytics workspace.')
param location string

@description('Tags to apply to the Container Apps environment resources.')
param tags object = {}

resource workspace 'Microsoft.OperationalInsights/workspaces@2025-02-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource environment 'Microsoft.App/managedEnvironments@2025-02-02-preview' = {
  name: environmentName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: workspace.properties.customerId
        sharedKey: workspace.listKeys().primarySharedKey
      }
    }
  }
}

output environmentName string = environment.name
output environmentId string = environment.id
output logAnalyticsWorkspaceName string = workspace.name
