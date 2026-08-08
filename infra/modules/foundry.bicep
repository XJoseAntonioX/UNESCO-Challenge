targetScope = 'resourceGroup'

metadata description = 'Creates or updates a Microsoft Foundry resource and project.'

@description('Name of the Microsoft Foundry resource to create or update.')
@minLength(2)
@maxLength(64)
param foundryName string

@description('Name of the default Microsoft Foundry project to create or update.')
@minLength(2)
@maxLength(64)
param projectName string

@description('Azure region for the Microsoft Foundry resource.')
param location string

@description('Tags to apply to the Microsoft Foundry resources.')
param tags object = {}

resource foundry 'Microsoft.CognitiveServices/accounts@2025-06-01' = {
  name: foundryName
  location: location
  kind: 'AIServices'
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'S0'
  }
  tags: tags
  properties: {
    allowProjectManagement: true
    customSubDomainName: foundryName
    publicNetworkAccess: 'Enabled'
  }
}

resource project 'Microsoft.CognitiveServices/accounts/projects@2025-06-01' = {
  name: projectName
  parent: foundry
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  tags: tags
  properties: {
    displayName: projectName
  }
}

output foundryName string = foundry.name
output projectName string = project.name
