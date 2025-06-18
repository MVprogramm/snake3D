
## Состояние блокировки прокрутки **"scrollLockState.ts"**
#comments 

### **Описание кода**

Код максимально простой и выполняет одну задачу — хранение данных о блокировке скролла.

1. **Импорт библиотек и компонентов**:
	Импортируется тип объекта, хранящего состояние блокировки прокрутки [[`ScrollLockState`]]
```ts
	import { ScrollLockState } from '../types/controlsTypes'
```
2. **`scrollLockState`** хранит информацию о текущем положении страницы (scrollY), ширине скроллбара и факте блокировки (`isLocked`).
```ts
	let scrollLockState: ScrollLockState = {
	  isLocked: false,
	  scrollY: 0,
	  scrollbarWidth: 0,
	}
```
3. **`setScrollLockState`** используется для записи новых значений (например, при вызове [[`disableScrolling.ts`]]).
```ts
	export const setScrollLockState = (state: ScrollLockState): void => {
	  scrollLockState = { ...state }
	}
```
4.  **`getScrollLockState`** предоставляет доступ к сохранённому состоянию (например, в [[`enableScrolling`]] и [[`scrollController`]]).
```ts
	export const getScrollLockState = (): ScrollLockState => scrollLockState
```
5.  **Оценка**
	 Благодаря отдельным функциям чтения и записи глобальное состояние изменяется централизованно, что упрощает дальнейшее сопровождение. Недостатков, влияющих на работу, не наблюдается.