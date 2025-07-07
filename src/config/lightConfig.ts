import { lightConfig } from '../types/lightTypes'

export const lightCONFIG: lightConfig = {
  sun: {
    position: [-2, 2, 3],
    intensity: 1.5,
  },
  ambientLight: {
    intensity: 0.2,
  },
  directionalLight: {
    shadowMapSize: [1024, 1024],
    castShadow: true,
    shadowCameraNear: 0.1,
    shadowCameraFar: 20,
    shadowCameraLeft: -20,
    shadowCameraRight: 20,
    shadowCameraTop: 20,
    shadowCameraBottom: -20,
  },
}
