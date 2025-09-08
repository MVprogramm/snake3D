import * as React from 'react'
import { Object3D } from 'three'
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
import { getDistanceFromSnakeToFood } from '../engine/events/snakeMovesTowardsFood'

const COUNTER_RESET_VALUE = 1000000 // Предотвращает переполнение счетчика
const DEBUG_MODE = false
const FORCE_SPINNER = false
const FORCE_LOAD_ERROR = false
const FORCE_ERROR = false

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
  useShadowSetup(gltf?.scene)
  const counterRef = React.useRef<Object3D | null>(null)
  const [eaten, setEaten] = React.useState(false)
  const opacityRef = React.useRef(1)
  let scaleArray = React.useMemo(() => [scale, scale, scale] as const, [scale])

  useFrame((_, delta) => {
    try {
      // counterRef.current = (counterRef.current + 1) % COUNTER_RESET_VALUE
      // if (counterRef.current % FRAME_SKIP !== 0) return
      updatePosition()
      if (!eaten && getDistanceFromSnakeToFood() === 1) {
        setEaten(true)
      }

      if (eaten && counterRef.current) {
        opacityRef.current = Math.max(0, opacityRef.current - delta) // плавно уменьшаем
        counterRef.current.traverse((child: any) => {
          if (child.isMesh && child.material) {
            child.material.opacity = opacityRef.current
          }
        })
      }
    } catch (error) {
      console.error('Ошибка обновления позиции яблока:', error)
      setLoadError(error as Error)
    }
  })

  React.useEffect(() => {
    gltf.scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true
        child.material.opacity = 1
      }
    })
  }, [gltf])

  React.useEffect(() => {
    return () => useGLTF.clear('/apple.glb')
  }, [])

  // 🟥 Если произошла реальная ошибка — показываем её
  if (loadError) {
    return <ErrorScreen message={loadError.message} />
  }

  // ⏳ Показываем спиннер
  if (!gltf?.scene || (DEBUG_MODE && FORCE_SPINNER)) return <Spinner />
  if (!gltf?.scene) return <Spinner />

  return <primitive object={gltf.scene} position={debouncedPosition} scale={scaleArray} />
}

useGLTF.preload('/apple.glb')

export default React.memo(Apple)
