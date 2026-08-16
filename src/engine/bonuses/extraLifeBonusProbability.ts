import { BonusProps } from '../../types/bonusTypes'
import setBonusEvent from '../events/setBonusEvent'
import { getCurrentFoodNumber } from '../food/currentFoodNumber'
import { getExtraLifeBonusProbabilityValue } from '../protocol/lifeLossSpeed'
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

const EXTRA_LIFE_BONUS_TYPE = 'addExtraLives'
const EXTRA_LIFE_BONUS_VALUE = 1
const DYNAMIC_EXTRA_LIFE_BONUS_INDEX = -1

let hasExtraLifeBonusLaunchedThisLevel = false

function getExtraLifeBonusParams(): BonusProps {
  const currentFoodNumber = getCurrentFoodNumber()
  const configuredBonus = getBonuses().find(
    (bonus) => bonus.type === EXTRA_LIFE_BONUS_TYPE,
  )

  return {
    type: EXTRA_LIFE_BONUS_TYPE,
    value: configuredBonus?.value ?? EXTRA_LIFE_BONUS_VALUE,
    startFood: currentFoodNumber,
    endFood: currentFoodNumber,
  }
}

function expireDynamicExtraLifeBonus(): void {
  bonusAddTimeDeactivate()
  bonusAddLivesDeactivate()
  bonusAddScoresDeactivate()
}

export function tryLaunchExtraLifeBonusByProbability(): void {
  expireDynamicExtraLifeBonus()

  if (hasExtraLifeBonusLaunchedThisLevel) {
    return
  }

  const isAddBonusActive = checkAddTime() || checkAddLives() || checkAddScores()

  if (getBonusAvailability() || getBonusCatchingStatus().isBonusCaught || isAddBonusActive) {
    return
  }

  const probability = getExtraLifeBonusProbabilityValue()
  const randomValue = Math.random()

  addEvent({
    name: 'extra life bonus probability check',
    value: `${randomValue.toFixed(3)} < ${probability.toFixed(3)}`,
  })

  if (randomValue >= probability) return

  const bonus = getExtraLifeBonusParams()
  setBonusParams(bonus)
  if (!setBonusEvent()) return
  giveBonus()
  startBonusPickupWindow()
  setCurrentBonus(DYNAMIC_EXTRA_LIFE_BONUS_INDEX)
  hasExtraLifeBonusLaunchedThisLevel = true
}

export function resetExtraLifeBonusProbabilityLaunch(): void {
  resetBonusPickupWindow()
  hasExtraLifeBonusLaunchedThisLevel = false
}
