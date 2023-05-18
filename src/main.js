let config = {
    type: Phaser.CANVAS,
    render: {
        pixelArt: true //for using pixel art, keep things nice and crispy
    },
    width: 320,
    height: 240,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    zoom: 2, //zoom in game screen
    scene: [Overworld]
}

const game = new Phaser.Game(config);