import { apiFetch } from '../_shared/apiFetch'
import type { AuthResponse } from './types'

export function postSignup(name: string, email: string, password: string) {
  return apiFetch<AuthResponse>('/api/users/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}
