/**
 * @module getFreeCell.ts Рандомная генерация свободных ячеек
 *      @function getFreeCell Дает координаты свободной ячейки
 */
import { getField } from './fieldPerLevel'
/**
 * Находит на игровом поле свободную ячейку и возвращает ее координаты
 * @param bookedCells массив занятых ячеек игрового поля
 * @description рандомно генерирует координаты ячейки пока не получит свободную
 * @returns координаты freeCellX и freeCellY свободной ячейки игрового поля или null,
 * если свободных ячеек не осталось
 */
const getFreeCell = (bookedCells: number[][]): number[] | null => {
  const fieldSize = getField()
  const totalCells = fieldSize * fieldSize

  const filteredBookedCells = bookedCells.filter(
    (coord): coord is [number, number] =>
      Array.isArray(coord) &&
      coord.length === 2 &&
      coord.every((value) => typeof value === 'number' && Number.isFinite(value))
  )
  const occupiedCells = new Set(
    filteredBookedCells.map(([cellX, cellY]) => `${cellX}:${cellY}`)
  )

  if (occupiedCells.size >= totalCells) {
    return null
  }

  let freeCellX: number
  let freeCellY: number
  let candidateKey: string

  do {
    freeCellX = Math.floor(Math.random() * fieldSize) + 1
    freeCellY = Math.floor(Math.random() * fieldSize) + 1
    candidateKey = `${freeCellX}:${freeCellY}`
  } while (occupiedCells.has(candidateKey))

  return [freeCellX, freeCellY]
}

export default getFreeCell
