import { getCounterHead } from '../../animations/snakeAnimation/headAnimations/snakeHeadLocation'
import { getFoodCoord } from '../food/food'
import { getSnakeHeadParams } from '../snake/snake'
// import { getNewMove } from './changeDirectionEvent'
import getSnakeMoveDirection from '../snake/getSnakeMoveDirection'
import { getFoodEaten } from './snakeCatchesFoodEvent'

/**
 * Флаг, информирующий о поедании еды:
 * 0 - еда съедена, 1 - до еды 1 клетка, 2 - еда далеко
 */
let distanceFromSnakeToFood = 2
/**
 *  Управляет флагом @var distanceFromSnakeToFood:
 *  0 - еда съедена, 1 - до еды 1 клетка, 2 - еда далеко
 *  @returns distanceFromSnakeToFood
 */
export function snakeMovesTowardsFood(): number {
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0) {
    const { snakeHeadCoordX, snakeHeadCoordY } = getSnakeHeadParams()
    const [foodX, foodY] = getFoodCoord()
    // const dir = getNewMove()
    const [, dir] = getSnakeMoveDirection()
    const lineX = snakeHeadCoordX === foodX
    const lineY = snakeHeadCoordY === foodY
    const deltaX = foodX - snakeHeadCoordX
    const deltaY = foodY - snakeHeadCoordY
    distanceFromSnakeToFood =
      dir === 'up' && lineX && deltaY === 1 ? 1 : distanceFromSnakeToFood
    distanceFromSnakeToFood =
      dir === 'right' && lineY && deltaX === 1 ? 1 : distanceFromSnakeToFood
    distanceFromSnakeToFood =
      dir === 'down' && lineX && deltaY === -1 ? 1 : distanceFromSnakeToFood
    distanceFromSnakeToFood =
      dir === 'left' && lineY && deltaX === -1 ? 1 : distanceFromSnakeToFood
    distanceFromSnakeToFood = getFoodEaten()
      ? 0
      : distanceFromSnakeToFood === 0
      ? 2
      : distanceFromSnakeToFood
  }

  return distanceFromSnakeToFood
}
