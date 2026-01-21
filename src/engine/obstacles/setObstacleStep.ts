/**
 * @module setObstacleStep.ts Управляет шагом препятствий
 *    @function setObstacleStep Задает шаг препятствиям с учетом столкновений
 */
import { obstacleContactProps } from '../../types/obstacleTypes'
import contactBonusObstacle from './contactBonusObstacle'
import contactBorderObstacle from './contactBorderObstacle'
import contactFoodObstacle from './contactFoodObstacle'
import contactObstacleCollidingPosition from './contactObstacleCollidingPosition'
import contactObstacleObstacle from './contactObstacleObstacle'
import contactSnakeBodyObstacle from './contactSnakeBodyObstacle'
import { getCollidingPositions } from './getCollidingPositions'

// Cache for colliding positions to avoid recalculation within same frame
let cachedCollidingPositions: number[][] | undefined = undefined

/**
 * Проверяет все возможные случаи столкновений препятствия и меняет его шаг
 * @param props параметры препятствия, для которого производится расчет шага
 * @returns шаг препятствия
 */
function setObstacleStep(props: obstacleContactProps): number {
  const { step, i } = props

  // // Compute colliding positions once per frame
  // if (cachedCollidingPositions === undefined) {
  //   cachedCollidingPositions = getCollidingPositions()
  // }
  // console.log(cachedCollidingPositions)

  // // Pass cached colliding positions to all contact checks
  // const propsWithColliding = { ...props, collidingPositions: cachedCollidingPositions }

  step[i] = contactBorderObstacle(props)
  step[i] = contactFoodObstacle(props)
  step[i] = contactObstacleObstacle(props)
  step[i] = contactObstacleCollidingPosition(props)
  step[i] = contactBonusObstacle(props)
  step[i] = contactSnakeBodyObstacle(props)

  return step[i]
}

/**
 * Reset cache at the start of each frame
 */
export const resetCollidingPositionsCache = () => {
  cachedCollidingPositions = undefined
}

export default setObstacleStep
