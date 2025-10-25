/**
 * @module changeDirectionEvent.ts Управление змейкой с клавиатуры
 *    @var prohibitedMove Хранит параметры запрещенного обратного хода змейки
 *    @function changeDirectionEvent Отрабатывает нажатие клавиш
 */
import { Event } from '../../types/eventTypes'
import * as TIMER from '../time/isTimer'
import checkTimerStep from '../time/checkTimerStep'
import findLastMoveDirection from '../protocol/findLastMoveDirection'
import { getInterruptGame } from './interruptGameEvent'
import { checkPause } from './pauseEvent'
import { checkTimerWorking } from '../time/isTimer'
import { checkContact } from './isContact'
/**
 * @var Новое направление головы змейки
 */
let newKeyboardMove = ''
/**
 * Изменяет направление движения змейки при нажатии клавиш со стрелками
 * @param e событие нажатия клавиши на клавиатуре
 * @description
 * 1. После паузы позволяет двигаться змейке в прежнем направлении
 * 2. Повтороное нажатие не отрабатывается
 * 3. Движение змейки в обратную сторону запрещено
 * 4. Отработка нажатия клавиши происходит внесением записи об этом в протокол
 * 5. Нажатие клавиши запускает игру
 * @returns событие изменения направления движения змейки, или "пустое" событие
 */
export const changeDirectionEvent = (e: KeyboardEvent): Event => {
  const moveDirection = findLastMoveDirection()
  let newName = ''
  let newValue = 0
  // prohibitedMove.direction = getSnakeMoveDirection()[0]
  // prohibitedMove.step =
  //   getSnakeMoveDirection()[1] === 'up' || getSnakeMoveDirection()[1] === 'right' ? -1 : 1
  if (!checkTimerWorking() || checkContact()) moveDirection.name = ''
  // if (checkTimerStep() || getInterruptGame()) return { name: newName, value: newValue }
  if (e.code === 'ArrowUp' && moveDirection.name !== 'Y') {
    newName = 'Y'
    newValue = 1
    newKeyboardMove = 'up'
  } else if (
    e.code === 'ArrowDown' &&
    moveDirection.name !== 'Y' &&
    findLastMoveDirection().name !== ''
  ) {
    newName = 'Y'
    newValue = -1
    newKeyboardMove = 'down'
  } else if (e.code === 'ArrowLeft' && moveDirection.name !== 'X') {
    newName = 'X'
    newValue = -1
    newKeyboardMove = 'left'
  } else if (e.code === 'ArrowRight' && moveDirection.name !== 'X') {
    newName = 'X'
    newValue = 1
    newKeyboardMove = 'right'
  }

  // if (newName === prohibitedMove.direction && newValue === prohibitedMove.step)
  //   return { name: '', value: 0 }
  if (newName !== '' && !checkPause()) TIMER.startTimer()
  const newEvent = Object.assign({}, { name: newName, value: newValue })

  return newEvent
}

export const getNewKeyboardMove = () => newKeyboardMove
