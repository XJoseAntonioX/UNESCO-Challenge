import { apiFetch } from '../_shared/apiFetch'
import type { AuthResponse } from './types'

export function postLogin(email: string, password: string) {
  return apiFetch<AuthResponse>('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
