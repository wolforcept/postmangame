import { Assets, Starter } from 'miglib';
import { GameScreen } from './GameScreen';
import { loadFont } from './consts';

const game = new Starter((assets: Assets) => {

    loadFont(assets.sketch.loadFont('assets/quaver.ttf'));

    assets.loadImage("world", "tilemap/world.png");

    [
        "car",
        "letter",
        "map1",
        "player",
        "patch",
        "hovered",
        "quest_marker",
        "person1",
        "person2",
        "person3",
        "person4",
        "person5",
        "person6",
        "person7",
        "person8",
        "person9",
        "person10",
        "money",
        "door"

    ].forEach(img => assets.loadImage(img, img + ".png"));

    return new GameScreen();
});

game.start();
