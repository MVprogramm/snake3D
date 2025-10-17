import { allObstaclesData } from '../../types/obstacleTypes'
import { getObstacles } from './obstaclesPerLevel'
import { getObstaclesStepX, getObstaclesXCoord } from './obstaclesX'
import { getObstaclesStepY, getObstaclesYCoord } from './obstaclesY'

export const getAllObstacles = (): allObstaclesData => {
  const obstacles = getObstacles()
  const obstaclesXCoord = getObstaclesXCoord()
  const obstaclesYCoord = getObstaclesYCoord()
  const obstaclesStepX = getObstaclesStepX()
  const obstaclesStepY = getObstaclesStepY()
  return {
    type: obstacles,
    xCoord: obstaclesXCoord,
    xStep: obstaclesStepX,
    yCoord: obstaclesYCoord,
    yStep: obstaclesStepY,
    fixCoord: [],
  }
}
