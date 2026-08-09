import {
  Bot,
  CheckCircle2,
  ChevronDown,
  FileSearch,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import './ChatPage.css'

const chats = [
  ['Agua con limón y cáncer', 'Analizamos evidencia médica', '10:24'],
  ['¿Los celulares 5G enferman?', 'Revisión científica', 'Ayer'],
  ['Vacuna contra la gripe', 'Efectividad y recomendaciones', 'Ayer'],
]

export function ChatPage() {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [drawer, setDrawer] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.trim()) return
    setMessages((current) => [...current, draft.trim()])
    setDraft('')
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
          <button className="new-chat">
            <Plus size={18} />
            Nuevo chat
          </button>
          <button className="close-drawer" onClick={() => setDrawer(false)} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <label className="chat-search">
          <Search size={17} />
          <input placeholder="Buscar conversaciones" />
        </label>
        <small className="sidebar-label">RECIENTES</small>
        <div className="chat-items">
          {chats.map(([title, detail, time], index) => (
            <article className={index === 0 ? 'selected' : ''} key={title}>
              <button onClick={() => setDrawer(false)}>
                <MessageCircle size={17} />
                <span>
                  <b>{title}</b>
                  <small>{detail}</small>
                </span>
                <time>{time}</time>
              </button>
            </article>
          ))}
        </div>
        <div className="safety">
          <ShieldCheck size={20} />
          <p>
            <b>Tu aliado digital</b>VERIFIBOT puede equivocarse. Contrasta siempre las fuentes.
          </p>
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
          <span className="today">Hoy</span>
          <div className="user-message">
            ¿Es verdad que beber agua con limón cura el cáncer?
            <small>
              10:24 a. m. <CheckCircle2 size={13} />
            </small>
          </div>
          <article className="verdict">
            <header>
              <span className="wrong">
                <X size={20} />
              </span>
              <div>
                <small>VEREDICTO</small>
                <h2>No verídica</h2>
              </div>
              <b>Confianza alta · 90%</b>
            </header>
            <p>
              No existe evidencia científica confiable de que beber agua con limón cure el cáncer.
              Puede formar parte de una alimentación saludable, pero no sustituye tratamientos
              médicos basados en evidencia.
            </p>
            <button
              className="sources-toggle"
              onClick={() => setSourcesOpen(!sourcesOpen)}
              aria-expanded={sourcesOpen}
            >
              <span>
                <FileSearch size={17} />3 fuentes consultadas
              </span>
              <ChevronDown size={17} />
            </button>
            {sourcesOpen && (
              <div className="sources">
                {['OMS', 'NCI', 'INSP'].map((source) => (
                  <a href="#sources" key={source}>
                    <b>{source}</b>
                    <span>
                      Fuente institucional<small>Consulta el contenido original</small>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </article>
          {messages.map((message, index) => (
            <div className="user-message" key={`${message}-${index}`}>
              {message}
              <small>
                Ahora <CheckCircle2 size={13} />
              </small>
            </div>
          ))}
        </div>
        <form className="composer" onSubmit={submit}>
          <div>
            <textarea
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Pregunta algo o pega una noticia…"
            />
            <button aria-label="Enviar mensaje">
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
        <div className="score">
          <span className="wrong">
            <X size={18} />
          </span>
          <div>
            <b>No verídica</b>
            <p>
              Confianza <strong>90%</strong>
            </p>
          </div>
        </div>
        <div className="score-line">
          <span />
        </div>
        <small>Basado en calidad y coincidencia de fuentes.</small>
        <h3>Cómo verificar</h3>
        {[
          'Cuestiona la afirmación',
          'Busca fuentes confiables',
          'Evalúa la evidencia',
          'Decide antes de compartir',
        ].map((step, index) => (
          <span className="verification-step" key={step}>
            <b>{index + 1}</b>
            {step}
          </span>
        ))}
      </aside>
    </main>
  )
}
