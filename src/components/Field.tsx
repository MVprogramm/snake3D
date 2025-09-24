import { useMemo } from 'react'
import { fieldConfig } from '../config/fieldConfig'
import { getField } from '../engine/field/fieldPerLevel'
import { Grid } from './Grid'

export const Field = () => {
  const { position, backgroundColor } = fieldConfig
  const fieldSize = useMemo(() => getField(), [])
  const fieldDimensions = useMemo((): [number, number] => {
    return [fieldSize, fieldSize]
  }, [fieldSize])
  return (
    <group>
      <Grid />
      <mesh position={position} receiveShadow>
        <planeGeometry args={fieldDimensions} />
        <meshStandardMaterial color={backgroundColor} />
      </mesh>
    </group>
  )
}
