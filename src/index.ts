import main from './main'
import { enableScrolling } from './commands/enableScrolling'

// Восстанавливаем прокрутку при закрытии страницы
const handleBeforeUnload = () => {
  enableScrolling()
}
window.addEventListener('beforeunload', handleBeforeUnload)

// Запускаем инициализацию
main()

// Очищаем обработчик при необходимости (например, в SPA)
window.addEventListener('unload', () => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
