
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class BaseScene extends Phaser.Scene {

    createLabel (scene, text, align, fontSize, space) {
        return scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),
            text: scene.add.text(0, 0, text, {fontSize: fontSize}),
            align: align,
            space: {
                left: space,
                right: space,
                top: space,
                bottom: space
            }
        });
    }

    createDialog(scene, title, text) {
        var style = {
            width: 800, height: 600,
            space: { left: 20, right: 20, top: 20, bottom: 20, title: 20, content: 30, action: 10, },
            background: {
                color: COLOR_PRIMARY,
                strokeColor: COLOR_LIGHT,
                radius: 20,
            },
            title: {
                space: { left: 5, right: 5, top: 5, bottom: 5 },
                text: { fontSize: 24 },
                align: 'center',
                //background: { color: COLOR_DARK }
            },
            content: {
                space: { left: 5, right: 5, text: 10 },
                slider: {
                    track: {
                        color: COLOR_DARK,
                        radius: 8,
                        width: 16
                    },
                    thumb: {
                        color: COLOR_LIGHT,
                        radius: 11,
                        width: 22,
                    },
                }
            },
            buttonMode: 1,
            button: {
                space: { left: 10, right: 10, top: 10, bottom: 10 },
                background: {
                    color: COLOR_DARK,
                    strokeColor: COLOR_LIGHT,
                    radius: 10,
                    'hover.strokeColor': 0xffffff,
                }
            },
            align: {
                actions: 'center'
            },
        }

        var dialog = scene.rexUI.add.confirmDialog(style)
            .setPosition((scene.background.width / 2), (scene.background.height / 2.5))
            .setDraggable('title')
            .resetDisplayContent({
                title: title,
                content: text,
                buttonA: 'Ok'
            })
            .layout()

        dialog.modalPromise()
    }
}

exports.BaseScene = BaseScene;