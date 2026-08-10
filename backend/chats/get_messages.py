from connections.connection_cosmos import get_chats_container


async def get_messages(chat_id: str, user_id: str) -> list[dict]:
    query = (
        "SELECT * FROM c WHERE c.userId = @userId AND c.chatId = @chatId "
        "AND c.type = 'message' ORDER BY c.createdAt ASC"
    )
    parameters = [
        {"name": "@userId", "value": user_id},
        {"name": "@chatId", "value": chat_id},
    ]
    return [
        item
        async for item in get_chats_container().query_items(
            query=query,
            parameters=parameters,
            partition_key=user_id,
        )
    ]
