import { useFrame } from '@react-three/fiber'
import { useState } from 'react'
import { getField } from '../engine/field/fieldPerLevel'
import { getAppleTimeIdealPath } from '../engine/protocol/appleTimeEfficiency'
import { isTrainingMode } from '../engine/training/trainingMode'
import { Coordinate } from '../types/obstacleTypes'

const PATH_COLOR = '#00fff2'
const PATH_CELL_OPACITY = 0.38
const PATH_CELL_SIZE = 0.86
const PATH_CELL_Z = 0.015

function getCellKey([x, y]: Coordinate): string {
  return `${x}:${y}`
}

function toScenePosition([x, y]: Coordinate, fieldSize: number): [number, number, number] {
  return [
    Math.round(x - fieldSize / 2) - 1,
    Math.round(y - fieldSize / 2) - 1,
    PATH_CELL_Z,
  ]
}

function getCellsKey(cells: Coordinate[]): string {
  return cells.map((cell) => getCellKey(cell)).join('|')
}

function ApplePathHighlight() {
  const fieldSize = getField()
  const [path, setPath] = useState<Coordinate[]>([])
  const [pathKey, setPathKey] = useState('')

  useFrame(() => {
    if (!isTrainingMode()) return

    const idealPath = getAppleTimeIdealPath()
    const idealPathKey = getCellsKey(idealPath)

    if (idealPathKey === pathKey) return

    setPathKey(idealPathKey)
    setPath(idealPath)
  })

  if (!isTrainingMode()) return null

  return (
    <group>
      {path.map((cell) => (
        <mesh key={getCellKey(cell)} position={toScenePosition(cell, fieldSize)}>
          <planeGeometry args={[PATH_CELL_SIZE, PATH_CELL_SIZE]} />
          <meshBasicMaterial
            color={PATH_COLOR}
            transparent
            opacity={PATH_CELL_OPACITY}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default ApplePathHighlight
