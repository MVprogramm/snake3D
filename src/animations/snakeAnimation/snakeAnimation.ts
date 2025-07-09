import checkTimerStep from '../../engine/time/checkTimerStep'
import { PreviousStep, snakeSteps } from '../../types/animationTypes'
import snakeBodyDiff from './bodyAnimations/snakeBodyDiff'
import * as LOCATION from './bodyAnimations/snakeBodyLocation'
import { snakeBodyMoving } from './bodyAnimations/snakeBodyMoving'
import { snakeBodyTurnaround } from './bodyAnimations/snakeBodyTurnaround'
import { snakeHeadLocation } from './headAnimations/snakeHeadLocation'
import { snakeHeadMoving } from './headAnimations/snakeHeadMoving'
import { snakeStepSetting } from './snakeStepSetting'

/**
 * @var массив объектов с направлениями движения каждого
 * элемента змейки по осям X и Y. Исходное состояние массива
 * соответствует змейке на старте игры.
 */
let snakePreviousStepsArray: PreviousStep[] = []
/**
 * Управляет змейкой, запуская процедуры расчета анимации в требуемом порядке.
 * @param delta - интервал рендера змейки, используется для управления скоростью
 * анимации
 */
export const snakeAnimation = (delta: number): void => {
  /**
   * @var массив объектов с направлениями движения каждого элемента змейки
   * по осям X и Y на текущем и предыдущем шагах.
   * В момент создания масива, текущие направления неизвестены, и поэтому
   * они приравниваются предыдущим. Длина массива равна текущей длине змейки
   */
  let snakeSteps: snakeSteps[] = snakePreviousStepsArray.map((step) => ({
    previousStepX: step.previousStepX,
    previousStepY: step.previousStepY,
    currentStepX: step.previousStepX,
    currentStepY: step.previousStepY,
  }))
  // если скорость змейки не равна 0
  if (!checkTimerStep()) {
    // вычисляем направление движения всех элементов змейки
    LOCATION.getSnakeBodyLocation().forEach((_, index) => snakeBodyDiff(index))
    snakeSteps = snakeStepSetting(snakeSteps)
    LOCATION.updateSnakeBodyLocation()
    snakeHeadLocation(snakeSteps[0], delta)
    snakeHeadMoving(snakeSteps[0], delta)
    snakeBodyMoving(delta)
    snakeBodyTurnaround()
    snakePreviousStepsArray = snakeSteps.map((step) => {
      step.previousStepX = step.currentStepX
      step.previousStepY = step.currentStepY
      return step
    })
  }
}

export const setSnakePreviousStepsArray = (props: PreviousStep[]) => {
  snakePreviousStepsArray.length = 0

  props.forEach((unit) => snakePreviousStepsArray.push(unit))
}
