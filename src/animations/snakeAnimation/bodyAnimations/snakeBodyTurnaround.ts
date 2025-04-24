let snakeBodyTurn = 1

export const setBodyTurnaround = (body: number) => {
  snakeBodyTurn = body
}

export const getBodyTurnaround = () => snakeBodyTurn

import { snakeSteps } from '../../../types/animationTypes'
import * as PROPS from './snakeBodyProps'

export const snakeBodyTurnaround = (steps: snakeSteps) => {
  // const rotations: number[][] = Array(PROPS.getSnakeUnitRotation().length).fill([0, 0, 0])
  // const rotations: number[][] = PROPS.getSnakeUnitRotation()
  // console.log(rotations[0], rotations[1], rotations[2])
  const { previousStepX, previousStepY, currentStepX, currentStepY } = steps
  const rotations = PROPS.getSnakeUnitRotation().map((unit, index) => {
    if (index === 0) {
      if (previousStepX === 0 && currentStepX === 1) unit[2] = 11
      if (previousStepX === 0 && currentStepX === -1) unit[2] = 33
      if (previousStepY === 0 && currentStepY === -1) unit[2] = 22
      if (previousStepY === 0 && currentStepY === 1) unit[2] = 0
    }

    return unit
  })
  // const { previousStepX, previousStepY, currentStepX, currentStepY } = steps
  // PROPS.getSnakeUnitRotation().forEach((_, index) => {
  //   if (index === 0) {
  //     if (previousStepX === 0 && currentStepX === 1) rotations[index][2] = 11
  //     if (previousStepX === 0 && currentStepX === -1) rotations[index][2] = 33
  //     if (previousStepY === 0 && currentStepY === -1) rotations[index][2] = 22
  //     if (previousStepY === 0 && currentStepY === 1) rotations[index][2] = 0
  //   }
  // })

  PROPS.setSnakeUnitRotation(rotations)
}
