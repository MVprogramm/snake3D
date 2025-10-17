import { Vector2 } from 'three'
import { hedgehogProps } from '../../types/obstacleTypes'

function Hedgehog(props: hedgehogProps) {
  const { direction, index, line } = props
  const frontPoints = []
  for (let i = 0; i < 10; i++) {
    frontPoints.push(new Vector2((Math.sin(i * 0.2) * 8 + 8) / 25, (i + 6) / 15))
  }

  // const backPoints = []
  // for (let i = 0; i < 10; i++) {
  //   backPoints.push(new Vector2((Math.sin(i * 0.2) * 8 + 8) / 25, (i * 0.9 - 21) / 15))
  // }
  const backPoints = []

  // Полукруглая заглушка (3 точки)
  const r = (Math.sin(0 * 0.2) * 8 + 8) / 65
  const y0 = (0 * 0.9 - 21) / 15
  backPoints.push(new Vector2(r, y0)) // край
  backPoints.push(new Vector2(r * 0.7, y0 - r * 0.3)) // середина дуги
  backPoints.push(new Vector2(0, y0 - r)) // центр (закрывает дырку)

  // Основные точки
  for (let i = 0; i < 10; i++) {
    backPoints.push(new Vector2((Math.sin(i * 0.2) * 8 + 8) / 25, (i * 0.9 - 21) / 15))
  }

  return (
    <group
      position={[
        line === 'X' ? direction[index] : 0,
        line === 'Y' ? direction[index] : 0,
        0.1,
      ]}
    >
      <mesh
        position={[
          line === 'Y' ? 0 : -0.2 * direction[index],
          line === 'Y' ? -0.2 * direction[index] : 0,
          0,
        ]}
        rotation={[
          0,
          0,
          line === 'X' ? direction[index] * -1.57 : ((direction[index] - 1) / 2) * 3.14,
        ]}
      >
        <coneGeometry args={[0.4, 0.5, 3, 1, false, 4.7, 3.14]} />
        <meshStandardMaterial color='#A18E74' />
      </mesh>
      <mesh
        rotation={[
          0,
          0,
          line === 'Y' ? direction[index] * 1.57 + 1.57 : direction[index] * 1.57,
        ]}
      >
        <latheGeometry args={[frontPoints, 12, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={'#5B586A'} />
      </mesh>
      <mesh
        position={[0, 0, 0]}
        rotation={[
          0,
          0,
          line === 'Y' ? direction[index] * 1.57 - 1.57 : direction[index] * -1.57,
        ]}
      >
        <latheGeometry args={[backPoints, 12, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={'#5B586A'} />
      </mesh>

      <mesh
        position={[
          line === 'X' ? direction[index] * -0.03 : 0,
          line === 'Y' ? direction[index] * -0.03 : 0,
          0.05,
        ]}
      >
        <sphereGeometry args={[0.1, 5]} />
        <meshStandardMaterial color={'#5B586A'} />
      </mesh>
      <mesh
        position={
          line === 'Y'
            ? [direction[index] * 0.2, direction[index] * -0.3, 0.2]
            : [direction[index] * -0.3, -0.2, 0.2]
        }
      >
        <sphereGeometry args={[0.1, 5]} />
        <meshStandardMaterial color={'#5B586A'} />
      </mesh>
      <mesh
        position={
          line === 'Y'
            ? [direction[index] * -0.2, direction[index] * -0.3, 0.2]
            : [direction[index] * -0.3, 0.2, 0.2]
        }
      >
        <sphereGeometry args={[0.1, 5]} />
        <meshStandardMaterial color={'#5B586A'} />
      </mesh>
    </group>
  )
}

export default Hedgehog
