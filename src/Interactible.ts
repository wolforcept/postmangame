import { Graphics, vec, Vec2 } from 'miglib';
import { DEBUG, WHITE } from './consts';
import { Data, Quest } from './Data';
import { Dialog } from './Dialog';
import { REQUESTS_BY_SHOP } from './Quest';

export class Interactible {

    pos: Vec2;
    interactRadius: number = 10

    constructor(
        public readonly img: string,
        tilePos: Vec2,
        public hasQuestMarker: () => boolean,
        public onInteract: (self: Interactible) => void,
    ) {
        this.pos = tilePos.scale(8).addxy(4, 4);
    }

    interact(): void {
        this.onInteract(this);
    }

    render(g: Graphics, pos: Vec2, isPlayerNearby: boolean): void {
        const s = g.sketch;
        s.noStroke();
        // s.fill(isPlayerNearby ? 255 : 160, isPlayerNearby ? 220 : 120, 60);
        g.renderImage("interactibles/" + this.img, pos.x - 4, pos.y - 4);
        if (isPlayerNearby)
            g.renderImage("hovered", pos.x - 5, pos.y - 5);
        if (this.hasQuestMarker())
            g.renderImage("quest_marker", pos.x - 4, pos.y - 5 - 8);
    }
}

export class InteractibleShop extends Interactible {

    constructor(
        dialog: Dialog,
        private data: Data,
        public readonly id: string,
        tilePos: Vec2,
    ) {
        super("door_gray2", tilePos, () => false, () => {

            const req = REQUESTS_BY_SHOP[id];

            dialog.showDialog([{
                text: () => "What would you like to purchase?",
                options: ["cancel", ...req.map(item => {
                    return item.itemName + " " + item.price + "$"
                })],
                callback: (_opt) => {
                    if (_opt === 0) return;
                    const opt = req[_opt - 1];
                    if (this.data.money >= opt.price) {
                        this.data.money -= opt.price
                        this.data.inventory.push(opt.itemName)
                        dialog.lastOptionSelected = 1
                    } else {
                        dialog.lastOptionSelected = 2
                    }
                }
            }, {
                skip: () => dialog.lastOptionSelected !== 2,
                text: () => "Not enough money."
            }])

        })
    }

    override render(g: Graphics, pos: Vec2, isPlayerNearby: boolean): void {
        super.render(g, pos, isPlayerNearby);
        const pos2 = vec(-g.textWidth(this.id, { size: 5 }) / 2, -5);
        g.renderText(this.id, pos.x + pos2.x, pos.y + pos2.y, { size: 5, color: WHITE })
    }
}

export class InteractibleDoor extends Interactible {

    constructor(
        private data: Data,
        public readonly id: number,
        public readonly nr: number,
        tilePos: Vec2,
        public onInteract: (self: Interactible) => void,
    ) {
        super("door_gray2", tilePos, () => {
            const quest = this.getQuest()
            return quest !== null && !quest.accepted;
        }, onInteract)
    }

    getQuest(): Quest | null {
        return this.data.quests.find(x => x.houseId === this.id) ?? null;
    }

    override render(g: Graphics, pos: Vec2, isPlayerNearby: boolean): void {
        super.render(g, pos, isPlayerNearby);

        const show = this.nr === 0 || DEBUG ? "*" + this.id : "" + this.nr;
        g.renderText(show, pos.x + 5, pos.y, { size: 5, color: WHITE })

        const quest = this.getQuest()
        if (quest !== null) {
            g.renderImage(quest.personImg, pos.x - 4, pos.y - 2)
        }
    }
}