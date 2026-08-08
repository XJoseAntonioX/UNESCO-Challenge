targetScope = 'resourceGroup'

metadata description = 'Creates or updates a user-assigned managed identity.'

@description('Name of the user-assigned managed identity.')
@minLength(3)
@maxLength(128)
param identityName string

@description('Azure region for the managed identity.')
param location string

@description('Tags to apply to the managed identity.')
param tags object = {}

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2024-11-30' = {
  name: identityName
  location: location
  tags: tags
}

output identityId string = identity.id
output principalId string = identity.properties.principalId
