/**
 *  @module snakeHeadBodyContactEvent.ts Управляет контактом головы змейки с телом
 *     @function snakeHeadBodyContactEvent Создает событие контакт змейки с собой
 */
import { SnakeHeadCoord } from '../../types/snakeTypes'
import { isContact } from './isContact'
import * as SNAKE from '../snake/snake'
/**
 * При контакте змейки с самой собой останавливает движение и создает событие
 * @param snakeHead
 * @returns Измененные в результате контакта параметры головы змейки
 */
function snakeHeadBodyContactEvent(snakeHead: SnakeHeadCoord): SnakeHeadCoord {
  const currentSnakeLength = SNAKE.getSnakeBodyCoord().length
  const maxSnakeBodyLength = currentSnakeLength + (currentSnakeLength % 2) - 2
  SNAKE.getSnakeBodyCoord().forEach((pos: number[], index: number) => {
    if (
      index !== 0 &&
      index !== maxSnakeBodyLength &&
      snakeHead.snakeHeadCoordX === pos[0] &&
      snakeHead.snakeHeadCoordY === pos[1]
    ) {
      snakeHead.snakeHeadCoordY = snakeHead.snakeHeadCoordY - snakeHead.snakeHeadStepY
      snakeHead.snakeHeadCoordX = snakeHead.snakeHeadCoordX - snakeHead.snakeHeadStepX
      snakeHead.snakeHeadStepX = 0
      snakeHead.snakeHeadStepY = 0
      isContact(snakeHead, 'oneself')
    }
  })

  return snakeHead
}

export default snakeHeadBodyContactEvent
