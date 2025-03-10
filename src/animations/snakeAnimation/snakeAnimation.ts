import checkTimerStep from '../../engine/time/checkTimerStep'
import { snakeHeadLocation } from './headAnimations/snakeHeadLocation'
import { snakeHeadMoving } from './headAnimations/snakeHeadMoving'
import { snakeHeadTurnaround } from './headAnimations/snakeHeadTurnaround'
// import { snakeHeadWaves } from './headAnimations/snakeHeadWaves'
import { snakeStepSetting } from './snakeStepSetting'
import { snakeTailTurnaround } from './tailAnimations/snakeTailTurnaround'
//import { snakeTailWaves } from './tailAnimations/snakeTailWaves'
//import { setTailWavesAmplitude } from './tailAnimations/tailWavesAmplitude'

let previousStepX = 0
let previousStepY = 0

export const snakeAnimation = (delta: number) => {
  let snakeSteps = {
    previousStepX,
    previousStepY,
    currentStepX: previousStepX,
    currentStepY: previousStepY,
  }
  if (!checkTimerStep()) {
    snakeSteps = snakeStepSetting(snakeSteps)
    snakeHeadLocation(snakeSteps, delta)
    snakeHeadTurnaround(snakeSteps)
    snakeTailTurnaround(snakeSteps)

    previousStepX = snakeSteps.currentStepX
    previousStepY = snakeSteps.currentStepY
    snakeHeadMoving(snakeSteps, delta)
  }
  return snakeSteps
}
