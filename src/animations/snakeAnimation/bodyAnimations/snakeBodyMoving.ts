import { snakeSteps } from '../../../types/animationTypes'
import { getSnakeUnitPosition, setSnakeUnitPosition } from './snakeBodyProps'
import { getSnakeSpeed } from '../snakeSpeedSetting'
import { checkTimerWorking } from '../../../engine/time/isTimer'
import { checkMistake } from '../../../engine/lives/isMistake'
import { breakContact, checkContact } from '../../../engine/events/isContact'
import { getDiff } from './snakeDiff'
import { getSnakeBodyCoord, getSnakeHeadParams } from '../../../engine/snake/snake'
import { getCounterHead } from '../headAnimations/snakeHeadLocation'
import snakeBodyDiff from './snakeBodyDiff'
import { getAmountOfFood } from '../../../engine/food/amountOfFoodPerLevel'
import { getSnakeBodyLocation } from './snakeBodyLocation'

let counterUnits: number[][] = []

export const setCounterUnits = () => {
  for (let i = 0; i < getAmountOfFood() + 1; i++) counterUnits.push([0, 0])
}

export const getCounterUnits = () => counterUnits

export const snakeBodyMoving = (steps: snakeSteps[], delta: number) => {
  const moveSpeed = getSnakeSpeed()
  const newSteps = [...steps]
  // newSteps.forEach((step, index) => {
  //   const isChangingDirectionFromXtoY =
  //     step.previousStepX !== 0 && step.currentStepX === 0 && step.currentStepY !== 0
  //   const isChangingDirectionFromYtoX =
  //     step.previousStepY !== 0 && step.currentStepY === 0 && step.currentStepX !== 0
  //   // if (isChangingDirectionFromXtoY || isChangingDirectionFromYtoX) {
  //   //   console.log({ isChangingDirectionFromXtoY, isChangingDirectionFromYtoX })
  //   // }

  //   // counterUnits[index][0] = isChangingDirectionFromXtoY ? 0 : getDiff()[index].diffX
  //   // counterUnits[index][1] = isChangingDirectionFromYtoX ? 0 : getDiff()[index].diffY
  //   counterUnits[index][0] = isChangingDirectionFromXtoY ? 0 : getDiff()[index].diffX
  //   counterUnits[index][1] = isChangingDirectionFromYtoX ? 0 : getDiff()[index].diffY
  // })
  // if (getSnakeBodyCoord().length > getSnakeUnitPosition().length)
  //   setSnakeUnitPosition([...getSnakeUnitPosition(), [0, 0, 0]])
  const posHeadBefore = [
    Math.round(getSnakeUnitPosition()[0][0]),
    Math.round(getSnakeUnitPosition()[0][1]),
  ]
  const posBodyBefore = [
    Math.round(getSnakeUnitPosition()[1][0]),
    Math.round(getSnakeUnitPosition()[1][1]),
  ]
  const pos = getSnakeUnitPosition().map((positions, index) => {
    positions[0] += getDiff()[index].diffX * delta * moveSpeed
    positions[1] += getDiff()[index].diffY * delta * moveSpeed
    positions[2] = 0

    // const pos = getSnakeUnitPosition().map((positions, index) => {
    //   if (index === 0) {
    //     positions[0] += getDiff()[0].diffX * delta * moveSpeed
    //     positions[1] += getDiff()[0].diffY * delta * moveSpeed
    //     positions[2] = 0
    //   } else {
    //     positions[0] += counterUnits[index][0] * delta * moveSpeed
    //     positions[1] += counterUnits[index][1] * delta * moveSpeed
    //     positions[2] = 0
    //   }
    // if (getSnakeHeadParams().snakeHeadStepX === 0) positions[0] = Math.round(positions[0])
    // if (getSnakeHeadParams().snakeHeadStepY === 0) positions[1] = Math.round(positions[1])
    return positions
  })
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0) {
    if (
      getSnakeHeadParams().snakeHeadStepX !== 0 ||
      getSnakeHeadParams().snakeHeadStepY !== 0
    ) {
      // console.log(getSnakeBodyLocation()[0], getSnakeBodyLocation()[1])

      // console.log('pos: ', posHeadBefore, posBodyBefore)
      // console.log('diff: ', getDiff()[0], getDiff()[1])

      console.log('----------------------------')

      //     console.log(
      //       'координаты движка: ',
      //       getSnakeBodyCoord()[0],
      //       getSnakeBodyCoord()[1],
      //       getSnakeBodyCoord()[2]
      //     )
      //     console.log('смещения 3D координат: ', getDiff()[0], getDiff()[1], getDiff()[2])
    }
  }

  // const isChangingDirectionFromXtoY =
  //       previousStepX !== 0 && currentStepX === 0 && currentStepY !== 0
  //     const isChangingDirectionFromYtoX =
  //       previousStepY !== 0 && currentStepY === 0 && currentStepX !== 0

  //     counterHeadX = isChangingDirectionFromXtoY ? 0 : counterX
  //     counterHeadY = isChangingDirectionFromYtoX ? 0 : counterY

  // if (counterHeadX === 0 && counterHeadY === 0) {
  //   if (
  //     getSnakeHeadParams().snakeHeadStepX !== 0 ||
  //     getSnakeHeadParams().snakeHeadStepY !== 0
  //   ) {
  //     // console.log(
  //     //   'координаты 3D змейки: ',
  //     //   getSnakeUnitPosition()[0],
  //     //   getSnakeUnitPosition()[1],
  //     //   getSnakeUnitPosition()[2]
  //     // )
  //   }
  // }
  setSnakeUnitPosition(pos)
}
