from functools import lru_cache

from openai import AsyncAzureOpenAI, AsyncOpenAI

from core.config import settings


@lru_cache
def get_ai_client() -> AsyncAzureOpenAI | AsyncOpenAI:
    endpoint = settings.azure_openai_endpoint.rstrip("/")

    # Azure AI Foundry's newer OpenAI-compatible `/v1` endpoint rejects the
    # api-version query parameter used by AsyncAzureOpenAI. Use the standard
    # OpenAI client for that endpoint instead.
    if endpoint.endswith("/v1") or ".services.ai.azure.com" in endpoint:
        base_url = endpoint if endpoint.endswith("/v1") else f"{endpoint}/openai/v1"
        return AsyncOpenAI(
            base_url=base_url,
            api_key=settings.azure_openai_api_key,
        )

    return AsyncAzureOpenAI(
        azure_endpoint=endpoint,
        api_key=settings.azure_openai_api_key,
        api_version=settings.azure_openai_api_version,
    )


@lru_cache
def get_responses_client() -> AsyncOpenAI:
    """Responses API client, required for Azure Foundry hosted tools.

    Unlike Chat Completions, web search is available on the Azure `/openai/v1`
    Responses endpoint.  Keeping this separate avoids changing the existing
    chat client used for the final structured verdict.
    """
    endpoint = settings.azure_openai_endpoint.rstrip("/")
    if endpoint.endswith("/v1"):
        base_url = endpoint
    elif ".services.ai.azure.com" in endpoint:
        base_url = f"{endpoint}/openai/v1"
    else:
        base_url = f"{endpoint}/openai/v1"
    return AsyncOpenAI(base_url=base_url, api_key=settings.azure_openai_api_key)
