import { Graphics, Rect } from 'miglib';
import { Interactible } from './Interactible';

export class World {
    width = 0;
    height = 0;
    interactibles: Interactible[] = [];

    constructor() { }

    init(g: Graphics): void {
        const img = g.assets.getImage("world");
        this.width = img.width;
        this.height = img.height;
    }

    add(obj: Interactible): void {
        this.interactibles.push(obj);
    }

    renderBackground(g: Graphics, view: Rect): void {
        const x0 = Math.max(0, Math.floor(view.x));
        const y0 = Math.max(0, Math.floor(view.y));
        const x1 = Math.min(this.width, Math.ceil(view.x + view.w));
        const y1 = Math.min(this.height, Math.ceil(view.y + view.h));

        const w = x1 - x0;
        const h = y1 - y0;
        if (w <= 0 || h <= 0) return;

        g.renderImage("world", x0, y0, {
            sx: x0,
            sy: y0,
            sw: w,
            sh: h,
            w,
            h,
        });

    }
}