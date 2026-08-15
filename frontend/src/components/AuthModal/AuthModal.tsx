import { ArrowRight, X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AuthMode } from '../../App'
import { setAccessToken } from '../../backend_calls/_shared/apiFetch'
import { postLogin } from '../../backend_calls/users/postLogin'
import { postSignup } from '../../backend_calls/users/postSignup'
import type { User } from '../../backend_calls/users/types'
import { Brand } from '../Brand/Brand'
import './AuthModal.css'

type Props = {
  initialMode: AuthMode
  onClose: () => void
  onAuthenticated: (user: User) => void
}

export function AuthModal({ initialMode, onClose, onAuthenticated }: Props) {
  const [mode, setMode] = useState(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await postSignup(name, email, password)
        setMode('login')
        setPassword('')
        setSuccess('Cuenta creada. Ahora inicia sesión.')
        return
      }
      const result = await postLogin(email, password)
      setAccessToken(result.access_token)
      onAuthenticated(result.user)
      onClose()
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'No se pudo completar el acceso',
      )
    } finally {
      setLoading(false)
    }
  }

  const changeMode = () => {
    setMode((current) => (current === 'login' ? 'signup' : 'login'))
    setError('')
    setSuccess('')
  }

  return (
    <div className="modal-bg" onMouseDown={onClose}>
      <form className="modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="modal-x" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>
        <Brand />
        <h2>{mode === 'login' ? 'Te damos la bienvenida' : 'Crea tu cuenta'}</h2>
        <p>
          {mode === 'login'
            ? 'Recupera tus chats y verificaciones.'
            : 'Guarda tus chats e historial de evidencia.'}
        </p>
        {mode === 'signup' && (
          <label>
            Nombre
            <input
              type="text"
              autoComplete="name"
              maxLength={80}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
        )}
        <label>
          Correo electrónico
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="auth-success" role="status">
            {success}
          </p>
        )}
        <button className="primary full" disabled={loading}>
          {loading ? 'Procesando…' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          {!loading && <ArrowRight size={15} />}
        </button>
        <small>
          {mode === 'login' ? '¿Aún no tienes cuenta? ' : '¿Ya tienes una cuenta? '}
          <button type="button" onClick={changeMode}>
            {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </small>
      </form>
    </div>
  )
}
