import { useMemo } from 'react'
import { MushroomProps } from '../../types/obstacleTypes'

/**
 * Генерирует позиции белых точек на верхней полусфере шляпки гриба.
 * Координаты локальные — относительно центра шляпки.
 * useMemo гарантирует, что точки создаются один раз и не пересчитываются
 * каждый кадр (это была причина "прыжков" точек).
 */
function createDotPositions(radius: number, count: number): [number, number, number][] {
  const positions: [number, number, number][] = []
  // Спираль Фибоначчи только по верхней полусфере (y от 0 до 1)
  const step = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < count; i++) {
    const y = i / (count - 1) // от 0 до 1, только верхняя полусфера
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = step * i

    const x = Math.cos(theta) * radiusAtY
    const z = Math.sin(theta) * radiusAtY

    positions.push([x * radius, y * radius, z * radius])
  }

  return positions
}

function Mushroom(props: MushroomProps) {
  const { position, rotation = [0, 0, 0], scale } = props

  const sphereRadius = 6
  const dotCount = 20

  // useMemo — точки вычисляются один раз, не пересоздаются на каждый рендер
  const dotPositions = useMemo(
    () => createDotPositions(sphereRadius, dotCount),
    [sphereRadius, dotCount],
  )

  return (
    // scale и rotation передаём напрямую в JSX — useFrame для этого не нужен
    <group
      position={position}
      rotation={[rotation[0] + Math.PI / 2, rotation[1], rotation[2]]} // +45° по X
      scale={scale}
    >
      {/* Ствол */}
      <mesh position={[0, 4, -2]} scale={[0.8, 1.5, 0.8]} receiveShadow castShadow>
        <cylinderGeometry args={[5, 6, 12, 9]} />
        <meshStandardMaterial color={'#f5e642'} />
      </mesh>

      {/* Шляпка + точки в одной группе — точки двигаются вместе со шляпкой */}
      <group position={[0, 14, 0]} scale={[1.2, 0.7, 1.2]}>
        <mesh receiveShadow castShadow>
          <sphereGeometry args={[sphereRadius, 32, 32]} />
          <meshStandardMaterial color={'#cc1a1a'} />
        </mesh>

        {/* Белые точки: координаты локальные, никаких магических офсетов */}
        {dotPositions.map((pos, i) => (
          <mesh key={i} position={pos} receiveShadow castShadow>
            <sphereGeometry args={[0.35, 12, 12]} />
            <meshStandardMaterial color={'white'} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default Mushroom
