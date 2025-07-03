import * as React from 'react'
import { getField } from '../engine/field/fieldPerLevel'
import { getFoodCoord } from '../engine/food/food'
import { Position2D, Position3D } from '../types/threeTypes'

const ROUNDING_OFFSET = 0.5
const INITIAL_POSITION: Position3D = [0, 0, 0]

/**
 * Хук для управления позицией яблока
 */
export const useApplePosition = (zLocation: number) => {
  const fieldSize = getField()
  const halfField = React.useMemo(() => fieldSize / 2 + 1, [fieldSize])

  // Состояние позиции яблока
  const [position, setPosition] = React.useState<Position3D>([
    ...(INITIAL_POSITION.slice(0, 2) as Position2D),
    zLocation,
  ])

  // Мемоизированная функция битового округления
  const fastRound = React.useCallback(
    (value: number) => (value + ROUNDING_OFFSET) | 0,
    []
  )

  // Мемоизированная функция преобразования координат
  const transformCoordinates = React.useCallback(
    (coord: Position2D): Position3D => [
      fastRound(coord[0] - halfField),
      fastRound(coord[1] - halfField),
      zLocation,
    ],
    [halfField, zLocation, fastRound]
  )

  // Мемоизированная функция проверки изменения позиции
  const positionChanged = React.useCallback(
    (prev: Position3D, next: Position3D): boolean =>
      prev[0] !== next[0] || prev[1] !== next[1],
    []
  )

  // Функция обновления позиции
  const updatePosition = React.useCallback(() => {
    const updatedPosition: Position2D = getFoodCoord()
    const adjustedPosition = transformCoordinates(updatedPosition)

    // Обновляем состояние только при изменении позиции
    setPosition((prev) =>
      positionChanged(prev, adjustedPosition) ? adjustedPosition : prev
    )
  }, [transformCoordinates, positionChanged])

  return { position, updatePosition }
}
