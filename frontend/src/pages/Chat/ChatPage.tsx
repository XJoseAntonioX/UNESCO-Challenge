import {
  Bot,
  CheckCircle2,
  ChevronDown,
  FileSearch,
  LoaderCircle,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { AuthMode } from '../../App'
import { postRespond } from '../../backend_calls/chat/postRespond'
import { getChats } from '../../backend_calls/chats/getChats'
import { getMessages } from '../../backend_calls/chats/getMessages'
import { postChat } from '../../backend_calls/chats/postChat'
import { deleteAllChats, deleteChat } from '../../backend_calls/chats/deleteChats'
import type { Chat, FactCheckResult, Message } from '../../backend_calls/chats/types'
import type { User } from '../../backend_calls/users/types'
import './ChatPage.css'

type Props = { user: User | null; onAuth: (mode: AuthMode) => void }

function VerdictIcon({ verdict, size = 20 }: { verdict: FactCheckResult['verdict']; size?: number }) {
  return verdict === 'verdadera' ? <CheckCircle2 size={size} /> : <X size={size} />
}

function Verdict({ analysis }: { analysis: FactCheckResult }) {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  return (
    <article className={`verdict verdict-${analysis.verdict.replaceAll(' ', '-')}`}>
      <header>
        <span className="wrong">
          <VerdictIcon verdict={analysis.verdict} />
        </span>
        <div>
          <small>VEREDICTO</small>
          <h2>{analysis.verdict}</h2>
        </div>
      </header>
      <p>{analysis.explanation}</p>
      <button
        className="sources-toggle"
        onClick={() => setSourcesOpen(!sourcesOpen)}
        aria-expanded={sourcesOpen}
      >
        <span>
          <FileSearch size={17} />
          {analysis.sources.length} fuentes consultadas
        </span>
        <ChevronDown size={17} />
      </button>
      {sourcesOpen && (
        <div className="sources">
          {analysis.sources.length ? (
            analysis.sources.map((source) => (
              <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                <b>{source.publisher.slice(0, 3).toUpperCase()}</b>
                <span>
                  {source.title}
                  <small>{source.rating ?? source.publisher}</small>
                  {source.rating_explanation && <small>{source.rating_explanation}</small>}
                </span>
              </a>
            ))
          ) : (
            <p className="no-sources">
              No se encontró evidencia publicada suficiente para emitir un veredicto.
            </p>
          )}
        </div>
      )}
    </article>
  )
}

export function ChatPage({ user, onAuth }: Props) {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) return
    let active = true
    getChats()
      .then((result) => {
        if (active) setChats(result)
      })
      .catch((reason: Error) => {
        if (active) setError(reason.message)
      })
    return () => {
      active = false
    }
  }, [user])

  const filteredChats = useMemo(
    () => chats.filter((chat) => chat.title.toLowerCase().includes(search.toLowerCase())),
    [chats, search],
  )
  const latestAnalysis = [...messages].reverse().find((message) => message.analysis)?.analysis

  const selectChat = async (chat: Chat) => {
    setDrawer(false)
    setSelectedChatId(chat.id)
    setError('')
    setLoading(true)
    try {
      setMessages(await getMessages(chat.id))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo cargar el chat')
    } finally {
      setLoading(false)
    }
  }

  const newChat = async () => {
    if (!user) {
      setDrawer(false)
      onAuth('login')
      return
    }
    setError('')
    try {
      const chat = await postChat()
      setChats((current) => [chat, ...current])
      setSelectedChatId(chat.id)
      setMessages([])
      setDrawer(false)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo crear el chat')
    }
  }

  const removeChat = async (chat: Chat) => {
    if (!window.confirm(`¿Eliminar "${chat.title}" y todo su historial?`)) return
    setError('')
    try {
      await deleteChat(chat.id)
      setChats((current) => current.filter((item) => item.id !== chat.id))
      if (selectedChatId === chat.id) {
        setSelectedChatId(null)
        setMessages([])
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo eliminar el chat')
    }
  }

  const removeAllChats = async () => {
    if (
      !window.confirm(
        '¿Eliminar todas tus conversaciones y sus historiales? Esta acción no se puede deshacer.',
      )
    )
      return
    setError('')
    try {
      await deleteAllChats()
      setChats([])
      setSelectedChatId(null)
      setMessages([])
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudieron eliminar los chats')
    }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const content = draft.trim()
    if (!content || loading) return
    setDraft('')
    setError('')
    setLoading(true)
    try {
      const result = await postRespond(content, user ? selectedChatId : null, messages)
      setMessages((current) => [...current, result.userMessage, result.assistantMessage])
      if (user && result.chatId) {
        setSelectedChatId(result.chatId)
        setChats(await getChats())
      }
    } catch (reason) {
      setDraft(content)
      setError(reason instanceof Error ? reason.message : 'No se pudo verificar la afirmación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="chat-page">
      {drawer && (
        <button
          className="drawer-backdrop"
          onClick={() => setDrawer(false)}
          aria-label="Cerrar conversaciones"
        />
      )}
      <aside className={drawer ? 'chat-sidebar is-open' : 'chat-sidebar'}>
        <div className="sidebar-top">
          <button className="new-chat" onClick={newChat}>
            <Plus size={18} />
            Nuevo chat
          </button>
          <button className="close-drawer" onClick={() => setDrawer(false)} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-section-heading">
          <small className="sidebar-label">{user ? 'TUS CONVERSACIONES' : 'MODO INVITADO'}</small>
        </div>
        <label className="chat-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar conversaciones"
          />
        </label>
        <div className="chat-items">
          {filteredChats.map((chat) => (
            <article className={chat.id === selectedChatId ? 'selected' : ''} key={chat.id}>
              <button onClick={() => selectChat(chat)}>
                <MessageCircle size={17} />
                <span>
                  <b>{chat.title}</b>
                </span>
              </button>
              <button
                className="delete-chat"
                onClick={() => removeChat(chat)}
                aria-label={`Eliminar ${chat.title}`}
              >
                <Trash2 size={15} />
              </button>
            </article>
          ))}
          {!user && (
            <p className="guest-note">
              Tu chat actual no se guardará. Inicia sesión para conservar el historial.
            </p>
          )}
        </div>
        <div className="sidebar-footer">
          {user && chats.length > 0 && (
            <div className="delete-chats">
              <button className="delete-all" onClick={removeAllChats}>
                Eliminar chats
              </button>
            </div>
          )}
          <div className="safety">
            <ShieldCheck size={20} />
            <p>
              <b>Tu aliado digital</b>VERIFIBOT puede equivocarse. Contrasta siempre las fuentes.
            </p>
          </div>
        </div>
      </aside>
      <section className="conversation-panel">
        <header className="conversation-header">
          <button
            className="drawer-button"
            onClick={() => setDrawer(true)}
            aria-label="Abrir conversaciones"
          >
            <Menu size={21} />
          </button>
          <i>
            <Bot size={21} />
          </i>
          <span>
            <b>VERIFIBOT</b>
            <small>● Listo para verificar</small>
          </span>
        </header>
        <div className="messages">
          {!messages.length && !loading && (
            <div className="chat-empty">
              <Bot size={40} />
              <h2>¿Qué quieres verificar?</h2>
              <p>Escribe una afirmación o pega el texto de una noticia.</p>
            </div>
          )}
          {messages.map((message) =>
            message.role === 'user' ? (
              <div className="user-message" key={message.id}>
                {message.content}
                <small>
                  {new Date(message.createdAt).toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  <CheckCircle2 size={13} />
                </small>
              </div>
            ) : message.analysis ? (
              <Verdict analysis={message.analysis} key={message.id} />
            ) : (
              <p key={message.id}>{message.content}</p>
            ),
          )}
          {loading && (
            <div className="chat-loading">
              <LoaderCircle size={19} /> Consultando evidencia…
            </div>
          )}
          {error && (
            <p className="chat-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <form className="composer" onSubmit={submit}>
          <div>
            <textarea
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Pregunta algo o pega una noticia…"
              maxLength={4000}
            />
            <button disabled={loading} aria-label="Enviar mensaje">
              <Send size={18} />
            </button>
          </div>
          <small>
            <ShieldCheck size={13} />
            Revisa siempre las fuentes antes de tomar una decisión.
          </small>
        </form>
      </section>
      <aside className="evidence-panel">
        <h2>
          <FileSearch size={20} />
          Análisis de evidencia
        </h2>
        {latestAnalysis ? (
          <div className={`score verdict-${latestAnalysis.verdict.replaceAll(' ', '-')}`}>
            <span className="wrong">
              <VerdictIcon verdict={latestAnalysis.verdict} size={18} />
            </span>
            <div>
              <b>{latestAnalysis.verdict}</b>
              <p>Basado en las fuentes mostradas</p>
            </div>
          </div>
        ) : (
          <p className="evidence-empty">El análisis aparecerá cuando envíes una afirmación.</p>
        )}
      </aside>
    </main>
  )
}
