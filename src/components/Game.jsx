import React , {useEffect, useRef}from 'react'
import { OfficeScene } from '../game/officeScene'


function Game() {

    const gameRef = useRef(null)
    useEffect(()=>{
        if (!gameRef.current) {
            gameRef.current = new OfficeScene()
            return 
        }

        const config = {
            type : Phaser.AUTO,
            parent : gameRef.current,
            width : 800,
            height : 600,
            physics : {
                default : 'arcade',
                arcade : {
                    gravity : {y : 0},
                    debug : true
                }
            },
            scene : OfficeScene
        }

        const game = new Phaser.Game(config)

        return () => {
            game.destroy(true)
        }
    },[])

  return (
    <div ref={gameRef}>
        {/* <div>
            Game
        </div> */}
    </div>
  )
}

export default Game