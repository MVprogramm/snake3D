/**
 *  @module snakeHeadBodyContactEvent.ts Управляет контактом головы змейки с телом
 *     @function snakeHeadBodyContactEvent Создает событие контакт змейки с собой
 */
import { SnakeHeadCoord } from '../../types/snakeTypes'
import { isContact } from './isContact'
import { getSnakeBlockingBodyForHead } from '../snake/getSnakeCollisionBody'
import { didSnakeReachCellOnStep } from './snakeStepCollision'
/**
 * При контакте змейки с самой собой останавливает движение и создает событие
 * @param snakeHead
 * @returns Измененные в результате контакта параметры головы змейки
 */
function snakeHeadBodyContactEvent(snakeHead: SnakeHeadCoord): SnakeHeadCoord {
  const blockingSnakeBody = getSnakeBlockingBodyForHead()
  for (const pos of blockingSnakeBody) {
    if (didSnakeReachCellOnStep(snakeHead, pos)) {
      snakeHead.snakeHeadCoordY = snakeHead.snakeHeadCoordY - snakeHead.snakeHeadStepY
      snakeHead.snakeHeadCoordX = snakeHead.snakeHeadCoordX - snakeHead.snakeHeadStepX
      isContact(snakeHead, 'oneself')
      break
    }
  }

  return snakeHead
}

export default snakeHeadBodyContactEvent
