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
            //image.scale = 1

            //TODO: add the chibi heads for characters that are inside
        };
        
        //Add all the locations to the map
        let locationWidth = this.background.width / 6
        let locationHeight = this.background.height / 5
        let locationStartX = (this.background.width / 2) - ((((this.scenario.locations.length / 2) * locationWidth) / 2) - (locationWidth / 4))
        let currentX = locationStartX
        let currentY = locationHeight + (locationHeight * 1.25)
        const isOdd = this.scenario.locations.length % 2;
        if (isOdd) {
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
        }
        else {
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
        }

        //Add the outside characters to the map


        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}

exports.Overworld = Overworld;