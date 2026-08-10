import { apiFetch } from '../_shared/apiFetch'
import type { Chat } from './types'

export function getChats() {
  return apiFetch<Chat[]>('/api/chats/')
}
