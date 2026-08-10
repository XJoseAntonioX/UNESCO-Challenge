import { apiFetch } from '../_shared/apiFetch'
import type { User } from './types'

export function getMe() {
  return apiFetch<User>('/api/users/me')
}
