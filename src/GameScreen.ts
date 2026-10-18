import { Graphics, Keys, MigScreen, vec, Vec2 } from 'miglib';
import { Camera } from './Camera';
import { FONT, PLAYER_START, random, toggleDebug, WHITE, ZOOM } from './consts';
import { Data, Letter, Quest } from './Data';
import { Dialog } from './Dialog';
import { HOUSES } from './houses';
import { Input } from './Input';
import { Interactible, InteractibleDoor, InteractibleShop } from './Interactible';
import { LetterGen } from './LetterGen';
import { Menu } from './Menu';
import { Player } from './Player';
import { genQuest } from './Quest';
import { World } from './World';

const moneyss = [
    { id: 1, amount: 10, pos: vec(36, 244) },
    { id: 2, amount: 10, pos: vec(48, 219) },
    { id: 3, amount: 15, pos: vec(68, 185) },
    { id: 4, amount: 5, pos: vec(0, 249) },
    { id: 5, amount: 20, pos: vec(95, 285) },
    { id: 6, amount: 15, pos: vec(125, 263) },
    { id: 7, amount: 100, pos: vec(288, 6) },
    { id: 8, amount: 10, pos: vec(178, 150) },
]

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

        this.world.add(new Interactible("door_gray2", vec(39, 237), () => !this.data.hasJob, () => this.onPostDoor()));
        this.world.add(new InteractibleShop(this.dialog, this.data, "Toy Shop", vec(102, 252)));
        this.world.add(new InteractibleShop(this.dialog, this.data, "Library", vec(118, 247)));
        this.world.add(new InteractibleShop(this.dialog, this.data, "Hardware store", vec(49, 191)));
        this.world.add(new InteractibleShop(this.dialog, this.data, "Bakery", vec(86, 179)));
        this.world.add(new InteractibleShop(this.dialog, this.data, "Groceries", vec(68, 205)));


        for (const { id, amount, pos } of moneyss) {
            if (!this.data.caughtMoney.includes(id))
                this.world.add(new Interactible("money", pos, () => true, (self) => {
                    this.data.caughtMoney.push(id)
                    console.log(this.data.caughtMoney.length, moneyss.length)
                    if (this.data.caughtMoney.length < moneyss.length)
                        this.dialog.showDialogEasy("Found " + amount + "$")
                    else
                        this.dialog.showDialog([{ text: () => "Found " + amount + "$" }, { text: () => "Achievement! I collected all the scattered money!" }])
                    this.data.money += amount;
                    const inter: number = this.world.interactibles.findIndex(x => x === self);
                    this.world.interactibles.splice(inter, 1)
                    this.save();
                }));
        }

        for (const { pos, id, nr } of HOUSES) {
            this.world.add(new InteractibleDoor(this.data, id, nr, pos.clone(), () => this.deliver(id)));
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
            money: 0,
            inventory: [],
            caughtMoney: [],
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
                { text: () => 'Postman. 25$ a day.' },
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
                callback: () => {
                    if (!relevantQuest) return;
                    if (!relevantQuest.accepted)
                        relevantQuest.accepted = true;
                    else {
                        console.log(this.data.inventory, relevantQuest.item, this.data.inventory.includes(relevantQuest.item))
                        if (this.data.inventory.includes(relevantQuest.item)) {
                            this.data.inventory.splice(this.data.inventory.indexOf(relevantQuest.item), 1)
                            relevantQuest.completed = true;
                        }
                    }
                },
            },
            {
                skip: () => relevantQuest === null || relevantQuest.completed !== true,
                text: () => "Thank you! Please accept this!\n*You receive " + relevantQuest!!.reward + "$*",
            },
        ])
    }

    beginDay() {
        this.data.money += 25;
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
        if (Keys.justPressed(Keys.KEY_F10)) toggleDebug()
        if (Keys.justPressed(Keys.KEY_F9)) this.clearSave()

        g.sketch.background(0);

        this.camera.begin(g);

        this.world.renderBackground(g, this.camera.visibleRect(g));

        for (const obj of this.world.interactibles) {
            obj.render(g, obj.pos, obj === this.nearest);
        }

        this.player.render(g);

        this.camera.end(g);

        // g.render9patch("patch", 0, 0, 200, 80, { scale: ZOOM })
        // const ww = g.textWidth(this.data.money + "$", { size: 50 })
        // g.renderText(this.data.money + "$", 170 - ww, 58, { size: 50, color: WHITE })

        this.dialog.render(g);

        this.menu.render(g, this.player);

    }
}