import { snakeSteps } from '../../../types/animationTypes'
import { getPositionHead, setPositionHead } from './snakeHeadProps'
import { getSnakeSpeed } from '../snakeSpeedSetting'
import { SystemConfig } from '../../../config/systemConfig'
import { getCounterHead } from './snakeHeadLocation'

let moveSpeed = 1

export const snakeHeadMoving = (steps: snakeSteps, delta: number) => {
  const { currentStepX, currentStepY } = steps
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0) moveSpeed = getSnakeSpeed()
  const positionHead = getPositionHead()

  positionHead[0] += (currentStepX * moveSpeed) / SystemConfig.FPS
  positionHead[1] += (currentStepY * moveSpeed) / SystemConfig.FPS
  if (counterHeadX === 0 && counterHeadY === 0) {
    positionHead[0] = Math.round(positionHead[0])
    positionHead[1] = Math.round(positionHead[1])
  }

  setPositionHead(positionHead)
}
