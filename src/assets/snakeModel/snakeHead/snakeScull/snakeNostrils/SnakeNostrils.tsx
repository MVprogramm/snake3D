import { snakeCONFIG } from '../../../../../config/snakeConfig'
import SnakeNostrilsGeometry from './SnakeNostrilsGeometry'

function SnakeNostrils() {
  return (
    <mesh castShadow>
      <SnakeNostrilsGeometry />
      <meshStandardMaterial
        color={snakeCONFIG.snakeSecondCOLOR}
        opacity={snakeCONFIG.snakeOPACITY}
        transparent
      />
    </mesh>
  )
}

export default SnakeNostrils
