import { getObstacles } from '../engine/obstacles/obstaclesPerLevel'
import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { getObstaclesStepX, getObstaclesXCoord } from '../engine/obstacles/obstaclesX'
import { getObstaclesStepY, getObstaclesYCoord } from '../engine/obstacles/obstaclesY'
import { getAllObstacles } from '../engine/obstacles/getAllObstacles'
import { useFrame } from '@react-three/fiber'
import Hedgehog from '../assets/hedgehogModel/hedgehog'
import { getField } from '../engine/field/fieldPerLevel'

const Obstacles: React.FC = () => {
  const gridSize = getField()
  let { type, xCoord, xStep, yCoord, yStep, fixCoord } = getAllObstacles()

  // локальные состояния шагов для передачи в Hedgehog — будут обновляться в useFrame
  const [xStepState, setXStepState] = useState<number[]>(xStep)
  const [yStepState, setYStepState] = useState<number[]>(yStep)

  // контейнер рефов, обеспечивающий стабильность ссылок между рендерами
  const obstaclesRefs = useRef<Record<string, React.RefObject<THREE.Group>>>({})
  // Создаём стабильные рефы по индексам координат для каждого типа препятствий.
  // Ранее рефы формировались по массиву `type`, что могло не совпадать с порядком
  // и количеством координат в xCoord/yCoord, приводя к отсутствию некоторых объектов.
  // Здесь мы явно создаём ключи `x_0..x_n`, `y_0..y_n`, `fix_0..fix_n` на основе
  // размеров массивов координат, чтобы индексы совпадали с индексами данных.
  const xCount = xCoord.length
  for (let i = 0; i < xCount; i++) {
    const key = `x_${i}`
    if (!obstaclesRefs.current[key])
      obstaclesRefs.current[key] = React.createRef<THREE.Group>()
  }

  const yCount = yCoord.length
  for (let i = 0; i < yCount; i++) {
    const key = `y_${i}`
    if (!obstaclesRefs.current[key])
      obstaclesRefs.current[key] = React.createRef<THREE.Group>()
  }

  const fixCount = fixCoord.length
  for (let i = 0; i < fixCount; i++) {
    const key = `fix_${i}`
    if (!obstaclesRefs.current[key])
      obstaclesRefs.current[key] = React.createRef<THREE.Group>()
  }

  Object.entries(obstaclesRefs.current || {})
    .map(([key]) => {
      const [obsType, indexStr] = key.split('_')
      const index = parseInt(indexStr, 10)
      if (obsType === 'fix') return null
      const directionArray = obsType === 'x' ? xStep : yStep
      const ref = obstaclesRefs.current[key]
      return {
        key,
        ref,
        // Передаём весь массив шагов для линии; внутри Hedgehog используется direction[index]
        element: <Hedgehog direction={directionArray} index={index} line={obsType} />,
      }
    })
    .filter(Boolean) as {
    key: string
    ref: React.RefObject<THREE.Group>
    element: React.ReactElement
  }[]

  useFrame((_, delta) => {
    const movedXObstacles = xStep.map((s, i) => {
      if (s === 0) return xStepState[i]
      return s
    })
    const movedYObstacles = yStep.map((s, i) => {
      if (s === 0) return yStepState[i]
      return s
    })

    setXStepState([...movedXObstacles])
    setYStepState([...movedYObstacles])

    const threeCoordX = xCoord.map(
      (coord) =>
        new THREE.Vector3(
          Math.round(coord[0] - gridSize / 2 - 1),
          Math.round(coord[1] - gridSize / 2 - 1),
          0
        )
    )
    const threeCoordY = yCoord.map(
      (coord) =>
        new THREE.Vector3(
          Math.round(coord[0] - gridSize / 2 - 1),
          Math.round(coord[1] - gridSize / 2 - 1),
          0
        )
    )

    // обновляем позиции рефов — делаем это в useFrame, а не во время рендера
    Object.entries(obstaclesRefs.current).forEach(([key, ref]) => {
      const [obsType, indexStr] = key.split('_')
      const index = parseInt(indexStr, 10)
      if (obsType === 'fix') return

      const vec: THREE.Vector3 | undefined =
        obsType === 'x' ? threeCoordX[index] : threeCoordY[index]
      if (!vec) return

      ref.current?.position.set(vec.x, vec.y, 0)
    })
  })

  return (
    <>
      {Object.entries(obstaclesRefs.current || {}).map(([key, ref]) => {
        const [obsType, indexStr] = key.split('_')
        const index = parseInt(indexStr, 10)
        if (obsType === 'fix') return null
        const directionArray = obsType === 'x' ? xStepState : yStepState

        return (
          <group key={key} ref={ref} scale={[0.65, 0.65, 0.65]}>
            <Hedgehog direction={directionArray} index={index} line={obsType} />
          </group>
        )
      })}
    </>
  )
}
export default Obstacles
