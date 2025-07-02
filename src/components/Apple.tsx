import * as React from 'react'
import { useGLTF } from '@react-three/drei' // хук для загрузки 3D-модели
import { getField } from '../engine/field/fieldPerLevel' // получаем размер игрового поля
import { useFrame } from '@react-three/fiber'
import { getFoodCoord } from '../engine/food/food' // координаты текущего яблока

/**
 * Компонент Apple отображает 3D-модель яблока,
 * получая его позицию на поле из игрового движка.
 */
const Apple: React.FC = () => {
  const { scene } = useGLTF('/apple.glb') // загружаем сцену с 3D-моделью яблока
  const fieldSize = getField() // актуальный размер игрового поля
  const halfField = React.useMemo(() => fieldSize / 2 + 1, [fieldSize])
  const [foodPosition, setFoodPosition] = React.useState<[number, number, number]>([
    0, 0, 0.5,
  ])

  useFrame(() => {
    const updatedPosition = getFoodCoord()
    const adjustedX = Math.round(updatedPosition[0] - halfField)
    const adjustedY = Math.round(updatedPosition[1] - halfField)
    const adjustedPosition: [number, number, number] = [adjustedX, adjustedY, 0.5]
    setFoodPosition((prev) =>
      prev[0] !== adjustedPosition[0] || prev[1] !== adjustedPosition[1]
        ? adjustedPosition
        : prev
    )
  })

  React.useEffect(() => {
    scene.traverse((node) => {
      if ('isMesh' in node) {
        node.castShadow = true
      }
    })
  }, [scene])

  return <primitive object={scene} position={foodPosition} scale={0.3} />
}

export default Apple
