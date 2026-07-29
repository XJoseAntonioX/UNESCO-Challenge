# VERIFIBOT

Prototipo para el reto UNESCO enfocado en verificación de información y
alfabetización digital. El frontend contiene la experiencia completa con datos
dummy; el backend es una referencia mínima de FastAPI.

## Estructura

```text
.
├── .github/workflows/build.yml
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Ejecutar el frontend

Requiere Node.js 22 o posterior.

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. Para verificar una compilación de producción:

```bash
cd frontend
npm run build
```

## Ejecutar el backend de referencia

Requiere Python 3.10 o posterior.

```bash
cd backend
python -m venv .venv
```

Activa el entorno en PowerShell e instala las dependencias:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
fastapi dev main.py
```

La API quedará disponible en `http://localhost:8000` y su documentación en
`http://localhost:8000/docs`.

El backend no está conectado al frontend todavía. Su propósito es mostrar el
punto de inicio recomendado para la integración futura.

