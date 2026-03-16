import React, { useMemo } from 'react'
import * as THREE from 'three'
import { RockProps } from '../../types/obstacleTypes'

// маленький детерминированный random по seed (чтобы камень не менялся при каждом рендере)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Props = RockProps & { seed?: number }

function Rock({ color = 0xacacac, seed = 1, position, rotation, scale }: Props) {
  const geom = useMemo(() => new THREE.IcosahedronGeometry(0.5), [])

  const { s, r, zLift } = useMemo(() => {
    const rnd = mulberry32(seed)

    // как в three-snake-live, только ось "вверх" у тебя это Z (потому что plane лежит в XY)
    const sx = rnd() * 0.5 + 0.5
    const sy = rnd() * 0.5 + 0.5
    const sz = 0.5 + Math.pow(rnd(), 2) * 1.9 // делаем "высоту" по Z

    const yaw = rnd() * Math.PI * 2 // вокруг вертикали Z
    const tilt = rnd() * Math.PI * 0.1 // легкий наклон

    return {
      s: [sx, sy, sz] as [number, number, number],
      r: [tilt, 0, yaw] as [number, number, number],
      zLift: 0.35, // чуть приподнять над полем (подгонишь по вкусу)
    }
  }, [seed])

  return (
    <mesh
      geometry={geom}
      castShadow
      receiveShadow
      position={position ?? [0, 0, zLift]}
      rotation={rotation ?? r}
      scale={scale ?? s}
    >
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  )
}

export default Rock
