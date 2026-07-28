# VERIFIBOT — UNESCO Challenge

Prototipo frontend de una plataforma de fact-checking y alfabetización digital.
La experiencia central es un chatbot multiturno de demostración con historial,
evidencia consultada, contenido educativo, gamificación y métricas dummy.

## Tecnologías

- Node.js 22+
- React 19
- TypeScript
- Vinext / Next App Router
- Vite
- Lucide React
- CSS responsive

Esta versión no incluye backend. Los chats, fuentes, resultados y métricas son
datos de demostración.

## Cómo correr el proyecto

```bash
git clone https://github.com/XJoseAntonioX/UNESCO-Challenge.git
cd UNESCO-Challenge
npm install
npm run dev
```

Abre la dirección que muestre la terminal, normalmente
`http://localhost:5173`.

## Compilar y validar

```bash
npm run build
npm run validate:artifact
```

## Funcionalidad incluida

- Landing page minimalista y modular.
- Inicio de sesión y registro demostrativos.
- Crear, abrir, continuar y eliminar chats.
- Veredicto, confianza, evidencia y fuentes desplegables.
- Lecciones, XP, nivel, progreso y racha.
- Dashboard de verificaciones, resultados, medios y satisfacción.
- Diseño responsive para escritorio y móvil.

## Estructura principal

```text
app/
├── layout.tsx
├── page.tsx
└── globals.css
worker/
└── index.ts
```

## Próxima etapa

Conectar el frontend con FastAPI, LangGraph, Azure AI Foundry, Azure AI Search
y Azure Database for PostgreSQL.
