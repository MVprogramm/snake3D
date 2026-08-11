import { Coordinate } from '../../types/obstacleTypes'
import { SystemConfig } from '../../config/systemConfig'
import { getFoodCoord } from '../food/food'
import { getShortestPathForecast } from '../food/applePathForecast'
import { getCurrentLevel } from '../levels/currentLevel'
import { getObstaclesXCoord } from '../obstacles/obstaclesX'
import { getObstaclesYCoord } from '../obstacles/obstaclesY'
import { getSnakeHeadParams } from '../snake/snake'
import { checkTimerWorking } from '../time/isTimer'
import { getTimer } from '../time/timer'
import { getStep } from '../time/timerStepPerLevel'
import { addEvent } from './protocol'

type AppleTimeMeasurement = {
  foodKey: string
  target: Coordinate
  startTimeMs: number
  initialRouteCells: number
  idealElapsedMs: number
  idealFrameCount: number
  idealCellProgress: number
  route: Coordinate[]
  completedIdealMs: number | null
  rerouteCount: number
}

let currentMeasurement: AppleTimeMeasurement | null = null
let lastEfficiencyText = ''

function getCellKey([x, y]: Coordinate): string {
  return `${x}:${y}`
}

function getFoodKey(coord: Coordinate): string {
  return `${getCurrentLevel()}:${getCellKey(coord)}`
}

function getMovingObstacleCells(): Coordinate[] {
  return [
    ...getObstaclesXCoord().map((coord) => coord as Coordinate),
    ...getObstaclesYCoord().map((coord) => coord as Coordinate),
  ]
}

function hasMovingObstacleOnRoute(route: Coordinate[]): boolean {
  const routeKeys = new Set(route.slice(1).map((cell) => getCellKey(cell)))

  return getMovingObstacleCells().some((cell) => routeKeys.has(getCellKey(cell)))
}

function buildRoute(start: Coordinate, target: Coordinate): Coordinate[] {
  return getShortestPathForecast(start, target, getRealSnakeSpeed())?.path ?? [start]
}

function getRealSnakeSpeed(): number {
  return Math.max(getStep(), 0)
}

function advanceVirtualRoute(nowMs: number, shouldAdvance: boolean): void {
  if (!currentMeasurement || currentMeasurement.completedIdealMs !== null) return

  if (shouldAdvance && checkTimerWorking()) {
    currentMeasurement.idealFrameCount += 1
    currentMeasurement.idealCellProgress += getRealSnakeSpeed() / SystemConfig.FPS
  }

  while (
    currentMeasurement.route.length > 1 &&
    currentMeasurement.idealCellProgress >= 1
  ) {
    currentMeasurement.route = currentMeasurement.route.slice(1)
    currentMeasurement.idealCellProgress -= 1
  }

  if (currentMeasurement.route.length <= 1) {
    currentMeasurement.completedIdealMs = Math.max(
      nowMs - currentMeasurement.startTimeMs,
      0,
    )
  }

  currentMeasurement.idealElapsedMs = Math.max(nowMs - currentMeasurement.startTimeMs, 0)
}

function getCurrentSnakeHeadCoord(): Coordinate {
  const { snakeHeadCoordX, snakeHeadCoordY } = getSnakeHeadParams()

  return [snakeHeadCoordX, snakeHeadCoordY]
}

export function startAppleTimeEfficiencyMeasurement(): void {
  const target = getFoodCoord()
  const start = getCurrentSnakeHeadCoord()
  const route = buildRoute(start, target)

  currentMeasurement = {
    foodKey: getFoodKey(target),
    target,
    startTimeMs: getTimer(),
    initialRouteCells: Math.max(route.length - 1, 0),
    idealElapsedMs: 0,
    idealFrameCount: 0,
    idealCellProgress: 0,
    route,
    completedIdealMs: null,
    rerouteCount: 0,
  }
}

export function updateAppleTimeIdealRoute(shouldAdvance = true): void {
  if (!currentMeasurement) return

  advanceVirtualRoute(getTimer(), shouldAdvance)

  if (
    currentMeasurement.completedIdealMs === null &&
    hasMovingObstacleOnRoute(currentMeasurement.route)
  ) {
    const [virtualCell] = currentMeasurement.route
    currentMeasurement.route = buildRoute(virtualCell, currentMeasurement.target)
    currentMeasurement.idealCellProgress = 0
    currentMeasurement.rerouteCount += 1
  }
}

export function getAppleTimeIdealPath(): Coordinate[] {
  if (!currentMeasurement) return []

  return currentMeasurement.route.slice(1)
}

export function recordAppleTimeEfficiency(): void {
  if (!currentMeasurement) return

  updateAppleTimeIdealRoute()

  const playerMs = Math.max(getTimer() - currentMeasurement.startTimeMs, 0)
  const remainingCells = Math.max(currentMeasurement.route.length - 1, 0)
  const averageFrameMs =
    currentMeasurement.idealFrameCount > 0
      ? currentMeasurement.idealElapsedMs / currentMeasurement.idealFrameCount
      : 1000 / SystemConfig.FPS
  const realSnakeSpeed = getRealSnakeSpeed()
  const remainingFrames = realSnakeSpeed > 0
    ? Math.max(remainingCells - currentMeasurement.idealCellProgress, 0) /
      (realSnakeSpeed / SystemConfig.FPS)
    : 0
  const remainingMs =
    currentMeasurement.completedIdealMs === null
      ? Math.ceil(remainingFrames * averageFrameMs)
      : 0
  const idealMs =
    currentMeasurement.completedIdealMs ??
    currentMeasurement.idealElapsedMs + remainingMs
  const overrun = idealMs > 0 ? playerMs / idealMs : 0

  lastEfficiencyText = [
    `playerMs:${Math.round(playerMs)}`,
    `idealMs:${Math.round(idealMs)}`,
    `overrun:${overrun.toFixed(2)}`,
    `initialRouteCells:${currentMeasurement.initialRouteCells}`,
    `remainingCells:${remainingCells}`,
    `speed:${realSnakeSpeed}`,
    `idealFrames:${currentMeasurement.idealFrameCount}`,
    `idealElapsedMs:${Math.round(currentMeasurement.idealElapsedMs)}`,
    `remainingFrames:${remainingFrames.toFixed(2)}`,
    `remainingMs:${Math.round(remainingMs)}`,
    `cellProgress:${currentMeasurement.idealCellProgress.toFixed(2)}`,
    `completedIdealMs:${currentMeasurement.completedIdealMs === null ? 'null' : Math.round(currentMeasurement.completedIdealMs)}`,
    `reroutes:${currentMeasurement.rerouteCount}`,
  ].join(';')

  addEvent({
    name: 'apple time efficiency',
    value: lastEfficiencyText,
  })

  currentMeasurement = null
}

export function getAppleTimeEfficiency(): string {
  return lastEfficiencyText
}
