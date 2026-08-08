targetScope = 'resourceGroup'

metadata description = 'Creates or updates the backend Azure Container App.'

@description('Name of the Azure Container App to create or update.')
@minLength(1)
@maxLength(32)
param containerAppName string

@description('Azure region for the Azure Container App.')
param location string

@description('Container Apps managed environment resource ID.')
param environmentId string

@description('User-assigned managed identity resource ID used by the Container App.')
param identityId string

@description('Container image to deploy.')
param image string

@description('Azure Container Registry login server used by the backend image.')
param registryServer string

@description('Container port exposed by the backend app.')
param targetPort int = 8000

@description('Tags to apply to the Azure Container App.')
param tags object = {}

resource containerApp 'Microsoft.App/containerApps@2025-02-02-preview' = {
  name: containerAppName
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identityId}': {}
    }
  }
  properties: {
    managedEnvironmentId: environmentId
    configuration: {
      activeRevisionsMode: 'Single'
      registries: [
        {
          server: registryServer
          identity: identityId
        }
      ]
      ingress: {
        external: true
        targetPort: targetPort
        transport: 'auto'
        allowInsecure: false
      }
    }
    template: {
      containers: [
        {
          name: 'backend'
          image: image
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 3
      }
    }
  }
}

output containerAppName string = containerApp.name
output latestRevisionFqdn string = containerApp.properties.configuration.ingress.fqdn
