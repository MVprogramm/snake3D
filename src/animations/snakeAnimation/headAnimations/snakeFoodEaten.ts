import { snakeCONFIG } from '../../../config/snakeConfig/snakeCONFIG'
import { getTimerStep } from '../../../engine/time/timerStepPerLevel'
import { getHeadVerticalStep } from './snakeHeadLocation'
import { MathUtils, Vector3 } from 'three'

const snakeHeadProps = snakeCONFIG.head.head
const snakeJawProps = snakeCONFIG.head.jaw
const snakeTongueProps = snakeCONFIG.head.tongue
const HEAD_ROTATION = 0.66
const JAW_OPEN_ROTATION = -1.3
const JAW_CLOSED_ROTATION = -0.05
const JAW_OPEN_Z = -0.3
const JAW_CLOSED_Z = 0.11
const TONGUE_OPEN_ROTATION = -0.6
const TONGUE_CLOSED_ROTATION = 0
const TONGUE_OPEN_Z = -0.1
const TONGUE_CLOSED_Z = 0.23
const TONGUE_OPEN_Y = 0.1
const TONGUE_CLOSED_Y = 0.35

export const snakeFoodEaten = (delta: number) => {
  const moveSpeed = getTimerStep()
  const currentStepZ = getHeadVerticalStep()
  const lambda = 50 * moveSpeed

  const headTarget = currentStepZ > 0 ? HEAD_ROTATION : 0
  snakeHeadProps['rotation-x'] = MathUtils.damp(
    snakeHeadProps['rotation-x'],
    headTarget,
    lambda,
    delta
  )

  const jawRotTarget = currentStepZ > 0 ? JAW_OPEN_ROTATION : JAW_CLOSED_ROTATION
  snakeJawProps['rotation-x'] = MathUtils.damp(
    snakeJawProps['rotation-x'],
    jawRotTarget,
    lambda,
    delta
  )

  const jawPosTarget = currentStepZ > 0 ? JAW_OPEN_Z : JAW_CLOSED_Z
  snakeJawProps.position.z = MathUtils.damp(
    snakeJawProps.position.z,
    jawPosTarget,
    lambda,
    delta
  )
  snakeJawProps.position = new Vector3(
    snakeJawProps.position.x,
    snakeJawProps.position.y,
    snakeJawProps.position.z
  )

  const tongueRotTarget = currentStepZ > 0 ? TONGUE_OPEN_ROTATION : TONGUE_CLOSED_ROTATION
  snakeTongueProps['rotation-x'] = MathUtils.damp(
    snakeTongueProps['rotation-x'],
    tongueRotTarget,
    lambda,
    delta
  )
  const tonguePosTargetZ = currentStepZ > 0 ? TONGUE_OPEN_Z : TONGUE_CLOSED_Z
  snakeTongueProps.position.z = MathUtils.damp(
    snakeTongueProps.position.z,
    tonguePosTargetZ,
    lambda,
    delta
  )
  const tonguePosTargetY = currentStepZ > 0 ? TONGUE_OPEN_Y : TONGUE_CLOSED_Y
  snakeTongueProps.position.y = MathUtils.damp(
    snakeTongueProps.position.y,
    tonguePosTargetY,
    lambda,
    delta
  )
  snakeTongueProps.position = new Vector3(
    snakeTongueProps.position.x,
    snakeTongueProps.position.y,
    snakeTongueProps.position.z
  )
}

export const getSnakeHeadProps = () => snakeHeadProps
export const getSnakeJawProps = () => snakeJawProps
export const getSnakeTongueProps = () => snakeTongueProps
