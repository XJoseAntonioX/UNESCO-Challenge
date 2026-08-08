targetScope = 'resourceGroup'

metadata description = 'Creates or updates an Azure AI Search service.'

@description('Name of the Azure AI Search service to create or update.')
@minLength(2)
@maxLength(60)
param searchServiceName string

@description('Azure region for the Azure AI Search service.')
param location string

@description('Tags to apply to the Azure AI Search service.')
param tags object = {}

resource searchService 'Microsoft.Search/searchServices@2025-05-01' = {
  name: searchServiceName
  location: location
  sku: {
    name: 'free'
  }
  tags: tags
  properties: {
    hostingMode: 'Default'
  }
}

output searchServiceName string = searchService.name
