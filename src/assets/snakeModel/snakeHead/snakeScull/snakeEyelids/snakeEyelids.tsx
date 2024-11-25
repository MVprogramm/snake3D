import SnakeEyelidsGeometry from './SnakeEyelidsGeometry'
import { snakeCONFIG } from '../../../../../config/snakeConfig'
function SnakeEyelids() {
  return (
    <mesh>
      <SnakeEyelidsGeometry />
      <meshStandardMaterial
        color={snakeCONFIG.snakeSecondCOLOR}
        opacity={snakeCONFIG.snakeOPACITY}
        transparent
      />
    </mesh>
  )
}

export default SnakeEyelids
