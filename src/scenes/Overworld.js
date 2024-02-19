import { Scene, GameObjects } from 'phaser';


class Overworld extends Phaser.Scene
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
            this.load.image(location._id, location.resizedImageFilename)

            //Load the character chibis
            location.allAgents.forEach(chibi => {
                this.load.image(chibi._id, chibi.agentDescription.resizedChibiFilename)
            })
        });

        //Load the oustide character images
        this.scenario.outsideAgents.forEach(agent => {
            this.load.image(agent._id, agent.agentDescription.resizedIconFilename)
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
            let image = __this.add.image(x, y, location._id);

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

        //Add the outside characters to the map
        if (this.scenario.outsideAgents.length > 0) {
            let chibiWidth = 164
            let totalWidth = (chibiWidth * this.scenario.outsideAgents.length)
            let chibiX = ((this.background.width / 2) - (totalWidth / 2)) + (chibiWidth / 2)
            let chibiY = currentY
            for (let i = 0; i < this.scenario.outsideAgents.length; i++) {
                let chibi = __this.add.image(chibiX, chibiY, this.scenario.outsideAgents[i]._id);
                chibi.scale *= 0.9
                chibiX += chibiWidth
            }
        }

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}

exports.Overworld = Overworld;