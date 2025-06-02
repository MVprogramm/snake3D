import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './components/Main'
import setInitialLevelOfGame from './engine/events/setInitialLevelOfGame'
// import { disableScrolling } from './commands/disableScrolling'
import { disableScrolling, enableScrolling } from './commands/scrollController'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}
const levelAtWhichGameStarts = 1
try {
  const levelSet = setInitialLevelOfGame(levelAtWhichGameStarts)
  if (levelSet) {
    disableScrolling()
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <Main />
      </React.StrictMode>
    )
  } else {
    console.warn('Level not set, app not started')
  }
} catch (error) {
  console.error('Error initializing app:', error)
  enableScrolling()
}

window.addEventListener('beforeunload', () => {
  enableScrolling()
})
