import { useEffect, useState } from 'react'
import {
  GameSessionSummary,
  listGameSessions,
} from '../services/gameSessionRepository'
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabaseClient'
import '../styles/sessionHistoryPanel.css'

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatStatus(session: GameSessionSummary): string {
  if (session.status === 'won') return 'Победа'
  if (session.status === 'completed') return 'Уровень пройден'
  return 'Игра окончена'
}

function formatMode(mode: GameSessionSummary['gameMode']): string {
  return mode === 'training' ? 'Тренировка' : 'Игра'
}

function formatOverrun(value: number | null): string {
  if (value === null) return '-'
  return `${value.toFixed(2)}x`
}

function formatMs(value: number | null): string {
  if (value === null) return '-'
  return `${Math.round(value)} мс`
}

function SessionHistoryPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sessions, setSessions] = useState<GameSessionSummary[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function loadSessions() {
    if (!isSupabaseConfigured()) return

    setIsLoading(true)
    setMessage('')

    const result = await listGameSessions()

    setIsLoading(false)
    setSessions(result.sessions)
    setMessage(result.error ?? '')
  }

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    let isMounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return

      const hasUser = Boolean(data.user)
      setIsAuthenticated(hasUser)
      if (hasUser) void loadSessions()
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const hasUser = Boolean(session?.user)
      setIsAuthenticated(hasUser)

      if (hasUser) {
        void loadSessions()
      } else {
        setSessions([])
        setMessage('')
      }
    })

    return () => {
      isMounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  if (!isSupabaseConfigured()) return null

  if (!isAuthenticated) {
    return (
      <section className='session-history-panel' aria-label='История игровых сессий'>
        <div className='session-history-header'>
          <h2 className='session-history-title'>История</h2>
        </div>
        <p className='session-history-empty'>Войдите, чтобы видеть сохраненные результаты.</p>
      </section>
    )
  }

  return (
    <section className='session-history-panel' aria-label='История игровых сессий'>
      <div className='session-history-header'>
        <h2 className='session-history-title'>История</h2>
        <button
          className='session-history-refresh'
          type='button'
          onClick={loadSessions}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Обновить'}
        </button>
      </div>

      {message && <p className='session-history-empty'>{message}</p>}

      {!message && sessions.length === 0 && (
        <p className='session-history-empty'>
          {isLoading ? 'Загрузка...' : 'Сохраненных сессий пока нет.'}
        </p>
      )}

      {sessions.length > 0 && (
        <div className='session-history-list'>
          {sessions.map((session) => (
            <article className='session-history-item' key={session.id}>
              <div className='session-history-item-main'>
                <span className='session-history-level'>Ур. {session.levelNumber}</span>
                <span className='session-history-status'>{formatStatus(session)}</span>
              </div>
              <div className='session-history-meta'>
                <span>{formatMode(session.gameMode)}</span>
                <span>
                  {session.score}/{session.maxScore}
                </span>
                <span>{formatOverrun(session.appleTimeOverrunAvg)}</span>
                <span>{formatDate(session.createdAt)}</span>
              </div>
              {session.lastAppleEfficiency && (
                <div className='session-history-diagnostics'>
                  <span>игрок: {formatMs(session.lastAppleEfficiency.playerMs)}</span>
                  <span>идеал: {formatMs(session.lastAppleEfficiency.idealMs)}</span>
                  <span>путь: {session.lastAppleEfficiency.initialRouteCells ?? '-'}</span>
                  <span>ост.: {session.lastAppleEfficiency.remainingCells ?? '-'}</span>
                  <span>скор.: {session.lastAppleEfficiency.speed ?? '-'}</span>
                  <span>перестр.: {session.lastAppleEfficiency.reroutes ?? '-'}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SessionHistoryPanel
