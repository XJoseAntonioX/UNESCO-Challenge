import { apiFetch } from '../_shared/apiFetch'
import type { Message } from './types'

export function getMessages(chatId: string) {
  return apiFetch<Message[]>(`/api/chats/${encodeURIComponent(chatId)}/messages`)
}
