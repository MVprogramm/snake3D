import { snakeCONFIG } from '../../../config/snakeConfig/snakeCONFIG'
import { getTimerStep } from '../../../engine/time/timerStepPerLevel'
import { getHeadVerticalStep } from './snakeHeadLocation'
import { SystemConfig } from '../../../config/systemConfig'
import { Vector3 } from 'three'

const snakeHeadProps = snakeCONFIG.head.head
const snakeJawProps = snakeCONFIG.head.jaw

export const snakeFoodEaten = () => {
  const moveSpeed = getTimerStep()
  const currentStepZ = getHeadVerticalStep()
  snakeHeadProps['rotation-x'] += (currentStepZ * moveSpeed) / SystemConfig.FPS / 1.5
  snakeJawProps['rotation-x'] -= (1.25 * (currentStepZ * moveSpeed)) / SystemConfig.FPS
  snakeJawProps.position.z -= (0.41 * (currentStepZ * moveSpeed)) / SystemConfig.FPS
  snakeJawProps.position = new Vector3(
    snakeJawProps.position.x,
    snakeJawProps.position.y,
    snakeJawProps.position.z
  )
}

export const getSnakeHeadProps = () => snakeHeadProps
export const getSnakeJawProps = () => snakeJawProps
