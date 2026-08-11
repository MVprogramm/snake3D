import { getSupabaseClient } from './supabaseClient'

export type AuthResult = {
  ok: boolean
  error?: string
}

function normalizeAuthErrorMessage(message: string): string {
  if (/failed to fetch|fetch failed|network|name could not be resolved/i.test(message)) {
    return 'Не удалось подключиться к Supabase. Проверьте интернет, DNS/VPN/AdBlock и доступность проекта Supabase.'
  }

  return message
}

function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return normalizeAuthErrorMessage(error.message)
  }

  return 'Unknown auth error'
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<AuthResult> {
  const supabase = getSupabaseClient()
  if (!supabase) return { ok: false, error: 'Supabase is not configured' }

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    return error ? { ok: false, error: normalizeAuthErrorMessage(error.message) } : { ok: true }
  } catch (error) {
    return { ok: false, error: getAuthErrorMessage(error) }
  }
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  const supabase = getSupabaseClient()
  if (!supabase) return { ok: false, error: 'Supabase is not configured' }

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    return error ? { ok: false, error: normalizeAuthErrorMessage(error.message) } : { ok: true }
  } catch (error) {
    return { ok: false, error: getAuthErrorMessage(error) }
  }
}

export async function signOut(): Promise<AuthResult> {
  const supabase = getSupabaseClient()
  if (!supabase) return { ok: false, error: 'Supabase is not configured' }

  try {
    const { error } = await supabase.auth.signOut()

    return error ? { ok: false, error: normalizeAuthErrorMessage(error.message) } : { ok: true }
  } catch (error) {
    return { ok: false, error: getAuthErrorMessage(error) }
  }
}
