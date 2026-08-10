import type { ReactNode } from 'react'
import type { Navigate, View } from '../../types/navigation'
import type { AuthMode } from '../../App'
import type { User } from '../../backend_calls/users/types'
import { Header } from '../../components/Header/Header'
import './MainLayout.css'

type Props = {
  children: ReactNode
  view: View
  navigate: Navigate
  onAuth: (mode: AuthMode) => void
  user: User | null
  onLogout: () => void
}
export function MainLayout({ children, view, navigate, onAuth, user, onLogout }: Props) {
  return (
    <div className="app-shell">
      <Header view={view} navigate={navigate} onAuth={onAuth} user={user} onLogout={onLogout} />
      {children}
    </div>
  )
}
