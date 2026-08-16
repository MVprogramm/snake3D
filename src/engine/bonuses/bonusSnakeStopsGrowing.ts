import { addEvent } from '../protocol/protocol'
import { getTimer } from '../time/timer'
import { catchBonus } from './bonusCatchingState'

const STOPS_GROWING_DURATION_MS = 20000

let isStopsGrowing = false
let stopsGrowingExpiresAt = 0

export function setStopsGrowing(stopsGrowing: boolean): void {
  isStopsGrowing = stopsGrowing
  stopsGrowingExpiresAt = stopsGrowing ? getTimer() + STOPS_GROWING_DURATION_MS : 0
}

export function getStopsGrowing(): boolean {
  return isStopsGrowing
}

export function expireStopsGrowing(): void {
  if (!isStopsGrowing || stopsGrowingExpiresAt === 0 || getTimer() < stopsGrowingExpiresAt) {
    return
  }

  addEvent({ name: 'bonus', value: ' snakeStopsGrowing disabled' })
  setStopsGrowing(false)
  catchBonus(false)
}
