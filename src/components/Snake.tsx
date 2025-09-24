import { RefObject, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import SnakeHead from '../assets/snakeModel/snakeHead/SnakeHead'
import SnakeTail from '../assets/snakeModel/snakeTail/snakeTail'
import React from 'react'
import { snakeAnimation } from '../animations/snakeAnimation/snakeAnimation'
import { getSnakeBodyCoord } from '../engine/snake/snake'
import SnakeBodyUnit from '../assets/snakeModel/snakeBody/snakeBodyUnit'
import { getAmountOfFood } from '../engine/food/amountOfFoodPerLevel'
import * as U from '../animations/snakeAnimation/bodyAnimations/snakeBodyProps'
import SnakeJaw from '../assets/snakeModel/snakeHead/snakeJaw/SnakeJaw'

/**
 * Компонент Snake рендерит 3D-модель змеи, состоящую из головы, тела и хвоста.
 */
const Snake = () => {
  const snakeMaxLength = getAmountOfFood() + 1
  const [snakeCurrentLength, setSnakeCurrentLength] = useState(3)
  let snake = Array(getAmountOfFood() + 1).fill(1)
  const [snakeSeparate, setSnakeSeparate] = useState(Array(getAmountOfFood() + 1).fill(1))
  const snakeRefs: { [key: string]: RefObject<THREE.Group> } = {}
  let tempKey: string
  for (let i = 0; i <= snakeMaxLength - 1; i++) {
    tempKey = `bodyUnitRef_${i}`
    if (i === 0) tempKey = 'headRef'
    if (i === snakeMaxLength - 1) tempKey = 'tailRef'
    snakeRefs[tempKey] = useRef<THREE.Group>(null)
  }
  useFrame((_, delta) => {
    snakeAnimation(delta)
    const updatedSnake = snake.map((_, index) => {
      if (index > getSnakeBodyCoord().length - 3) return 0
      return 1
    })

    setSnakeSeparate(updatedSnake)
    if (snakeCurrentLength < getSnakeBodyCoord().length) {
      setSnakeCurrentLength(getSnakeBodyCoord().length)
    }
    for (const key in snakeRefs) {
      if (snakeRefs.hasOwnProperty(key)) {
        if (key === 'headRef') {
          snakeRefs['headRef'].current?.position.set(
            U.getSnakeUnitPosition()[0][0],
            U.getSnakeUnitPosition()[0][1],
            U.getSnakeUnitPosition()[0][2]
          )

          snakeRefs['headRef'].current?.rotation.set(0, 0, U.getSnakeUnitRotation()[0][2])
        }
        const index = +key[key.length - 1]
        if (key === 'tailRef') {
          snakeRefs['tailRef'].current?.position.set(
            U.getSnakeUnitPosition()[snakeCurrentLength - 2][0],
            U.getSnakeUnitPosition()[snakeCurrentLength - 2][1],
            U.getSnakeUnitPosition()[snakeCurrentLength - 2][2]
          )
          snakeRefs['tailRef'].current?.rotation.set(
            0,
            0,
            U.getSnakeUnitRotation()[snakeCurrentLength - 2][2]
          )
          snakeRefs['tailRef'].current?.scale.set(
            0.65 + 0.35 * (1 - (snakeCurrentLength - 2) / getSnakeBodyCoord().length),
            0.65 + 0.35 * (1 - (snakeCurrentLength - 2) / getSnakeBodyCoord().length),
            0.65 + 0.35 * (1 - (snakeCurrentLength - 2) / getSnakeBodyCoord().length)
          )
        }

        if (key.includes('bodyUnitRef_')) {
          if (index < snakeCurrentLength - 2) {
            snakeRefs[`bodyUnitRef_${index}`].current?.position.set(
              U.getSnakeUnitPosition()[index][0],
              U.getSnakeUnitPosition()[index][1],
              U.getSnakeUnitPosition()[index][2]
            )
            snakeRefs[`bodyUnitRef_${index}`].current?.rotation.set(
              0,
              0,
              U.getSnakeUnitRotation()[index][2]
            )
            snakeRefs[`bodyUnitRef_${index}`].current?.scale.set(
              0.65 +
                (0.35 * (getSnakeBodyCoord().length - index)) /
                  getSnakeBodyCoord().length,
              0.65 +
                (0.35 * (getSnakeBodyCoord().length - index)) /
                  getSnakeBodyCoord().length,
              0.65 +
                (0.35 * (getSnakeBodyCoord().length - index)) / getSnakeBodyCoord().length
            )
          }
        }
      }
    }
  })

  return (
    <group>
      {snakeSeparate.map((ref, index) => {
        if (index === 0) {
          return (
            <group key={index} ref={snakeRefs['headRef']}>
              <SnakeHead />
              <SnakeJaw />
            </group>
          )
        } else if (index < snakeMaxLength - 1) {
          return (
            ref === 1 && (
              <group key={index} ref={snakeRefs[`bodyUnitRef_${index}`]}>
                <SnakeBodyUnit
                  right={-(index % 2) * 1.57}
                  left={3.14 - (index % 2) * 1.57}
                />
              </group>
            )
          )
        } else if (index === snakeMaxLength - 1) {
          return (
            <group key={index} ref={snakeRefs['tailRef']}>
              <SnakeTail />
            </group>
          )
        } else {
          return null
        }
      })}
    </group>
  )
}

export default React.memo(Snake)
