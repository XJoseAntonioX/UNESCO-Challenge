from connections.connection_cosmos import get_chats_container


async def post_message(document: dict) -> dict:
    return await get_chats_container().create_item(document)


async def update_chat(document: dict) -> dict:
    return await get_chats_container().replace_item(item=document["id"], body=document)
