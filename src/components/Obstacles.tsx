import { getObstacles } from '../engine/obstacles/obstaclesPerLevel'
import React, { useRef } from 'react'
import * as THREE from 'three'
import { getObstaclesStepX, getObstaclesXCoord } from '../engine/obstacles/obstaclesX'
import { getObstaclesStepY, getObstaclesYCoord } from '../engine/obstacles/obstaclesY'
import { getAllObstacles } from '../engine/obstacles/getAllObstacles'
import { useFrame } from '@react-three/fiber'

const Obstacles: React.FC = () => {
  let { type, xCoord, xStep, yCoord, yStep, fixCoord } = getAllObstacles()
  // контейнер рефов, обеспечивающий стабильность ссылок между рендерами
  const obstaclesRefs = useRef<Record<string, React.RefObject<THREE.Group>>>({})

  type.forEach((obs, i) => {
    const key = `${obs}-${i}`
    if (!obstaclesRefs.current[key]) {
      // React.createRef безопасно вызывать условно; важно, что мы
      // НЕ вызываем хуки внутри цикла
      obstaclesRefs.current[key] = React.createRef<THREE.Group>()
    }
  })

  useFrame(() => {
    ;({ type, xCoord, xStep, yCoord, yStep, fixCoord } = getAllObstacles())
  })
  console.log(xCoord)

  return <></>
}
export default Obstacles
