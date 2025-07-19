import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { Field } from './Field'
import { Environment } from './Environment'
import Snake from './Snake'
import Apple from './Apple'
import { useFrame, useThree } from '@react-three/fiber'
import { cameraCONFIG } from '../config/cameraConfig'
import { getTimerStep } from '../engine/time/timerStepPerLevel'
import { getCounterHead } from '../animations/snakeAnimation/headAnimations/snakeHeadLocation'
import { SystemConfig } from '../config/systemConfig'
import { getSnakeUnitPosition } from '../animations/snakeAnimation/bodyAnimations/snakeBodyProps'

let moveSpeed = 1

export function Scene() {
  // const { performance } = useControls('Monitoring', {
  //   performance: true,
  // })

  const { camera } = useThree()
  const [x, y, z] = cameraCONFIG.position
  const [xx, yy, zz] = cameraCONFIG.rotation

  camera.rotation.set(xx, yy, zz)
  // const [counterHeadX, counterHeadY] = getCounterHead()
  // if (counterHeadX === 0 && counterHeadY === 0) moveSpeed = getTimerStep()

  useFrame(() => {
    camera.position.set(
      x + getSnakeUnitPosition()[0][0],
      y + getSnakeUnitPosition()[0][1],
      z
    )
    camera.updateProjectionMatrix()
  })

  return (
    <>
      {/* performance && <Perf position='top-left' /> */}

      <Snake />
      <Apple />
      <Field />
      <Environment />
    </>
  )
}
