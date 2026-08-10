import { apiFetch } from '../_shared/apiFetch'
import type { Chat } from './types'

export function postChat(title = 'Nueva verificación') {
  return apiFetch<Chat>('/api/chats/', { method: 'POST', body: JSON.stringify({ title }) })
}
