import React, { useMemo } from 'react'
import * as THREE from 'three'

type TreeProps = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  color?: number
  seed?: number
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Tree({ position, rotation, scale, color = 0xa2d109, seed = 1 }: TreeProps) {
  const geometry = useMemo(() => {
    const rnd = mulberry32(seed)

    const geo = new THREE.IcosahedronGeometry(0.3, 0)

    // немного разная исходная форма
    geo.rotateX(rnd() * Math.PI * 2)
    geo.rotateY(rnd() * Math.PI * 2)
    geo.rotateZ((rnd() - 0.5) * 0.5)

    // дерево в стиле three-snake-live:
    // вытягиваем по вертикали Z, потому что у тебя "вверх" это Z
    const sx = 0.8 + rnd() * 0.5
    const sy = 0.8 + rnd() * 0.5
    const sz = 3.5 + rnd() * 3.5

    geo.scale(sx, sy, sz)

    return geo
  }, [seed])

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      flatShading: true,
      emissive: 0x224400,
      emissiveIntensity: 0.2,
    })
  }, [color])

  const finalTransform = useMemo(() => {
    const rnd = mulberry32(seed + 1000)

    const localScale: [number, number, number] = [
      0.7 + rnd() * 0.9,
      0.7 + rnd() * 0.9,
      0.8 + rnd() * 1.6,
    ]

    const localRotation: [number, number, number] = [
      (rnd() - 0.5) * 0.15,
      (rnd() - 0.5) * 0.15,
      rnd() * Math.PI * 2,
    ]

    return {
      s: localScale,
      r: localRotation,
    }
  }, [seed])

  return (
    <mesh
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
      position={position ?? [0, 0, 0.6]}
      rotation={rotation ?? finalTransform.r}
      scale={scale ?? finalTransform.s}
    />
  )
}

export default Tree
