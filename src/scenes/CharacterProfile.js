import { Scene, GameObjects } from 'phaser';

class CharacterProfile extends Phaser.Scene
{
    constructor ()
    {
        super('CharacterProfile');
    }

    init (config) 
    {
        console.log("CharacterProfile init")
        this.agent = config.agent
        this.prevScreen = config.prevScreen
    }

    preload () 
    {
        console.log("CharacterProfile preload")
        
        //TODO: error check that the location interior exists
        //Load the background image
        let image = this.load.image(`portraitFilename${this.agent._id}`, this.agent.agentDescription.portraitFilename);
    }

    create ()
    {
        console.log("CharacterProfile create")

        this.background = this.add.image(this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            `portraitFilename${this.agent._id}`);

        this.input.once('pointerdown', () => {
            this.scene.run(this.prevScreen);
            this.scene.remove("CharacterProfile")
        });
    }
}

exports.CharacterProfile = CharacterProfile;