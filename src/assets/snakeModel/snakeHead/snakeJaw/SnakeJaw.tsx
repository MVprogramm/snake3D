import { snakeCONFIG } from '../../../../config/snakeConfig/snakeCONFIG'
import SnakeJawGeometry from './SnakeJawGeometry'
import { getSnakeJawProps } from '../../../../animations/snakeAnimation/headAnimations/snakeFoodEaten'
function SnakeJaw() {
  const jawProps = { ...getSnakeJawProps() }
  return (
    <mesh {...jawProps} receiveShadow castShadow>
      <SnakeJawGeometry />
      <meshStandardMaterial
        color={snakeCONFIG.colors.snakeSecondCOLOR}
        opacity={snakeCONFIG.opacity}
        transparent
      />
    </mesh>
  )
}

export default SnakeJaw
