import { Protocol } from '../types/protocolTypes'
import { isTrainingMode } from '../engine/training/trainingMode'
import { getSupabaseClient } from './supabaseClient'
import levels from '../engine/levels/levels.json'

export type GameSessionStatus = 'completed' | 'game_over' | 'won'

export type SaveGameSessionParams = {
  levelNumber: number
  status: GameSessionStatus
  finishReason?: string
  score: number
  maxScore: number
  protocol: Protocol
}

export type GameSessionSummary = {
  id: string
  levelNumber: number
  gameMode: 'classic' | 'training'
  status: GameSessionStatus
  finishReason: string | null
  score: number
  maxScore: number
  appleTimeOverrunAvg: number | null
  appleTimeOverrunCount: number
  lastAppleEfficiency: {
    playerMs: number | null
    idealMs: number | null
    overrun: number | null
    initialRouteCells: number | null
    remainingCells: number | null
    speed: number | null
    reroutes: number | null
  } | null
  createdAt: string
}

function parseProtocolFields(value: string | number): Record<string, string> {
  if (typeof value === 'number') return {}

  return Object.fromEntries(
    value
      .split(';')
      .map((part) => part.split(':', 2))
      .filter(([key, fieldValue]) => key && fieldValue !== undefined),
  )
}

function parseNumberField(fields: Record<string, string>, key: string): number | null {
  const rawValue = fields[key]
  if (!rawValue || rawValue === 'null') return null

  const value = Number(rawValue)

  return Number.isFinite(value) ? value : null
}

function parseOverrun(value: string | number): number | null {
  const overrun = parseNumberField(parseProtocolFields(value), 'overrun')

  return overrun
}

function getLevelProtocolSlice(protocol: Protocol, levelNumber: number): Protocol {
  for (let index = protocol.length - 1; index >= 0; index -= 1) {
    const event = protocol[index]

    if (event.name === 'start level' && Number(event.value) === levelNumber) {
      return protocol.slice(index)
    }
  }

  return protocol
}

function getLastAppleEfficiency(protocol: Protocol): GameSessionSummary['lastAppleEfficiency'] {
  const event = protocol.findLast((item) => item.name === 'apple time efficiency')
  if (!event) return null

  const fields = parseProtocolFields(event.value)

  return {
    playerMs: parseNumberField(fields, 'playerMs'),
    idealMs: parseNumberField(fields, 'idealMs'),
    overrun: parseNumberField(fields, 'overrun'),
    initialRouteCells: parseNumberField(fields, 'initialRouteCells'),
    remainingCells: parseNumberField(fields, 'remainingCells'),
    speed: parseNumberField(fields, 'speed'),
    reroutes: parseNumberField(fields, 'reroutes'),
  }
}

function getAppleTimeOverrunAverage(protocol: Protocol): {
  average: number | null
  count: number
} {
  const values = protocol
    .filter((event) => event.name === 'apple time efficiency')
    .map((event) => parseOverrun(event.value))
    .filter((value): value is number => value !== null)

  if (values.length === 0) {
    return { average: null, count: 0 }
  }

  return {
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    count: values.length,
  }
}

function getLevelBonusValue(levelNumber: number, type: string): number {
  const level = levels[levelNumber - 1]
  const bonus = level?.bonuses.find((item) => item.type === type)
  const value = Number(bonus?.value)

  return Number.isFinite(value) ? value : 0
}

function getLevelScoreFromProtocol(
  protocol: Protocol,
  levelNumber: number,
  fallbackScore: number,
): number {
  const levelProtocol = getLevelProtocolSlice(protocol, levelNumber)
  let score = 0
  let pendingFoodScore: number | null = null

  levelProtocol.forEach((event) => {
    if (event.name === 'bonus doubleScoresFood') {
      const eventScore = Number(event.value)
      pendingFoodScore = Number.isFinite(eventScore) ? eventScore : 2
      return
    }

    if (event.name === 'food eaten') {
      score += pendingFoodScore ?? 1
      pendingFoodScore = null
      return
    }

    if (
      event.name === 'bonus' &&
      typeof event.value === 'string' &&
      event.value.trim().startsWith('addExtraScores')
    ) {
      score += getLevelBonusValue(levelNumber, 'addExtraScores')
    }
  })

  return score > 0 || levelProtocol.some((event) => event.name === 'food eaten')
    ? score
    : fallbackScore
}

export async function saveGameSession(
  params: SaveGameSessionParams,
): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) return

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) return

  const levelProtocol = getLevelProtocolSlice(params.protocol, params.levelNumber)
  const overrun = getAppleTimeOverrunAverage(levelProtocol)
  const score = getLevelScoreFromProtocol(
    params.protocol,
    params.levelNumber,
    params.score,
  )
  const { error } = await supabase.from('game_sessions').insert({
    user_id: userData.user.id,
    level_number: params.levelNumber,
    game_mode: isTrainingMode() ? 'training' : 'classic',
    status: params.status,
    finish_reason: params.finishReason ?? null,
    score,
    max_score: params.maxScore,
    apple_time_overrun_avg: overrun.average,
    apple_time_overrun_count: overrun.count,
    protocol: params.protocol,
  })

  if (error) {
    console.error('Failed to save game session to Supabase:', error.message)
  }
}

export async function listGameSessions(limit = 8): Promise<{
  sessions: GameSessionSummary[]
  error?: string
}> {
  const supabase = getSupabaseClient()
  if (!supabase) return { sessions: [], error: 'Supabase is not configured' }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) return { sessions: [], error: userError.message }
  if (!userData.user) return { sessions: [] }

  const { data, error } = await supabase
    .from('game_sessions')
    .select(
      'id, level_number, game_mode, status, finish_reason, score, max_score, apple_time_overrun_avg, apple_time_overrun_count, protocol, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return { sessions: [], error: error.message }

  return {
    sessions: (data ?? []).map((item) => ({
      id: item.id,
      levelNumber: item.level_number,
      gameMode: item.game_mode,
      status: item.status,
      finishReason: item.finish_reason,
      score: getLevelScoreFromProtocol(
        item.protocol as Protocol,
        item.level_number,
        item.score,
      ),
      maxScore: item.max_score,
      appleTimeOverrunAvg:
        item.apple_time_overrun_avg === null ? null : Number(item.apple_time_overrun_avg),
      appleTimeOverrunCount: item.apple_time_overrun_count,
      lastAppleEfficiency: getLastAppleEfficiency(
        getLevelProtocolSlice(item.protocol as Protocol, item.level_number),
      ),
      createdAt: item.created_at,
    })),
  }
}
