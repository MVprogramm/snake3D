import { getField } from '../engine/field/fieldPerLevel'

export function Landscape() {
  const fieldSize = getField()
  const outerSize = fieldSize * 12

  return (
    <mesh position={[0, 0, -0.005]} receiveShadow>
      <planeGeometry args={[outerSize, outerSize]} />
      <meshStandardMaterial color='#56f854' />
    </mesh>
  )
}
