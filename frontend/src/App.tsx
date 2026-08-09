import { useState } from 'react'
import type { ComponentType } from 'react'
import { AuthModal } from './components/AuthModal/AuthModal'
import { MainLayout } from './layouts/MainLayout/MainLayout'
import { ChatPage } from './pages/Chat/ChatPage'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { HomePage } from './pages/Home/HomePage'
import { LearnPage } from './pages/Learn/LearnPage'
import type { View } from './types/navigation'

const routes: Record<Exclude<View, 'home'>, ComponentType> = {
  chat: ChatPage,
  learn: LearnPage,
  dashboard: DashboardPage,
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [authOpen, setAuthOpen] = useState(false)
  const Page = view === 'home' ? null : routes[view]

  return (
    <MainLayout view={view} navigate={setView} onAuth={() => setAuthOpen(true)}>
      {view === 'home' ? <HomePage navigate={setView} /> : Page && <Page />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </MainLayout>
  )
}
