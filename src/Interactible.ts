import { Graphics, Vec2 } from 'miglib';
import { GameScreen } from './GameScreen';
import { DEBUG, WHITE } from './consts';
import { Quest } from './Quest';

export class Interactible {

    pos: Vec2;
    interactRadius: number = 10

    constructor(
        public readonly img: string,
        tilePos: Vec2,
        public hasQuestMarker: () => boolean,
        public onInteract?: () => void,
    ) {
        this.pos = tilePos.scale(8).addxy(4, 4);
    }

    interact(): void {
        this.onInteract?.();
    }

    render(g: Graphics, pos: Vec2, isPlayerNearby: boolean): void {
        const s = g.sketch;
        s.noStroke();
        // s.fill(isPlayerNearby ? 255 : 160, isPlayerNearby ? 220 : 120, 60);
        g.renderImage("interactibles/" + this.img, pos.x - 4, pos.y - 4);
        if (isPlayerNearby)
            g.renderImage("hovered", pos.x - 5, pos.y - 4);
        if (this.hasQuestMarker())
            g.renderImage("quest_marker", pos.x - 4, pos.y - 5 - 8);
    }
}

export class InteractibleDoor extends Interactible {

    quest: null | Quest = null

    constructor(
        public readonly id: number,
        public readonly nr: string | number,
        tilePos: Vec2,
        public hasQuestMarker: () => boolean,
        public onInteract: () => void,
    ) {
        super("door_gray2", tilePos, hasQuestMarker, onInteract)
    }

    override render(g: Graphics, pos: Vec2, isPlayerNearby: boolean): void {
        super.render(g, pos, isPlayerNearby);

        const show = this.nr === 0 || DEBUG ? "*" + this.id : "" + this.nr;
        g.renderText(show, pos.x + 5, pos.y, { size: 5, color: WHITE })
    }
}