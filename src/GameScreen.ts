import { Graphics, Keys, MigScreen, vec, Vec2 } from 'miglib';
import { Camera } from './Camera';
import { Data, Letter, Quest } from './Data';
import { Dialog } from './Dialog';
import { Input } from './Input';
import { Interactible, InteractibleDoor } from './Interactible';
import { Menu } from './Menu';
import { Player } from './Player';
import { World } from './World';
import { DEBUG, FONT, PLAYER_START, random, toggleDebug, WHITE, ZOOM } from './consts';
import { HOUSES } from './houses';
import { LetterGen } from './LetterGen';
import { genQuest } from './Quest';

export class GameScreen implements MigScreen {

    data: Data = this.load();

    world = new World();
    camera = new Camera(ZOOM, vec(this.data.playerX, this.data.playerY));
    player = new Player(this.data);
    dialog = new Dialog();
    letterGen = new LetterGen(this.data);
    menu = new Menu(this.data);

    nearest: Interactible | null = null;

    get hasLetters(): boolean { return this.data.letters.length > 0 }

    onShow(g: Graphics): void {
        g.sketch.textFont(FONT)
        g.sketch.frameRate(1000);

        this.world.init(g);

        this.world.add(new Interactible("post_door", vec(39, 237), () => !this.data.hasJob, () => this.onPostDoor()));

        for (const { pos, id, nr } of HOUSES) {
            // const x = pos.x * 8, y = pos.y * 8;
            this.world.add(new InteractibleDoor(this.data, id, nr, pos.clone(), () => this.deliver(id)));
            // g.renderImage("door_gray2", x, y)
            // const show = nr === 0 || this.DEBUG ? "*" + id : "" + nr;
            // g.renderText(show, x + 9, y + 4, { size: 5, color: WHITE })
        }

        setInterval(() => {
            this.save()
            console.log("game saved.")
        }, 10000);
    }

    clearSave() {
        localStorage.removeItem("postmangame")
        window.location.reload();
    }

    save() {
        localStorage.setItem("postmangame", JSON.stringify(this.data))
    }

    load(): Data {
        const loaded = this.tryLoad();
        if (loaded) return loaded;
        return {
            letters: [],
            quests: [],
            daysPassed: 0,
            hasJob: false,
            playerX: PLAYER_START.x,
            playerY: PLAYER_START.y,
        }
    }

    tryLoad(): Data | null {
        try {
            const dataRaw = localStorage.getItem("postmangame");
            if (!dataRaw) return null;
            const data = JSON.parse(dataRaw) as Data;
            if (!data) return null;
            return data;

        } catch (e) {
            console.error(e)
            return null;
        }
    }

    onPostDoor() {
        if (!this.data.hasJob) return this.dialog.showDialog(
            [
                { text: () => 'There is a job opening!' },
                { text: () => 'Postman. 15$ a day.' },
                {
                    text: () => 'Accept?', options: ["yes!", "maybe later..."], callback: (option: number) => {
                        if (option !== 0) return;
                        this.data.hasJob = true;
                        this.beginDay();
                        this.save();
                    }
                },
                { text: () => this.data.hasJob ? "Ok now i need to deliver all these letters. (press Q to view letters)" : "I really need a job..." }
            ],
            () => console.log('Dialog A done'),
        )

        return this.dialog.showDialog([
            {
                skip: () => !this.hasLetters,
                text: () => "I have not delivered all letters yet."
            },

            {
                skip: () => this.hasLetters,
                text: () => 'End work day?', options: ["yes", "not yet"], callback: (option: number) => {
                    if (option !== 0) return;
                    this.beginDay();
                }
            },

            {
                skip: () => this.dialog.lastOptionSelected !== 0 || !this.hasLetters,
                text: () => "Day " + this.data.daysPassed + "\n" + "Letters to deliver: " + this.data.letters.length
            }
        ], () => console.log("test"))
    }

    deliver(_id: number) {
        const id = _id;

        let relevantLetter: Letter | null = null;
        let relevantQuest: Quest | null = null;
        for (const letter of this.data.letters)
            if (letter.houseId === id) relevantLetter = letter;
        for (const quest of this.data.quests)
            if (quest.houseId === id) relevantQuest = quest;

        this.dialog.showDialog([

            {
                skip: () => relevantLetter !== null || relevantQuest !== null,
                text: () => "I have nothing to deliver here...",
            },
            {
                skip: () => relevantLetter === null,
                text: () => "Letter Delivered!",
                callback: () => this.data.letters.splice(this.data.letters.findIndex(x => x.houseId === id), 1)
            },
            {
                skip: () => relevantQuest === null,
                text: () => relevantQuest?.text ?? "",
                callback: () => { if (relevantQuest) relevantQuest.accepted = true },
            },
        ])
    }

    beginDay() {
        this.data.daysPassed++;
        this.data.letters = this.letterGen.genLetters();
        this.addRandomQuest();
        this.save();
    }

    addRandomQuest() {
        const questHouseId = random(this.data.letters).houseId;
        const interactible: InteractibleDoor | undefined = this.world.interactibles.find(x => x instanceof InteractibleDoor && x.id === questHouseId) as InteractibleDoor | undefined;
        if (!interactible) return;
        if (interactible.getQuest() !== null) return;
        const quest = genQuest(this.data);
        if (quest !== null)
            this.data.quests.push(quest)
        console.log(this.data)
    }

    onUpdate(g: Graphics): void {
        const dt = Math.min(g.deltaTime / 1000, 0.1);

        if (this.dialog.isOpen) {
            this.dialog.update(g, dt);
            this.camera.update(this.player.pos, dt);
            return;
        }


        if (Input.menuPressed()) {
            this.menu.isOpen = !this.menu.isOpen;
        }

        if (this.menu.isOpen) {
            this.menu.update(g, dt);
            this.camera.update(this.player.pos, dt);
            return;
        }


        this.player.update(dt, this.world);
        this.camera.update(this.player.pos, dt);

        let best: Interactible | null = null;
        let bestDist = Infinity;
        for (const obj of this.world.interactibles) {
            const d = Vec2.dist(this.player.pos, obj.pos);
            if (d <= obj.interactRadius && d < bestDist) {
                best = obj;
                bestDist = d;
            }
        }
        this.nearest = best;

        if (this.nearest && Input.interactPressed()) {
            this.nearest.interact();
        }
    }

    onRender(g: Graphics): void {
        if (Keys.justPressed(Keys.KEY_F9)) toggleDebug()
        if (Keys.justPressed(Keys.KEY_F10)) this.clearSave()

        g.sketch.background(0);

        this.camera.begin(g);

        this.world.renderBackground(g, this.camera.visibleRect(g));

        for (const obj of this.world.interactibles) {
            obj.render(g, obj.pos, obj === this.nearest);
        }

        this.player.render(g);

        this.camera.end(g);

        this.dialog.render(g);

        this.menu.render(g, this.player);

    }
}