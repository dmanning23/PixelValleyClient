import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            'background');
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
