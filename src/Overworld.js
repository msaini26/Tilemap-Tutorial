class Overworld extends Phaser.Scene {
    constructor() {
        super({key: 'overworldScene'});

        this.VEL = 100;
    }

    // preload assets
    preload() {
        // load in path for assets
        this.load.path = './assets/';
        // create slime spritesheet
        this.load.spritesheet('slime', 'slime.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.image('tilesetImage', 'tileset.png'); // init tilemap
        this.load.tilemapTiledJSON('tilemapJSON', 'area01.json');
    }


    // create objects, instances, and images
    create() {
        const map = this.add.tilemap('tilemapJSON');
        const tileset = map.addTilesetImage('tileset', 'tilesetImage');

        // add background, terrain, and tree layers
        const bgLayer = map.createLayer('Background', tileset, 0, 0);
        const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);
        const treeLayer = map.createLayer('Trees', tileset, 0, 0).setDepth(10); //set depth to hide player and make tree on top

        const slimeSpawn = map.findObject('Spawns', obj => obj.name === 'slimeSpawn');

        // create player 
        this.slime = this.physics.add.sprite(slimeSpawn.x, slimeSpawn.y, 'slime', 0);
        // init jiggly slime animation
        this.anims.create({
            key: 'jiggle',
            frameRate: 8,
            repeat: -1, // infinite loop
            frames: this.anims.generateFrameNumbers('slime', {
                start: 0,
                end: 1
            })
        });

        // jiggle animation
        this.slime.play('jiggle');

        // make sure slime stays in bounds
        this.slime.body.setCollideWorldBounds(true); 

        // collision check for layers
        terrainLayer.setCollisionByProperty({collides: true});
        treeLayer.setCollisionByProperty({collides: true});

        //physics collision
        this.physics.add.collider(this.slime, terrainLayer);
        this.physics.add.collider(this.slime, treeLayer);

        // create cameras
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // parameters: player, round pixels, lerp (how fast camera follows)
        this.cameras.main.startFollow(this.slime, true, 0.25, 0.25); // have the camera move based on player
        // change world bounds based on where the player is
        this.physics.world.bounds.setTo(0, 0, map.widthInPixels, map.heightInPixels);

        // take in user input via cursors
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // make sure diagonal movement is the same velocity - vector math
        this.direction = new Phaser.Math.Vector2(0);

        // take in user input for left and right arrow keys
        if(this.cursors.left.isDown){ // left arrow
            this.direction.x = -1;
        } else if (this.cursors.right.isDown){ // right arrow
            this.direction.x = 1;
        }

        // take in user input for up and down movement
        if(this.cursors.up.isDown){ // up arrow
            this.direction.y = -1;
        } else if (this.cursors.down.isDown){ // down arrow
            this.direction.y = 1;
        }

        // direction normalize + velocity
        this.direction.normalize();
        this.slime.setVelocity(this.VEL * this.direction.x, this.VEL * this.direction.y);
    }
}