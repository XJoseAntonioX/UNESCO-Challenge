import { Menu } from 'lucide-react'
import { useState } from 'react'
import type { Navigate, View } from '../../types/navigation'
import { Brand } from '../Brand/Brand'
import './Header.css'

type Props = { view: View; navigate: Navigate; onAuth: () => void }
const items: Array<[View, string]> = [['home', 'Inicio'], ['chat', 'VERIFIBOT'], ['learn', 'Aprender'], ['dashboard', 'Métricas']]

export function Header({ view, navigate, onAuth }: Props) {
  const [open, setOpen] = useState(false)
  const go = (next: View) => { navigate(next); setOpen(false) }
  return <header className="header">
    <button className="brand-button" onClick={() => go('home')} aria-label="Ir al inicio"><Brand /></button>
    <nav className={open ? 'open' : ''} aria-label="Navegación principal">
      {items.map(([id, label]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => go(id)}>{label}</button>)}
    </nav>
    <div className="header-actions">
      <button className="login" onClick={onAuth}>Iniciar sesión</button>
      <button className="signup" onClick={onAuth}>Crear cuenta</button>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Abrir menú" aria-expanded={open}><Menu size={20} /></button>
    </div>
  </header>
}
