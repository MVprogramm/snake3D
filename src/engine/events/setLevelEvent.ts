/**
 *  @module setLevelEvent.ts Устанавливает уровень в игре
 *     @function setLevelEvent Создание нового уровня
 */
import {
  getSnakeBodyLocation,
  setSnakeBodyLocation,
} from '../../animations/snakeAnimation/bodyAnimations/snakeBodyLocation'
import {
  setSnakeUnitPosition,
  setSnakeUnitRotation,
  setSnakeUnitScale,
} from '../../animations/snakeAnimation/bodyAnimations/snakeBodyProps'
import { setDiff } from '../../animations/snakeAnimation/bodyAnimations/snakeDiff'
import { setSnakePreviousStepsArray } from '../../animations/snakeAnimation/snakeAnimation'
import { PreviousStep } from '../../types/animationTypes'
import { getAmountOfFood } from '../food/amountOfFoodPerLevel'
import { setCurrentLevel } from '../levels/currentLevel'
import loadLevelProps from '../levels/loadLevelProps'
import { setMaxLevel } from '../levels/maxLevel'
import protocolExecutor from '../protocol/protocolExecutor'
/**
 *  Задает уровень в игре
 * @param level номер уровня, который загружается в игру
 * @description
 * 1. Задает максимальный уровень
 * 2. Устанавливает стартовый уровень и его настройки
 * 3. Фиксирует событие запуска уровня в игре
 */
function setLevelEvent(level: number): boolean {
  if (!Number.isInteger(level) || level < 1) {
    throw new Error('Level must be a positive integer')
  }
  try {
    setMaxLevel()
    setCurrentLevel(level)
    loadLevelProps(level)
    protocolExecutor({
      name: 'start level',
      value: level,
    })
    const tempVector3 = []
    const positionVector3 = []
    const tempLocationBody = []
    const previousStep: PreviousStep[] = []
    for (let i = 0; i < getAmountOfFood() + 1; i++) {
      setDiff({ diffX: 0, diffY: 0 }, i)
      tempVector3.push([0, 0, 0])
      positionVector3.push([0, i * -1, 0])
      previousStep.push({ previousStepX: 0, previousStepY: 0 })
      tempLocationBody.push([0, i * -1])
    }
    setSnakeUnitPosition(positionVector3)
    setSnakeUnitRotation(tempVector3)
    setSnakeUnitScale(tempVector3)
    setSnakeBodyLocation(tempLocationBody)
    setSnakePreviousStepsArray(previousStep)
  } catch (error) {
    console.error(`Error setting level ${level}:`, error)
    throw error
  }

  return true
  // setMaxLevel()
  // setCurrentLevel(level)
  // loadLevelProps(level)
  // protocolExecutor({
  //   name: 'start level',
  //   value: level,
  // })
}

export default setLevelEvent
