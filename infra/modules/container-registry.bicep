targetScope = 'resourceGroup'

metadata description = 'Creates or updates an Azure Container Registry for backend container images.'

@description('Name of the Azure Container Registry to create or update.')
@minLength(5)
@maxLength(50)
param registryName string

@description('Azure region for the Azure Container Registry.')
param location string

@description('Tags to apply to the Azure Container Registry.')
param tags object = {}

resource registry 'Microsoft.ContainerRegistry/registries@2025-04-01' = {
  name: registryName
  location: location
  sku: {
    name: 'Basic'
  }
  tags: tags
  properties: {
    adminUserEnabled: false
    anonymousPullEnabled: false
    publicNetworkAccess: 'Enabled'
  }
}

output registryName string = registry.name
output loginServer string = registry.properties.loginServer
