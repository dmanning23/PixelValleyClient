import { Scene, GameObjects } from 'phaser';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { CharacterProfile } from './CharacterProfile.js';
import { BaseScene } from './BaseScene.js';

class BuildingInterior extends BaseScene
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

        //Add the exit button
        let exit = this.createLabel(this, "<- Exit", 'left', '22px', 18)
        exit.setInteractive();
        exit.on('pointerdown', function() {
            __this.scene.start("Overworld", __this.scenario);
        })
        this.rexUI.add.sizer({
                x: 128, y: 48,
                orientation: 'center'
            })
            .add(exit)
            .layout()

        let title = this.createLabel(this, this.location.name, 'center', '24px', 20)
        title.setInteractive();
        title.on('pointerdown', function() {
            __this.createDialog(__this, __this.location.name, __this.location.description)
        })
        this.rexUI.add.sizer({
                x: this.background.width/2, y: 48,
                orientation: 'center'
            })
            .add(title)
            .layout()

        

/*

        var dialog = this.rexUI.add.dialog({
            x: 800,
            y: 600,
            width: 500,

            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

            title: this.createLabel2(this, 'Title').setDraggable(),

            toolbar: [
                this.createLabel2(this, 'O'),
                this.createLabel2(this, 'X')
            ],

            leftToolbar: [
                this.createLabel2(this, 'A'),
                this.createLabel2(this, 'B')
            ],  

            content: this.createLabel2(this, 'Content'),

            description: this.createLabel2(this, 'Description'),

            choices: [
                this.createLabel2(this, 'Choice0'),
                this.createLabel2(this, 'Choice1'),
                this.createLabel2(this, 'Choice2')
            ],

            actions: [
                this.createLabel2(this, 'Action0'),
                this.createLabel2(this, 'Action1')
            ],

            space: {
                left: 20,
                right: 20,
                top: -20,
                bottom: -20,

                title: 25,
                titleLeft: 30,
                content: 25,
                description: 25,
                descriptionLeft: 20,
                descriptionRight: 20,
                choices: 25,

                toolbarItem: 5,
                choice: 15,
                action: 15,
            },

            expand: {
                title: false,
                // content: false,
                // description: false,
                // choices: false,
                // actions: true,
            },

            align: {
                title: 'center',
                // content: 'left',
                // description: 'left',
                // choices: 'left',
                actions: 'right', // 'center'|'left'|'right'
            },

            click: {
                mode: 'release'
            }
        })
        .setDraggable('background')   // Draggable-background
        .layout()
        // .drawBounds(this.add.graphics(), 0xff0000)
        .popUp(1000);

        var tween = this.tweens.add({
            targets: dialog,
            scaleX: 1,
            scaleY: 1,
            ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0, // -1: infinity
            yoyo: false
        });
        */
    }

    createLabel2(scene, text) {
        return scene.rexUI.add.label({
            width: 40, // Minimum width of round-rectangle
            height: 40, // Minimum height of round-rectangle
          
            background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),
    
            text: scene.add.text(0, 0, text, {
                fontSize: '24px'
            }),
    
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        });
    }
}

exports.BuildingInterior = BuildingInterior;