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
  // Фильтруем и валидируем входящие координаты
  const filteredBookedCells = bookedCells.filter(
    (coord): coord is [number, number] =>
      Array.isArray(coord) &&
      coord.length === 2 &&
      coord.every((value) => typeof value === 'number' && Number.isFinite(value)) &&
      coord[0] > 0 &&
      coord[0] <= fieldSize && // проверка границ X (1-based)
      coord[1] > 0 &&
      coord[1] <= fieldSize // проверка границ Y (1-based)
  )
  // Создаем Set для быстрого поиска занятых ячеек
  const occupiedCells = new Set(
    filteredBookedCells.map(([cellX, cellY]) => `${cellX}:${cellY}`)
  )
  // Проверяем, есть ли свободные ячейки
  if (occupiedCells.size >= totalCells) {
    return null
  }
  let freeCellX: number
  let freeCellY: number
  let candidateKey: string
  // Генерируем случайные координаты (1-based)
  do {
    freeCellX = Math.floor(Math.random() * fieldSize) + 1 // 1 до fieldSize
    freeCellY = Math.floor(Math.random() * fieldSize) + 1 // 1 до fieldSize
    candidateKey = `${freeCellX}:${freeCellY}`
  } while (occupiedCells.has(candidateKey))

  return [freeCellX, freeCellY]
}

export default getFreeCell
