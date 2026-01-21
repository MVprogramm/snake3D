import { getObstacles } from '../engine/obstacles/obstaclesPerLevel'
import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { getObstaclesStepX, getObstaclesXCoord } from '../engine/obstacles/obstaclesX'
import { getObstaclesStepY, getObstaclesYCoord } from '../engine/obstacles/obstaclesY'
import { getAllObstacles } from '../engine/obstacles/getAllObstacles'
import { useFrame } from '@react-three/fiber'
import Hedgehog from '../assets/hedgehogModel/hedgehog'
import { getField } from '../engine/field/fieldPerLevel'
import { SystemConfig } from '../config/systemConfig'
import { checkTimerWorking } from '../engine/time/isTimer'
import moveObstacles from '../engine/obstacles/moveObstacles'
import { getFoodCoord } from '../engine/food/food'
import { getCurrentHeadState } from '../engine/snake/getCurrentHeadState'
import { getPositionHead } from '../animations/snakeAnimation/headAnimations/snakeHeadProps'
import { getSnakeHeadParams } from '../engine/snake/snake'

let threeCoordX: THREE.Vector3[] = []
let threeCoordY: THREE.Vector3[] = []
let counter = -1
let nextStepX: boolean[] = []
let nextStepY: boolean[] = []
let currentSnakeX = 0
let currentSnakeY = 0
let loggedMatchingY = false

