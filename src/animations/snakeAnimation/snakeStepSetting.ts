/**
 * @module snakeStepSetting.ts Задает направление движения головы змейки при рендере
 *    @function snakeStepSetting Передает рендеру команды игрока
 */
import { getProtocol } from '../../engine/protocol/protocol'
import moveSnake from '../../engine/snake/moveSnake'
import {
  getSnakeBodyCoord,
  getSnakeHeadParams,
  setSnakeHeadParams,
} from '../../engine/snake/snake'
import checkTimerStep from '../../engine/time/checkTimerStep'
import { checkTimerWorking } from '../../engine/time/isTimer'
import { snakeSteps } from '../../types/animationTypes'
import snakeBodyDiff from './bodyAnimations/snakeBodyDiff'
import { getDiff, setDiff } from './bodyAnimations/snakeDiff'
import { getCounterHead } from './headAnimations/snakeHeadLocation'
/**
 * Задает направление движения головы змейки при рендере по данным движка.
 * @param step Текущее и предыдущее направления движения головы змейки
 *             при рендера по осям X и Y
 * @description
 * 1. Функция работает только в момент нахождения змейки в узлах игрового поля
 * 2. Здесь рендер получает текущее направление движения головы змейки от движка
 * 3. При быстрой смене направлений змейка теряет промежуточные команды и может
 *    начать движение в обратном направлении, что приводит к ошибке. На этом этапе
 *    запрещается движение змейки в обратном направлении.
 * @returns step, содержащий актуальные данные о направлении движения головы змейки
 *                с учетом корректировки
 */
export const snakeStepSetting = (step: snakeSteps[]): snakeSteps[] => {
  // let newStep: snakeSteps[] = []
  // console.log(getCounterHead())

  // Функция работает только в момент нахождения рендера в узлах игрового поля
  if (getCounterHead()[0] === 0 && getCounterHead()[1] === 0 && checkTimerWorking()) {
    // newStep = [...step]

    // Здесь рендер получает текущее направление движения головы змейки от движка
    // newStep = step.map((item, index) => {
    //   item.currentStepX = getDiff()[index].diffX
    //   item.currentStepY = getDiff()[index].diffY
    //   // item.currentStepX = getSnakeHeadParams().snakeHeadStepX
    //   // item.currentStepY = getSnakeHeadParams().snakeHeadStepY
    //   return item
    // })

    step[0].currentStepX = getSnakeHeadParams().snakeHeadStepX
    step[0].currentStepY = getSnakeHeadParams().snakeHeadStepY
  }
  // console.log(newStep.length)

  // На этом этапе запрещается движение змейки в обратном направлении

  if (step[0].currentStepX !== 0 && step[0].currentStepX === -step[0].previousStepX) {
    step[0].currentStepX = 0
    step[0].currentStepY = +getProtocol()[getProtocol().length - 2].value

    setDiff({ diffX: step[0].currentStepX, diffY: step[0].currentStepY }, 0)
  }
  if (step[0].currentStepY !== 0 && step[0].currentStepY === -step[0].previousStepY) {
    step[0].currentStepY = 0
    step[0].currentStepX = +getProtocol()[getProtocol().length - 2].value

    setDiff({ diffX: step[0].currentStepX, diffY: step[0].currentStepY }, 0)
  }

  // const output = newStep.length !== 0 ? newStep : step
  // console.log(output)
  // setSnakeHeadParams({
  //   ...headParams,
  //   snakeHeadStepX: step[0].currentStepX,
  //   snakeHeadStepY: step[0].currentStepY,
  // })
  return step
}
