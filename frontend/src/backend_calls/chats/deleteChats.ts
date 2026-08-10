import { apiFetch } from '../_shared/apiFetch'

export function deleteChat(chatId: string) {
  return apiFetch<void>(`/api/chats/${chatId}`, { method: 'DELETE' })
}

export function deleteAllChats() {
  return apiFetch<void>('/api/chats/', { method: 'DELETE' })
}
