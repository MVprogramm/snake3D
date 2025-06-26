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

const lastMoveDirection = {
  name: '',
  value: 0,
  turn: 0,
}

import findLastMoveDirection from '../../../engine/protocol/findLastMoveDirection'
import { getSnakeBodyCoord } from '../../../engine/snake/snake'
import { checkTimerWorking } from '../../../engine/time/isTimer'
import { getCounterHead } from '../headAnimations/snakeHeadLocation'
import * as PROPS from './snakeBodyProps'
import { getDiff } from './snakeDiff'

export const snakeBodyTurnaround = () => {
  const rotations = PROPS.getSnakeUnitRotation().map((unit, index) => {
    const { name, value } = findLastMoveDirection()
    if (index === 0) {
      unit[2] = lastMoveDirection.turn
      if (lastMoveDirection.name !== name) {
        if (name === 'X' && value === 1) unit[2] = 11
        if (name === 'X' && value === -1) unit[2] = 33
        if (name === 'Y' && value === -1) unit[2] = 22
        if (name === 'Y' && value === 1) unit[2] = 0
      }
      lastMoveDirection.turn = unit[2]
      lastMoveDirection.name = name
      lastMoveDirection.value = +value
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

  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0) rotations[0][2] = lastMoveDirection.turn
  PROPS.setSnakeUnitRotation(rotations)
}
