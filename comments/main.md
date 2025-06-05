
## Главный процедурный файл **"main.ts"**
#comments 

### **Описание кода**

Этот код — современный и хорошо структурированный **входной скрипт React-приложения с игровым уровнем**, реализующий инициализацию, обработку ошибок и управление прокруткой страницы.

1. **Импорт библиотек и компонентов**:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './components/Main'
import setInitialLevelOfGame from './engine/events/setInitialLevelOfGame'
import ErrorScreen from './components/ErrorScreen'
import { disableScrolling, enableScrolling } from './commands/scrollController'
```
   - `React` и `ReactDOM` импортируются для работы с библиотекой React и её функциональностью по рендерингу компонентов.
   - [['Main']] — это основной компонент приложения, который будет отображаться на странице.
   - [[setInitialLevelOfGame]] — функция, которая, настраивает уровень игры.
   - [[disableScrolling]] и [[enableScrolling]] — функции, которые отключают и включают прокрутку страницы соответственно.  
2. **Поиск корневого DOM-элемента**:
```ts
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}
```
— Если не найден, приложение не стартует: выбрасывается ошибка.
3. **Создание React root:**
    ```ts
  const root = ReactDOM.createRoot(rootElement)
    ```
4. **Получение стартового уровня из URL-параметра:**
   ```    ts
	const levelAtWhichGameStarts = 
		new URLSearchParams(window.location.search).get('level') || '1'
```
5. **Инициализация приложения в функции `initializeApp`:** 
	```ts
	export default function main() {
	  try {
	```
    - Устанавливает уровень игры. 
    ```ts
    const levelSet = setInitialLevelOfGame(+levelAtWhichGameStarts)
```
    - При успешной инициализации:   
	    ```ts
		if (levelSet) {
		```
        - Отключает прокрутку.    
        ```ts
	        disableScrolling()
		```
        - Рендерит компонент `<Main />`.      
	    ```ts
		    root.render(
		        <React.StrictMode>
			         <Main />
		        </React.StrictMode>
		    )
		```
    - При неудаче: 
	    ```ts
		     } else {
		```
        - Показывает `ErrorScreen` с сообщением.            
    	    ```ts
		    console.warn('Level not set, rendering fallback UI')
		```    
        - Включает прокрутку обратно при ошибке.     
    	    ```ts
		    root.render(
		        <React.StrictMode>
		          <ErrorScreen message='Failed to initialize game level' />
		        </React.StrictMode>
	         )
		```    
6. **События страницы:**   
	```ts
		 }
	  } catch (error) {
		  console.error('Error initializing app:', error)
		  root.render(
		      <React.StrictMode>
		        <ErrorScreen message='An error occurred while initializing the game' />
		      </React.StrictMode>
          )
	```
    - Восстанавливает прокрутку при `beforeunload` (выход со страницы).        
        ```ts
		    enableScrolling() // Восстанавливаем прокрутку при ошибке
	  }
	    ```
}
