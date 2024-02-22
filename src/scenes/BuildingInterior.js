import { Scene, GameObjects } from 'phaser';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { CharacterProfile } from './CharacterProfile.js';

class BuildingInterior extends Phaser.Scene
{
    constructor ()
    {
        super('BuildingInterior');
    }

    init (config) 
    {
        console.log("BuildingInterior init")
        this.scenario = config.scenario
        this.location = config.location
    }

    preload () 
    {
        console.log("BuildingInterior preload")
        
        //TODO: error check that the location interior exists
        //Load the background image
        let image = this.load.image(`resizedImageInteriorFilename${this.location._id}`, this.location.resizedImageInteriorFilename);

        //Load the location images
        if (this.location.locations) {
            this.location.locations.forEach(childLocation => {

                //TODO: error check that the location interior exists
                //load the location image
                this.load.image(childLocation._id, childLocation.imageInteriorFilename)

                //Load the character chibis
                childLocation.allAgents.forEach(chibi => {
                    //TODO: error check that the chibi exists
                    this.load.image(chibi._id, chibi.agentDescription.resizedChibiFilename)
                })
            });
        }

        //Load the oustide character images
        this.location.agents.forEach(agent => {
            //TODO: error check that the iconFilename exists
            this.load.image(`iconFilename${agent._id}`, agent.agentDescription.iconFilename)
        })
    }

    create ()
    {
        console.log("BuildingInterior create")

        this.background = this.add.image(this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            `resizedImageInteriorFilename${this.location._id}`);
        this.background.setDisplaySize(this.cameras.main.width, 
            this.cameras.main.height);
        
        var __this = this;
        let createLocation = function(location, x, y) {
            //add the image for the location
            let image = __this.add.image(x, y, location._id);
        };

        //Add the characters to the interior
        if (this.location.agents.length > 0) {
            let chibiWidth = 340
            let totalWidth = (chibiWidth * this.location.agents.length)
            let chibiX = ((this.background.width / 2) - (totalWidth / 2)) + (chibiWidth / 2)
            let chibiY = (this.background.height / 2) + 116
            for (let i = 0; i < this.location.agents.length; i++) {
                let chibi = __this.add.image(chibiX, chibiY, `iconFilename${this.location.agents[i]._id}`);
                chibi.scale *= 0.8
                chibiX += chibiWidth

                chibi.setInteractive();
                chibi.on('pointerdown', function() {
                    console.log("nav to agent")
                    const start = async (agent) => {
                        const client = new ApolloClient({
                            uri: 'http://127.0.0.1:5000/graphql',
                            cache: new InMemoryCache(),
                        });
                        const results = await client.query({
                            variables: { agentId: agent._id },
                            query: gql`
                                query Agent($agentId: ID!)
                                {
                                    agent(id: $agentId)
                                    {
                                        success
                                        agent
                                        {
                                            _id
                                            name
                                            age
                                            gender
                                            status
                                            emoji
                                            description
                                            agentDescription
                                            {
                                                portraitFilename
                                            }
                                        }
                                    }
                                }`
                            });

                        __this.scene.add("CharacterProfile", new CharacterProfile(), true, { agent: results.data.agent.agent, prevScreen: "BuildingInterior" });
                        __this.scene.pause("BuildingInterior")
                    }
                    start(__this.location.agents[i]);
                });
            }
        }
    }
}

exports.BuildingInterior = BuildingInterior;