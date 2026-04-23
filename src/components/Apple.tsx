import * as React from 'react'
import { Material, Object3D } from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { appleCONFIG } from '../config/appleConfig'
import { GLTFResult } from '../types/threeTypes'
import { AppleConfig } from '../types/appleTypes'
import { useDebounce } from '../hooks/useDebounce'
import { useApplePosition } from '../hooks/useApplePosition'
import { useShadowSetup } from '../hooks/useShadowSetup'
import ErrorScreen from './ErrorScreen'
import Spinner from './Spinner'
import { SystemConfig } from '../config/systemConfig'
import { getFoodEaten } from '../engine/events/snakeCatchesFoodEvent'
import { closeSnakeMouthOnly } from '../animations/snakeAnimation/headAnimations/foodEatenAnimation'

const COUNTER_RESET_VALUE = 1000000 // Предотвращает переполнение счетчика
const DEBUG_MODE = false
const FORCE_SPINNER = false
const FORCE_LOAD_ERROR = false
const FORCE_ERROR = false
const SHRINK_OUT_SPEED = 1
const MOUTH_FIT_SCALE_FACTOR = 1
const MOUTH_CLOSE_SCALE_THRESHOLD = 0.5

/**
 * Компонент Apple отображает 3D-модель яблока,
 * получая его позицию на поле из игрового движка.
 */
const Apple: React.FC = () => {
  // 🟥 Если принудительная ошибка активна — сразу рендерим ErrorScreen
  if (DEBUG_MODE && FORCE_ERROR && !FORCE_SPINNER) {
    console.log('Принудительная отладочная ошибка (FORCE_ERROR)')

    return <ErrorScreen message='Принудительная отладочная ошибка (FORCE_ERROR)' />
  }

  const [loadError, setLoadError] = React.useState<Error | null>(null)
  const gltf = useGLTF('/apple.glb', undefined, undefined, (error) => {
    console.error('Ошибка загрузки модели яблока:', error)
    setLoadError(new Error('Не удалось загрузить модель яблока'))
  }) as GLTFResult
  const { zLocation, scale, FRAME_SKIP } = appleCONFIG as AppleConfig
  const { position, updatePosition } = useApplePosition(zLocation)
  const debouncedPosition = useDebounce(position, SystemConfig.DEBOUNCE_DELAY)
  const appleScene = React.useMemo(() => {
    const scene = gltf.scene.clone(true)
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((material: Material) => material.clone())
        } else {
          child.material = child.material.clone()
        }
      }
    })

    return scene
  }, [gltf.scene])
  useShadowSetup(appleScene)
  const counterRef = React.useRef<Object3D | null>(null)
  const [eaten, setEaten] = React.useState(false)
  const scaleRef = React.useRef(1)
  const mouthClosedRef = React.useRef(false)
  let scaleArray = React.useMemo(() => [scale, scale, scale] as const, [scale])

  useFrame((_, delta) => {
    try {
      // counterRef.current = (counterRef.current + 1) % COUNTER_RESET_VALUE
      // if (counterRef.current % FRAME_SKIP !== 0) return
      updatePosition()
      if (!eaten && getFoodEaten()) {
        setEaten(true)
      }

      if (eaten && counterRef.current) {
        scaleRef.current = Math.max(
          0,
          scaleRef.current - delta * SHRINK_OUT_SPEED,
        )
        const fittedScale = scale * scaleRef.current * MOUTH_FIT_SCALE_FACTOR
        counterRef.current.scale.set(
          fittedScale,
          fittedScale,
          fittedScale,
        )
        if (
          scaleRef.current <= MOUTH_CLOSE_SCALE_THRESHOLD &&
          !mouthClosedRef.current
        ) {
          closeSnakeMouthOnly()
          mouthClosedRef.current = true
        }
      }
    } catch (error) {
      console.error('Ошибка обновления позиции яблока:', error)
      setLoadError(error as Error)
    }
  })

  React.useEffect(() => {
    setEaten(false)
    scaleRef.current = 1
    mouthClosedRef.current = false
    counterRef.current?.scale.set(scale, scale, scale)
  }, [debouncedPosition, scale])

  React.useEffect(() => {
    return () => useGLTF.clear('/apple.glb')
  }, [])

  // 🟥 Если произошла реальная ошибка — показываем её
  if (loadError) {
    return <ErrorScreen message={loadError.message} />
  }

  // ⏳ Показываем спиннер
  if (!appleScene || (DEBUG_MODE && FORCE_SPINNER)) return <Spinner />
  if (!appleScene) return <Spinner />
  if (!debouncedPosition) return null

  return (
    <primitive
      ref={counterRef}
      object={appleScene}
      position={debouncedPosition}
      scale={scaleArray}
    />
  )
}

useGLTF.preload('/apple.glb')

export default React.memo(Apple)
