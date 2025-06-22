import { snakeSteps } from '../../../types/animationTypes'
import { getSnakeUnitPosition, setSnakeUnitPosition } from './snakeBodyProps'
import { getSnakeSpeed } from '../snakeSpeedSetting'
import { getDiff } from './snakeDiff'
import { getAmountOfFood } from '../../../engine/food/amountOfFoodPerLevel'

let counterUnits: number[][] = []

export const setCounterUnits = () => {
  for (let i = 0; i < getAmountOfFood() + 1; i++) counterUnits.push([0, 0])
}

export const getCounterUnits = () => counterUnits

export const snakeBodyMoving = (steps: snakeSteps[], delta: number) => {
  const moveSpeed = getSnakeSpeed()
  const pos = getSnakeUnitPosition().map((positions, index) => {
    positions[0] += getDiff()[index].diffX * delta * moveSpeed
    positions[1] += getDiff()[index].diffY * delta * moveSpeed
    positions[2] = 0

    return positions
  })

  setSnakeUnitPosition(pos)
}
