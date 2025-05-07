import { RefObject, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import SnakeHead from '../assets/snakeModel/snakeHead/SnakeHead'
import SnakeTail from '../assets/snakeModel/snakeTail/snakeTail'
import React from 'react'
import { snakeAnimation } from '../animations/snakeAnimation/snakeAnimation'
import { getCounterHead } from '../animations/snakeAnimation/headAnimations/snakeHeadLocation'
import { getSnakeBodyCoord, getSnakeHeadParams } from '../engine/snake/snake'
import SnakeBodyUnit from '../assets/snakeModel/snakeBody/snakeBodyUnit'
import { getAmountOfFood } from '../engine/food/amountOfFoodPerLevel'
import checkTimerStep from '../engine/time/checkTimerStep'
import {
  getSnakeUnitPosition,
  getSnakeUnitRotation,
  setSnakeUnitPosition,
  setSnakeUnitRotation,
} from '../animations/snakeAnimation/bodyAnimations/snakeBodyProps'
import { getDiff, setDiff } from '../animations/snakeAnimation/bodyAnimations/snakeDiff'
import { getProtocol } from '../engine/protocol/protocol'
import { getCurrentFoodNumber } from '../engine/food/currentFoodNumber'

/**
 * Компонент Snake рендерит 3D-модель змеи, состоящую из головы, тела и хвоста.
 */
const Snake = () => {
  const snakeMaxLength = getAmountOfFood() + 2

  const [snakeCurrentLength, setSnakeCurrentLength] = useState(3)
  // const snakeSeparate = Array(getAmountOfFood() + 2).fill(1)
  let snake = Array(getAmountOfFood() + 2).fill(1)
  const [snakeSeparate, setSnakeSeparate] = useState(Array(getAmountOfFood() + 2).fill(1))
  const snakeRefs: { [key: string]: RefObject<THREE.Group> } = {}
  let tempKey: string
  for (let i = 0; i <= snakeMaxLength - 1; i++) {
    tempKey = `bodyUnitRef_${i}`
    if (i === 0) tempKey = 'headRef'
    if (i === snakeMaxLength - 1) tempKey = 'tailRef'
    snakeRefs[tempKey] = useRef<THREE.Group>(null)
  }
  // console.log(getSnakeUnitPosition().length, getSnakeBodyCoord().length)

  if (getSnakeUnitPosition().length < getSnakeBodyCoord().length) {
    const tempUnitPosition = [...getSnakeUnitPosition()]
    console.log(tempUnitPosition)
    for (let i = 0; i < snakeCurrentLength; i++) setDiff({ diffX: 0, diffY: 0 }, 3 + i)
    tempUnitPosition.push([0, -3 - snakeCurrentLength - 1, 0])
    setSnakeUnitPosition(tempUnitPosition)
    const tempUnitRotation = [...getSnakeUnitRotation()]
    for (let i = 0; i < snakeCurrentLength; i++) tempUnitRotation.push([0, 0, 0])
    setSnakeUnitRotation(tempUnitRotation)
  }

  useFrame((state, delta) => {
    snakeAnimation(delta)

    //**********КОНТРОЛЬ************************
    const [counterHeadX, counterHeadY] = getCounterHead()
    // const isSnakeMoving =
    //   getSnakeHeadParams().snakeHeadStepX !== 0 ||
    //   getSnakeHeadParams().snakeHeadStepY !== 0
    // const zRotation = Math.sin(state.clock.elapsedTime * -2) * 0.2
    if (counterHeadX === 0 && counterHeadY === 0) {
      if (
        getSnakeHeadParams().snakeHeadStepX !== 0 ||
        getSnakeHeadParams().snakeHeadStepY !== 0
      ) {
        console.log(snakeRefs)
        // console.log(
        //   getProtocol()[getProtocol().length - 1],
        //   getProtocol()[getProtocol().length - 2]
        // )
        // console.log(
        //   'координаты движка: ',
        //   getSnakeHeadParams().snakeHeadStepX,
        //   getSnakeHeadParams().snakeHeadStepY,
        //   getSnakeBodyCoord()[0],
        //   getSnakeBodyCoord()[1],
        //   getSnakeBodyCoord()[2]
        // )
        // console.log('смещения 3D координат: ', getDiff()[0], getDiff()[1], getDiff()[2])
        // getSnakeUnitPosition().forEach((unit, index) => console.log(index, unit))
      }
    }
    const updatedSnake = snake.map((_, index) => {
      if (index > getSnakeBodyCoord().length - 3) return 0
      return 1
    })

    setSnakeSeparate(updatedSnake)
    if (snakeCurrentLength < getSnakeBodyCoord().length) {
      setSnakeCurrentLength(getSnakeBodyCoord().length)
    }

    // if (
    //   getSnakeHeadParams().snakeHeadStepX !== 0 ||
    //   getSnakeHeadParams().snakeHeadStepY !== 0
    // ) {
    //snake.forEach((_, index) => {
    for (const key in snakeRefs) {
      if (snakeRefs.hasOwnProperty(key)) {
        if (key === 'headRef') {
          snakeRefs['headRef'].current?.position.set(
            getSnakeUnitPosition()[0][0],
            getSnakeUnitPosition()[0][1],
            getSnakeUnitPosition()[0][2]
          )
          snakeRefs['headRef'].current?.rotation.set(0, 0, getSnakeUnitRotation()[0][2])
        }
        if (key === 'tailRef') {
          snakeRefs['tailRef'].current?.position.set(
            getSnakeUnitPosition()[getSnakeUnitPosition().length - 2][0],
            getSnakeUnitPosition()[getSnakeUnitPosition().length - 2][1],
            getSnakeUnitPosition()[getSnakeUnitPosition().length - 2][2]
          )
          snakeRefs['tailRef'].current?.rotation.set(0, 0, getSnakeUnitRotation()[0][2])
        }
      }
    }
    // for (let i = 0; i < snakeLength; i++) {
    //   if (i === 0) {
    //     headRef.current!.position.set(
    //       getSnakeUnitPosition()[0][0],
    //       getSnakeUnitPosition()[0][1],
    //       getSnakeUnitPosition()[0][2]
    //     )
    //     headRef.current!.rotation.z = getSnakeUnitRotation()[0][2]
    //     headRef.current!.name = 'head'
    //     // headRef.current!.rotation.z = isSnakeMoving ? -zRotation : 0
    //   }
    //   if (i > 0 && i < snakeLength - 1) {
    //     bodyRefs.current[i]!.position.set(
    //       getSnakeUnitPosition()[i][0],
    //       getSnakeUnitPosition()[i][1],
    //       getSnakeUnitPosition()[i][2]
    //     )
    //     bodyRefs.current[i]!.name = `unit_${i}`
    //   }
    //   if (i === snakeLength - 2) {
    //     tailRef.current!.position.set(
    //       getSnakeUnitPosition()[i][0],
    //       getSnakeUnitPosition()[i][1],
    //       getSnakeUnitPosition()[i][2]
    //     )
    //     tailRef.current!.rotation.z = getSnakeUnitRotation()[snakeLength - 2][2]
    //     tailRef.current!.name = 'tail'
    //     // tailRef.current!.rotation.z = isSnakeMoving ? zRotation : 0
    //   }
    // }
    // }
  })

  return (
    <group>
      {snakeSeparate.map((ref, index) => {
        if (index === 0) {
          return (
            <group key={index} ref={snakeRefs['headRef']}>
              <SnakeHead />
            </group>
          )
        } else if (index < snakeMaxLength - 1) {
          return (
            ref === 1 && (
              <group key={index} ref={snakeRefs[`bodyUnitRef_${index}`]}>
                <SnakeBodyUnit />
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
