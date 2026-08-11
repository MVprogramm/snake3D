import { Coordinate } from '../../types/obstacleTypes'
import { getField } from '../field/fieldPerLevel'
import { getObstaclesFixCoord } from '../obstacles/obstaclesFix'
import { getObstaclesXCoord } from '../obstacles/obstaclesX'
import { getObstaclesYCoord } from '../obstacles/obstaclesY'
import { getSnakeBodyCoord, getSnakeHeadParams } from '../snake/snake'
import { getSpeedLimit } from '../time/timerStepPerLevel'
import { getFoodCoord } from './food'

const MILLISECONDS_PER_SECOND = 1000
const DIRECTIONS: Coordinate[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

export type ApplePathForecast = {
  path: Coordinate[]
  distanceCells: number
  durationMs: number
}

function getCellKey([x, y]: Coordinate): string {
  return `${x}:${y}`
}

function isInsideField([x, y]: Coordinate): boolean {
  const fieldSize = getField()

  return x >= 1 && x <= fieldSize && y >= 1 && y <= fieldSize
}

function getBlockedCells(start: Coordinate, target: Coordinate): Set<string> {
  const blockedCells = new Set(
    [
      ...getObstaclesFixCoord(),
      ...getMovingObstacleCells(),
      ...getSnakeBodyCoord(),
    ].map((coord) => getCellKey(coord as Coordinate)),
  )

  blockedCells.delete(getCellKey(start))
  blockedCells.delete(getCellKey(target))

  return blockedCells
}

function getMovingObstacleCells(): Coordinate[] {
  return [...getObstaclesXCoord(), ...getObstaclesYCoord()].map(
    (coord) => coord as Coordinate,
  )
}

function getStoppedObstacleOnPath(
  path: Coordinate[],
  maxSpeed: number,
): Coordinate | null {
  const stopDistance = maxSpeed + 2

  for (const obstacleCell of getMovingObstacleCells()) {
    const obstaclePathIndex = path.findIndex(
      (pathCell) => getCellKey(pathCell) === getCellKey(obstacleCell),
    )

    if (obstaclePathIndex === -1) continue

    const obstacleStopsBeforeSnakeArrives = path
      .slice(0, obstaclePathIndex + 1)
      .some(
        ([headX, headY]) =>
          Math.abs(obstacleCell[0] - headX) < stopDistance &&
          Math.abs(obstacleCell[1] - headY) < stopDistance,
      )

    if (obstacleStopsBeforeSnakeArrives) {
      return obstacleCell
    }
  }

  return null
}

function restorePath(
  targetKey: string,
  parents: Map<string, string | null>,
  cellsByKey: Map<string, Coordinate>,
): Coordinate[] {
  const path: Coordinate[] = []
  let currentKey: string | null = targetKey

  while (currentKey) {
    const cell = cellsByKey.get(currentKey)
    if (!cell) break

    path.unshift(cell)
    currentKey = parents.get(currentKey) ?? null
  }

  return path
}

function findShortestPath(
  start: Coordinate,
  target: Coordinate,
  blockedCells: Set<string>,
): Coordinate[] | null {
  const targetKey = getCellKey(target)
  const queue: Coordinate[] = [start]
  const parents = new Map<string, string | null>([[getCellKey(start), null]])
  const cellsByKey = new Map<string, Coordinate>([[getCellKey(start), start]])

  for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
    const currentCell = queue[queueIndex]
    const currentKey = getCellKey(currentCell)

    if (currentKey === targetKey) {
      return restorePath(targetKey, parents, cellsByKey)
    }

    for (const [stepX, stepY] of DIRECTIONS) {
      const nextCell: Coordinate = [currentCell[0] + stepX, currentCell[1] + stepY]
      const nextKey = getCellKey(nextCell)

      if (
        parents.has(nextKey) ||
        blockedCells.has(nextKey) ||
        !isInsideField(nextCell)
      ) {
        continue
      }

      parents.set(nextKey, currentKey)
      cellsByKey.set(nextKey, nextCell)
      queue.push(nextCell)
    }
  }

  return null
}

export function getShortestPathForecast(
  start: Coordinate,
  target: Coordinate,
  maxSpeed: number = getSpeedLimit(),
): ApplePathForecast | null {
  const blockedCells = getBlockedCells(start, target)

  if (maxSpeed <= 0 || !isInsideField(start) || !isInsideField(target)) {
    return null
  }

  while (true) {
    const path = findShortestPath(start, target, blockedCells)

    if (!path) return null

    const stoppedObstacle = getStoppedObstacleOnPath(path, maxSpeed)

    if (!stoppedObstacle) {
      const distanceCells = Math.max(path.length - 1, 0)

      return {
        path,
        distanceCells,
        durationMs: Math.ceil((distanceCells * MILLISECONDS_PER_SECOND) / maxSpeed),
      }
    }

    blockedCells.add(getCellKey(stoppedObstacle))
  }
}

export function getShortestPathToFood(
  maxSpeed: number = getSpeedLimit(),
): ApplePathForecast | null {
  const { snakeHeadCoordX, snakeHeadCoordY } = getSnakeHeadParams()

  return getShortestPathForecast(
    [snakeHeadCoordX, snakeHeadCoordY],
    getFoodCoord(),
    maxSpeed,
  )
}
