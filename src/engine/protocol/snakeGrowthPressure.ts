import { getField } from '../field/fieldPerLevel'
import { getAmountOfFood } from '../food/amountOfFoodPerLevel'
import { getCurrentLevel } from '../levels/currentLevel'
import { getObstaclesFixCoord } from '../obstacles/obstaclesFix'
import { getObstaclesXCoord } from '../obstacles/obstaclesX'
import { getObstaclesYCoord } from '../obstacles/obstaclesY'
import { getSnakeBodyCoord } from '../snake/snake'
import { getTimer } from '../time/timer'
import { getProtocol } from './protocol'

const TARGET_BONUS_SECONDS = 20
const MILLISECONDS_PER_SECOND = 1000
const MIN_STOPS_GROWING_BONUS_PROBABILITY = 5
const MAX_STOPS_GROWING_BONUS_PROBABILITY = 50

type SnakeGrowthProjection = {
  remainingFood: number
  targetFoodInBonusWindow: number
  snakeLength: number
  freeCells: number
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

function getOccupiedCellCount(): number {
  const occupiedCells = new Set<string>()

  getSnakeBodyCoord()
    .concat(getObstaclesFixCoord(), getObstaclesXCoord(), getObstaclesYCoord())
    .forEach(([x, y]) => {
      occupiedCells.add(`${x}:${y}`)
    })

  return occupiedCells.size
}

function getSnakeGrowthProjection(): SnakeGrowthProjection | null {
  const elapsedTime = getTimer() - getCurrentLevelStartTime()
  const eatenCount = getFoodEatenCountSinceLevelStart()

  if (elapsedTime <= 0 || eatenCount === 0) return null

  const fieldCells = getField() * getField()
  const freeCells = Math.max(fieldCells - getOccupiedCellCount(), 1)
  const eatingSpeedPerMillisecond = eatenCount / elapsedTime
  const targetFoodInBonusWindow =
    eatingSpeedPerMillisecond * TARGET_BONUS_SECONDS * MILLISECONDS_PER_SECOND

  return {
    remainingFood: Math.max(getAmountOfFood() - eatenCount, 0),
    targetFoodInBonusWindow,
    snakeLength: getSnakeBodyCoord().length,
    freeCells,
  }
}

function getStopsGrowingBonusProbabilityPercent(
  projection: SnakeGrowthProjection | null,
): number {
  if (!projection || projection.remainingFood === 0) {
    return MIN_STOPS_GROWING_BONUS_PROBABILITY
  }

  const timeWindowFactor =
    projection.targetFoodInBonusWindow <= 0
      ? 0
      : Math.max(
          0,
          1 -
            Math.abs(projection.remainingFood - projection.targetFoodInBonusWindow) /
              projection.targetFoodInBonusWindow,
        )
  const crowdingFactor = Math.min(projection.snakeLength / projection.freeCells, 1)
  const probability =
    MIN_STOPS_GROWING_BONUS_PROBABILITY +
    (MAX_STOPS_GROWING_BONUS_PROBABILITY - MIN_STOPS_GROWING_BONUS_PROBABILITY) *
      timeWindowFactor *
      crowdingFactor

  return Math.max(
    MIN_STOPS_GROWING_BONUS_PROBABILITY,
    Math.min(MAX_STOPS_GROWING_BONUS_PROBABILITY, Math.round(probability)),
  )
}

export function getStopsGrowingBonusProbabilityValue(): number {
  return getStopsGrowingBonusProbabilityPercent(getSnakeGrowthProjection()) / 100
}

export function getStopsGrowingBonusProbability(): string {
  return `${getStopsGrowingBonusProbabilityPercent(getSnakeGrowthProjection())}%`
}
