/**
 * @module turnSnakeVertically.ts Управляет поворотом змейки вверх / вниз
 *    @function turnSnakeVertically Изменяет параметры головы змейки
 */
import { checkMistake, noMistakeWasMade } from '../lives/isMistake'
import * as SNAKE from '../snake/snake'
import { hasPendingSnakeHead, queueSnakeDirection } from '../snake/snakeStepPhase'
/**
 * Запускается в ответ на нажатие игроком стрелок вверх / вниз
 * @param stepX Новое значение шага головы змейки по вертикали
 */
function turnSnakeVertically(stepY: number): void {
  if (hasPendingSnakeHead()) {
    queueSnakeDirection([0, stepY])
    if (checkMistake()) noMistakeWasMade()
    return
  }

  SNAKE.setSnakeHeadParams({
    ...SNAKE.getSnakeHeadParams(),
    snakeHeadStepX: 0,
    snakeHeadStepY: stepY,
  })
  if (checkMistake()) noMistakeWasMade()
}

export default turnSnakeVertically
