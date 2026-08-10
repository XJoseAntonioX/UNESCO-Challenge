import httpx

from core.config import settings
from models.chat import Source


def _as_int(value: object) -> int | None:
    """The API documents integers, but gracefully ignore malformed publisher data."""
    try:
        return int(value) if value is not None else None
    except (TypeError, ValueError):
        return None


async def find_factcheck_sources(claim: str) -> list[Source]:
    """Retrieve publisher-backed reviews; never ask the model to invent URLs."""
    if not settings.factcheck_api_key:
        return []
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.get(
                "https://factchecktools.googleapis.com/v1alpha1/claims:search",
                params={"query": claim, "key": settings.factcheck_api_key, "languageCode": "es"},
            )
            response.raise_for_status()
    except httpx.HTTPError:
        return []
    sources: list[Source] = []
    for claim_record in response.json().get("claims", [])[:5]:
        for review in claim_record.get("claimReview", [])[:2]:
            if review.get("url") and review.get("title"):
                sources.append(
                    Source(
                        title=review["title"],
                        url=review["url"],
                        publisher=review.get("publisher", {}).get("name", "Verificador independiente"),
                        rating=review.get("textualRating"),
                        rating_value=_as_int(review.get("ratingValue")),
                        worst_rating=_as_int(review.get("worstRating")),
                        best_rating=_as_int(review.get("bestRating")),
                        rating_explanation=review.get("ratingExplanation"),
                    )
                )
    return sources[:5]


def has_decisive_google_rating(sources: list[Source]) -> bool:
    """Only an explicit publisher true/false label skips the broader web search."""
    decisive = {
        "true", "false", "verdadera", "verdadero", "falsa", "falso",
        "cierto", "cierta", "incorrecto", "incorrecta",
    }
    return any((source.rating or "").strip().casefold() in decisive for source in sources)
