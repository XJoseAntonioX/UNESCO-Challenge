targetScope = 'resourceGroup'

metadata description = 'Grants AcrPull on an Azure Container Registry to a managed identity.'

@description('Name of the Azure Container Registry.')
param registryName string

@description('Principal ID that should receive AcrPull permissions.')
param principalId string

resource registry 'Microsoft.ContainerRegistry/registries@2025-04-01' existing = {
  name: registryName
}

resource acrPullAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(registry.id, principalId, 'AcrPull')
  scope: registry
  properties: {
    principalId: principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '7f951dda-4ed3-4680-a7ca-43fe172d538d'
    )
  }
}

output roleAssignmentName string = acrPullAssignment.name
