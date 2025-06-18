/**
 *  @module snakeHeadBodyContactEvent.ts Управляет контактом головы змейки с телом
 *     @function snakeHeadBodyContactEvent Создает событие контакт змейки с собой
 */
import { SnakeHeadCoord } from '../../types/snakeTypes'
// import { mistakeWasMade } from "../lives/isMistake";
import { isContact } from './isContact'
// import protocolExecutor from "../protocol/protocolExecutor";
import * as SNAKE from '../snake/snake'
/**
 * При контакте змейки с самой собой останавливает движение и создает событие
 * @param snakeHead
 * @returns Измененные в результате контакта параметры головы змейки
 */
function snakeHeadBodyContactEvent(snakeHead: SnakeHeadCoord): SnakeHeadCoord {
  SNAKE.getSnakeBodyCoord().forEach((pos: number[], index: number) => {
    if (
      index !== 0 &&
      index !== SNAKE.getSnakeBodyCoord().length - 1 &&
      snakeHead.snakeHeadCoordX - snakeHead.snakeHeadStepX === pos[0] &&
      snakeHead.snakeHeadCoordY - snakeHead.snakeHeadStepY === pos[1]
    ) {
      console.log(snakeHead, pos)

      // const coordX = snakeHead.snakeHeadCoordX;
      // const coordY = snakeHead.snakeHeadCoordY;
      snakeHead.snakeHeadCoordY = snakeHead.snakeHeadCoordY - snakeHead.snakeHeadStepY
      snakeHead.snakeHeadCoordX = snakeHead.snakeHeadCoordX - snakeHead.snakeHeadStepX
      snakeHead.snakeHeadStepX = 0
      snakeHead.snakeHeadStepY = 0
      isContact(snakeHead, 'oneself')
      // const value = `Snake with oneself ${coordX}:${coordY} contact`;
      // mistakeWasMade();
      // protocolExecutor({
      //   name: "life lost",
      //   value: value,
      // });
    }
  })

  return snakeHead
}

export default snakeHeadBodyContactEvent
