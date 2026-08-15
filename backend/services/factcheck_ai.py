import json

from connections.connection_ai import get_ai_client
from core.config import settings
from models.chat import FactCheckResult, Source

SYSTEM_PROMPT = """Eres VERIFIBOT, un asistente educativo de verificación de hechos.
Evalúa únicamente la afirmación del usuario usando EXCLUSIVAMENTE las fuentes verificadas incluidas.
Da prioridad a rating (textualRating de Google Fact Check Tools API), rating_value y
rating_explanation: son evaluaciones publicadas por los verificadores, no una escala universal.
Elige únicamente: verdadera, falsa, parcialmente correcta o sin evidencia suficiente.
Usa 'parcialmente correcta' cuando la afirmación coincide en lo esencial con la evidencia,
pero contiene una omisión, exageración o detalle material incorrecto. Nunca conviertas una ausencia
de resultados o evidencia no concluyente en 'verdadera' o 'falsa'.
No inventes hechos, citas, fuentes ni URLs. Si las fuentes no permiten decidir, el veredicto debe ser
'sin evidencia suficiente'. Para verdadera, falsa o parcialmente correcta, explica brevemente la evidencia
y sus límites. Para 'sin evidencia suficiente', explica qué se pudo comprobar, qué no y por qué las fuentes
no permiten concluir; no uses una frase genérica si hay evidencia relevante. Distingue ausencia de evidencia
de evidencia de que la afirmación es falsa. Cuando trate sobre una persona, cargo o candidatura, separa
hechos confirmados, antecedentes, aspiraciones y rumores. Responde en español, de forma clara y directa,
idealmente en 2 a 5 párrafos. No des consejo médico, legal o financiero.
Devuelve JSON con: verdict (verdadera|falsa|parcialmente correcta|sin evidencia suficiente) y explanation."""

ALLOWED_VERDICTS = {"verdadera", "falsa", "parcialmente correcta", "sin evidencia suficiente"}


async def analyze_claim(claim: str, sources: list[Source], history: list[dict], web_evidence: str = "") -> FactCheckResult:
    evidence = [source.model_dump(mode="json") for source in sources]
    context = history[-8:]
    response = await get_ai_client().chat.completions.create(
        model=settings.azure_openai_chat_deployment,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "system", "content": f"Fuentes verificadas disponibles: {json.dumps(evidence, ensure_ascii=False)}"},
            {"role": "system", "content": f"Resumen de evidencia web con citas: {web_evidence}"},
            *context,
            {"role": "user", "content": claim},
        ],
    )
    raw = json.loads(response.choices[0].message.content or "{}")
    if raw.get("verdict") not in ALLOWED_VERDICTS:
        raw["verdict"] = "sin evidencia suficiente"
    if not sources:
        raw["verdict"] = "sin evidencia suficiente"
    if not raw.get("explanation"):
        raw["explanation"] = "No se reunió evidencia suficiente para llegar a una conclusión."
    return FactCheckResult(
        verdict=raw.get("verdict", "sin evidencia suficiente"),
        explanation=raw.get("explanation", "No fue posible evaluar la afirmación con evidencia suficiente."),
        sources=sources,
    )
