import { checkTimerWorking } from '../time/isTimer'
import { advanceSnake } from './moveSnake'

/**
 * тип, описывающий счётчик шагов головы 3D змейки по X и Y
 * при её движении от центра одной клетки к центру другой
 */
type positionCounter = {
  counterX: number
  counterY: number
}
/**
 * Контролирует количество шагов головы 3D змейки по X и Y,
 * ограничивая их пределами межклеточного расстояния.
 * Когда counter превышает 1 это означает, что межклеточное
 * расстояние пройдено и счетчик обнуляется.
 * @param props текущее количество шагов головы 3D змейки
 * @returns количество шагов головы 3D змейки после контроля
 */
export const setSnakePosition = (props: positionCounter): positionCounter => {
  let { counterX, counterY } = props
  if (checkTimerWorking()) {
    while (Math.abs(counterX) > 1) {
      counterX -= Math.sign(counterX)
      advanceSnake()
    }
    while (Math.abs(counterY) > 1) {
      counterY -= Math.sign(counterY)
      advanceSnake()
    }
  }

  return { counterX, counterY }
}
