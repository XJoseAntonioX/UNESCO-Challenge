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

@description('SQL database used by VERIFIBOT.')
param databaseName string = 'unesco-db'

@description('Container that stores user identities and password hashes.')
param usersContainerName string = 'users'

@description('Container that stores chat metadata and messages.')
param chatsContainerName string = 'chats'

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

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2025-04-15' = {
  parent: account
  name: databaseName
  properties: {
    resource: {
      id: databaseName
    }
  }
}

resource usersContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2025-04-15' = {
  parent: database
  name: usersContainerName
  properties: {
    resource: {
      id: usersContainerName
      partitionKey: {
        paths: [
          '/email'
        ]
        kind: 'Hash'
        version: 2
      }
    }
  }
}

resource chatsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2025-04-15' = {
  parent: database
  name: chatsContainerName
  properties: {
    resource: {
      id: chatsContainerName
      partitionKey: {
        paths: [
          '/userId'
        ]
        kind: 'Hash'
        version: 2
      }
    }
  }
}

output accountName string = account.name
output databaseName string = database.name
output usersContainerName string = usersContainer.name
output chatsContainerName string = chatsContainer.name
