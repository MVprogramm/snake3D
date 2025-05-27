import moveSnake from '../../engine/snake/moveSnake'
import { setSnakePosition } from '../../engine/snake/setSnakePosition'
import { getSnakeBodyCoord, getSnakeHeadParams } from '../../engine/snake/snake'
import checkTimerStep from '../../engine/time/checkTimerStep'
import { PreviousStep, snakeSteps } from '../../types/animationTypes'
import snakeBodyDiff from './bodyAnimations/snakeBodyDiff'
import {
  getSnakeBodyLocation,
  updateSnakeBodyLocation,
} from './bodyAnimations/snakeBodyLocation'
// import { snakeBodyLocation } from './bodyAnimations/snakeBodyLocation'
import { snakeBodyMoving } from './bodyAnimations/snakeBodyMoving'
import {
  getSnakeUnitPosition,
  getSnakeUnitRotation,
  setSnakeUnitPosition,
  setSnakeUnitRotation,
} from './bodyAnimations/snakeBodyProps'
import {
  getSnakeBodyRotation,
  snakeBodyTurnaround,
  updateSnakeBodyRotation,
} from './bodyAnimations/snakeBodyTurnaround'
import { getDiff, setDiff } from './bodyAnimations/snakeDiff'
import { getCounterHead, snakeHeadLocation } from './headAnimations/snakeHeadLocation'
import { snakeHeadMoving } from './headAnimations/snakeHeadMoving'
import { snakeHeadTurnaround } from './headAnimations/snakeHeadTurnaround'
import { getSnakeSpeed } from './snakeSpeedSetting'
// import { snakeHeadWaves } from './headAnimations/snakeHeadWaves'
import { snakeStepSetting } from './snakeStepSetting'

import { snakeTailTurnaround } from './tailAnimations/snakeTailTurnaround'
//import { snakeTailWaves } from './tailAnimations/snakeTailWaves'
//import { setTailWavesAmplitude } from './tailAnimations/tailWavesAmplitude'

/**
 * @var массив объектов с направлениями движения каждого
 * элемента змейки по осям X и Y. Исходное состояние массива
 * соответствует змейке на старте игры.
 */
let snakePreviousStepsArray: PreviousStep[] = [
  // { previousStepX: 0, previousStepY: 0 },
  // { previousStepX: 0, previousStepY: 0 },
  // { previousStepX: 0, previousStepY: 0 },
]
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
    // if (getSnakeBodyCoord().length > snakePreviousStepsArray.length) {
    //   snakePreviousStepsArray.push({ previousStepX: 0, previousStepY: 0 })
    // const tempUnitPosition = [...getSnakeUnitPosition()]
    // tempUnitPosition.push([0, 0, 0])
    // // console.log(tempUnitPosition[tempUnitPosition.length - 1])

    // setSnakeUnitPosition(tempUnitPosition)
    // setDiff({ diffX: 0, diffY: 0 }, getDiff().length)
    // }
    // вычисляем направление движения всех элементов змейки
    // getSnakeUnitPosition().forEach((_, index) => {
    //   if (index < getSnakeBodyCoord().length) {
    //     snakeBodyDiff(index)
    //   } else {
    //     const { diffX, diffY } = getDiff()[index - 1]
    //     setDiff({ diffX, diffY }, index)
    //   }
    // })
    // console.log(getSnakeUnitRotation()[getSnakeUnitRotation().length - 1])

    getSnakeBodyLocation().forEach((_, index) => snakeBodyDiff(index))
    // getSnakeUnitPosition().forEach((_, index) => snakeBodyDiff(index))
    // console.log(getDiff()[0], getDiff()[1])
    // console.log(
    //   'pos: ',
    //   [
    //     Math.round(getSnakeUnitPosition()[0][0]),
    //     Math.round(getSnakeUnitPosition()[0][1]),
    //   ],
    //   [Math.round(getSnakeUnitPosition()[1][0]), Math.round(getSnakeUnitPosition()[1][1])]
    // )

    // updateSnakeBodyRotation()

    snakeSteps = snakeStepSetting(snakeSteps)
    updateSnakeBodyLocation()
    // const [counterHeadX, counterHeadY] = getCounterHead()
    // if (counterHeadX === 0 && counterHeadY === 0) {
    //   if (
    //     getSnakeHeadParams().snakeHeadStepX !== 0 ||
    //     getSnakeHeadParams().snakeHeadStepY !== 0
    //   ) {
    //     console.log(snakeSteps)
    //   }
    // }

    snakeHeadLocation(snakeSteps[0], delta)
    snakeHeadMoving(snakeSteps[0], delta)
    snakeBodyMoving(snakeSteps, delta)
    snakeBodyTurnaround(snakeSteps[0])
    // setSnakeUnitRotation(getSnakeBodyRotation())
    // const [counterHeadX, counterHeadY] = getCounterHead()
    // console.log({ counterHeadX, counterHeadY })

    // if (counterHeadX >= 0 && counterHeadY >= 0) moveSnake()

    /* snakeBodyLocation(snakeSteps, delta) */

    // snakeHeadTurnaround(snakeSteps)

    // snakeTailTurnaround(snakeSteps[0])
    // console.log(snakeSteps[0])

    snakePreviousStepsArray = snakeSteps.map((step) => {
      step.previousStepX = step.currentStepX
      step.previousStepY = step.currentStepY
      return step
    })
    // if (getSnakeBodyCoord().length > snakePreviousStepsArray.length)
    //   snakePreviousStepsArray.push({ previousStepX: 0, previousStepY: 0 })
    // previousStepX = snakeSteps.currentStepX
    // previousStepY = snakeSteps.currentStepY

    // snakeBodyMoving(snakeSteps, delta)
  }
}

export const setSnakePreviousStepsArray = (props: PreviousStep[]) => {
  snakePreviousStepsArray.length = 0

  props.forEach((unit) => snakePreviousStepsArray.push(unit))
}
