import React from 'react'
import Game from './components/Game'

const App = () => {
  return (
    <div className='flex justify-center flex-col gap-y-8'>
      <div className='flex justify-center'>
        App
      </div>
      <div className='flex justify-center'>
        <Game />
      </div>
    </div>
  )
}

export default App