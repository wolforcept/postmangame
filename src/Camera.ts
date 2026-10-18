import { Graphics, Rect, Vec2 } from 'miglib';

export class Camera {
    pos: Vec2;
    stiffness = 4;

    constructor(public zoom: number, start: Vec2) {
        this.pos = start
    }

    update(target: Vec2, dt: number): void {
        const t = 1 - Math.exp(-this.stiffness * dt);
        this.pos = new Vec2(
            this.pos.x + (target.x - this.pos.x) * t,
            this.pos.y + (target.y - this.pos.y) * t,
        );
    }

    viewSize(g: Graphics): Vec2 {
        return new Vec2(g.width / this.zoom, g.height / this.zoom);
    }

    origin(g: Graphics): Vec2 {
        const size = this.viewSize(g);
        return new Vec2(this.pos.x - size.x / 2, this.pos.y - size.y / 2);
    }

    visibleRect(g: Graphics): Rect {
        const o = this.origin(g);
        const size = this.viewSize(g);
        return new Rect(o.x, o.y, size.x, size.y);
    }

    begin(g: Graphics): void {
        const o = this.origin(g);
        g.sketch.push();
        g.sketch.scale(this.zoom);
        g.sketch.translate(-o.x, -o.y);
    }

    end(g: Graphics): void {
        g.sketch.pop();
    }
}
