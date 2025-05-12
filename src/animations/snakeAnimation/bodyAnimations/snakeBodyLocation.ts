import { getField } from '../../../engine/field/fieldPerLevel'
import { getSnakeHeadParams } from '../../../engine/snake/snake'
import { checkTimerWorking } from '../../../engine/time/isTimer'
import { getCounterHead } from '../headAnimations/snakeHeadLocation'

const snakeBodyLocation: number[][] = []

export const setSnakeBodyLocation = (props: number[][]) => {
  snakeBodyLocation.length = 0

  props.forEach((unit) => snakeBodyLocation.push(unit))
}

export const updateSnakeBodyLocation = () => {
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0 && checkTimerWorking()) {
    let { snakeHeadCoordX, snakeHeadCoordY, snakeHeadStepX, snakeHeadStepY } =
      getSnakeHeadParams()
    const xCoord = snakeHeadCoordX - (getField() + 1) / 2
    const yCoord = snakeHeadCoordY - (getField() + 1) / 2

    for (let i = snakeBodyLocation.length - 1; i > 0; i--)
      snakeBodyLocation[i] = snakeBodyLocation[i - 1]
    snakeBodyLocation[0] = [xCoord + snakeHeadStepX, yCoord + snakeHeadStepY]
  }
}

export const getSnakeBodyLocation = (): number[][] => {
  return snakeBodyLocation
}
