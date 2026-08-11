import { FormEvent, useEffect, useMemo, useState } from 'react'
import { signInWithEmail, signOut, signUpWithEmail } from '../services/authRepository'
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabaseClient'
import '../styles/authPanel.css'

type AuthMode = 'sign-in' | 'sign-up'

type AuthPanelProps = {
  embedded?: boolean
}

function AuthPanel({ embedded = false }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const isConfigured = isSupabaseConfigured()

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.length >= 6 && !isBusy,
    [email, password, isBusy],
  )

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    let isMounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return
      setUserEmail(data.user?.email ?? '')
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? '')
      if (session?.user.email) setMessage('')
    })

    return () => {
      isMounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setIsBusy(true)
    setMessage('')

    const result =
      mode === 'sign-in'
        ? await signInWithEmail(email.trim(), password)
        : await signUpWithEmail(email.trim(), password, displayName.trim() || undefined)

    setIsBusy(false)

    if (!result.ok) {
      setMessage(result.error ?? 'Ошибка авторизации')
      return
    }

    setMessage(
      mode === 'sign-in'
        ? 'Вход выполнен'
        : 'Регистрация создана. Проверьте email, если включено подтверждение.',
    )
    setPassword('')
  }

  async function handleSignOut() {
    setIsBusy(true)
    const result = await signOut()
    setIsBusy(false)
    setMessage(result.ok ? 'Вы вышли из аккаунта' : result.error ?? 'Ошибка выхода')
  }

  const panelClass = embedded ? 'auth-panel auth-panel-embedded' : 'auth-panel'

  if (!isConfigured) {
    return (
      <aside className={`${panelClass} auth-panel-muted`} aria-label='Supabase'>
        Supabase не настроен
      </aside>
    )
  }

  if (userEmail) {
    return (
      <aside
        className={`${panelClass} auth-panel-user`}
        aria-label='Аккаунт'
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <span className='auth-user-email'>{userEmail}</span>
        <button
          className='auth-button auth-button-secondary'
          type='button'
          onClick={handleSignOut}
          disabled={isBusy}
        >
          Выйти
        </button>
      </aside>
    )
  }

  return (
    <aside
      className={panelClass}
      aria-label='Авторизация'
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className='auth-tabs' role='tablist' aria-label='Режим авторизации'>
        <button
          className={mode === 'sign-in' ? 'auth-tab auth-tab-active' : 'auth-tab'}
          type='button'
          onClick={() => setMode('sign-in')}
        >
          Вход
        </button>
        <button
          className={mode === 'sign-up' ? 'auth-tab auth-tab-active' : 'auth-tab'}
          type='button'
          onClick={() => setMode('sign-up')}
        >
          Регистрация
        </button>
      </div>

      <form className='auth-form' onSubmit={handleSubmit}>
        {mode === 'sign-up' && (
          <input
            className='auth-input'
            type='text'
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder='Имя игрока'
            autoComplete='nickname'
          />
        )}
        <input
          className='auth-input'
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder='Email'
          autoComplete='email'
        />
        <input
          className='auth-input'
          type='password'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder='Пароль'
          autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
        />
        <button className='auth-button' type='submit' disabled={!canSubmit}>
          {isBusy ? 'Подождите...' : mode === 'sign-in' ? 'Войти' : 'Создать'}
        </button>
      </form>

      {message && <p className='auth-message'>{message}</p>}
    </aside>
  )
}

export default AuthPanel
