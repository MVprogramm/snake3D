import * as React from 'react'
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
const COUNTER_RESET_VALUE = 1000000 // Предотвращает переполнение счетчика
const DEBOUNCE_DELAY = 16 // ~60fps для debouncing позиции
/**
 * Компонент Apple отображает 3D-модель яблока,
 * получая его позицию на поле из игрового движка.
 */
const Apple: React.FC = () => {
  const [loadError, setLoadError] = React.useState<Error | null>(null)
  const gltf = useGLTF('/apple.glb', undefined, undefined, (error) => {
    console.error('Ошибка загрузки модели яблока:', error)
    setLoadError(new Error('Не удалось загрузить модель яблока'))
  }) as GLTFResult
  const { zLocation, scale, FRAME_SKIP } = appleCONFIG as AppleConfig
  const { position, updatePosition } = useApplePosition(zLocation)
  const debouncedPosition = useDebounce(position, DEBOUNCE_DELAY)
  useShadowSetup(gltf?.scene)
  const counterRef = React.useRef<number>(0)
  const scaleArray = React.useMemo(() => [scale, scale, scale] as const, [scale])

  useFrame(() => {
    try {
      counterRef.current = (counterRef.current + 1) % COUNTER_RESET_VALUE
      if (counterRef.current % FRAME_SKIP !== 0) return
      updatePosition()
    } catch (error) {
      console.error('Ошибка обновления позиции яблока:', error)
      setLoadError(error as Error)
    }
  })

  React.useEffect(() => {
    return () => useGLTF.clear('/apple.glb')
  }, [])
  if (loadError) {
    return <ErrorScreen message={loadError.message} />
  }
  if (!gltf?.scene) {
    return <Spinner />
  }
  return <primitive object={gltf.scene} position={debouncedPosition} scale={scaleArray} />
}

useGLTF.preload('/apple.glb')

export default React.memo(Apple)
