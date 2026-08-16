/**
 * @module renderInfo.ts Выводит на экран информационное табло
 *    @function renderInfo Выполняет рендер всех параметров игры
 */
import getSelectors from './getSelectors'
import { getScores, setScores } from '../scores/scores'
import { howMuchIsLeftToEat } from '../food/currentFoodNumber'
import timeFormat from '../time/timeFormat'
import { getTimePerLevel } from '../time/timePerLevel'
import { getTimer } from '../time/timer'
import { getCurrentLevel } from '../levels/currentLevel'
import { getLives } from '../lives/lives'
import { getMaxScores } from '../scores/maxScoresPerLevel'
import { getStep } from '../time/timerStepPerLevel'
import checkTimerStep from '../time/checkTimerStep'
import { checkPause } from '../events/pauseEvent'
import { checkContact } from '../events/isContact'
import { getExtraTimeBonusProbability } from '../protocol/appleEatingSpeed'
import { getFoodEaten } from '../events/snakeCatchesFoodEvent'
import { getBonusAvailability } from '../bonuses/bonusAvailableState'
import { getBonusParams } from '../bonuses/bonusParams'
import { getExtraLifeBonusProbability } from '../protocol/lifeLossSpeed'
import { getStopsGrowingBonusProbability } from '../protocol/snakeGrowthPressure'

// let attention = 0;
/**
 * Рендер информации о ходе игры по ссылкам на DOM-элементы
 */
function renderInfo(): void {
  // attention++;
  // const attentionInterval = 4 + getStep();
  const {
    scoreElement,
    leftToEatElement,
    timeElement,
    levelElement,
    lifeElement,
    bonusElement,
    speedElement,
    appleEatingSpeedElement,
    lifeLossStatusElement,
    snakeGrowthStatusElement,
  } = getSelectors()
  if (howMuchIsLeftToEat() === 0) setScores(getLives())
  if (scoreElement) scoreElement.innerHTML = ` ${getScores()} / ${getMaxScores()}`
  if (leftToEatElement) leftToEatElement.innerHTML = ` ${howMuchIsLeftToEat()}`
  if (timeElement)
    timeElement.innerHTML = ` ${timeFormat(
      getTimePerLevel() - getTimer() < 0 ? 0 : getTimePerLevel() - getTimer()
    )}`
  if (levelElement) levelElement.innerHTML = ` ${getCurrentLevel()}`
  if (lifeElement) {
    lifeElement.innerHTML = ` ${
      getLives() < 0 || howMuchIsLeftToEat() === 0 ? 0 : getLives()
    }`
  }

  if (bonusElement) {
    const bonusType = getBonusAvailability() ? getBonusParams().type : ''
    const bonusIconClass =
      bonusType === 'addExtraTime'
        ? 'fa-clock'
        : bonusType === 'addExtraLives'
        ? 'fa-heart'
        : bonusType === 'snakeStopsGrowing'
        ? 'fa-snowflake'
        : ''
    const isKnownBonusAvailable = bonusIconClass !== ''

    bonusElement.style.opacity = isKnownBonusAvailable ? '1' : '0.5'
    bonusElement.style.color = ''
    const currentBonusIcon = bonusElement.querySelector('.available-bonus-icon')
    if (
      isKnownBonusAvailable &&
      !currentBonusIcon?.classList.contains(bonusIconClass)
    ) {
      bonusElement.innerHTML = ` <span class="fa-solid ${bonusIconClass} available-bonus-icon"></span>`
    }
    if (!isKnownBonusAvailable && bonusElement.innerHTML !== ' 0') {
      bonusElement.innerHTML = ' 0'
    }
  }
  if (speedElement && !checkContact()) {
    speedElement.innerHTML = ` ${checkTimerStep() || checkPause() ? 0 : getStep()}`
  }
  if (appleEatingSpeedElement && getFoodEaten()) {
    appleEatingSpeedElement.innerHTML = ` ${getExtraTimeBonusProbability()}`
  }
  if (lifeLossStatusElement && getFoodEaten()) {
    lifeLossStatusElement.innerHTML = ` ${getExtraLifeBonusProbability()}`
  }
  if (snakeGrowthStatusElement && getFoodEaten()) {
    snakeGrowthStatusElement.innerHTML = ` ${getStopsGrowingBonusProbability()}`
  }
}

export default renderInfo
