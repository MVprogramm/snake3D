/**
 * @module setObstacleEvent.ts Генерирует координаты препятствий всех типов
 *    @function setObstacleEvent Каждое препятствие занимает отдельную ячейку
 */
import * as X from '../obstacles/obstaclesX'
import * as Y from '../obstacles/obstaclesY'
import * as FIX from '../obstacles/obstaclesFix'
import getFreeCell from '../field/getFreeCell'
import { getField } from '../field/fieldPerLevel'
import cellsBookingAroundSnake from '../snake/cellsBookingAroundSnake'
import selectionObstacleType from '../obstacles/selectionObstacleType'
import { addEvent } from '../protocol/protocol'
/**
 * Генерирует координаты препятствий всех типов в свободных ячейках
 * @description
 * 1. В центре поля резервируется 9 клеток под змейку и ее первые ходы
 * 2. Последовательно генерируются координаты препятствий типов "x", "y" и "fix"
 * 3. Сгенерированные координаты препятствий заносятся в booking
 * 4. Событие генерации заносится в протокол
 * 5. Координаты препятствий каждого типа хранятся в соответствующих массивах
 */
function setObstacleEvent(): void {
  let booking: number[][] = []
  const topLeftCoord = Math.round(getField() / 2 - 1)
  booking = [...cellsBookingAroundSnake(topLeftCoord, topLeftCoord)]
  for (const type of ['x', 'y', 'fix'] as const) {
    const obstaclesDirection = selectionObstacleType(type)
    if (type === 'y') booking = booking.concat([...X.getObstaclesXCoord()])
    if (type === 'fix') booking = booking.concat([...Y.getObstaclesYCoord()])
    const obstacles: number[][] = []
    for (let index = 0; index < obstaclesDirection.length; index += 1) {
      const freeCell = getFreeCell(booking)
      if (!freeCell) {
        console.warn(`WARNING! Unable to set obstacle ${type}: no free cells available`)
        return
      }
      const [obstacleX, obstacleY] = freeCell
      addEvent({
        name: `set obstacle ${type === 'fix' ? 'fix' : 'moving ' + type}`,
        value: `${obstacleX} : ${obstacleY} ${type !== 'fix' ? 'step ' : ''}${
          type === 'x'
            ? X.getObstaclesStepX()[index]
            : type === 'y'
            ? Y.getObstaclesStepY()[index]
            : ''
        }`,
      })
      booking.push([obstacleX, obstacleY])
      obstacles.push([obstacleX, obstacleY])
    }

    if (type === 'x') X.setObstaclesXCoord(obstacles)
    if (type === 'y') Y.setObstaclesYCoord(obstacles)
    if (type === 'fix') FIX.setObstaclesFixCoord(obstacles)
  }
}

export default setObstacleEvent
