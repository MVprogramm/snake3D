/**
 * @module advanceSnake.ts Вычисляет координаты головы в координатах сетки поля
 *    @function advanceSnake Пересчитывает координаты для следующего положения змейки
 */
import allContactEvents, { setIsDistraintContact } from '../events/allContactEvents'
import { breakContact } from '../events/isContact'
import { checkMistake } from '../lives/isMistake'
import { checkTimerWorking, startTimer } from '../time/isTimer'
import { getPotentialHeadState } from './getPotentialHeadState'
import * as SNAKE from './snake'
import { shiftSnakeBody } from './shiftSnakeBody'
import {
  clearPendingSnakeHead,
  consumePendingSnakeHead,
  consumeQueuedSnakeDirection,
  setPendingSnakeHead,
} from './snakeStepPhase'
import { stopSnakeHead } from './stopSnakeHead'
/**
 * Двигает змейку по игровому полю
 * @description
 * 1. Вычисляет координаты головы в координатах сетки поля
 * 2. Если змейка движется:
 *    - Вычисляет потенциальную позицию головы
 *    - Обрабатывает контакты с объектами
 *    - Обновляет позицию головы и тела змейки
 *    - Управляет таймером движения
 */
export function advanceSnake(): void {
  const completedHead = consumePendingSnakeHead()
  if (completedHead) {
    const queuedDirection = consumeQueuedSnakeDirection()
    const { snakeHeadStepX, snakeHeadStepY } = SNAKE.getSnakeHeadParams()
    SNAKE.setSnakeHeadParams({
      ...completedHead,
      snakeHeadStepX: queuedDirection?.[0] ?? snakeHeadStepX,
      snakeHeadStepY: queuedDirection?.[1] ?? snakeHeadStepY,
    })
  }

  let currentHead = SNAKE.getSnakeHeadParams()
  const newBodyCoord = [...SNAKE.getSnakeBodyCoord()]
  let { snakeHeadCoordX, snakeHeadCoordY, snakeHeadStepX, snakeHeadStepY } = currentHead
  if (snakeHeadStepX !== 0 || snakeHeadStepY !== 0) {
    const potentialHead = getPotentialHeadState(currentHead)
    const nextSnakeHeadCoord = allContactEvents(potentialHead)
    let nextBodyHeadX = snakeHeadCoordX
    let nextBodyHeadY = snakeHeadCoordY

    if (
      nextSnakeHeadCoord.snakeHeadCoordX !== potentialHead.snakeHeadCoordX ||
      nextSnakeHeadCoord.snakeHeadCoordY !== potentialHead.snakeHeadCoordY
    ) {
      setIsDistraintContact(true)
      currentHead = stopSnakeHead(nextSnakeHeadCoord)
      clearPendingSnakeHead()
    } else {
      setPendingSnakeHead(potentialHead)
      nextBodyHeadX = potentialHead.snakeHeadCoordX
      nextBodyHeadY = potentialHead.snakeHeadCoordY
    }
    SNAKE.setSnakeHeadParams(currentHead)
    breakContact()
    if (checkTimerWorking() && !checkMistake()) {
      shiftSnakeBody(newBodyCoord, nextBodyHeadX, nextBodyHeadY)
    } else if (!checkMistake()) {
      startTimer()
    }
  }
}
