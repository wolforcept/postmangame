import { Graphics } from 'miglib';
import { Input } from './Input';
import { WHITE, ZOOM } from './consts';

export interface DialogPart {
    text: () => string
    // skip?: () => boolean
    options?: string[]
    callback?: (option: number) => void
}

const MAX_INTERACT_CD = 160;

export class Dialog {
    charsPerSecond = 30;

    width = 950;
    height = 150;
    padding = 24;

    textSize = 24;
    textColor = WHITE;

    private parts: DialogPart[] = [];
    private partIndex = 0;
    private revealed = 0;
    private selectedOption = 0;
    lastOptionSelected: null | number = null;
    // private onDone?: () => void;

    constructor() { }

    get hasParts(): boolean {
        return this.partIndex < this.parts.length;
    }

    showEasy(text: string): void {
        this.show([{ text: () => text }])
    }

    show(parts: DialogPart[]): void {
        if (this.hasParts) {
            this.parts.splice(this.partIndex + 1, 0, ...parts);
            return;
        }

        this.parts = [...parts];
        this.partIndex = 0;
        this.revealed = 0;
        this.selectedOption = 0;
        this.interactCooldown = MAX_INTERACT_CD;
        this.lastOptionSelected = null;
    }

    // private skipParts(): void {
    //     while (this.hasParts && this.parts[this.partIndex].skip?.()) this.goNext();
    // }

    update(g: Graphics, dt: number): void {
        // this.skipParts();
        if (!this.hasParts) return;

        const part = this.parts[this.partIndex];
        const text = part.text();
        const textLength = text.length;

        this.revealed = Math.min(this.revealed + this.charsPerSecond * dt, textLength);

        if (part.options && part.callback && this.revealed >= textLength) {
            this.handleOption(g, part, text, textLength)
        } else {
            this.handleNormal(g, part, text, textLength)
        }
    }

    interactCooldown = 0;
    handleOption(g: Graphics, part: DialogPart, text: string, textLength: number) {
        if (this.interactCooldown > 0) {
            this.interactCooldown -= g.deltaTime;
            return;
        }
        const mv = Input.move();
        if (mv.x > 0) {
            this.selectedOption = Math.max(0, Math.min(part.options!!.length - 1, this.selectedOption + 1))
            this.interactCooldown = MAX_INTERACT_CD
        }
        if (mv.x < 0) {
            this.selectedOption = Math.max(0, Math.min(part.options!!.length - 1, this.selectedOption - 1))
            this.interactCooldown = MAX_INTERACT_CD
        }
        if (!Input.interactPressed()) return;
        this.lastOptionSelected = this.selectedOption;
        part.callback!!(this.selectedOption)
        this.goNext()
    }

    handleNormal(g: Graphics, part: DialogPart, text: string, textLength: number) {

        if (!Input.interactPressed()) return;

        if (this.revealed < textLength) {
            this.revealed = textLength;
            return;
        }

        if (part.callback) part.callback(0)

        this.goNext()
    }

    goNext() {
        this.partIndex++;
        this.revealed = 0;
        if (!this.hasParts) {
            // const onDone = this.onDone;
            // this.onDone = undefined;
            // onDone?.();
        }
    }

    render(g: Graphics): void {
        // this.skipParts();
        if (!this.hasParts) return;

        const part = this.parts[this.partIndex];

        const w = this.width;
        const h = this.height;
        const x = Math.floor(g.width / 2 - w / 2);
        const y = Math.floor(g.height - h - 8);
        g.render9patch("patch", x, y, w, h, { scale: ZOOM });

        const s = g.sketch;
        s.push();

        const lines = this.wrap(g, part.text(), w - this.padding * 2);
        const lineHeight = this.textSize * 1.25;
        let remaining = Math.floor(this.revealed);
        for (let i = 0; i < lines.length && remaining > 0; i++) {
            g.renderText(lines[i].slice(0, remaining), x + this.padding, y + this.textSize + this.padding + i * lineHeight, { size: this.textSize, color: this.textColor })
            remaining -= lines[i].length;
        }
        s.pop();

        if (part.options) {
            // if (part.options && this.revealed >= textLength) {
            let dx = 0;
            const ox = x + 24;
            const oy = y + h - 8 - this.textSize;
            for (let i = 0; i < part.options.length; i++) {
                let opt = part.options[i];
                if (i === this.selectedOption) opt = "[" + opt + "]"
                else opt = " " + opt + " "
                g.renderText(opt, ox + dx, oy, { size: this.textSize, color: this.textColor })
                dx += 50 + g.textWidth(opt, { size: this.textSize })
            }
        }
    }

    private wrap(g: Graphics, text: string, maxWidth: number): string[] {
        const lines: string[] = [];
        let line = '';
        for (const word of text.split(/(?<=\s)/)) {
            if (line && g.textWidth((line + word), { size: this.textSize }) > maxWidth) {
                lines.push(line);
                line = '';
            }
            line += word;
        }
        if (line) lines.push(line);
        return lines;
    }
}