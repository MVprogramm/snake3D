import { Vector3 } from '@react-three/fiber'
import { lightCONFIG } from '../config/lightConfig'

/**
 * Компонент направленного света (аналог солнца в 3D-сцене).
 * @param intensity - яркость света
 * @param position - положение источника света в 3D пространстве
 */
export function DirectionalLight({
  intensity = 1,
  position = [0, 10, 0],
}: {
  intensity?: number
  position?: Vector3
}) {
  const lightConfig = lightCONFIG.directionalLight

  return (
    <directionalLight
      position={position}
      intensity={intensity}
      castShadow={lightConfig.castShadow}
      shadow-mapSize={lightConfig.shadowMapSize}
      shadow-camera-near={lightConfig.shadowCameraNear}
      shadow-camera-far={lightConfig.shadowCameraFar}
      shadow-camera-left={lightConfig.shadowCameraLeft}
      shadow-camera-right={lightConfig.shadowCameraRight}
      shadow-camera-top={lightConfig.shadowCameraTop}
      shadow-camera-bottom={lightConfig.shadowCameraBottom}
    />
  )
}
