targetScope = 'resourceGroup'

metadata description = 'Creates or updates an Azure Cosmos DB for NoSQL account.'

@description('Name of the Azure Cosmos DB for NoSQL account to create or update.')
@minLength(3)
@maxLength(44)
param accountName string

@description('Azure region for the Azure Cosmos DB account.')
param location string

@description('Cosmos DB regional display name.')
param locationName string

@description('Tags to apply to the Azure Cosmos DB account.')
param tags object = {}

resource account 'Microsoft.DocumentDB/databaseAccounts@2025-04-15' = {
  name: accountName
  location: location
  kind: 'GlobalDocumentDB'
  tags: tags
  properties: {
    databaseAccountOfferType: 'Standard'
    enableFreeTier: true
    enableMultipleWriteLocations: false
    enableAutomaticFailover: false
    capabilities: []
    capacity: {
      totalThroughputLimit: 1000
    }
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    locations: [
      {
        locationName: locationName
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
  }
}

output accountName string = account.name
