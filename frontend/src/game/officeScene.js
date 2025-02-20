import Phaser from 'phaser';
import { io } from 'socket.io-client';

export class OfficeScene extends Phaser.Scene{

    constructor() {
        super({key: 'OfficeScene'});
        // this.socket = io('http://localhost:3001')
        // this.players = {}   //storing the players
    }

    preload (){
        this.load.tilemapTiledJSON('office','src/assets/hello.json')
        this.load.image('floors','src/assets/floors.png')
        this.load.image('furniture','src/assets/furniture.png')
        this.load.image('gather','src/assets/gather.png')
        this.load.spritesheet('character','src/assets/Flora.png',{frameWidth: 32, frameHeight: 32})
    }

    create () {

        // socket connectimo
        this.socket = io('http://localhost:6969')
        this.otherPlayers = {}

        const map = this.make.tilemap({key: 'office'})
        const tileset1 = map.addTilesetImage('test-tiles','floors')
        const tileset2 = map.addTilesetImage('walls','furniture')
        const tileset3 = map.addTilesetImage('tables','gather')

        const floorLayer = map.createLayer('firstlayer', tileset1, 0, 0);
        const walllayer = map.createLayer('secondlayer', tileset2, 0, 0);
        const tablelayer = map.createLayer('thirdlayer', tileset3, 0, 0);
        // this didnot work as we defined the layer in a different way ig (ignore rn)
        // floorLayer.setCollisionByProperty({ collides: true });
        // adding sprite static
        this.player = this.physics.add.sprite(400,300,'character') //main player jiiii
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // setting collision layers
        walllayer.setCollisionByProperty({ collides: true });
        tablelayer.setCollisionByProperty({ collides: true });
        
        // also add physics collider
        this.physics.add.collider(this.player, walllayer);
        this.physics.add.collider(this.player, tablelayer);

        // camera following the sprite
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(1);


        // creating a cursors to use in the update functions
        this.cursors = this.input.keyboard.createCursorKeys();

        // socket related
        // sending player to server
        // this.socket.emit('newPlayer', { x: 400, y: 300 });

        this.socket.on('currentPlayers',(players)=>{
            Object.keys(players).forEach((id)=>{
                if(id!==this.socket.id){
                    this.addOtherPlayer(id,players[id])
                }
            })
        })

        this.socket.on('newPlayer', (player) => {
            this.addOtherPlayer(player.id, player);
        });

        this.socket.on('playerMoved', (player) => {
            if (this.otherPlayers[player.id]) {
                
                this.otherPlayers[player.id].setPosition(player.x, player.y);
 
            }
        });

        this.socket.on('playerDisconnected', (id) => {
            if (this.otherPlayers[id]) {
                this.otherPlayers[id].destroy();
                delete this.otherPlayers[id];
            }
        });
        // // loading other players
        // this.socket.on('playerJoined',({id,player})=>{
        //     if(!this.players[id]){
        //         this.players[id] = this.add.sprite(player.x,player.y,'character')
        //     }
        // })

        // // listening player movements
        // this.socket.on('updatePlayers',({id,player}) => {
        //     if(this.players[id]){
        //         this.players[id].x = player.x
        //         this.players[id].y = player.y
        //     }
        // })

        // // Remove  disconnected players
        // this.socket.on('playerLeft',(id)=>{
        //     if(this.players[id]){
        //         this.players[id].destroy();
        //         delete this.players[id]
        //     }
        // }) //commented as to refactor

    }

    addOtherPlayer(id, playerInfo) {
        this.otherPlayers[id] = this.physics.add.sprite(playerInfo.x, playerInfo.y, 'character');

        // Create a label (text object) above the player
        
    }

    update(){

        let move = false;

    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown) {
        velocityX = -160;
        move = true;
    } else if (this.cursors.right.isDown) {
        velocityX = 160;
        move = true;
    }

    if (this.cursors.up.isDown) {
        velocityY = -160;
        move = true;
    } else if (this.cursors.down.isDown) {
        velocityY = 160;
        move = true;
    }

    this.player.setVelocity(velocityX, velocityY); // Set both X and Y together

    // Emit movement only if there's movement
    if (move) {
        this.socket.emit('playerMoved', { x: this.player.x, y: this.player.y });
    }
    }
}