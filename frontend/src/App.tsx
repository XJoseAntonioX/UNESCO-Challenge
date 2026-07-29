import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileSearch,
  Flame,
  Globe2,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react'

type View = 'home' | 'chat' | 'learn' | 'dashboard'
type Chat = { id: number; title: string; detail: string; time: string }

const seedChats: Chat[] = [
  { id: 1, title: 'Agua con limón y cáncer', detail: 'Analizamos evidencia médica', time: '10:24' },
  { id: 2, title: '¿Los celulares 5G enferman?', detail: 'Revisión científica', time: 'Ayer' },
  { id: 3, title: 'Vacuna contra la gripe', detail: 'Efectividad y recomendaciones', time: 'Ayer' },
  { id: 4, title: 'Azúcar morena vs. blanca', detail: 'Comparación nutricional', time: '2 días' },
]

const lessons = [
  [
    'Fuentes',
    'Cómo reconocer una fuente confiable',
    'Evalúa autoría, evidencia y transparencia.',
    72,
    120,
  ],
  [
    'Lenguaje',
    'Las señales de la desinformación',
    'Identifica titulares alarmistas y manipulación.',
    35,
    100,
  ],
  [
    'Multimedia',
    'Verifica una imagen antes de compartir',
    'Usa búsquedas inversas y pistas visuales.',
    0,
    140,
  ],
  [
    'Práctica',
    'Pon a prueba tu criterio digital',
    'Resuelve casos inspirados en situaciones reales.',
    0,
    180,
  ],
] as const

function Brand() {
  return (
    <span className="brand">
      <i>
        <Check size={18} strokeWidth={3} />
      </i>
      VERIFI<strong>BOT</strong>
    </span>
  )
}

