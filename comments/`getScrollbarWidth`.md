
## Определение ширины скроллбара **"getScrollbarWidth.ts"**
#comments 

### **Описание кода**

1. Функция **создаёт** скрытый контейнер с прокруткой (`outer`)
```ts
	export const getScrollbarWidth = (): number => {
	  const outer = document.createElement('div')
	  outer.style.cssText = `
	    position: absolute;
	    top: -9999px;
	    width: 50px;
	    height: 50px;
	    overflow: scroll;
	    visibility: hidden;
	  `
	
	  document.body.appendChild(outer)
```
2. **Помещает** внутрь контейнера элемент (`inner`)
```ts
	const inner = document.createElement('div')
    inner.style.width = '100%'
	inner.style.height = '200px'
	outer.appendChild(inner)
```
3. **Вычисляет** разницу их ширин.
```ts
	const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
```
	Эта разница и есть ширина полосы прокрутки, которая затем используется, например, 
	в `disableScrolling` для компенсации исчезновения скроллбара при блокировке 
	прокрутки.

4.  **Удаляет** скрытый контейнер после использования
```ts
	document.body.removeChild(outer)

  return scrollbarWidth
}
```
5. **Оценка**

	**Плюсы**
	
	- Минимальный объём кода и простая логика.    
	- Временные элементы удаляются сразу после измерения, что предотвращает лишние узлы в DOM.    
	- Позволяет корректно компенсировать полосу прокрутки, чтобы контент не «прыгал».
	    
	**Минусы**
	
	- Функция предполагает наличие объекта `document`, поэтому не подходит для сред без DOM (например, серверного рендеринга).    
	- Каждое обращение пересоздаёт элементы и заново измеряет ширину. Если вызывать часто, можно добавить кеширование результата — ширина скроллбара обычно неизменна в течение сессии.   
	
	В целом реализация стандартна и надёжна для браузерной среды.