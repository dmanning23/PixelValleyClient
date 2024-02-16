import { Scene, GameObjects } from 'phaser';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

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
        console.log("MainMenu create")

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
            console.log("nav to Overworld")


            const start = async () => {
                const client = new ApolloClient({
                    uri: 'http://127.0.0.1:5000/graphql',
                    cache: new InMemoryCache(),
                });
                const results = await client.query({
                query: gql`
                    {
                        scenario(id: "6580b18f0b38cba6f29e3f88")
                        {
                            success
                            scenario
                            {
                                imageFilename
                                name
                                outsideAgents
                                {
                                    agentDescription
                                    {
                                    resizedIconFilename
                                    }
                                    name
                                    status
                                            emoji
                                }
                                locations
                                {
                                    resizedImageFilename
                                    name
                                    allAgents
                                    {
                                        agentDescription
                                        {
                                            resizedChibiFilename
                                        }
                                        name
                                        status
                                        emoji
                                    }
                                }
                            }
                        }
                    }`,
                });
                
                //const outsideBackground = results.data.scenario.scenario.imageFilename
                //this.load.image('outsideBackground', outsideBackground)
                
                this.scene.start("Overworld", results.data.scenario.scenario);
            };
            start();

            //this.scene.start('Overworld');

        });
    }
}
