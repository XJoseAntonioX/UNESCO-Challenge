from connections.connection_cosmos import get_chats_container


async def post_chat(document: dict) -> dict:
    return await get_chats_container().create_item(document)
