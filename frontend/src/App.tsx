import { useEffect, useState } from 'react'
import { getAccessToken, setAccessToken } from './backend_calls/_shared/apiFetch'
import { getMe } from './backend_calls/users/getMe'
import type { User } from './backend_calls/users/types'
import { AuthModal } from './components/AuthModal/AuthModal'
import { MainLayout } from './layouts/MainLayout/MainLayout'
import { ChatPage } from './pages/Chat/ChatPage'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { HomePage } from './pages/Home/HomePage'
import { LearnPage } from './pages/Learn/LearnPage'
import type { View } from './types/navigation'

export type AuthMode = 'login' | 'signup'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!getAccessToken()) return
    getMe()
      .then(setUser)
      .catch(() => setAccessToken(null))
  }, [])

  const logout = () => {
    setAccessToken(null)
    setUser(null)
  }

  return (
    <MainLayout view={view} navigate={setView} onAuth={setAuthMode} user={user} onLogout={logout}>
      {view === 'home' && <HomePage navigate={setView} />}
      {view === 'chat' && <ChatPage key={user?.id ?? 'guest'} user={user} onAuth={setAuthMode} />}
      {view === 'learn' && <LearnPage />}
      {view === 'dashboard' && <DashboardPage />}
      {authMode && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthMode(null)}
          onAuthenticated={setUser}
        />
      )}
    </MainLayout>
  )
}
