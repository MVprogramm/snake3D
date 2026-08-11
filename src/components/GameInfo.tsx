import '../styles/gameInfo.css'

function GameInfo() {
  return (
    <div className='game-info'>
      <i className='fa-solid fa-wallet game-info-score'></i>
      <i className='fa-solid fa-carrot game-info-food'></i>
      <i className='fa-solid fa-clock game-info-time'></i>
      <i className='fa-solid fa-stairs game-info-level'></i>
      <i className='fa-solid fa-heart game-info-life'></i>
      <i className='fa-solid fa-gift game-info-bonus'></i>
      <i className='fa-solid fa-gauge-high game-info-speed'></i>
      <span className='bonus-probability'>
        <i className='fa-solid fa-clock bonus-probability-icon'></i>
        <span className='apple-eating-speed'> 5%</span>
      </span>
      <span className='bonus-probability'>
        <i className='fa-solid fa-heart bonus-probability-icon'></i>
        <span className='life-loss-status'> 5%</span>
      </span>
    </div>
  )
}

export default GameInfo
