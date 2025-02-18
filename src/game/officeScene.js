import Phaser from 'phaser';

export class OfficeScene extends Phaser.Scene{

    constructor() {
        super({key: 'OfficeScene'});
    }

    preload (){
        this.load.tilemapTiledJSON('office','src/assets/hello.json')
        this.load.image('floors','src/assets/floors.png')
        this.load.image('furniture','src/assets/furniture.png')
        this.load.image('gather','src/assets/gather.png')
        this.load.spritesheet('character','src/assets/Flora.png',{frameWidth: 32, frameHeight: 32})
    }

    create () {
        const map = this.make.tilemap({key: 'office'})
        const tileset1 = map.addTilesetImage('test-tiles','floors')
        const tileset2 = map.addTilesetImage('walls','furniture')
        const tileset3 = map.addTilesetImage('tables','gather')

        const floorLayer = map.createLayer('firstlayer', tileset1, 0, 0);
        const walllayer = map.createLayer('secondlayer', tileset2, 0, 0);
        const tablelayer = map.createLayer('thirdlayer', tileset3, 0, 0);
        // this didnot work as we defined the layer in a different way ig (ignore rn)
        // floorLayer.setCollisionByProperty({ collides: true });
        // adding sprite
        this.player = this.physics.add.sprite(400,300,'character')


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

    }

    update(){
        this.player.setVelocity(0);

        if(this.cursors.left.isDown){
            this.player.setVelocityX(-160)
        }else if(this.cursors.right.isDown){
            this.player.setVelocityX(160)
        }

        if(this.cursors.up.isDown){
            this.player.setVelocityY(-160)
        } else if(this.cursors.down.isDown){
            this.player.setVelocityY(160)
        }
    }
}