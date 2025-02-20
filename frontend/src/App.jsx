import React from 'react'
import Game from './components/Game'
import Home from './components/Home'
import {Router,Routes,Route} from 'react-router-dom'


const App = () => {
  return (
    <div className='flex justify-center flex-col gap-y-8'>
      <div className='flex justify-center'>
        App
        <Routes>
          <Route path='/' element = {<Home/>} />
          <Route path='/Game' element = {<Game/>} />
        </Routes>
      </div>
      <div className='flex justify-center'>
        {/* <Game /> */}
      </div>
    </div>
  )
}

export default App