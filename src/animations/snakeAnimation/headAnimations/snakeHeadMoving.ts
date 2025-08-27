import { snakeSteps } from '../../../types/animationTypes'
import { getPositionHead, setPositionHead } from './snakeHeadProps'
import { SystemConfig } from '../../../config/systemConfig'
import { getCounterHead, getHeadVerticalStep } from './snakeHeadLocation'
import { getTimerStep } from '../../../engine/time/timerStepPerLevel'
import { snakeFoodEaten } from './snakeFoodEaten'

let moveSpeed = 1

export const snakeHeadMoving = (steps: snakeSteps, delta: number) => {
  const { currentStepX, currentStepY } = steps
  const currentStepZ = getHeadVerticalStep()
  snakeFoodEaten()
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0) moveSpeed = getTimerStep()
  const positionHead = getPositionHead()

  positionHead[0] += (currentStepX * moveSpeed) / SystemConfig.FPS
  positionHead[1] += (currentStepY * moveSpeed) / SystemConfig.FPS
  positionHead[2] += (currentStepZ * moveSpeed) / SystemConfig.FPS / 2
  if (counterHeadX === 0 && counterHeadY === 0) {
    positionHead[0] = Math.round(positionHead[0])
    positionHead[1] = Math.round(positionHead[1])
    // positionHead[2] = Math.round(positionHead[2])
  }

  setPositionHead(positionHead)
}
