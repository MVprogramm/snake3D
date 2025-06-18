
## Отключение прокрутки экрана **"disableScrolling.ts"**
#comments 

### **Описание кода**

Код лаконичен и выполняет задачу эффективной блокировки прокрутки, особенно важную для мобильных устройств.

1. **Импорт библиотек и компонентов**:
```ts
import * as SCROLL from './scrollLockState'
import { getScrollbarWidth } from './getScrollbarWidth'
import { preventScroll } from './scrollController'
```
Функция импортирует
- модуль состояния блокировки скролла [[`scrollLockState.ts`]] и его методы, 
- утилиту определения ширины скроллбара [[`getScrollbarWidth`]]
- обработчик [[`preventScroll`]] для iOS.

2. **Что делает функция**
	`2.1. Проверяет, не активна ли блокировка уже, чтобы не выполнять её повторно.
```ts
export const disableScrolling = (): void => {
  // Предотвращаем повторную блокировку
  if (SCROLL.getScrollLockState().isLocked) return
```
	2.2. Сохраняет текущие значения прокрутки и ширину скроллбара в `scrollLockState`	
```ts
// Сохраняем текущее состояние
  SCROLL.setScrollLockState({
    isLocked: true,
    scrollY: window.scrollY,
    scrollbarWidth: getScrollbarWidth(),
  })
```
	2.3. Добавляет правый отступ к `<body>`, чтобы компенсировать исчезновение полосы прокрутки (измерено функцией `getScrollbarWidth`)
```ts
// Компенсируем исчезновение скроллбара
  document.body.style.paddingRight =
    `${SCROLL.getScrollLockState().scrollbarWidth}px`
```
	2.4. Фиксирует `<body>` в текущей позиции с помощью `position: fixed` и смещает его на прежний `scrollY`.
```ts
// Фиксируем позицию
  document.body.style.position = 'fixed'
  document.body.style.top = `-${SCROLL.getScrollLockState().scrollY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
```
	2.5. Добавляет CSS‑класс `no-scroll`
```ts
 document.body.classList.add('no-scroll')
```
	2.6. Навешивает обработчик `touchmove` для предотвращения прокрутки на iOS
```ts
// Предотвращаем скролл на iOS
  document.addEventListener('touchmove', preventScroll, { passive: false })
}
```
3.  **Оценка**

	**Плюсы**
	- Запоминает положение страницы и корректно восстанавливает его при повторном включении скролла.    
	- Учитывает ширину скроллбара, чтобы контент не «прыгал» при блокировке.    
	- Блокирует прокрутку на iOS при помощи `touchmove` и `preventDefault`, что решает проблему overscroll. 

	**Минусы**
	- Функция предполагает наличие DOM и не подходит для сред без `document`.    
	- Не возвращает функцию для удаления обработчика `touchmove`, поэтому разблокировка должна осуществляться отдельной функцией [[`enableScrolling`]].    
	- Отступ для компенсации скроллбара и фиксация позиции могут повлиять на стили, если на странице есть другие элементы с фиксированным позиционированием.
	