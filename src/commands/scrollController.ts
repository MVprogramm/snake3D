export const disableScrolling = () => {
  // Сохраняем текущую позицию прокрутки
  const scrollY = window.scrollY

  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
  document.body.classList.add('no-scroll')
}

export const enableScrolling = () => {
  const scrollY = document.body.style.top

  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.classList.remove('no-scroll')

  // Восстанавливаем позицию прокрутки
  window.scrollTo(0, parseInt(scrollY || '0') * -1)
}
