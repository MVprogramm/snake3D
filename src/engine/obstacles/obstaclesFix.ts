/**
 * @module obstaclesFix.ts Управляет неподвижными препятствиями
 *    @var obstaclesFix Массив строк "fix" для каждого препятствия
 *    @var obstaclesFixCoord Массив координат [x, y] для каждого препятствия
 *    @function setObstaclesFix Задает массив строк
 *    @function setObstaclesFixCoord Задает массив координат
 *    @function getObstaclesFix Возвращает массив строк
 *    @function getObstaclesFixCoord Возвращает массив координат
 */
import { getObstacles } from './obstaclesPerLevel'
import { Coordinate } from '../../types/obstacleTypes'
/**
 * @var массив ключевых слов 'fix' для каждого препятствия, которое не движется
 */
let obstaclesFix: string[] = []
/**
 * @var массив координат [x, y] для каждого препятствия, которое не движется
 */
let obstaclesFixCoord: Coordinate = [0, 0]
/**
 * Выделяет из массива всех препятствий массив препятствий, которые не движутся
 */
export function setObstaclesFix(): void {
  obstaclesFix = getObstacles().filter((obstacle) => obstacle.substring(0, 3) === 'fix')
}
/**
 * Заносит массив координат [x, y] препятствий в obstaclesFixCoord
 * @param obstacles массив координат [x, y] препятствий
 */
export function setObstaclesFixCoord(obstacles: Coordinate): void {
  obstaclesFixCoord = [...obstacles]
}
/**
 * Возвращает массив ключевых слов 'fix' для препятствий, которые не движутся
 */
export function getObstaclesFix(): string[] {
  return obstaclesFix
}
/**
 * Возвращает массив координат [x, y] препятствий, которые не движутся
 */
export function getObstaclesFixCoord(): Coordinate {
  return obstaclesFixCoord
}
