import { useEffect, useState } from 'react'
import {
  getTrainingSpeed,
  isTrainingMode,
  setTrainingSpeed,
} from '../engine/training/trainingMode'
import '../styles/trainingPanel.css'

const SPEEDS = [1, 2, 3, 4, 5]

function updateTrainingSpeedUrl(speed: number): void {
  const url = new URL(window.location.href)
  url.searchParams.set('mode', 'training')
  url.searchParams.set('speed', String(speed))
  window.history.replaceState(null, '', url)
}

function TrainingPanel() {
  const [speed, setSpeed] = useState(getTrainingSpeed())

  useEffect(() => {
    if (!isTrainingMode()) return

    const intervalId = window.setInterval(() => {
      setSpeed(getTrainingSpeed())
    }, 100)

    return () => window.clearInterval(intervalId)
  }, [])

  if (!isTrainingMode()) return null

  function selectSpeed(nextSpeed: number): void {
    setTrainingSpeed(nextSpeed)
    setSpeed(nextSpeed)
    updateTrainingSpeedUrl(nextSpeed)
  }

  return (
    <div className='training-panel'>
      <span className='training-panel-title'>Training</span>
      <div className='training-speed-group' aria-label='Training snake speed'>
        {SPEEDS.map((item) => (
          <button
            key={item}
            className={
              item === speed
                ? 'training-speed-button training-speed-button-active'
                : 'training-speed-button'
            }
            type='button'
            onClick={() => selectSpeed(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TrainingPanel
