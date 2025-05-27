import { getField } from '../../../engine/field/fieldPerLevel'
import { getProtocol } from '../../../engine/protocol/protocol'
import { getSnakeHeadParams } from '../../../engine/snake/snake'
import { checkTimerWorking } from '../../../engine/time/isTimer'
import { getCounterHead } from '../headAnimations/snakeHeadLocation'
import { getSnakeTurnAround, setSnakeTurnAround } from '../snakeStepSetting'

const snakeBodyLocation: number[][] = []

export const setSnakeBodyLocation = (props: number[][]) => {
  snakeBodyLocation.length = 0

  props.forEach((unit) => snakeBodyLocation.push(unit))
}

export const updateSnakeBodyLocation = () => {
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0 && checkTimerWorking()) {
    console.log('head life: ', snakeBodyLocation[0])
    let { snakeHeadCoordX, snakeHeadCoordY, snakeHeadStepX, snakeHeadStepY } =
      getSnakeHeadParams()
    const xCoord = snakeHeadCoordX - (getField() + 1) / 2
    const yCoord = snakeHeadCoordY - (getField() + 1) / 2

    let currentSnakeHeadStepX = snakeHeadStepX
    let currentSnakeHeadStepY = snakeHeadStepY

    for (let i = snakeBodyLocation.length - 1; i > 0; i--)
      snakeBodyLocation[i] = snakeBodyLocation[i - 1]

    if (getSnakeTurnAround()[0] === 1) {
      console.log('head shock X')

      currentSnakeHeadStepX = 0
      currentSnakeHeadStepY = +getProtocol()[getProtocol().length - 2].value
    }
    if (getSnakeTurnAround()[1] === 1) {
      console.log('head shock Y')
      currentSnakeHeadStepX = +getProtocol()[getProtocol().length - 2].value
      currentSnakeHeadStepY = 0
    }

    snakeBodyLocation[0] = [
      xCoord + currentSnakeHeadStepX,
      yCoord + currentSnakeHeadStepY,
    ]
    console.log('after: ', getSnakeBodyLocation()[0])

    setSnakeTurnAround([0, 0])
  }
}

export const getSnakeBodyLocation = (): number[][] => {
  return snakeBodyLocation
}
