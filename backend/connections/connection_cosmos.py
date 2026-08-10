from functools import lru_cache

from azure.cosmos import PartitionKey
from azure.cosmos.aio import ContainerProxy, CosmosClient, DatabaseProxy

from core.config import settings


@lru_cache
def get_cosmos_client() -> CosmosClient:
    return CosmosClient(settings.cosmos_endpoint, credential=settings.cosmos_key)


def get_database() -> DatabaseProxy:
    return get_cosmos_client().get_database_client(settings.cosmos_database)


def get_users_container() -> ContainerProxy:
    return get_database().get_container_client(settings.cosmos_users_container)


def get_chats_container() -> ContainerProxy:
    return get_database().get_container_client(settings.cosmos_chats_container)


async def initialize_cosmos() -> None:
    database = await get_cosmos_client().create_database_if_not_exists(settings.cosmos_database)
    await database.create_container_if_not_exists(
        id=settings.cosmos_users_container,
        partition_key=PartitionKey(path="/email"),
    )
    await database.create_container_if_not_exists(
        id=settings.cosmos_chats_container,
        partition_key=PartitionKey(path="/userId"),
    )
