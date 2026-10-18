import { Color, Graphics, Keys, NinePatchOptions, rect, RectLike, vec, Vec2 } from 'miglib';
import { Input } from './Input';
import { WHITE, ZOOM } from './consts';
import { Data } from './Data';
import { Player } from './Player';
import { HOUSES, HOUSES_BY_ID, STREET_BY_HOUSE, StreetRect, STREETS, STREETS_RECTS } from './houses';

export interface DialogPart {
    text: string
    options?: string[]
    callback?: (option: number) => void
}

export class Menu {

    w = ZOOM * 120;
    h = ZOOM * 56;
    x = 0
    y = 0
    padding = 24;

    textSize = 24;
    textColor = WHITE;

    cursor = vec(18, 37)

    constructor(private data: Data) { }

    isOpen = false

    update(g: Graphics, dt: number): void {
        if (!this.isOpen) return;

        const mv = Input.move();
        this.cursor = this.cursor.add(mv)

    }

    dd = 2.425;
    xx = 30;
    yy = -188;
    cutoffX = 5;
    cutoffY = 32;
    cutoffW = 50;
    cutoffH = 50;

    hoveredStreet = ""

    // asd1 = vec(56, 253).scale(8).addxy(4, 4);
    // asd2 = vec(56, 172).scale(8).addxy(4, 4);
    render(g: Graphics, player: Player): void {
        const zxc = player.pos.scale(1 / this.dd).scale(1 / ZOOM).round().scale(ZOOM).addxy(this.xx, this.yy - 2).addxy(-this.cutoffX * ZOOM, - this.cutoffY * ZOOM);
        if (!this.isOpen) {
            this.cursor = zxc.clone();
            return;
        }
        this.hoveredStreet = "";
        // if (Keys.justPressed(Keys.KEY_0)) console.log(this.dd, this.xx, this.yy)
        // if (Keys.justPressed(Keys.KEY_1)) this.dd -= .1;
        // if (Keys.justPressed(Keys.KEY_2)) this.dd += .1;
        // if (Keys.isDown(Keys.KEY_3)) this.xx--;
        // if (Keys.isDown(Keys.KEY_4)) this.xx++;
        // if (Keys.isDown(Keys.KEY_5)) this.yy--;
        // if (Keys.isDown(Keys.KEY_6)) this.yy++;
        // if (Keys.isDown(Keys.KEY_7)) player.pos = player.pos.set(this.asd1.x, this.asd1.y);
        // if (Keys.isDown(Keys.KEY_8)) player.pos = player.pos.set(this.asd2.x, this.asd2.y);

        // g.sketch.push();
        // g.sketch.scale(ZOOM);
        // g.sketch.pop();

        this.x = Math.floor(g.width / 2 - this.w / 2);
        this.y = Math.floor(g.height / 2 - this.h / 2);
        g.render9patch("patch", this.x, this.y, this.w, this.h, { scale: ZOOM });

        // const img = g.assets.getImage("map1")
        g.renderImage("map1", this.x + ZOOM * 3, this.y + ZOOM * 3, {
            sw: this.cutoffW, sh: this.cutoffH,
            w: this.cutoffW * ZOOM, h: this.cutoffH * ZOOM,
            sx: this.cutoffX, sy: this.cutoffY
        })

        const cursorView = this.cursor.scale(1 / ZOOM).floor().scale(ZOOM);


        let hoveredStreet;
        for (const streetRect of STREETS_RECTS) {
            const hovered = this.drawRect(g, cursorView, streetRect, false)
            if (hovered) hoveredStreet = streetRect
        }
        if (hoveredStreet)
            this.drawRect(g, cursorView, hoveredStreet, true)

        this.drawPixel(g, cursorView)
        this.drawPixel(g, zxc, "player")

        g.renderText(this.hoveredStreet, this.x + 30, this.y + this.h - 30, { color: WHITE, size: 30 })

        this.renderLetters(g, this.x + 560, this.y + 30);
    }


    drawRect(g: Graphics, cursorView: Vec2, street: StreetRect, drawHovered: boolean): boolean {

        let isHovered = false;
        const boundss = street.rects.map(r => rect((3 + r.x - this.cutoffX) * ZOOM, (3 + r.y - this.cutoffY) * ZOOM, r.w * ZOOM, r.h * ZOOM));
        for (const bounds of boundss) {
            if (bounds.contains(cursorView))
                isHovered = true;
        }

        const varr = Date.now() % 500 > 250;
        if (drawHovered) {
            g.sketch.fill(155, 155, 255, varr ? 80 : 120)
            this.hoveredStreet = street.name
        }
        else {
            g.sketch.fill(255, 255, 255, 0)
        }

        if (street.name === "Hymnal Park") {
            g.sketch.fill(255, 255, 255, drawHovered ? (varr ? 50 : 20) : 0)

        }

        g.sketch.noStroke()
        for (const r of boundss)
            g.sketch.rect(this.x + r.x, this.y + r.y, r.w, r.h);

        return isHovered;
    }

    drawPixel(g: Graphics, { x: px, y: py }: Vec2, _color?: "player") {

        if (_color === "player") {
            const varr = Date.now() % 500 > 250 ? 0 : 50;
            g.sketch.fill(50, varr, 255)
        }
        else g.sketch.fill(0, 0, 0)
        g.sketch.noStroke()
        g.sketch.rect(this.x + px, this.y + py, ZOOM, ZOOM);
    }


    renderLetters(g: Graphics, x: number, y: number) {
        const letters = [...this.data.letters];
        let dy = 0;
        for (const { houseId, to, from } of letters) {
            const house = HOUSES_BY_ID[houseId]
            const street = STREET_BY_HOUSE[houseId]
            g.renderText("From: " + from + "\nTo: " + to + "\nat " + street + ", nr " + house.nr, x, y + 30 + dy)
            dy += 140
        }
    }
}
