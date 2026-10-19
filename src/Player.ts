import { Graphics, Rect, vec, Vec2 } from 'miglib';
import { Input } from './Input';
import { World } from './World';
import { BLOCKING } from './blocking';
import { SHOE_UPGRADE_OPTIONS, TILE_SIZE } from './consts';
import { Data } from './Data';

type Dir = "up" | "down" | "left" | "right";

const RENDER_ROWS: Record<Dir, number> = {
    down: 0,
    up: 8,
    left: 16,
    right: 24,
};


export class Player {

    movingDir: null | Dir = null;
    lastMovingDir: Dir = 'down';
    facing: Dir = "down";
    pos: Vec2
    isInCar = false

    private lastHitbox: Rect;

    get hitbox() { return this.isInCar ? new Rect(-4, -4, 14, 14) : new Rect(-2, 0, 4, 4) };
    get speed() {
        if (this.isInCar) return 150
        if (this.data.upgrades.includes(SHOE_UPGRADE_OPTIONS[2].name)) return 80
        if (this.data.upgrades.includes(SHOE_UPGRADE_OPTIONS[1].name)) return 66
        if (this.data.upgrades.includes(SHOE_UPGRADE_OPTIONS[0].name)) return 50
        return 40;
    }
    // get speed() { return 40; }

    constructor(private data: Data) {
        this.pos = vec(data.playerX, data.playerY)
        this.lastHitbox = this.hitbox;
    }

    update(dt: number, world: World): void {
        if (Input.car() && this.data.upgrades.includes("car")) {
            this.isInCar = !this.isInCar;
        }

        this.handleHitboxChange();

        const step = Input.move().scale(this.speed * dt);
        this.setDir(step);

        this.moveAxis(step.x, 0, world);
        this.moveAxis(0, step.y, world);

        this.pos = new Vec2(
            Math.min(Math.max(this.pos.x, 0), world.width),
            Math.min(Math.max(this.pos.y, 0), world.height),
        );
        this.data.playerX = this.pos.x
        this.data.playerY = this.pos.y
    }

    setDir(step: Vec2): void {
        const ax = Math.abs(step.x);
        const ay = Math.abs(step.y);

        if (this.movingDir !== null) this.lastMovingDir = this.movingDir;
        if (ax === 0 && ay === 0) {
            this.movingDir = null;
            return;
        }

        if (ax > ay) {
            this.facing = step.x < 0 ? "left" : "right";
        } else if (ay > ax) {
            this.facing = step.y < 0 ? "up" : "down";
        }
        this.movingDir = this.facing;
    }

    render(g: Graphics): void {

        if (this.isInCar) {
            g.renderImage("car", this.pos.x - 4, this.pos.y - 4, {
                w: 14,
                h: 14,
                sx: this.lastMovingDir === 'right' || this.lastMovingDir === 'down' ? 14 : 0,
                sy: this.lastMovingDir === 'up' || this.lastMovingDir === 'down' ? 14 : 0,
                sw: 14,
                sh: 14,
            });
            return;
        }

        const sy = RENDER_ROWS[this.facing];

        let sx = 0;
        if (this.movingDir !== null) {
            sx = Date.now() % 500 > 250 ? 8 : 16;
        }

        g.renderImage("player", this.pos.x - 4, this.pos.y - 4, {
            w: 8,
            h: 8,
            sx,
            sy,
            sw: 8,
            sh: 8,
        });
    }

    private isBlocking(tx: number, ty: number): boolean {
        return BLOCKING[ty]?.[tx] ?? true;
    }

    private collidingTiles(x: number, y: number, box: Rect): { wx: number, wy: number }[] {
        const out: { wx: number, wy: number }[] = [];

        const left = Math.floor((x + box.x) / TILE_SIZE);
        const right = Math.ceil((x + box.x + box.w) / TILE_SIZE) - 1;
        const top = Math.floor((y + box.y) / TILE_SIZE);
        const bottom = Math.ceil((y + box.y + box.h) / TILE_SIZE) - 1;

        for (let ty = top; ty <= bottom; ty++) {
            for (let tx = left; tx <= right; tx++) {
                if (!this.isBlocking(tx, ty)) continue;

                const wx = tx * TILE_SIZE;
                const wy = ty * TILE_SIZE;

                const hit =
                    x + box.x < wx + TILE_SIZE && x + box.x + box.w > wx &&
                    y + box.y < wy + TILE_SIZE && y + box.y + box.h > wy;
                if (hit) out.push({ wx, wy });
            }
        }
        return out;
    }

    private handleHitboxChange(): void {
        const box = this.hitbox;
        const last = this.lastHitbox;
        if (box.x === last.x && box.y === last.y && box.w === last.w && box.h === last.h) return;

        this.lastHitbox = box;
        this.pushOutOfWalls(box);
    }

    private pushOutOfWalls(box: Rect): void {
        for (const { wx, wy } of this.collidingTiles(this.pos.x, this.pos.y, box)) {
            const left = this.pos.x + box.x;
            const top = this.pos.y + box.y;

            const overlapX = Math.min(left + box.w, wx + TILE_SIZE) - Math.max(left, wx);
            const overlapY = Math.min(top + box.h, wy + TILE_SIZE) - Math.max(top, wy);
            if (overlapX <= 0 || overlapY <= 0) continue;

            const dirX = left + box.w / 2 < wx + TILE_SIZE / 2 ? -1 : 1;
            const dirY = top + box.h / 2 < wy + TILE_SIZE / 2 ? -1 : 1;

            if (overlapX < overlapY) this.pos = new Vec2(this.pos.x + dirX * overlapX, this.pos.y);
            else this.pos = new Vec2(this.pos.x, this.pos.y + dirY * overlapY);
        }
    }

    private moveAxis(dx: number, dy: number, world: World): void {
        if (dx === 0 && dy === 0) return;

        const box = this.hitbox;
        let x = this.pos.x + dx;
        let y = this.pos.y + dy;

        const left = Math.floor((x + box.x) / TILE_SIZE);
        const right = Math.ceil((x + box.x + box.w) / TILE_SIZE) - 1;
        const top = Math.floor((y + box.y) / TILE_SIZE);
        const bottom = Math.ceil((y + box.y + box.h) / TILE_SIZE) - 1;

        for (let ty = top; ty <= bottom; ty++) {
            for (let tx = left; tx <= right; tx++) {
                if (!this.isBlocking(tx, ty)) continue;

                const wx = tx * TILE_SIZE;
                const wy = ty * TILE_SIZE;

                const hit =
                    x + box.x < wx + TILE_SIZE && x + box.x + box.w > wx &&
                    y + box.y < wy + TILE_SIZE && y + box.y + box.h > wy;
                if (!hit) continue;

                if (dx > 0) x = wx - box.x - box.w;
                else if (dx < 0) x = wx + TILE_SIZE - box.x;
                if (dy > 0) y = wy - box.y - box.h;
                else if (dy < 0) y = wy + TILE_SIZE - box.y;
            }
        }

        this.pos = new Vec2(x, y);
    }

}