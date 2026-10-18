import { Assets, Starter } from 'miglib';
import { GameScreen } from './GameScreen';
import { loadFont } from './consts';

const game = new Starter((assets: Assets) => {

    loadFont(assets.sketch.loadFont('assets/quaver.ttf'));

    assets.loadImage("world", "tilemap/world.png");

    [
        "map1",
        "player",
        "patch",
        "hovered",
        "quest_marker",

    ].forEach(img => assets.loadImage(img, img + ".png"));

    [
        "post_door",
        "door_gray2"

    ].forEach(img => assets.loadImage("interactibles/" + img, "interactibles/" + img + ".png"));


    [
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
    ].forEach(img => assets.loadImage(img, "persons/" + img + ".png"));

    // [
    //     "pink",
    //     "blue",
    //     "gray",
    //     "gray2",
    //     "glass",

    // ].forEach(img => assets.loadImage("door_" + img, "door_" + img + ".png"));

    return new GameScreen();
});

game.start();
