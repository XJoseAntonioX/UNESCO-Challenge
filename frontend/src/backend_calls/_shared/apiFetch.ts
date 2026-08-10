const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const TOKEN_KEY = 'verifibot_access_token'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAccessToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

function getErrorMessage(detail: unknown) {
  if (typeof detail === 'string' && detail.trim()) return detail
  if (Array.isArray(detail)) {
    return detail
      .map((item) =>
        typeof item === 'object' && item !== null && 'msg' in item ? String(item.msg) : '',
      )
      .filter(Boolean)
      .join('. ')
  }
  return ''
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken()
  const headers = new Headers(init.headers)
  if (init.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { detail?: unknown }
    if (response.status === 401) setAccessToken(null)
    throw new ApiError(
      getErrorMessage(body.detail) || 'No se pudo completar la solicitud',
      response.status,
    )
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
