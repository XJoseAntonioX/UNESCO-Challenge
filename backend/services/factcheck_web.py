"""Web-search fallback for claims without a decisive Google Fact Check rating."""

from collections.abc import Iterable
import logging
from urllib.parse import urlparse

from connections.connection_ai import get_responses_client
from core.config import settings
from models.chat import Source

logger = logging.getLogger(__name__)


def _citation_sources(output: Iterable[object]) -> list[Source]:
    """Extract only URLs supplied by the web-search tool's citations."""
    sources: list[Source] = []
    seen: set[str] = set()
    for item in output:
        for content in getattr(item, "content", []) or []:
            for annotation in getattr(content, "annotations", []) or []:
                if getattr(annotation, "type", None) != "url_citation":
                    continue
                url = getattr(annotation, "url", None)
                if not url or url in seen or urlparse(url).scheme not in {"http", "https"}:
                    continue
                seen.add(url)
                title = getattr(annotation, "title", None) or url
                sources.append(
                    Source(title=title, url=url, publisher=urlparse(url).netloc, rating=None)
                )
    return sources[:5]


async def find_web_evidence(claim: str) -> tuple[list[Source], str]:
    """Search the web through the configured Foundry/OpenAI web-search tool.

    The returned text and citations are passed to the final verifier; URLs are
    never generated from the model's prose.
    """
    prompt = (
        "Busca evidencia fiable para verificar esta afirmación: "
        f"{claim!r}. Prioriza fuentes primarias, instituciones públicas, publicaciones "
        "académicas y verificadores reconocidos. Resume únicamente la evidencia relevante "
        "y no afirmes un veredicto si las fuentes no lo sustentan."
    )
    try:
        response = await get_responses_client().responses.create(
            model=settings.azure_openai_chat_deployment,
            tools=[{"type": "web_search"}],
            tool_choice="required",
            include=["web_search_call.action.sources"],
            input=prompt,
        )
    except Exception as exc:
        logger.exception("Foundry web search failed: %s", exc)
        return [], ""
    if not any(getattr(item, "type", None) == "web_search_call" for item in response.output):
        logger.warning("Foundry returned a response without a web_search_call")
        return [], ""
    sources = _citation_sources(response.output)
    if not sources:
        logger.warning("Foundry web search completed without URL citations")
    return sources, response.output_text or ""
