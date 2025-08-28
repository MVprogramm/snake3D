import { snakeCONFIG } from '../../../../config/snakeConfig/snakeCONFIG'
import SnakeTongueGeometry from './SnakeTongueGeometry'
import { getSnakeTongueProps } from '../../../../animations/snakeAnimation/headAnimations/snakeFoodEaten'
import { DoubleSide } from 'three'
function SnakeTongue() {
  const tongueProps = { ...getSnakeTongueProps() }
  return (
    <mesh {...tongueProps} receiveShadow castShadow>
      <SnakeTongueGeometry />
      <meshStandardMaterial
        color={snakeCONFIG.colors.snakeThirdCOLOR}
        side={DoubleSide}
        opacity={snakeCONFIG.opacity}
        transparent
      />
    </mesh>
  )
}

export default SnakeTongue
