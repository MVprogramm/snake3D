let snakeBodyTurn = 1

export const setBodyTurnaround = (body: number) => {
  snakeBodyTurn = body
}

export const getBodyTurnaround = () => snakeBodyTurn

import { snakeSteps } from '../../../types/animationTypes'
import * as PROPS from './snakeBodyProps'
import { getDiff } from './snakeDiff'

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

    if (index === PROPS.getSnakeUnitRotation().length - 2) {
      if (getDiff()[index].diffX === 1) unit[2] = 11
      if (getDiff()[index].diffX === -1) unit[2] = 33
      if (getDiff()[index].diffY === 1) unit[2] = 0
      if (getDiff()[index].diffY === -1) unit[2] = 22
    }
    return unit
  })

  PROPS.setSnakeUnitRotation(rotations)
}
