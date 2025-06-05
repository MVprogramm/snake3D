// Состояние для отслеживания блокировки
interface ScrollLockState {
  isLocked: boolean
  scrollY: number
  scrollbarWidth: number
}

let scrollLockState: ScrollLockState = {
  isLocked: false,
  scrollY: 0,
  scrollbarWidth: 0,
}

// Вычисляем ширину скроллбара
const getScrollbarWidth = (): number => {
  // Создаем временный элемент для измерения
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

  const inner = document.createElement('div')
  inner.style.width = '100%'
  inner.style.height = '200px'
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  document.body.removeChild(outer)

  return scrollbarWidth
}

export const disableScrolling = (): void => {
  // Предотвращаем повторную блокировку
  if (scrollLockState.isLocked) return

  // Сохраняем текущее состояние
  scrollLockState.scrollY = window.scrollY
  scrollLockState.scrollbarWidth = getScrollbarWidth()
  scrollLockState.isLocked = true

  // Компенсируем исчезновение скроллбара
  document.body.style.paddingRight = `${scrollLockState.scrollbarWidth}px`

  // Фиксируем позицию
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollLockState.scrollY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.classList.add('no-scroll')

  // Предотвращаем скролл на iOS
  document.addEventListener('touchmove', preventScroll, { passive: false })
}

export const enableScrolling = (): void => {
  // Проверяем, была ли блокировка
  if (!scrollLockState.isLocked) return

  // Удаляем обработчик iOS
  document.removeEventListener('touchmove', preventScroll)

  // Восстанавливаем стили
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.paddingRight = ''
  document.body.classList.remove('no-scroll')

  // Восстанавливаем позицию скролла
  window.scrollTo(0, scrollLockState.scrollY)

  // Сбрасываем состояние
  scrollLockState.isLocked = false
  scrollLockState.scrollY = 0
  scrollLockState.scrollbarWidth = 0
}

// Вспомогательная функция для iOS
const preventScroll = (e: TouchEvent): void => {
  e.preventDefault()
}

// Утилита для проверки состояния
export const isScrollLocked = (): boolean => scrollLockState.isLocked

// Утилита для принудительного сброса (на случай ошибок)
export const resetScrollLock = (): void => {
  if (scrollLockState.isLocked) {
    enableScrolling()
  }
}
