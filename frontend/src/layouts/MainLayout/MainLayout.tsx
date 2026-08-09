import type { ReactNode } from 'react'
import type { Navigate, View } from '../../types/navigation'
import { Header } from '../../components/Header/Header'
import './MainLayout.css'

type Props = { children: ReactNode; view: View; navigate: Navigate; onAuth: () => void }
export function MainLayout({ children, view, navigate, onAuth }: Props) {
  return (
    <div className="app-shell">
      <Header view={view} navigate={navigate} onAuth={onAuth} />
      {children}
    </div>
  )
}
