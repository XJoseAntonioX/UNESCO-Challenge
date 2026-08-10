from azure.cosmos.exceptions import CosmosResourceNotFoundError

from connections.connection_cosmos import get_users_container


async def get_user(user_id: str, email: str) -> dict | None:
    try:
        return await get_users_container().read_item(item=user_id, partition_key=email)
    except CosmosResourceNotFoundError:
        return None
