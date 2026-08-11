import { getCurrentLevel } from '../levels/currentLevel'
import { getAmountOfFood } from '../food/amountOfFoodPerLevel'
import { getTimer } from '../time/timer'
import { getTimePerLevel } from '../time/timePerLevel'
import { getProtocol } from './protocol'

const SECONDS_PER_MILLISECOND = 1000
const EXTRA_TIME_BONUS_SECONDS = 20
const MIN_EXTRA_TIME_BONUS_PROBABILITY = 5
const MAX_EXTRA_TIME_BONUS_PROBABILITY = 50
const EMPTY_EXTRA_TIME_BONUS_STATUS = `${MIN_EXTRA_TIME_BONUS_PROBABILITY}%`

type AppleEatingProjection = {
  eatenCount: number
  forecastSeconds: number
  remainingFood: number
  totalFood: number
}

function getCurrentLevelStartTime(): number {
  const currentLevel = getCurrentLevel()
  const levelStartEvent = getProtocol().findLast(
    (event) => event.name === 'start level' && event.value === currentLevel,
  )

  return levelStartEvent?.time ?? 0
}

function getFoodEatenCountSinceLevelStart(): number {
  const currentLevel = getCurrentLevel()
  const currentLevelStartIndex = getProtocol().findLastIndex(
    (event) => event.name === 'start level' && event.value === currentLevel,
  )
  const levelEvents =
    currentLevelStartIndex === -1 ? getProtocol() : getProtocol().slice(currentLevelStartIndex)

  return levelEvents.filter((event) => event.name === 'food eaten').length
}

function getAppleEatingProjection(): AppleEatingProjection | null {
  const elapsedTime = getTimer() - getCurrentLevelStartTime()
  const eatenCount = getFoodEatenCountSinceLevelStart()

  if (elapsedTime <= 0 || eatenCount === 0) return null

  const totalFood = getAmountOfFood()
  const remainingFood = Math.max(totalFood - eatenCount, 0)
  const averageTimePerFood = elapsedTime / eatenCount
  const projectedTimeToFinish = remainingFood * averageTimePerFood
  const availableTime = Math.max(getTimePerLevel() - getTimer(), 0)
  const forecastSeconds = Math.round(
    (availableTime - projectedTimeToFinish) / SECONDS_PER_MILLISECOND,
  )

  return {
    eatenCount,
    forecastSeconds,
    remainingFood,
    totalFood,
  }
}

function getExtraTimeBonusProbabilityPercent(projection: AppleEatingProjection | null): number {
  if (!projection || projection.remainingFood === 0) {
    return MIN_EXTRA_TIME_BONUS_PROBABILITY
  }

  if (projection.eatenCount < projection.totalFood / 2) {
    return MIN_EXTRA_TIME_BONUS_PROBABILITY
  }

  const distanceFromTargetDeficit = Math.abs(
    projection.forecastSeconds + EXTRA_TIME_BONUS_SECONDS,
  )
  const probabilityDrop =
    (distanceFromTargetDeficit / EXTRA_TIME_BONUS_SECONDS) *
    (MAX_EXTRA_TIME_BONUS_PROBABILITY - MIN_EXTRA_TIME_BONUS_PROBABILITY)

  return Math.max(
    MIN_EXTRA_TIME_BONUS_PROBABILITY,
    Math.round(MAX_EXTRA_TIME_BONUS_PROBABILITY - probabilityDrop),
  )
}

export function getExtraTimeBonusProbabilityValue(): number {
  return getExtraTimeBonusProbabilityPercent(getAppleEatingProjection()) / 100
}

export function getExtraTimeBonusProbability(): string {
  const projection = getAppleEatingProjection()

  if (!projection || projection.remainingFood === 0) {
    return EMPTY_EXTRA_TIME_BONUS_STATUS
  }

  if (projection.eatenCount < projection.totalFood / 2) {
    return `${MIN_EXTRA_TIME_BONUS_PROBABILITY}%`
  }

  const probability = getExtraTimeBonusProbabilityPercent(projection)

  return `${probability}%`
}
