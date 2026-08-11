/**
 * @module getSelectors.ts Передает в js ссылки на элементы html-разметки
 *    @function getSelectors Возвращает объект со ссылками на DOM-элементы
 */
import { GameElements } from '../../types/htmlElementsTypes'
/**
 * Устанавливает связь между игрой и DOM-элементами для рендера
 * @returns объект со ссылками на все DOM-элементы
 */
function getSelectors(): GameElements {
  const elements: GameElements = {
    playBoard: document.querySelector('.play-board'),
    scoreElement: document.querySelector('.game-info-score'),
    leftToEatElement: document.querySelector('.game-info-food'),
    timeElement: document.querySelector('.game-info-time'),
    levelElement: document.querySelector('.game-info-level'),
    lifeElement: document.querySelector('.game-info-life'),
    speedElement: document.querySelector('.game-info-speed'),
    appleEatingSpeedElement: document.querySelector('.apple-eating-speed'),
    lifeLossStatusElement: document.querySelector('.life-loss-status'),
    controls: document.querySelectorAll('.controls i'),
    bonusElement: document.querySelector('.game-info-bonus'),
  }

  return elements
}

export default getSelectors
