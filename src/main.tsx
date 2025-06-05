//
import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './components/Main'
import setInitialLevelOfGame from './engine/events/setInitialLevelOfGame'
import ErrorScreen from './components/ErrorScreen'
import { disableScrolling, enableScrolling } from './commands/scrollController'

// Проверяем наличие корневого элемента
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Создаём корень React один раз
const root = ReactDOM.createRoot(rootElement)

// Получаем начальный уровень из параметров или задаём по умолчанию
const levelAtWhichGameStarts =
  new URLSearchParams(window.location.search).get('level') || '1'

// Функция инициализации приложения
export default function main() {
  try {
    // Устанавливаем начальный уровень игры
    const levelSet = setInitialLevelOfGame(+levelAtWhichGameStarts)
    if (levelSet) {
      disableScrolling() // Отключаем прокрутку для игры
      root.render(
        <React.StrictMode>
          <Main />
        </React.StrictMode>
      )
    } else {
      console.warn('Level not set, rendering fallback UI')
      root.render(
        <React.StrictMode>
          <ErrorScreen message='Failed to initialize game level' />
        </React.StrictMode>
      )
    }
  } catch (error) {
    console.error('Error initializing app:', error)
    root.render(
      <React.StrictMode>
        <ErrorScreen message='An error occurred while initializing the game' />
      </React.StrictMode>
    )
    enableScrolling() // Восстанавливаем прокрутку при ошибке
  }
}
