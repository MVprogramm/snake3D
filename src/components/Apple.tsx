import * as React from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { appleCONFIG } from '../config/appleConfig'
import { GLTFResult, Position3D } from '../types/threeTypes'
import { AppleConfig } from '../types/appleTypes'
import { useDebounce } from '../hooks/useDebounce'
import { useApplePosition } from '../hooks/useApplePosition'
import { useShadowSetup } from '../hooks/useShadowSetup'
import ErrorScreen from './ErrorScreen'

// Константы с пояснениями
const COUNTER_RESET_VALUE = 1000000 // Предотвращает переполнение счетчика при длительной работе
const DEBOUNCE_DELAY = 16 // ~60fps для debouncing позиции

/**
 * Компонент Apple отображает 3D-модель яблока,
 * получая его позицию на поле из игрового движка.
 */
const Apple: React.FC = () => {
  // Состояние для обработки ошибок загрузки
  const [loadError, setLoadError] = React.useState<Error | null>(null)

  // Загрузка 3D-модели с обработкой ошибок
  const gltf = useGLTF('/apple.glb', undefined, undefined, (error) => {
    console.error('Ошибка загрузки модели яблока:', error)
    setLoadError(new Error('Не удалось загрузить модель яблока'))
  }) as GLTFResult

  // Конфигурация яблока
  const { zLocation, scale, FRAME_SKIP } = appleCONFIG as AppleConfig

  // Кастомные хуки для разделения логики
  const { position, updatePosition } = useApplePosition(zLocation)
  const debouncedPosition = useDebounce(position, DEBOUNCE_DELAY)

  // Настройка теней через кастомный хук
  useShadowSetup(gltf?.scene)

  // Счетчик для пропуска кадров
  const counterRef = React.useRef<number>(0)

  // Мемоизированный массив scale
  const scaleArray = React.useMemo(() => [scale, scale, scale] as const, [scale])

  // Основной цикл обновления позиции
  useFrame(() => {
    try {
      // Инкрементируем счетчик с периодическим сбросом
      counterRef.current = (counterRef.current + 1) % COUNTER_RESET_VALUE

      // Пропускаем кадры для оптимизации производительности
      if (counterRef.current % FRAME_SKIP !== 0) return

      // Обновляем позицию через кастомный хук
      updatePosition()
    } catch (error) {
      console.error('Ошибка обновления позиции яблока:', error)
      setLoadError(error as Error)
    }
  })

  // Очистка ресурсов при размонтировании
  React.useEffect(() => {
    return () => useGLTF.clear('/apple.glb')
  }, [])

  // Обработка ошибок и проверка загрузки
  if (loadError) {
    return <ErrorScreen message={loadError.message} />
  }

  if (!gltf?.scene) {
    return <ErrorScreen message='Модель яблока не загружена' />
  }

  return <primitive object={gltf.scene} position={debouncedPosition} scale={scaleArray} />
}

// Предзагрузка модели для лучшей производительности
useGLTF.preload('/apple.glb')

export default React.memo(Apple)
