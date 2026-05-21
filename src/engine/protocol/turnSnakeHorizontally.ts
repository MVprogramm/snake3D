/**
 * @module turnSnakeHorizontally.ts Управляет поворотом змейки вправо / влево
 *    @function turnSnakeHorizontally Изменяет параметры головы змейки
 */
import { checkMistake, noMistakeWasMade } from '../lives/isMistake'
import * as SNAKE from '../snake/snake'
import { hasPendingSnakeHead, queueSnakeDirection } from '../snake/snakeStepPhase'
/**
 * Запускается в ответ на нажатие игроком стрелок вправо / влево
 * @param stepX Новое значение шага головы змейки по горизонтали
 */
function turnSnakeHorizontally(stepX: number): void {
  if (hasPendingSnakeHead()) {
    queueSnakeDirection([stepX, 0])
    if (checkMistake()) noMistakeWasMade()
    return
  }

  SNAKE.setSnakeHeadParams({
    ...SNAKE.getSnakeHeadParams(),
    snakeHeadStepX: stepX,
    snakeHeadStepY: 0,
  })
  if (checkMistake()) noMistakeWasMade()
}

export default turnSnakeHorizontally
