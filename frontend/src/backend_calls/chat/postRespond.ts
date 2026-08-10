import { apiFetch } from '../_shared/apiFetch'
import type { Message } from '../chats/types'

export type RespondResponse = {
  chatId: string | null
  userMessage: Message
  assistantMessage: Message
}

export function postRespond(content: string, chatId: string | null, history: Message[]) {
  return apiFetch<RespondResponse>('/api/chat/respond', {
    method: 'POST',
    body: JSON.stringify({ content, chatId, history }),
  })
}
