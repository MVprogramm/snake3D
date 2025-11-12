/* eslint-disable prefer-const */
/**
 * @module moveObstacles.ts Перемещает препятствия по игровому полю
 *    @function moveObstacles Управляет движением среди других объектов на поле
 */
import { checkTimerWorking } from '../time/isTimer'
import selectObstacleDirection from './selectObstacleDirection'
import * as X from './obstaclesX'
import * as Y from './obstaclesY'
import checkObstaclePosition from './checkObstaclePosition'
import setObstacleStep from './setObstacleStep'
import { getSnakeHeadParams } from '../snake/snake'
import { getStep } from '../time/timerStepPerLevel'
// хранит ненулевые шаги препятствий
const prevSteps: number[] = []
/**
 * Изменяет координаты препятствий и их шаг
 * @description
 *  Для каждого направления движения препятствий во время игры:
 *      - получает координаты препятствий и шаг каждого из них
 *      - изменяет шаг на обратный при контакте препятствий с другими объектами
 *      - останавливает препятствия при приближении головы змейки
 *      - изменяет координаты препятствий на величину шага
 */
function moveObstacles(type: string): void {
  const stopDistance = getStep() + 2
  const isSnakeMoving =
    getSnakeHeadParams().snakeHeadStepX !== 0 || getSnakeHeadParams().snakeHeadStepY !== 0
  // Получаем копии данных направления, будем работать с ними и записать результат разом
  const selected = selectObstacleDirection(type)
  // coordCopy: глубокая копия вложенных массивов, чтобы избегать мутаций оригинала
  const coordCopy: number[][] = selected.coord
  const stepCopy: number[] = selected.step

  if (!checkTimerWorking()) return

  const twist = type === 'y' ? [1, 0] : [0, 1]

  for (let i = 0; i < coordCopy.length; i++) {
    // рассчитываем новый шаг с учётом всех столкновений, работаем с копией stepCopy
    stepCopy[i] = setObstacleStep({ i, twist, coord: coordCopy, step: stepCopy })
    if (stepCopy[i] !== 0) prevSteps[i] = stepCopy[i]
    // рассчёт предполагаемой новой позиции (без изменения оригинала)
    const probePos = [...coordCopy[i]]
    probePos[twist[0]] += stepCopy[i]

    // если позиция недопустима — останавливаем
    let newStep = !checkObstaclePosition(probePos) ? 0 : stepCopy[i]

    // если змейка близко и движется — останавливаем препятствие
    if (
      Math.abs(coordCopy[i][0] - getSnakeHeadParams().snakeHeadCoordX) < stopDistance &&
      Math.abs(coordCopy[i][1] - getSnakeHeadParams().snakeHeadCoordY) < stopDistance &&
      isSnakeMoving
    ) {
      newStep = 0
    } else {
      // если змейка не близко и препятствие было остановлено — возвращаем предыдущий шаг
      if (newStep === 0 && prevSteps[i] !== undefined) {
        newStep = prevSteps[i]
      }
    }

    // применяем шаг к копии координат
    coordCopy[i][twist[0]] += newStep
    stepCopy[i] = newStep
  }

  // Записываем обновлённые массивы в соответствующие модули одним присваиванием
  if (type === 'x') {
    X.setObstaclesStepX(stepCopy)
    X.setObstaclesXCoord(coordCopy)
  } else {
    Y.setObstaclesStepY(stepCopy)
    Y.setObstaclesYCoord(coordCopy)
  }
}

export default moveObstacles