function Header({ view, go, auth }: { view: View; go: (v: View) => void; auth: () => void }) {
  const [open, setOpen] = useState(false)
  const items: [View, string][] = [
    ['home', 'Inicio'],
    ['chat', 'VERIFIBOT'],
    ['learn', 'Aprender'],
    ['dashboard', 'Métricas'],
  ]
  return (
    <header className="header">
      <button className="brand-button" onClick={() => go('home')}>
        <Brand />
      </button>
      <nav className={open ? 'open' : ''}>
        {items.map(([id, label]) => (
          <button
            key={id}
            className={view === id ? 'active' : ''}
            onClick={() => {
              go(id)
              setOpen(false)
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <button className="login" onClick={auth}>
          Iniciar sesión
        </button>
        <button className="signup" onClick={auth}>
          Crear cuenta
        </button>
        <button className="menu" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          <Menu size={20} />
        </button>
      </div>
    </header>
  )
}

function HomeView({ go }: { go: (v: View) => void }) {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">— Ciudadanía digital para todas las personas</span>
          <h1>
            Comprueba antes
            <br />
            de <em>compartir.</em>
          </h1>
          <p>
            Verifica información, comprende la evidencia y fortalece tu criterio digital en una
            plataforma clara, pública y educativa.
          </p>
          <div className="actions">
            <button className="primary" onClick={() => go('chat')}>
              Verificar una noticia <ArrowRight size={16} />
            </button>
            <button className="secondary" onClick={() => go('learn')}>
              Explorar recursos
            </button>
          </div>
          <small className="trust">
            <ShieldCheck size={16} /> Evidencia visible. Fuentes consultables. Decisiones
            informadas.
          </small>
        </div>
        <div className="modules">
          <button className="window bot-window" onClick={() => go('chat')}>
            <div className="window-bar">
              <span /> <span /> <span />
              <b>VERIFIBOT</b>
            </div>
            <div className="bot-body">
              <i className="bot-icon">
                <Bot size={30} />
              </i>
              <small>● EN LÍNEA</small>
              <h2>Hola, soy VERIFIBOT</h2>
              <p>¿Qué información te gustaría verificar?</p>
              <div className="fake-input">
                Pega una noticia o escribe una afirmación… <Send size={15} />
              </div>
            </div>
            <footer>
              Abrir VERIFIBOT <ArrowRight size={15} />
            </footer>
          </button>
          <div className="mini-stack">
            <button className="window mini-window" onClick={() => go('learn')}>
              <i>
                <BookOpen size={20} />
              </i>
              <small>APRENDER</small>
              <h3>Detecta la desinformación</h3>
              <p>Lecciones breves y ejercicios prácticos.</p>
              <div className="progress">
                <span style={{ width: '42%' }} />
              </div>
            </button>
            <button className="window mini-window" onClick={() => go('dashboard')}>
              <i className="coral">
                <BarChart3 size={20} />
              </i>
              <small>MÉTRICAS</small>
              <h3>Tu impacto digital</h3>
              <p>
                <b>18</b> verificaciones esta semana
              </p>
              <div className="bars">
                {[32, 48, 40, 67, 55, 86].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </button>
          </div>
        </div>
      </section>
      <section className="value-strip">
        {[
          [Globe2, 'Información abierta', 'Consulta las fuentes detrás de cada respuesta.'],
          [BookOpen, 'Aprendizaje práctico', 'Aprende mientras verificas contenido real.'],
          [ShieldCheck, 'Criterio, no dependencia', 'Te ayudamos a tomar tus propias decisiones.'],
        ].map(([Icon, title, text]) => {
          const I = Icon as typeof Globe2
          return (
            <div key={title as string}>
              <I size={20} />
              <span>
                <b>{title as string}</b>
                {text as string}
              </span>
            </div>
          )
        })}
      </section>
    </main>
  )
}

function ChatView() {
  const [chats, setChats] = useState(seedChats),
    [active, setActive] = useState(1),
    [draft, setDraft] = useState(''),
    [sent, setSent] = useState<string[]>([]),
    [sources, setSources] = useState(false),
    [drawer, setDrawer] = useState(false)
  const current = chats.find((c) => c.id === active)
  const add = () => {
    const id = Date.now()
    setChats((c) => [
      { id, title: 'Nueva verificación', detail: 'Inicia una conversación', time: 'Ahora' },
      ...c,
    ])
    setActive(id)
    setSent([])
  }
  const remove = (id: number) => {
    const next = chats.filter((c) => c.id !== id)
    setChats(next)
    if (active === id) setActive(next[0]?.id ?? 0)
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (draft.trim()) {
      setSent((s) => [...s, draft.trim()])
      setDraft('')
    }
  }
  return (
    <main className="chat-layout">
      <aside className={drawer ? 'chat-list mobile-open' : 'chat-list'}>
        <div className="chat-top">
          <button className="new-chat" onClick={add}>
            <Plus size={16} /> Nuevo chat
          </button>
          <button className="close-drawer" onClick={() => setDrawer(false)}>
            <X size={18} />
          </button>
        </div>
        <label className="chat-search">
          <Search size={14} />
          <input placeholder="Buscar conversaciones" />
        </label>
        <small>RECIENTES</small>
        <div className="chat-items">
          {chats.map((c) => (
            <article key={c.id} className={active === c.id ? 'selected' : ''}>
              <button
                onClick={() => {
                  setActive(c.id)
                  setDrawer(false)
                }}
              >
                <MessageCircle size={16} />
                <span>
                  <b>{c.title}</b>
                  <small>{c.detail}</small>
                </span>
                <time>{c.time}</time>
              </button>
              <button
                className="trash"
                onClick={() => remove(c.id)}
                aria-label={`Eliminar ${c.title}`}
              >
                <Trash2 size={13} />
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
      <section className="conversation">
        <header>
          <button className="drawer-button" onClick={() => setDrawer(true)}>
            <Menu size={19} />
          </button>
          <i>
            <Bot size={20} />
          </i>
          <span>
            <b>VERIFIBOT</b>
            <small>● Listo para verificar</small>
          </span>
        </header>
        <div className="messages">
          {!current ? (
            <div className="empty">
              <Bot size={34} />
              <h2>Crea un chat para comenzar</h2>
            </div>
          ) : current.id !== 1 ? (
            <div className="empty">
              <Bot size={34} />
              <h2>{current.title}</h2>
              <p>Pega una afirmación, noticia o enlace para iniciar.</p>
            </div>
          ) : (
            <>
              <span className="today">Hoy</span>
              <div className="user-message">
                ¿Es verdad que beber agua con limón cura el cáncer?
                <small>
                  10:24 a. m. <CheckCircle2 size={12} />
                </small>
              </div>
              <div className="assistant">
                <i>
                  <Bot size={19} />
                </i>
                <article className="verdict">
                  <header>
                    <span className="wrong">
                      <X size={19} />
                    </span>
                    <div>
                      <small>VEREDICTO</small>
                      <h2>No verídica</h2>
                    </div>
                    <b>Confianza alta · 90%</b>
                  </header>
                  <p>
                    No existe evidencia científica confiable de que beber agua con limón cure el
                    cáncer.
                  </p>
                  <p>
                    Puede formar parte de una alimentación saludable, pero no sustituye tratamientos
                    médicos basados en evidencia.
                  </p>
                  <button className="sources-toggle" onClick={() => setSources(!sources)}>
                    <span>
                      <FileSearch size={16} /> 3 fuentes consultadas
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  {sources && (
                    <div className="sources">
                      {[
                        ['OMS', 'Cáncer: mitos y realidades'],
                        ['NCI', 'Mitos sobre el cáncer'],
                        ['INSP', 'Alimentación y evidencia'],
                      ].map(([o, t]) => (
                        <a href="#" onClick={(e) => e.preventDefault()} key={o}>
                          <b>{o}</b>
                          <span>
                            {t}
                            <small>Fuente institucional</small>
                          </span>
                          <ExternalLink size={13} />
                        </a>
                      ))}
                    </div>
                  )}
                  <button className="learn-more">
                    <Sparkles size={16} />
                    <span>
                      <b>¿Te gustaría saber más?</b>Reconoce las promesas milagro.
                    </span>
                    <ArrowRight size={15} />
                  </button>
                </article>
              </div>
            </>
          )}
          {sent.map((m, i) => (
            <div key={i}>
              <div className="user-message">
                {m}
                <small>
                  Ahora <CheckCircle2 size={12} />
                </small>
              </div>
              <div className="demo-answer">
                <Bot size={16} /> Demo: aquí aparecerá el análisis conectado al backend.
              </div>
            </div>
          ))}
        </div>
        <form className="composer" onSubmit={submit}>
          <div>
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Pregunta algo o pega una noticia…"
            />
            <button aria-label="Enviar">
              <Send size={17} />
            </button>
          </div>
          <small>
            <ShieldCheck size={12} /> Revisa siempre las fuentes antes de tomar una decisión.
          </small>
        </form>
      </section>
      <aside className="evidence">
        <h2>
          <BarChart3 size={20} /> Análisis de evidencia
        </h2>
        <div className="score">
          <div>
            <span className="wrong">
              <X size={18} />
            </span>
            <b>No verídica</b>
          </div>
          <p>
            Confianza <strong>90%</strong>
          </p>
          <div className="score-line">
            <span />
          </div>
          <small>Basado en calidad y coincidencia de fuentes.</small>
        </div>
        <h3>Fuentes principales</h3>
        {[
          ['OMS', 'Organización Mundial de la Salud'],
          ['NCI', 'National Cancer Institute'],
          ['INSP', 'Instituto Nacional de Salud Pública'],
        ].map(([a, n]) => (
          <div className="evidence-source" key={a}>
            <b>{a}</b>
            <span>
              {n}
              <small>Fuente institucional</small>
            </span>
            <ExternalLink size={13} />
          </div>
        ))}
        <div className="steps">
          <h3>Cómo verificar</h3>
          {['Cuestiona', 'Busca fuentes', 'Evalúa', 'Decide'].map((s, i) => (
            <span key={s}>
              <b>{i + 1}</b>
              {s}
            </span>
          ))}
        </div>
      </aside>
    </main>
  )
}

function LearnView() {
  return (
    <main className="section-page">
      <header className="section-heading">
        <div>
          <span>CONTENIDO EDUCATIVO</span>
          <h1>Desarrolla tu criterio digital</h1>
          <p>Contenido corto, útil y basado en situaciones cotidianas.</p>
        </div>
        <b className="level">
          <Award size={17} /> Nivel 7 · Explorador crítico
        </b>
      </header>
      <section className="learning-hero">
        <div>
          <small>
            <Flame size={15} /> RACHA DE 5 DÍAS
          </small>
          <h2>Piensa antes de compartir</h2>
          <p>Continúa tu ruta y aprende a evaluar fuentes, imágenes y argumentos.</p>
          <button>
            Continuar la lección <ArrowRight size={16} />
          </button>
        </div>
        <div className="ring">
          <b>42%</b>
          <small>completado</small>
        </div>
      </section>
      <section className="learning-stats">
        <span>
          <Award size={18} />
          <b>520 XP</b> de 700
        </span>
        <span>
          <CheckCircle2 size={18} />
          <b>6 lecciones</b> completadas
        </span>
        <span>
          <TrendingUp size={18} />
          <b>38 min</b> aprendiendo
        </span>
      </section>
      <h2 className="sub-title">Continúa tu ruta</h2>
      <section className="lesson-grid">
        {lessons.map(([tag, title, text, progress, xp]) => (
          <article key={title}>
            <div>
              <i>
                <BookOpen size={21} />
              </i>
              <small>+{xp} XP</small>
            </div>
            <span>{tag}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <div className="progress">
              <b style={{ width: `${progress}%` }} />
            </div>
            <button>
              {progress ? 'Continuar' : 'Comenzar'} <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </section>
    </main>
  )
}

function DashboardView() {
  const cards = [
    ['Verificaciones', '48', '+18%'],
    ['No verídicas', '19', '40% del total'],
    ['Fuentes consultadas', '126', '2.6 por análisis'],
    ['Satisfacción', '4.7', 'de 5 estrellas'],
  ]
  return (
    <main className="section-page">
      <header className="section-heading">
        <div>
          <span>MÉTRICAS DE DEMOSTRACIÓN</span>
          <h1>Impacto de la plataforma</h1>
          <p>Uso, resultados y experiencia en una lectura sencilla.</p>
        </div>
        <button className="period">
          Últimos 30 días <ChevronDown size={15} />
        </button>
      </header>
      <section className="stat-grid">
        {cards.map(([l, v, t]) => (
          <article key={l}>
            <span>{l}</span>
            <strong>{v}</strong>
            <small>{t}</small>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        <article className="chart-card wide">
          <h2>Actividad de verificación</h2>
          <p>Consultas realizadas por semana</p>
          <div className="vertical-bars">
            {[4, 7, 6, 10, 8, 13, 11, 16].map((v, i) => (
              <span key={i} style={{ height: `${v * 5}%` }}>
                <i>S{i + 1}</i>
              </span>
            ))}
          </div>
        </article>
        <article className="chart-card">
          <h2>Resultados</h2>
          <p>Distribución de veredictos</p>
          <div className="donut">
            <b>
              48<small>total</small>
            </b>
          </div>
          <div className="legend">
            <span>
              <i className="teal" />
              Verídicas <b>20</b>
            </span>
            <span>
              <i className="red" />
              No verídicas <b>19</b>
            </span>
            <span>
              <i className="yellow" />
              Sin evidencia <b>9</b>
            </span>
          </div>
        </article>
        <article className="chart-card wide">
          <h2>Origen de la información</h2>
          <p>Medio indicado en cada consulta</p>
          <div className="horizontal-bars">
            {[
              ['Redes sociales', 42],
              ['Sitios de noticias', 31],
              ['Mensajería', 17],
              ['Otros', 10],
            ].map(([n, v]) => (
              <div key={n}>
                <span>{n}</span>
                <i>
                  <b style={{ width: `${v}%` }} />
                </i>
                <strong>{v}%</strong>
              </div>
            ))}
          </div>
        </article>
        <article className="chart-card satisfaction">
          <h2>Experiencia de usuarios</h2>
          <strong>94%</strong>
          <p>considera clara la explicación</p>
          <small>Datos dummy de satisfacción</small>
        </article>
      </section>
    </main>
  )
}

function Auth({ close }: { close: () => void }) {
  const [signup, setSignup] = useState(false)
  return (
    <div className="modal-bg" onMouseDown={close}>
      <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={close}>
          <X size={18} />
        </button>
        <Brand />
        <h2>{signup ? 'Crea tu cuenta' : 'Te damos la bienvenida'}</h2>
        <p>
          {signup
            ? 'Guarda tus chats, progreso y logros digitales.'
            : 'Continúa tu aprendizaje y consulta tus verificaciones.'}
        </p>
        <label>
          Correo electrónico
          <input type="email" placeholder="nombre@correo.com" />
        </label>
        <label>
          Contraseña
          <input type="password" placeholder="••••••••" />
        </label>
        <button className="primary full">
          {signup ? 'Crear cuenta' : 'Iniciar sesión'} <ArrowRight size={15} />
        </button>
        <small>
          {signup ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
          <button onClick={() => setSignup(!signup)}>
            {signup ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </small>
        <footer>Demo visual: no se almacenan datos personales.</footer>
      </section>
    </div>
  )
}

export default function Page() {
  const [view, setView] = useState<View>('home'),
    [auth, setAuth] = useState(false)
  return (
    <>
      <Header view={view} go={setView} auth={() => setAuth(true)} />
      {view === 'home' && <HomeView go={setView} />} {view === 'chat' && <ChatView />}
      {view === 'learn' && <LearnView />}
      {view === 'dashboard' && <DashboardView />}
      {auth && <Auth close={() => setAuth(false)} />}
    </>
  )
}
