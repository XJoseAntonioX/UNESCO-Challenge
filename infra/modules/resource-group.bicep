targetScope = 'subscription'

metadata description = 'Creates or updates an Azure resource group.'

@description('Name of the resource group to create or update.')
@minLength(1)
@maxLength(90)
param rgName string

@description('Azure region for the resource group.')
param rgLocation string

@description('Tags to apply to the resource group.')
param tags object = {}

resource resourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: rgName
  location: rgLocation
  tags: tags
}

output resourceGroupName string = resourceGroup.name
output resourceGroupLocation string = resourceGroup.location
