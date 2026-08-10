from connections.connection_cosmos import get_chats_container


async def get_chats(user_id: str) -> list[dict]:
    query = "SELECT * FROM c WHERE c.userId = @userId AND c.type = 'chat' ORDER BY c.updatedAt DESC"
    parameters = [{"name": "@userId", "value": user_id}]
    return [
        item
        async for item in get_chats_container().query_items(
            query=query,
            parameters=parameters,
            partition_key=user_id,
        )
    ]
