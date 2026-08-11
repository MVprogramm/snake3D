import { getAmountOfFood } from '../food/amountOfFoodPerLevel'
import { getCurrentFoodNumber } from '../food/currentFoodNumber'
import { getLives } from '../lives/lives'
import { getCurrentLevel } from '../levels/currentLevel'
import { getTimer } from '../time/timer'
import { getTimePerLevel } from '../time/timePerLevel'
import { getProtocol } from './protocol'

const MIN_EXTRA_LIFE_BONUS_PROBABILITY = 5
const MAX_EXTRA_LIFE_BONUS_PROBABILITY = 50
const EXTRA_LIFE_BONUS_LIVES = 1

type LifeLossProjection = {
  projectedLifeNeed: number
  lifeBalance: number
}

function getCurrentLevelStartTime(): number {
  const currentLevel = getCurrentLevel()
  const levelStartEvent = getProtocol().findLast(
    (event) => event.name === 'start level' && event.value === currentLevel,
  )

  return levelStartEvent?.time ?? 0
}

function getLifeLostCountSinceLevelStart(): number {
  const currentLevel = getCurrentLevel()
  const currentLevelStartIndex = getProtocol().findLastIndex(
    (event) => event.name === 'start level' && event.value === currentLevel,
  )
  const levelEvents =
    currentLevelStartIndex === -1 ? getProtocol() : getProtocol().slice(currentLevelStartIndex)

  return levelEvents.filter((event) => event.name === 'life lost').length
}

function getLifeLossProjection(): LifeLossProjection | null {
  if (getCurrentFoodNumber() === 0 || getCurrentFoodNumber() >= getAmountOfFood()) {
    return null
  }

  const elapsedTime = getTimer() - getCurrentLevelStartTime()
  const lostLives = getLifeLostCountSinceLevelStart()

  if (elapsedTime <= 0 || lostLives === 0) return null

  const lifeLossPerMillisecond = lostLives / elapsedTime
  const availableTime = Math.max(getTimePerLevel() - getTimer(), 0)
  const projectedLifeLosses = lifeLossPerMillisecond * availableTime

  return {
    projectedLifeNeed: Math.max(Math.ceil(projectedLifeLosses - getLives()), 0),
    lifeBalance: getLives() - projectedLifeLosses,
  }
}

function getExtraLifeBonusProbabilityPercent(projection: LifeLossProjection | null): number {
  if (!projection) return MIN_EXTRA_LIFE_BONUS_PROBABILITY

  const distanceFromTargetShortage = Math.abs(
    projection.lifeBalance + EXTRA_LIFE_BONUS_LIVES,
  )
  const probabilityDrop =
    (distanceFromTargetShortage / EXTRA_LIFE_BONUS_LIVES) *
    (MAX_EXTRA_LIFE_BONUS_PROBABILITY - MIN_EXTRA_LIFE_BONUS_PROBABILITY)

  return Math.max(
    MIN_EXTRA_LIFE_BONUS_PROBABILITY,
    Math.round(MAX_EXTRA_LIFE_BONUS_PROBABILITY - probabilityDrop),
  )
}

export function getExtraLifeBonusProbabilityValue(): number {
  return getExtraLifeBonusProbabilityPercent(getLifeLossProjection()) / 100
}

export function getExtraLifeBonusProbability(): string {
  const probability = getExtraLifeBonusProbabilityPercent(getLifeLossProjection())

  return `${probability}%`
}
