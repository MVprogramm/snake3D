import { snakeSteps } from '../../../types/animationTypes'
import { getSnakeUnitPosition, setSnakeUnitPosition } from './snakeBodyProps'
import { getSnakeSpeed } from '../snakeSpeedSetting'
import { getDiff } from './snakeDiff'
import { getAmountOfFood } from '../../../engine/food/amountOfFoodPerLevel'
import { getCounterHead } from '../headAnimations/snakeHeadLocation'
import { SystemConfig } from '../../../config/systemConfig'

let counterUnits: number[][] = []

export const setCounterUnits = () => {
  for (let i = 0; i < getAmountOfFood() + 1; i++) counterUnits.push([0, 0])
}

export const getCounterUnits = () => counterUnits

export const snakeBodyMoving = (steps: snakeSteps[], delta: number) => {
  const [counterHeadX, counterHeadY] = getCounterHead()
  const moveSpeed = getSnakeSpeed()
  const pos = getSnakeUnitPosition().map((positions, index) => {
    positions[0] += (getDiff()[index].diffX * moveSpeed) / SystemConfig.FPS
    positions[1] += (getDiff()[index].diffY * moveSpeed) / SystemConfig.FPS
    if (counterHeadX === 0 && counterHeadY === 0) {
      positions[0] = Math.round(positions[0])
      positions[1] = Math.round(positions[1])
    }
    positions[2] = 0

    return positions
  })

  setSnakeUnitPosition(pos)
}
