import { SnakeHeadCoord } from '../../types/snakeTypes'

const MAX_QUEUED_DIRECTIONS = 2

let pendingSnakeHead: SnakeHeadCoord | null = null
let queuedSnakeDirections: [number, number][] = []

export function setPendingSnakeHead(head: SnakeHeadCoord): void {
  pendingSnakeHead = { ...head }
}

export function hasPendingSnakeHead(): boolean {
  return pendingSnakeHead !== null
}

export function hasQueuedSnakeDirection(): boolean {
  return queuedSnakeDirections.length > 0
}

export function hasSnakeDirectionQueueCapacity(): boolean {
  return queuedSnakeDirections.length < MAX_QUEUED_DIRECTIONS
}

export function consumePendingSnakeHead(): SnakeHeadCoord | null {
  if (!pendingSnakeHead) return null

  const head = { ...pendingSnakeHead }
  pendingSnakeHead = null
  return head
}

export function queueSnakeDirection(direction: [number, number]): void {
  if (!hasSnakeDirectionQueueCapacity()) return

  queuedSnakeDirections.push([...direction])
}

export function consumeQueuedSnakeDirection(): [number, number] | null {
  const queuedDirection = queuedSnakeDirections.shift()
  if (!queuedDirection) return null

  return [queuedDirection[0], queuedDirection[1]]
}

export function clearPendingSnakeHead(): void {
  pendingSnakeHead = null
  queuedSnakeDirections = []
}
