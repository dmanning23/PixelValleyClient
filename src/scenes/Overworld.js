import { Scene, GameObjects } from 'phaser';


class Overworld extends Phaser.Scene
{
    //background: GameObjects.Image;
    //logo: GameObjects.Image;
    //title: GameObjects.Text;
    //scenario: JSON

    constructor ()
    {
        super('Overworld');
    }

    init (scenario) 
    {
        console.log("Overworld init")
        this.scenario = scenario
        
    }

    preload () 
    {
        console.log("Overworld preload")
        console.log(this.scenario.imageFilename)
        this.load.image('outsideBackground', this.scenario.imageFilename);
    }

    create ()
    {
        this.background = this.add.image(this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            'outsideBackground');
        this.background.setDisplaySize(this.cameras.main.width, 
            this.cameras.main.height);

        this.logo = this.add.image(this.cameras.main.centerX, 
            this.cameras.main.centerY - 50, 
             'logo');

        this.title = this.add.text(this.cameras.main.centerX, 
            this.cameras.main.centerY + 50,  'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}

exports.Overworld = Overworld;