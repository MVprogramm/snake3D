import { changeSnakeSpeed } from '../../animations/snakeAnimation/snakeSpeedSetting'
import { getStep, setTimerStep } from '../time/timerStepPerLevel'

let trainingMode = false
let trainingSpeed = 5

export function setTrainingMode(isTraining: boolean): void {
  trainingMode = isTraining
}

export function isTrainingMode(): boolean {
  return trainingMode
}

export function setTrainingSpeed(speed: number): void {
  const safeSpeed = Math.min(Math.max(Math.round(speed), 1), 5)

  trainingSpeed = safeSpeed

  if (trainingMode) {
    setTimerStep(safeSpeed)
    changeSnakeSpeed(safeSpeed)
  }
}

export function getTrainingSpeed(): number {
  return trainingMode ? getStep() : trainingSpeed
}
