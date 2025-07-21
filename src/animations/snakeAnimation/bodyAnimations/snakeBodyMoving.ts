import { snakeSteps } from '../../../types/animationTypes'
import { getSnakeUnitPosition, setSnakeUnitPosition } from './snakeBodyProps'
import { getDiff } from './snakeDiff'
import { getAmountOfFood } from '../../../engine/food/amountOfFoodPerLevel'
import { getCounterHead } from '../headAnimations/snakeHeadLocation'
import { SystemConfig } from '../../../config/systemConfig'
import { getTimerStep } from '../../../engine/time/timerStepPerLevel'

let counterUnits: number[][] = []

/* Parameters controlling transverse wave for the snake body */

const WAVE_FREQUENCY = 2 * Math.PI
const WAVE_PHASE_STEP = Math.PI / 4
let waveTime = 0
/*----------------------------------------------------------*/

export const setCounterUnits = () => {
  for (let i = 0; i < getAmountOfFood() + 1; i++) counterUnits.push([0, 0])
}

export const getCounterUnits = () => counterUnits
let moveSpeed = 1
export const snakeBodyMoving = (steps: snakeSteps[], delta: number) => {
  const [counterHeadX, counterHeadY] = getCounterHead()
  if (counterHeadX === 0 && counterHeadY === 0) moveSpeed = getTimerStep()
  const WAVE_AMPLITUDE = moveSpeed / 100
  waveTime += delta * moveSpeed
  const pos = getSnakeUnitPosition().map((positions, index) => {
    const diff = getDiff()[index]
    positions[0] += (diff.diffX * moveSpeed) / SystemConfig.FPS
    positions[1] += (diff.diffY * moveSpeed) / SystemConfig.FPS
    /*-------------------------------------------------*/
    if (index != 0) {
      const perpX = -diff.diffY
      const perpY = diff.diffX
      const phase = waveTime + index * WAVE_PHASE_STEP
      const offset = Math.sin(phase * WAVE_FREQUENCY) * WAVE_AMPLITUDE
      positions[0] += perpX * offset
      positions[1] += perpY * offset
    }
    /*----------------------------------------------------*/
    if (counterHeadX === 0 && counterHeadY === 0) {
      positions[0] = Math.round(positions[0])
      positions[1] = Math.round(positions[1])
    }
    positions[2] = 0

    return positions
  })

  setSnakeUnitPosition(pos)
}
