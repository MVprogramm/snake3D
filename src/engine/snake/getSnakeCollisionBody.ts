import { SnakeBodyCoord } from '../../types/snakeTypes'
import { getSnakeBodyCoord } from './snake'

const withoutReserveTail = (snakeBody: SnakeBodyCoord): SnakeBodyCoord =>
  snakeBody.slice(0, -1)

export function getSnakeVisibleBodyCells(): SnakeBodyCoord {
  return withoutReserveTail(getSnakeBodyCoord())
}

export function getSnakeBlockingBodyForHead(): SnakeBodyCoord {
  return getSnakeBodyCoord().slice(1, -2)
}

export function getSnakeBlockingBodyForObstacles(): SnakeBodyCoord {
  return getSnakeVisibleBodyCells()
}
