import React, { memo } from 'react'
import { useMenuStore, usePauseStore } from '../store/menuStore'
import { swapPause } from '../engine/events/pauseEvent'
import { setTrainingMode, setTrainingSpeed } from '../engine/training/trainingMode'
import AuthPanel from './AuthPanel'
import SessionHistoryPanel from './SessionHistoryPanel'
import '../styles/menu.css'

const Menu: React.FC = () => {
  const { toggleModal, titleMenu } = useMenuStore()
  const { togglePause } = usePauseStore()

  function startClassic() {
    const url = new URL(window.location.href)

    url.searchParams.delete('mode')
    url.searchParams.delete('speed')
    window.history.replaceState(null, '', url)

    setTrainingMode(false)
    toggleModal()
  }

  function startTraining() {
    const url = new URL(window.location.href)

    url.searchParams.set('mode', 'training')
    url.searchParams.set('speed', '5')
    window.history.replaceState(null, '', url)

    setTrainingMode(true)
    setTrainingSpeed(5)
    toggleModal()
  }

  if (titleMenu === 'start') {
    return (
      <div className='menu-game menu-start-screen'>
        <section className='start-panel' aria-label='Стартовая панель'>
          <div className='start-panel-header'>
            <p className='start-panel-kicker'>Snake 3D</p>
            <h1 className='start-panel-title'>Змейка 3D</h1>
          </div>

          <AuthPanel embedded />
          <SessionHistoryPanel />

          <div className='start-panel-actions'>
            <button
              className='start-panel-button start-panel-button-primary'
              type='button'
              onClick={startClassic}
            >
              Играть
            </button>
            <button className='start-panel-button' type='button' onClick={startTraining}>
              Тренировка
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div
      className='menu-game'
      onClick={() => {
        if (titleMenu.indexOf('Game over') !== -1) location.reload()
        else if (titleMenu === 'Pause') {
          togglePause()
          swapPause()
          toggleModal()
        } else toggleModal()
      }}
    >
      <h2>{titleMenu}</h2>
    </div>
  )
}

export default memo(Menu)
