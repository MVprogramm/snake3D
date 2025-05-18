const snakeBodyRotation: number[][] = []
export const setSnakeBodyRotation = (props: number[][]) => {
  snakeBodyRotation.length = 0

  props.forEach((unit) => snakeBodyRotation.push(unit))
}
export const getSnakeBodyRotation = (): number[][] => snakeBodyRotation

export const updateSnakeBodyRotation = () => {
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0 && checkTimerWorking()) {
  }
}

let snakeBodyTurn = 1
export const setBodyTurnaround = (body: number) => {
  snakeBodyTurn = body
}

export const getBodyTurnaround = () => snakeBodyTurn

import { getSnakeBodyCoord } from '../../../engine/snake/snake'
import { checkTimerWorking } from '../../../engine/time/isTimer'
import { snakeSteps } from '../../../types/animationTypes'
import { getCounterHead } from '../headAnimations/snakeHeadLocation'
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

    if (index === getSnakeBodyCoord().length - 2) {
      if (getDiff()[index].diffX === 1) unit[2] = 11
      if (getDiff()[index].diffX === -1) unit[2] = 33
      if (getDiff()[index].diffY === 1) unit[2] = 0
      if (getDiff()[index].diffY === -1) unit[2] = 22
    } else {
      if (getDiff()[index].diffX === 1) unit[2] = 11 + (index % 2) * 11
      if (getDiff()[index].diffX === -1) unit[2] = 33 + (index % 2) * 11
      if (getDiff()[index].diffY === 1) unit[2] = 0 + (index % 2) * 11
      if (getDiff()[index].diffY === -1) unit[2] = 22 + (index % 2) * 11
    }
    return unit
  })

  PROPS.setSnakeUnitRotation(rotations)
}
