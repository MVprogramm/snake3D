import { getTimer } from '../time/timer'
import { addEvent } from '../protocol/protocol'
import { getBonusAvailability, removeBonus } from './bonusAvailableState'
import { catchBonus, getBonusCatchingStatus } from './bonusCatchingState'
import { getBonusParams } from './bonusParams'

const BONUS_PICKUP_WINDOW_MS = 20000

let bonusPickupExpiresAt = 0

export function startBonusPickupWindow(): void {
  bonusPickupExpiresAt = getTimer() + BONUS_PICKUP_WINDOW_MS
}

export function resetBonusPickupWindow(): void {
  bonusPickupExpiresAt = 0
}

export function expireBonusPickupWindow(): void {
  if (
    bonusPickupExpiresAt === 0 ||
    !getBonusAvailability() ||
    getBonusCatchingStatus().isBonusCaught ||
    getTimer() < bonusPickupExpiresAt
  ) {
    return
  }

  const bonusType = getBonusParams()?.type ?? 'bonus'
  addEvent({ name: 'bonus', value: ` ${bonusType} was not used` })
  removeBonus()
  catchBonus(false)
  resetBonusPickupWindow()
}