const Obstacles: React.FC = () => {
  const gridSize = getField()
  const foodCoordX = Math.round(getFoodCoord()[0] - gridSize / 2) - 1
  const foodCoordY = Math.round(getFoodCoord()[1] - gridSize / 2) - 1
  const fieldBoundary = Math.round(gridSize / 2) - 1
  const snakeHead = getSnakeHeadParams()
  const currentSnakeStepX = snakeHead.snakeHeadStepX
  const currentSnakeStepY = snakeHead.snakeHeadStepY

  if (counter === 0) {
    const [positionX, positionY] = getPositionHead()
    //currentSnakeX = currentSnakeStepX < 0 ? Math.ceil(positionX) : Math.floor(positionX)
    currentSnakeX = Math.round(snakeHead.snakeHeadCoordX - gridSize / 2) - 1
    currentSnakeY = Math.round(snakeHead.snakeHeadCoordY - gridSize / 2) - 1
    // currentSnakeY = currentSnakeStepY < 0 ? Math.ceil(positionY) : Math.floor(positionY)
    const nextSnakeX =
      snakeHead.snakeHeadStepX !== 0
        ? currentSnakeX + snakeHead.snakeHeadStepX
        : currentSnakeX
    // if (counter === 0)
    //   console.log(
    //     'eng: ',
    //     Math.round(snakeHead.snakeHeadCoordX - gridSize / 2) - 1,
    //     'rnd: ',
    //     currentSnakeX,
    //     'step: ',
    //     currentSnakeStepX
    //   )

    const nextSnakeY =
      snakeHead.snakeHeadStepY !== 0
        ? currentSnakeY + snakeHead.snakeHeadStepY
        : currentSnakeY
  }
  let { xCoord, xStep, yCoord, yStep, fixCoord } = getAllObstacles()

  // локальные состояния шагов для передачи в Hedgehog — будут обновляться в useFrame
  const [xStepState, setXStepState] = useState<number[]>(xStep)
  const [yStepState, setYStepState] = useState<number[]>(yStep)

  // контейнер рефов, обеспечивающий стабильность ссылок между рендерами
  const obstaclesRefs = useRef<Record<string, React.RefObject<THREE.Group>>>({})
  // сохранение последних ненулевых шагов для восстановления после остановки
  const prevXStepRef = useRef<number[]>([])
  const prevYStepRef = useRef<number[]>([])
  // Создаём стабильные рефы по индексам координат для каждого типа препятствий.
  // Ранее рефы формировались по массиву `type`, что могло не совпадать с порядком
  // и количеством координат в xCoord/yCoord, приводя к отсутствию некоторых объектов.
  // Здесь мы явно создаём ключи `x_0..x_n`, `y_0..y_n`, `fix_0..fix_n` на основе
  // размеров массивов координат, чтобы индексы совпадали с индексами данных.
  const xCount = xCoord.length
  for (let i = 0; i < xCount; i++) {
    const key = `x_${i}`
    if (!obstaclesRefs.current[key])
      obstaclesRefs.current[key] = React.createRef<THREE.Group>()
  }

  const yCount = yCoord.length
  for (let i = 0; i < yCount; i++) {
    const key = `y_${i}`
    if (!obstaclesRefs.current[key])
      obstaclesRefs.current[key] = React.createRef<THREE.Group>()
  }

  if (!nextStepX.length) {
    nextStepX = new Array(xCount).fill(true)
  }
  if (!nextStepY.length) {
    nextStepY = new Array(yCount).fill(true)
  }

  const fixCount = fixCoord.length
  for (let i = 0; i < fixCount; i++) {
    const key = `fix_${i}`
    if (!obstaclesRefs.current[key])
      obstaclesRefs.current[key] = React.createRef<THREE.Group>()
  }

  Object.entries(obstaclesRefs.current || {})
    .map(([key]) => {
      const [obsType, indexStr] = key.split('_')
      const index = parseInt(indexStr, 10)
      if (obsType === 'fix') return null
      const directionArray = obsType === 'x' ? xStep : yStep
      const ref = obstaclesRefs.current[key]
      return {
        key,
        ref,
        // Передаём весь массив шагов для линии; внутри Hedgehog используется direction[index]
        element: <Hedgehog direction={directionArray} index={index} line={obsType} />,
      }
    })
    .filter(Boolean) as {
    key: string
    ref: React.RefObject<THREE.Group>
    element: React.ReactElement
  }[]

  useFrame(() => {
    const movedXObstacles = xStep.map((s, i) => {
      if (s === 0) return xStepState[i]
      return s
    })
    const movedYObstacles = yStep.map((s, i) => {
      if (s === 0) return yStepState[i]
      return s
    })

    setXStepState([...movedXObstacles])
    setYStepState([...movedYObstacles])

    if (counter === -1) {
      threeCoordX = xCoord.map(
        (coord) =>
          new THREE.Vector3(
            Math.round(coord[0] - gridSize / 2) - 1,
            Math.round(coord[1] - gridSize / 2) - 1,
            0
          )
      )
      threeCoordY = yCoord.map(
        (coord) =>
          new THREE.Vector3(
            Math.round(coord[0] - gridSize / 2) - 1,
            Math.round(coord[1] - gridSize / 2) - 1,
            0
          )
      )

      counter = 0
    }

    if (checkTimerWorking()) {
      if (counter === 0) {
        ;['x', 'y'].forEach((type) => moveObstacles(type))
      }
    }

    counter += 1 / SystemConfig.FPS

    if (checkTimerWorking()) {
      if (counter >= 1) {
        counter = 0
      }
    }

    // обновляем позиции рефов — делаем это в useFrame, а не во время рендера
    Object.entries(obstaclesRefs.current).forEach(([key, ref]) => {
      const [obsType, indexStr] = key.split('_')
      const index = parseInt(indexStr, 10)
      if (obsType === 'fix') return
      let nextStepX = true
      let nextStepY = true
      const vec: THREE.Vector3 | undefined =
        obsType === 'x' ? threeCoordX[index] : threeCoordY[index]
      // if (counter === 0)
      //   console.log(
      //     'renderX: ',
      //     Math.round(vec.x),
      //     'engineX: ',
      //     Math.round(getObstaclesXCoord()[0][0] - gridSize / 2) - 1
      //   )
      if (!vec) return
      if (checkTimerWorking() /*&& counter !== 0*/) {
        const deltaX = obsType === 'x' ? xStep[index] / (SystemConfig.FPS - 1) : 0
        const deltaY = obsType === 'y' ? yStep[index] / (SystemConfig.FPS - 1) : 0

        const nextX = vec.x + deltaX
        const nextY = vec.y + deltaY

        const currentHedgehogX = xStep[index] > 0 ? Math.ceil(vec.x) : Math.floor(vec.x)
        const currentHedgehogY = yStep[index] > 0 ? Math.ceil(vec.y) : Math.floor(vec.y)
        const nextHedgehogX =
          obsType === 'x' ? currentHedgehogX + xStep[index] : currentHedgehogX
        const nextHedgehogY =
          obsType === 'y' ? currentHedgehogY + yStep[index] : currentHedgehogY
        // if (counter === 0) {
        //   console.log(
        //     'hh: ',
        //     // 'r: ',
        //     // currentHedgehogX,
        //     // vec.x,
        //     'index: ',
        //     index,
        //     'x: ',
        //     Math.round(getObstaclesXCoord()[index][0] - gridSize / 2) - 1
        //     // xStep[index],
        //     // getObstaclesStepX()[0]
        //   )

        // console.log(
        //   'rnd: ',
        //   currentSnakeX,
        //   'eng: ',
        //   Math.round(getSnakeHeadParams().snakeHeadCoordX - gridSize / 2) - 1
        // )
        //}
        // if (counter === 0) {
        // const isSnakeHeadStopDistance =
        //   obsType === 'x'
        //     ? nextHedgehogX === nextSnakeX && nextHedgehogY === nextSnakeY
        //     : nextHedgehogY === nextSnakeY && nextHedgehogX === nextSnakeX
        const isSnakeHeadStopDistance =
          obsType === 'x'
            ? currentHedgehogX === currentSnakeX && currentHedgehogY === currentSnakeY
            : currentHedgehogY === currentSnakeY && currentHedgehogX === currentSnakeX
        const isFoodXStopDistance =
          currentHedgehogY === foodCoordY ? currentHedgehogX !== foodCoordX : true
        const isFoodYStopDistance =
          nextHedgehogX === foodCoordX ? nextHedgehogY !== foodCoordY : true
        // Проверка столкновения с другими ежиками
        let isAnotherHedgehogCollision = false
        Object.entries(obstaclesRefs.current).forEach(([otherKey, otherRef]) => {
          if (otherKey === key) return // пропускаем самого себя

          const [otherType, otherIndexStr] = otherKey.split('_')
          const [type, indexStr] = key.split('_')

          const otherIndex = parseInt(otherIndexStr, 10)
          const index = parseInt(indexStr, 10)
          if (otherType === 'fix') return

          if (type === 'x') {
            // Формируем массив объектов { y, index } для всех элементов threeCoordX,
            // у которых координата y совпадает с текущей (по округлению).
            const currentY = threeCoordX[index]?.y
            const matchingY = threeCoordX
              .map((v, i) => ({ y: v?.y, index: i }))
              .filter(
                (item) =>
                  item.y !== undefined && Math.round(item.y) === Math.round(currentY)
              )
            // matchingY теперь содержит объекты вида { y, index } для совпадающих по y элементов
            if (/*!loggedMatchingY &&*/ matchingY.length > 1) {
              // console.log(currentHedgehogX, currentY)
              loggedMatchingY = true
            }
          }
          // if (type === 'y' && threeCoordY[otherIndex].x === threeCoordY[index].x)
          //   console.log(type, otherType, index, otherIndex)

          const otherVec =
            otherType === 'x' ? threeCoordX[otherIndex] : threeCoordY[otherIndex]
          if (!otherVec) return

          // Проверяем, будет ли столкновение на следующей позиции
          if (
            Math.round(nextX) === Math.round(otherVec.x) &&
            Math.round(nextY) === Math.round(otherVec.y)
          ) {
            isAnotherHedgehogCollision = true
          }
        })

        const isStopDistanceX = nextX >= -fieldBoundary && nextX <= fieldBoundary

        // &&
        // isFoodXStopDistance &&
        // !isAnotherHedgehogCollision
        const isStopDistanceY = nextY >= -fieldBoundary && nextY <= fieldBoundary
        // &&
        // isFoodYStopDistance &&
        // !isAnotherHedgehogCollision

        // nextStepX[index] = isStopDistanceX && !isSnakeHeadStopDistance ? true : false
        // nextStepY[index] = isStopDistanceY && !isSnakeHeadStopDistance ? true : false

        // отключаем шаг по X, если хотя бы одна проверка возвращает false
        // Check snake head distance only when counter === 0
        nextStepX =
          isStopDistanceX &&
          (counter !== 0 || !isSnakeHeadStopDistance) &&
          isFoodXStopDistance &&
          !isAnotherHedgehogCollision
        nextStepY =
          isStopDistanceY &&
          (counter !== 0 || !isSnakeHeadStopDistance) &&
          isFoodYStopDistance &&
          !isAnotherHedgehogCollision
        // } else {
        //   // при залипании на краю поля продолжаем движение внутрь
        //   nextStepX = isStopDistanceX
        //
        // nextStepY = isStopDistanceY
        // }
        // console.log(nextStepX[index], fieldBoundary)
        // if (nextStepX[index]) vec.x = nextX
        // if (nextStepY[index]) vec.y = nextY
        if (nextStepX && counter !== 0) vec.x = nextX
        //

        //   {
        //   console.log('move')

        //   vec.x = nextX
        // } else {
        //   console.log('stop', nextX)

        //   // исправление залипания на краю поля
        //   vec.x = Math.round(getObstaclesXCoord()[0][0] - gridSize / 2) - 1
        // }
        if (nextStepY && counter !== 0) vec.y = nextY
      }

      ref.current?.position.set(vec.x, vec.y, 0)
    })
  })

  return (
    <>
      {Object.entries(obstaclesRefs.current || {}).map(([key, ref]) => {
        const [obsType, indexStr] = key.split('_')
        const index = parseInt(indexStr, 10)
        if (obsType === 'fix') return null
        const directionArray = obsType === 'x' ? xStepState : yStepState

        return (
          <group key={key} ref={ref} scale={[0.65, 0.65, 0.65]}>
            <Hedgehog direction={directionArray} index={index} line={obsType} />
          </group>
        )
      })}
    </>
  )
}
export default Obstacles
