let moveSpeed = 1

import findLastMoveDirection from '../../../engine/protocol/findLastMoveDirection'
import { getProtocol } from '../../../engine/protocol/protocol'
import { getSnakeBodyCoord } from '../../../engine/snake/snake'
import { checkTimerWorking } from '../../../engine/time/isTimer'
import { getTimerStep } from '../../../engine/time/timerStepPerLevel'
import { getCounterHead } from '../headAnimations/snakeHeadLocation'
import * as PROPS from './snakeBodyProps'
import * as DIFF from './snakeDiff'

export const snakeBodyTurnaround = () => {
  const [counterHeadX, counterHeadY] = getCounterHead()
  const rotations = PROPS.getSnakeUnitRotation().map((unit, index) => {
    if (index === 0) {
      // const diffPreviousX = DIFF.getPreviousDiff()[index].diffX
      // const diffPreviousY = DIFF.getPreviousDiff()[index].diffY
      const diffCurrentX = DIFF.getDiff()[0].diffX
      const diffCurrentY = DIFF.getDiff()[0].diffY
      let currentDirection =
        diffCurrentX === 1 && diffCurrentY === 0
          ? 'right'
          : diffCurrentX === 0 && diffCurrentY === -1
          ? 'down'
          : diffCurrentX === -1 && diffCurrentY === 0
          ? 'left'
          : diffCurrentX === 0 && diffCurrentY === 1
          ? 'up'
          : ''
      unit[2] =
        currentDirection === 'up'
          ? 0
          : currentDirection === 'down'
          ? 3.14
          : currentDirection === 'right'
          ? -1.57
          : currentDirection === 'left'
          ? 1.57
          : 0
      if (counterHeadX === 0 && counterHeadY === 0)
        console.log('currentDirection head: ', currentDirection)
    }
    if (index > 0 && index < getSnakeBodyCoord().length - 2) {
      const diffPreviousX = DIFF.getPreviousDiff()[index - 1].diffX
      const diffPreviousY = DIFF.getPreviousDiff()[index - 1].diffY
      const diffCurrentX = DIFF.getDiff()[index - 1].diffX
      const diffCurrentY = DIFF.getDiff()[index - 1].diffY
      let previousDirection =
        diffPreviousX === 1 && diffPreviousY === 0
          ? 'right'
          : diffPreviousX === 0 && diffPreviousY === -1
          ? 'down'
          : diffPreviousX === -1 && diffPreviousY === 0
          ? 'left'
          : diffPreviousX === 0 && diffPreviousY === 1
          ? 'up'
          : ''
      let currentDirection =
        diffCurrentX === 1 && diffCurrentY === 0
          ? 'right'
          : diffCurrentX === 0 && diffCurrentY === -1
          ? 'down'
          : diffCurrentX === -1 && diffCurrentY === 0
          ? 'left'
          : diffCurrentX === 0 && diffCurrentY === 1
          ? 'up'
          : ''
      if (
        (previousDirection === 'right' && currentDirection === 'up') ||
        (previousDirection === 'left' && currentDirection === 'down') ||
        (previousDirection === 'up' && currentDirection === 'left') ||
        (previousDirection === 'down' && currentDirection === 'right')
      )
        unit[2] = unit[2] + (1.57 * moveSpeed) / 61
      if (counterHeadX === 0 && counterHeadY === 0)
        unit[2] = Math.ceil(unit[2] / 1.57) * 1.57
      if (
        (previousDirection === 'right' && currentDirection === 'down') ||
        (previousDirection === 'left' && currentDirection === 'up') ||
        (previousDirection === 'up' && currentDirection === 'right') ||
        (previousDirection === 'down' && currentDirection === 'left')
      )
        unit[2] = unit[2] - (1.57 * moveSpeed) / 61
      if (counterHeadX === 0 && counterHeadY === 0)
        unit[2] = Math.floor(unit[2] / 1.57) * 1.57

      // if (previousDirection === 'right' && currentDirection === 'up') {
      //   unit[2] = unit[2] + (1.57 * moveSpeed) / 61
      // }
      // if (previousDirection === 'right' && currentDirection === 'down') {
      //   unit[2] = unit[2] - (1.57 * moveSpeed) / 61
      // }
      // if (previousDirection === 'left' && currentDirection === 'up') {
      //   unit[2] = unit[2] - (1.57 * moveSpeed) / 61
      // }
      // if (previousDirection === 'left' && currentDirection === 'down') {
      //   unit[2] = unit[2] + (1.57 * moveSpeed) / 61
      // }
      // if (previousDirection === 'up' && currentDirection === 'right') {
      //   unit[2] = unit[2] - (1.57 * moveSpeed) / 61
      // }
      // if (previousDirection === 'up' && currentDirection === 'left') {
      //   unit[2] = unit[2] + (1.57 * moveSpeed) / 61
      // }
      // if (previousDirection === 'down' && currentDirection === 'right') {
      //   unit[2] = unit[2] + (1.57 * moveSpeed) / 61
      // }
      // if (previousDirection === 'down' && currentDirection === 'left') {
      //   unit[2] = unit[2] - (1.57 * moveSpeed) / 61
      // }
    }
    if (index === getSnakeBodyCoord().length - 2) {
      const diffPreviousX = DIFF.getPreviousDiff()[index - 1].diffX
      const diffPreviousY = DIFF.getPreviousDiff()[index - 1].diffY
      const diffCurrentX = DIFF.getDiff()[index - 1].diffX
      const diffCurrentY = DIFF.getDiff()[index - 1].diffY
      console.log(diffCurrentX, diffCurrentY)
      // if (counterHeadX === 0 && counterHeadY === 0)
      //   console.log(
      //     'tail previous X: ',
      //     diffPreviousX,
      //     'tail previous Y: ',
      //     diffPreviousY,
      //     '| tail current X: ',
      //     diffCurrentX,
      //     'tail current Y: ',
      //     diffCurrentY
      //   )
      let previousDirection =
        diffPreviousX === 1 && diffPreviousY === 0
          ? 'right'
          : diffPreviousX === 0 && diffPreviousY === -1
          ? 'down'
          : diffPreviousX === -1 && diffPreviousY === 0
          ? 'left'
          : diffPreviousX === 0 && diffPreviousY === 1
          ? 'up'
          : ''
      let currentDirection =
        diffCurrentX === 1 && diffCurrentY === 0
          ? 'right'
          : diffCurrentX === 0 && diffCurrentY === -1
          ? 'down'
          : diffCurrentX === -1 && diffCurrentY === 0
          ? 'left'
          : diffCurrentX === 0 && diffCurrentY === 1
          ? 'up'
          : ''
      console.log(previousDirection, currentDirection)
      if (
        (previousDirection === 'right' && currentDirection === 'up') ||
        (previousDirection === 'left' && currentDirection === 'down') ||
        (previousDirection === 'up' && currentDirection === 'left') ||
        (previousDirection === 'down' && currentDirection === 'right')
      )
        unit[2] = unit[2] + (1.57 * moveSpeed) / 61
      if (counterHeadX === 0 && counterHeadY === 0)
        unit[2] = Math.ceil(unit[2] / 1.57) * 1.57
      if (
        (previousDirection === 'right' && currentDirection === 'down') ||
        (previousDirection === 'left' && currentDirection === 'up') ||
        (previousDirection === 'up' && currentDirection === 'right') ||
        (previousDirection === 'down' && currentDirection === 'left')
      )
        unit[2] = unit[2] - (1.57 * moveSpeed) / 61
      if (counterHeadX === 0 && counterHeadY === 0)
        unit[2] = Math.floor(unit[2] / 1.57) * 1.57
    }
    if (index > getSnakeBodyCoord().length - 2) {
      const diffPreviousX = DIFF.getPreviousDiff()[index - 1].diffX
      const diffPreviousY = DIFF.getPreviousDiff()[index - 1].diffY
      const diffCurrentX = DIFF.getDiff()[index - 1].diffX
      const diffCurrentY = DIFF.getDiff()[index - 1].diffY
      let previousDirection =
        diffPreviousX === 1 && diffPreviousY === 0
          ? 'right'
          : diffPreviousX === 0 && diffPreviousY === -1
          ? 'down'
          : diffPreviousX === -1 && diffPreviousY === 0
          ? 'left'
          : diffPreviousX === 0 && diffPreviousY === 1
          ? 'up'
          : ''
      let currentDirection =
        diffCurrentX === 1 && diffCurrentY === 0
          ? 'right'
          : diffCurrentX === 0 && diffCurrentY === -1
          ? 'down'
          : diffCurrentX === -1 && diffCurrentY === 0
          ? 'left'
          : diffCurrentX === 0 && diffCurrentY === 1
          ? 'up'
          : ''
      if (
        (previousDirection === 'right' && currentDirection === 'up') ||
        (previousDirection === 'left' && currentDirection === 'down') ||
        (previousDirection === 'up' && currentDirection === 'left') ||
        (previousDirection === 'down' && currentDirection === 'right')
      )
        unit[2] = unit[2] + (1.57 * moveSpeed) / 61
      if (counterHeadX === 0 && counterHeadY === 0)
        unit[2] = Math.ceil(unit[2] / 1.57) * 1.57
      if (
        (previousDirection === 'right' && currentDirection === 'down') ||
        (previousDirection === 'left' && currentDirection === 'up') ||
        (previousDirection === 'up' && currentDirection === 'right') ||
        (previousDirection === 'down' && currentDirection === 'left')
      )
        unit[2] = unit[2] - (1.57 * moveSpeed) / 61
      if (counterHeadX === 0 && counterHeadY === 0)
        unit[2] = Math.floor(unit[2] / 1.57) * 1.57
    }

    return unit
  })
  // if (counterHeadX === 0 && counterHeadY === 0 && checkTimerWorking())
  //   console.log(direction)
  // if (counterHeadX === 0 && counterHeadY === 0) {
  //   moveSpeed = getTimerStep()
  //   if (counterTurnItem > 0 && counterTurnItem < getSnakeBodyCoord().length - 1) {
  //     setTurnItemNumber(getTurnItemNumber() + 1)
  //     counterTurnItem++
  //   } else {
  //     setTurnItemNumber(0)
  //     counterTurnItem = 0
  //   }
  // }
  // const { name, value } = findLastMoveDirection()

  // const rotations = PROPS.getSnakeUnitRotation().map((unit, index) => {
  //   if (counterHeadX === 0 && counterHeadY === 0 && index <= 3 && checkTimerWorking())
  //     console.log(index, getDiff()[index])

  //   if (index === 0) {
  //     unit[2] = lastMoveDirection.turn
  //     if (lastMoveDirection.name !== name && lastMoveDirection.name != '') {
  //       if (name === 'X' && value === 1) {
  //         unit[2] = 11
  //         currentDirection = 'right'
  //       }
  //       if (name === 'X' && value === -1) {
  //         unit[2] = 33
  //         currentDirection = 'left'
  //       }
  //       if (name === 'Y' && value === -1) {
  //         unit[2] = 22
  //         currentDirection = 'down'
  //       }
  //       if (name === 'Y' && value === 1) {
  //         unit[2] = 0
  //         currentDirection = 'up'
  //       }
  //       counterTurnItem = 1
  //     }

  //     lastMoveDirection.turn = unit[2]
  //     lastMoveDirection.name = name
  //     lastMoveDirection.value = +value
  //   }

  //   if (index === getSnakeBodyCoord().length - 2) {
  //     if (getDiff()[index].diffX === 1) {
  //       if (currentDirection === 'down') direction.rightX = -1
  //       if (currentDirection === 'up') direction.rightX = 1
  //       unit[2] =
  //         getTurnItemNumber() === index
  //           ? unit[2] + (direction.rightX * 1.57 * moveSpeed) / 61
  //           : Math.round(unit[2] / 1.57) * 1.57
  //     }
  //     if (getDiff()[index].diffX === -1) {
  //       if (currentDirection === 'down') direction.leftX = 1
  //       if (currentDirection === 'up') direction.leftX = -1
  //       unit[2] =
  //         getTurnItemNumber() === index
  //           ? unit[2] + (direction.leftX * 1.57 * moveSpeed) / 61
  //           : Math.round(unit[2] / 1.57) * 1.57
  //     }
  //     if (getDiff()[index].diffY === 1) {
  //       if (currentDirection === 'right') direction.upY = -1
  //       if (currentDirection === 'left') direction.upY = 1
  //       unit[2] =
  //         getTurnItemNumber() === index
  //           ? unit[2] + (direction.upY * 1.57 * moveSpeed) / 61
  //           : Math.round(unit[2] / 1.57) * 1.57
  //     }
  //     if (getDiff()[index].diffY === -1) {
  //       if (currentDirection === 'right') direction.downY = 1
  //       if (currentDirection === 'left') direction.downY = -1
  //       unit[2] =
  //         getTurnItemNumber() === index
  //           ? unit[2] + (direction.downY * 1.57 * moveSpeed) / 61
  //           : Math.round(unit[2] / 1.57) * 1.57
  //     }
  //   } else {
  //     if (getDiff()[index].diffX === 1 /* && getTurnItemNumber() === index*/) {
  //       unit[2] = 11 + (index % 2) * 11

  //       // console.log('right')
  //     }
  //     if (getDiff()[index].diffX === -1 /* && getTurnItemNumber() === index*/) {
  //       unit[2] = 33 + (index % 2) * 11

  //       // console.log('left')
  //     }
  //     if (getDiff()[index].diffY === 1 /*&& getTurnItemNumber() === index*/) {
  //       unit[2] = 0 + (index % 2) * 11
  //       // console.log('up')
  //     }
  //     if (getDiff()[index].diffY === -1 /* && getTurnItemNumber() === index*/) {
  //       unit[2] = 22 + (index % 2) * 11
  //       // console.log('down')
  //     }
  //   }

  //   return unit
  // })

  // if (counterHeadX === 0 && counterHeadY === 0) rotations[0][2] = lastMoveDirection.turn
  PROPS.setSnakeUnitRotation(rotations)
}
