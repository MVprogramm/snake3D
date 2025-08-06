const snakeBodyRotation: number[][] = []
export const setSnakeBodyRotation = (props: number[][]) => {
  snakeBodyRotation.length = 0

  props.forEach((unit) => snakeBodyRotation.push(unit))
}
export const getSnakeBodyRotation = (): number[][] => snakeBodyRotation

// export const updateSnakeBodyRotation = () => {
//   const [counterHeadX, counterHeadY] = getCounterHead()
//   if (counterHeadX === 0 && counterHeadY === 0 && checkTimerWorking()) {
//   }
// }

let snakeBodyTurn = 1
export const setBodyTurnaround = (body: number) => {
  snakeBodyTurn = body
}

export const getBodyTurnaround = () => snakeBodyTurn
let counterTurnItem = 0
const lastMoveDirection = {
  name: '',
  value: 0,
  turn: 0,
  turnItemNumber: 0,
}
let currentDirection = ''
const direction = {
  rightX: 0,
  leftX: 0,
  upY: 1,
  downY: 0,
}
let moveSpeed = 1
export const getTurnItemNumber = (): number => lastMoveDirection.turnItemNumber
export const setTurnItemNumber = (turn: number): void => {
  lastMoveDirection.turnItemNumber = turn
}

import findLastMoveDirection from '../../../engine/protocol/findLastMoveDirection'
import { getProtocol } from '../../../engine/protocol/protocol'
import { getSnakeBodyCoord } from '../../../engine/snake/snake'
import { getTimerStep } from '../../../engine/time/timerStepPerLevel'
import { getCounterHead } from '../headAnimations/snakeHeadLocation'
import * as PROPS from './snakeBodyProps'
import { getDiff } from './snakeDiff'

export const snakeBodyTurnaround = () => {
  const [counterHeadX, counterHeadY] = getCounterHead()

  if (counterHeadX === 0 && counterHeadY === 0) {
    moveSpeed = getTimerStep()
    if (counterTurnItem > 0 && counterTurnItem < getSnakeBodyCoord().length - 1) {
      setTurnItemNumber(getTurnItemNumber() + 1)
      counterTurnItem++
    } else {
      setTurnItemNumber(0)
      counterTurnItem = 0
    }
  }
  const { name, value } = findLastMoveDirection()

  const rotations = PROPS.getSnakeUnitRotation().map((unit, index) => {
    if (index === 0) {
      unit[2] = lastMoveDirection.turn
      if (lastMoveDirection.name !== name && lastMoveDirection.name != '') {
        if (name === 'X' && value === 1) {
          unit[2] = 11
          currentDirection = 'right'
        }
        if (name === 'X' && value === -1) {
          unit[2] = 33
          currentDirection = 'left'
        }
        if (name === 'Y' && value === -1) {
          unit[2] = 22
          currentDirection = 'down'
        }
        if (name === 'Y' && value === 1) {
          unit[2] = 0
          currentDirection = 'up'
        }
        counterTurnItem = 1
      }

      lastMoveDirection.turn = unit[2]
      lastMoveDirection.name = name
      lastMoveDirection.value = +value
    }

    if (index === getSnakeBodyCoord().length - 2) {
      if (getDiff()[index].diffX === 1) {
        if (currentDirection === 'down') direction.rightX = -1
        if (currentDirection === 'up') direction.rightX = 1
        unit[2] =
          getTurnItemNumber() === index
            ? unit[2] + (direction.rightX * 1.57 * moveSpeed) / 61
            : Math.round(unit[2] / 1.57) * 1.57
      }
      if (getDiff()[index].diffX === -1) {
        if (currentDirection === 'down') direction.leftX = 1
        if (currentDirection === 'up') direction.leftX = -1
        unit[2] =
          getTurnItemNumber() === index
            ? unit[2] + (direction.leftX * 1.57 * moveSpeed) / 61
            : Math.round(unit[2] / 1.57) * 1.57
      }
      if (getDiff()[index].diffY === 1) {
        if (currentDirection === 'right') direction.upY = -1
        if (currentDirection === 'left') direction.upY = 1
        unit[2] =
          getTurnItemNumber() === index
            ? unit[2] + (direction.upY * 1.57 * moveSpeed) / 61
            : Math.round(unit[2] / 1.57) * 1.57
      }
      if (getDiff()[index].diffY === -1) {
        if (currentDirection === 'right') direction.downY = 1
        if (currentDirection === 'left') direction.downY = -1
        unit[2] =
          getTurnItemNumber() === index
            ? unit[2] + (direction.downY * 1.57 * moveSpeed) / 61
            : Math.round(unit[2] / 1.57) * 1.57
      }
    } else {
      if (getDiff()[index].diffX === 1 /* && getTurnItemNumber() === index*/) {
        unit[2] = 11 + (index % 2) * 11

        // console.log('right')
      }
      if (getDiff()[index].diffX === -1 /* && getTurnItemNumber() === index*/) {
        unit[2] = 33 + (index % 2) * 11

        // console.log('left')
      }
      if (getDiff()[index].diffY === 1 /*&& getTurnItemNumber() === index*/) {
        unit[2] = 0 + (index % 2) * 11
        // console.log('up')
      }
      if (getDiff()[index].diffY === -1 /* && getTurnItemNumber() === index*/) {
        unit[2] = 22 + (index % 2) * 11
        // console.log('down')
      }
    }

    return unit
  })

  if (counterHeadX === 0 && counterHeadY === 0) rotations[0][2] = lastMoveDirection.turn
  PROPS.setSnakeUnitRotation(rotations)
}
