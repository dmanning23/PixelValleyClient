import { Scene, GameObjects } from 'phaser';

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
        let image = this.load.image(this.location._id, this.location.resizedImageInteriorFilename);

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
            this.load.image(agent._id, agent.agentDescription.iconFilename)
        })
    }

    create ()
    {
        console.log("BuildingInterior create")

        this.background = this.add.image(this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            this.location._id);
        this.background.setDisplaySize(this.cameras.main.width, 
            this.cameras.main.height);
        
        var __this = this;
        let createLocation = function(location, x, y) {
            //add the image for the location
            let image = __this.add.image(x, y, location._id);

            /*
            image.on('pointerdown', function() {
                //TODO: hit up GraphQL for the location info 
            }, { location });
          
            image.on('pointerover', function() {
                //this.strokeColor = 0xffffff; 
            });
          
            image.on('pointerout', function() { 
            this.paletteCircle.strokeColor = 0x000000;
            if (gameState.selectedColor === this.color) {
                for (let circle of gameState.paletteCircles) {
                circle.strokeColor = 0x000000;
                }
                this.paletteCircle.strokeColor = 0xffc836; 
            }
            }, { location })

            //add the chibi heads for characters that are inside
            if (location.allAgents.length > 0) {
                //let chibiWidth = __this.background.width / 20
                let chibiWidth = 96
                let totalWidth = (chibiWidth * location.allAgents.length)
                let chibiX = (x - (totalWidth / 2)) + (chibiWidth / 2)
                let chibiY = y - 100
                for (let i = 0; i < location.allAgents.length; i++) {
                    let chibi = __this.add.image(chibiX, chibiY, location.allAgents[i]._id);
                    chibi.scale *= 0.8
                    chibiX += chibiWidth
                }
            }
            */
        };
        /*
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
        */

        //Add the characters to the interior
        if (this.location.agents.length > 0) {
            let chibiWidth = 340
            let totalWidth = (chibiWidth * this.location.agents.length)
            let chibiX = ((this.background.width / 2) - (totalWidth / 2)) + (chibiWidth / 2)
            let chibiY = (this.background.height / 2) + 116
            for (let i = 0; i < this.location.agents.length; i++) {
                let chibi = __this.add.image(chibiX, chibiY, this.location.agents[i]._id);
                chibi.scale *= 0.8
                chibiX += chibiWidth
            }
        }

        this.input.once('pointerdown', () => {
            this.scene.start("Overworld", this.scenario);
        });
    }
}

exports.BuildingInterior = BuildingInterior;