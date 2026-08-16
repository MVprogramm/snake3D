import { BonusProps } from '../../types/bonusTypes'
import setBonusEvent from '../events/setBonusEvent'
import { getCurrentFoodNumber } from '../food/currentFoodNumber'
import { getStopsGrowingBonusProbabilityValue } from '../protocol/snakeGrowthPressure'
import { addEvent } from '../protocol/protocol'
import { setCurrentBonus } from './bonus'
import { getBonusAvailability, giveBonus } from './bonusAvailableState'
import { getBonusCatchingStatus } from './bonusCatchingState'
import { setBonusParams } from './bonusParams'
import { resetBonusPickupWindow, startBonusPickupWindow } from './bonusPickupWindow'
import { setStopsGrowing, getStopsGrowing } from './bonusSnakeStopsGrowing'

const STOPS_GROWING_BONUS_TYPE = 'snakeStopsGrowing'
const STOPS_GROWING_BONUS_DURATION_MS = 20000
const DYNAMIC_STOPS_GROWING_BONUS_INDEX = -1

let hasStopsGrowingBonusLaunchedThisLevel = false

function getStopsGrowingBonusParams(): BonusProps {
  const currentFoodNumber = getCurrentFoodNumber()

  return {
    type: STOPS_GROWING_BONUS_TYPE,
    value: STOPS_GROWING_BONUS_DURATION_MS,
    startFood: currentFoodNumber,
    endFood: currentFoodNumber,
  }
}

export function tryLaunchStopsGrowingBonusByProbability(): void {
  if (hasStopsGrowingBonusLaunchedThisLevel) {
    return
  }

  if (
    getBonusAvailability() ||
    getBonusCatchingStatus().isBonusCaught ||
    getStopsGrowing()
  ) {
    return
  }

  const probability = getStopsGrowingBonusProbabilityValue()
  const randomValue = Math.random()

  addEvent({
    name: 'stops growing bonus probability check',
    value: `${randomValue.toFixed(3)} < ${probability.toFixed(3)}`,
  })

  if (randomValue >= probability) return

  const bonus = getStopsGrowingBonusParams()
  setBonusParams(bonus)
  if (!setBonusEvent()) return
  giveBonus()
  startBonusPickupWindow()
  setCurrentBonus(DYNAMIC_STOPS_GROWING_BONUS_INDEX)
  hasStopsGrowingBonusLaunchedThisLevel = true
}

export function resetStopsGrowingBonusProbabilityLaunch(): void {
  resetBonusPickupWindow()
  hasStopsGrowingBonusLaunchedThisLevel = false
  setStopsGrowing(false)
}
