import asyncio

from connections.connection_cosmos import get_chats_container


async def _delete_documents(documents: list[dict], user_id: str) -> None:
    container = get_chats_container()
    await asyncio.gather(
        *(container.delete_item(item=document["id"], partition_key=user_id) for document in documents)
    )


async def delete_chat_with_messages(chat_id: str, user_id: str) -> bool:
    """Delete one owned chat and every message inside the same user partition."""
    query = "SELECT c.id FROM c WHERE c.userId = @userId AND (c.id = @chatId OR c.chatId = @chatId)"
    parameters = [{"name": "@userId", "value": user_id}, {"name": "@chatId", "value": chat_id}]
    documents = [
        item async for item in get_chats_container().query_items(
            query=query, parameters=parameters, partition_key=user_id
        )
    ]
    if not any(document["id"] == chat_id for document in documents):
        return False
    await _delete_documents(documents, user_id)
    return True


async def delete_all_chats_with_messages(user_id: str) -> None:
    query = "SELECT c.id FROM c WHERE c.userId = @userId"
    parameters = [{"name": "@userId", "value": user_id}]
    documents = [
        item async for item in get_chats_container().query_items(
            query=query, parameters=parameters, partition_key=user_id
        )
    ]
    if documents:
        await _delete_documents(documents, user_id)
