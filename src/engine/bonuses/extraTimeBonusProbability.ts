import { BonusProps } from '../../types/bonusTypes'
import setBonusEvent from '../events/setBonusEvent'
import { getCurrentFoodNumber } from '../food/currentFoodNumber'
import { getExtraTimeBonusProbabilityValue } from '../protocol/appleEatingSpeed'
import { addEvent } from '../protocol/protocol'
import { setCurrentBonus } from './bonus'
import { bonusAddScoresDeactivate, checkAddScores } from './bonusAddScores'
import { bonusAddLivesDeactivate, checkAddLives } from './bonusAddLives'
import { bonusAddTimeDeactivate, checkAddTime } from './bonusAddTime'
import { getBonusAvailability, giveBonus, removeBonus } from './bonusAvailableState'
import { catchBonus, getBonusCatchingStatus } from './bonusCatchingState'
import { setBonusParams } from './bonusParams'
import { getBonuses } from './bonusesPerLevel'
import { resetBonusPickupWindow, startBonusPickupWindow } from './bonusPickupWindow'

const EXTRA_TIME_BONUS_TYPE = 'addExtraTime'
const EXTRA_TIME_BONUS_VALUE_MS = 20000
const DYNAMIC_EXTRA_TIME_BONUS_INDEX = -1

let hasExtraTimeBonusLaunchedThisLevel = false

function getExtraTimeBonusParams(): BonusProps {
  const currentFoodNumber = getCurrentFoodNumber()
  const configuredBonus = getBonuses().find(
    (bonus) => bonus.type === EXTRA_TIME_BONUS_TYPE,
  )

  return {
    type: EXTRA_TIME_BONUS_TYPE,
    value: configuredBonus?.value ?? EXTRA_TIME_BONUS_VALUE_MS,
    startFood: currentFoodNumber,
    endFood: currentFoodNumber,
  }
}

function expireDynamicExtraTimeBonus(): void {
  bonusAddTimeDeactivate()
  bonusAddLivesDeactivate()
  bonusAddScoresDeactivate()
}

export function tryLaunchExtraTimeBonusByProbability(): void {
  expireDynamicExtraTimeBonus()

  if (hasExtraTimeBonusLaunchedThisLevel) {
    return
  }

  const isAddBonusActive = checkAddTime() || checkAddLives() || checkAddScores()

  if (getBonusAvailability() || getBonusCatchingStatus().isBonusCaught || isAddBonusActive) {
    return
  }

  const probability = getExtraTimeBonusProbabilityValue()
  const randomValue = Math.random()

  addEvent({
    name: 'extra time bonus probability check',
    value: `${randomValue.toFixed(3)} < ${probability.toFixed(3)}`,
  })

  if (randomValue >= probability) return

  const bonus = getExtraTimeBonusParams()
  setBonusParams(bonus)
  if (!setBonusEvent()) return
  giveBonus()
  startBonusPickupWindow()
  setCurrentBonus(DYNAMIC_EXTRA_TIME_BONUS_INDEX)
  hasExtraTimeBonusLaunchedThisLevel = true
}

export function resetExtraTimeBonusProbabilityLaunch(): void {
  resetBonusPickupWindow()
  hasExtraTimeBonusLaunchedThisLevel = false
}
