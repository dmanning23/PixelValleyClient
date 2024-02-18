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
                //swole ville 65bbcc69d9e6cf794859d192
                //pirate village 6580b18f0b38cba6f29e3f88
                //ninja village 659b4e1dd199ac6c4ab597c8
                //spooksville 65b13e13041e78973118f97f
                //Ancient Greek City 65d2692d22dcc866a3c70ab6
                const results = await client.query({
                query: gql`
                    {
                        scenario(id: "65d2692d22dcc866a3c70ab6")
                        {
                            success
                            scenario
                            {
                                imageFilename
                                name
                                outsideAgents
                                {
                                    _id
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
                                    _id
                                    resizedImageFilename
                                    name
                                    allAgents
                                    {
                                        _id
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

                this.scene.start("Overworld", results.data.scenario.scenario);
            };
            start();
        });
    }
}
