export type Source = {
  title: string
  url: string
  publisher: string
  rating?: string | null
  rating_value?: number | null
  worst_rating?: number | null
  best_rating?: number | null
  rating_explanation?: string | null
}
export type FactCheckResult = {
  verdict: 'verdadera' | 'falsa' | 'parcialmente correcta' | 'sin evidencia suficiente'
  explanation: string
  sources: Source[]
}
export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  analysis?: FactCheckResult | null
}
export type Chat = { id: string; title: string; createdAt: string; updatedAt: string }
