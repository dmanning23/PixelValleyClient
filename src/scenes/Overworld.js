import { Scene, GameObjects } from 'phaser';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { BaseScene } from './BaseScene.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class Overworld extends BaseScene
{
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
        
        //Load the background image
        this.load.image('outsideBackground', this.scenario.imageFilename);

        //Load the location images
        this.scenario.locations.forEach(location => {
            //load the location image
            this.load.image(`resizedImageFilename${location._id}`, location.resizedImageFilename)

            //Load the character chibis
            location.allAgents.forEach(chibi => {
                this.load.image(`resizedChibiFilename${chibi._id}`, chibi.agentDescription.resizedChibiFilename)
            })
        });

        //Load the oustide character images
        this.scenario.outsideAgents.forEach(agent => {
            this.load.image(`resizedIconFilename${agent._id}`, agent.agentDescription.resizedIconFilename)
        })
    }

    create ()
    {
        console.log("Overworld create")

        this.background = this.add.image(this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            'outsideBackground');
        this.background.setDisplaySize(this.cameras.main.width, 
            this.cameras.main.height);
        
        var __this = this;
        let createLocation = function(location, x, y) {
            //add the image for the location
            let image = __this.add.image(x, y, `resizedImageFilename${location._id}`);
            image.setInteractive();
            image.on('pointerdown', function() {
                console.log("nav to location")
                const start = async (location) => {
                    const client = new ApolloClient({
                        uri: 'http://127.0.0.1:5000/graphql',
                        cache: new InMemoryCache(),
                    });
                    const results = await client.query({
                        variables: { locationId: location._id },
                        query: gql`
                            query Location($locationId: ID!)
                            {
                                location(id: $locationId)
                                {
                                    success
                                    location 
                                    {
                                        _id
                                        description
                                        resizedImageInteriorFilename
                                        name
                                        agents
                                        {
                                            _id
                                            agentDescription
                                            {
                                                iconFilename
                                            }
                                            name
                                            status
                                            emoji
                                        }
                                        locations
                                        {
                                            _id
                                            imageInteriorFilename
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
                                },
                            }`
                        });

                    __this.scene.start("BuildingInterior", { location: results.data.location.location, scenario: __this.scenario });
                };
                start(location);
            });
          
            image.on('pointerover', function() {
                //this.strokeColor = 0xffffff; 
            });
          
            image.on('pointerout', function() { 
            /*this.paletteCircle.strokeColor = 0x000000;
            if (gameState.selectedColor === this.color) {
                for (let circle of gameState.paletteCircles) {
                circle.strokeColor = 0x000000;
                }
                this.paletteCircle.strokeColor = 0xffc836; 
            }*/
            }, { location })

            //add the chibi heads for characters that are inside
            if (location.allAgents.length > 0) {
                //let chibiWidth = __this.background.width / 20
                let chibiWidth = 96
                let totalWidth = (chibiWidth * location.allAgents.length)
                let chibiX = (x - (totalWidth / 2)) + (chibiWidth / 2)
                let chibiY = y - 100
                for (let i = 0; i < location.allAgents.length; i++) {
                    let chibi = __this.add.image(chibiX, chibiY, `resizedChibiFilename${location.allAgents[i]._id}`);
                    chibi.scale *= 0.8
                    chibiX += chibiWidth
                }
            }

            //add the label for the location at the bottom
            let title = __this.createLabel(__this, location.name, 'center', '14px', 10)
            __this.rexUI.add.sizer({
                    x: x, y: y + 128,
                    orientation: 'center'
                })
                .add(title)
                .layout()
            };
        
        //Add all the locations to the map
        let locationWidth = this.background.width / 4.5
        let locationHeight = this.background.height / 4.5
        let currentY = 0
        if (this.scenario.locations.length >= 9) {
            let locationStartX = (this.background.width / 2) - (((3 * locationWidth) / 2) - (locationWidth / 4))
            
            let currentX = locationStartX
            currentY = this.background.height * 0.22
            for (let i = 0; i < 3; i++) {
                createLocation(this.scenario.locations[i], currentX, currentY)
                currentX += locationWidth
            }

            currentY += locationHeight
            currentX = locationStartX + locationWidth / 2
            for (let i = 3; i < 6; i++) {
                createLocation(this.scenario.locations[i], currentX, currentY)
                currentX += locationWidth
            }

            currentY += locationHeight
            currentX = locationStartX
            for (let i = 6; i < this.scenario.locations.length; i++) {
                createLocation(this.scenario.locations[i], currentX, currentY)
                currentX += locationWidth
            }

            //increment this so the chibis show up in the correct spot
            currentY += 96
        }
        else if (this.scenario.locations.length % 2) {
            let locationStartX = (this.background.width / 2) - ((((this.scenario.locations.length / 2) * locationWidth) / 2) - (locationWidth / 4))
            let currentX = locationStartX
            currentY = this.background.height * 0.36
            for (let i = 0; i <= Math.floor(this.scenario.locations.length / 2); i++) {
                createLocation(this.scenario.locations[i], currentX, currentY)
                currentX += locationWidth
            }
            currentY += locationHeight
            currentX = locationStartX + locationWidth / 2
            for (let i = Math.floor(this.scenario.locations.length / 2) + 1; i < this.scenario.locations.length; i++) {
                createLocation(this.scenario.locations[i], currentX, currentY)
                currentX += locationWidth
            }

            //increment this so the chibis show up in the correct spot
            currentY += 132
        }
        else {
            let locationStartX = (this.background.width / 2) - ((((this.scenario.locations.length / 2) * locationWidth) / 2) - (locationWidth / 4))
            let currentX = locationStartX
            currentY = this.background.height * 0.36
            for (let i = 0; i < Math.floor(this.scenario.locations.length / 2); i++) {
                createLocation(this.scenario.locations[i], currentX, currentY)
                currentX += locationWidth
            }
            currentY += locationHeight
            currentX = locationStartX + locationWidth / 2
            for (let i = Math.floor(this.scenario.locations.length / 2); i < this.scenario.locations.length; i++) {
                createLocation(this.scenario.locations[i], currentX, currentY)
                currentX += locationWidth
            }

            //increment this so the chibis show up in the correct spot
            currentY += 132
        }

        let title = this.createLabel(this, this.scenario.name, 'center', '24px', 20)
        title.setInteractive();
        title.on('pointerdown', function() {
            __this.createDialog(__this, __this.scenario.name, __this.scenario.description)
        })
        this.rexUI.add.sizer({
                x: this.background.width/2, y: 48,
                orientation: 'center'
            })
            .add(title)
            .layout()

        //Add the outside characters to the map
        if (this.scenario.outsideAgents.length > 0) {
            let chibiWidth = 148
            let totalWidth = (chibiWidth * this.scenario.outsideAgents.length)
            let chibiX = ((this.background.width / 2) - (totalWidth / 2)) + (chibiWidth / 2)
            let chibiY = currentY
            for (let i = 0; i < this.scenario.outsideAgents.length; i++) {
                let chibi = __this.add.image(chibiX, chibiY, `resizedIconFilename${this.scenario.outsideAgents[i]._id}`);
                chibi.scale *= 0.3
                chibiX += chibiWidth
            }
        }
    }
}

exports.Overworld = Overworld;