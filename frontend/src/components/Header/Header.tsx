import { ChevronDown, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import type { Navigate, View } from '../../types/navigation'
import type { AuthMode } from '../../App'
import type { User } from '../../backend_calls/users/types'
import { Brand } from '../Brand/Brand'
import './Header.css'

type Props = {
  view: View
  navigate: Navigate
  onAuth: (mode: AuthMode) => void
  user: User | null
  onLogout: () => void
}
const items: Array<[View, string]> = [
  ['home', 'Inicio'],
  ['chat', 'VERIFIBOT'],
  ['learn', 'Aprender'],
  ['dashboard', 'Métricas'],
]

export function Header({ view, navigate, onAuth, user, onLogout }: Props) {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const go = (next: View) => {
    navigate(next)
    setOpen(false)
    setProfileOpen(false)
  }
  const initials = (user?.name || user?.email || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  return (
    <header className="header">
      <button className="brand-button" onClick={() => go('home')} aria-label="Ir al inicio">
        <Brand />
      </button>
      <nav className={open ? 'open' : ''} aria-label="Navegación principal">
        {items.map(([id, label]) => (
          <button key={id} className={view === id ? 'active' : ''} onClick={() => go(id)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        {user ? (
          <div className="profile-menu">
            <button
              className="profile-trigger"
              onClick={() => setProfileOpen((current) => !current)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <span className="user-avatar" aria-hidden="true">
                {initials}
              </span>
              <span className="user-email" title={user.email}>
                {user.name || user.email}
              </span>
              <ChevronDown
                className={profileOpen ? 'profile-chevron is-open' : 'profile-chevron'}
                size={15}
                aria-hidden="true"
              />
            </button>
            {profileOpen && (
              <div className="profile-dropdown" role="menu">
                <p>
                  <b>{user.name || 'Tu cuenta'}</b>
                  <small>{user.email}</small>
                </p>
                <button role="menuitem" onClick={onLogout}>
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="login" onClick={() => onAuth('login')}>
              Iniciar sesión
            </button>
            <button className="signup" onClick={() => onAuth('signup')}>
              Crear cuenta
            </button>
          </>
        )}
        <button
          className="menu"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  )
}
