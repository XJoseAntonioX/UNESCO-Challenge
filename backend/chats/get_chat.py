from azure.cosmos.exceptions import CosmosResourceNotFoundError

from connections.connection_cosmos import get_chats_container


async def get_chat(chat_id: str, user_id: str) -> dict | None:
    try:
        item = await get_chats_container().read_item(item=chat_id, partition_key=user_id)
        return item if item.get("type") == "chat" else None
    except CosmosResourceNotFoundError:
        return None
