from connections.connection_cosmos import get_users_container


async def post_user(document: dict) -> dict:
    return await get_users_container().create_item(document)
