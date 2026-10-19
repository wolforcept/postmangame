import { Graphics, Keys, MigScreen, vec, Vec2 } from 'miglib';
import { Camera } from './Camera';
import { FONT, PLAYER_START, random, SHOE_UPGRADE_OPTIONS, toggleDebug, UpgraderId, WHITE, ZOOM } from './consts';
import { Data, Letter, Quest } from './Data';
import { Dialog } from './Dialog';
import { HOUSES } from './houses';
import { Input } from './Input';
import { Interactible, InteractibleDoor, InteractibleShop, InteractibleUpgrader } from './Interactible';
import { LetterGen } from './LetterGen';
import { Menu } from './Menu';
import { Player } from './Player';
import { genQuest, REQUESTS_BY_SHOP } from './Quest';
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

        this.world.add(new Interactible("door", vec(39, 237), () => !this.data.hasJob, () => this.onPostDoor()));
        this.world.add(new InteractibleShop("Toy Shop", vec(102, 252), (self) => this.onShop(self.id)));
        this.world.add(new InteractibleShop("Library", vec(118, 247), (self) => this.onShop(self.id)));
        this.world.add(new InteractibleShop("Hardware store", vec(49, 191), (self) => this.onShop(self.id)));
        this.world.add(new InteractibleShop("Bakery", vec(86, 179), (self) => this.onShop(self.id)));
        this.world.add(new InteractibleShop("Groceries", vec(68, 205), (self) => this.onShop(self.id)));

        this.world.add(new InteractibleUpgrader("Used Cars", "person2", vec(79, 198), (self) => this.onUpgrader(self.id)));
        this.world.add(new InteractibleUpgrader("Shoes", "person3", vec(105, 224), (self) => this.onUpgrader(self.id)));
        this.world.add(new InteractibleUpgrader("School", "person4", vec(75, 265), (self) => this.onUpgrader(self.id)));


        for (const { id, amount, pos } of moneyss) {
            if (!this.data.caughtMoney.includes(id))
                this.world.add(new Interactible("money", pos, () => true, (self) => {
                    this.data.caughtMoney.push(id)
                    if (this.data.caughtMoney.length < moneyss.length)
                        this.dialog.showEasy("Found " + amount + "$")
                    else
                        this.dialog.show([{ text: () => "Found " + amount + "$" }, { text: () => "Achievement! I collected all the scattered money!" }])
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

    // load(): Data {
    //     const loaded = this.tryLoad() as any;
    //     const newData = {
    //         money: 0,
    //         knowledge: 0,
    //         daysPassed: 0,
    //         playerX: PLAYER_START.x,
    //         playerY: PLAYER_START.y,
    //         promotion: 0,
    //         inventory: [],
    //         caughtMoney: [],
    //         letters: [],
    //         quests: [],
    //         upgrades: [],
    //         hasJob: false,
    //         learnedToday: false,
    //     }
    //     if (loaded.money &&         /**/ typeof loaded.money             /**/ === "number")  /**/ newData.money          /**/ = loaded.money
    //     if (loaded.knowledge &&     /**/ typeof loaded.knowledge         /**/ === "number")  /**/ newData.knowledge      /**/ = loaded.knowledge
    //     if (loaded.daysPassed &&    /**/ typeof loaded.daysPassed        /**/ === "number")  /**/ newData.daysPassed     /**/ = loaded.daysPassed
    //     if (loaded.playerX &&       /**/ typeof loaded.playerX           /**/ === "number")  /**/ newData.playerX        /**/ = loaded.playerX
    //     if (loaded.playerY &&       /**/ typeof loaded.playerY           /**/ === "number")  /**/ newData.playerY        /**/ = loaded.playerY
    //     if (loaded.promotion &&     /**/ typeof loaded.promotion         /**/ === "number")  /**/ newData.promotion      /**/ = loaded.promotion
    //     if (loaded.inventory && loaded.inventory.length)                                     /**/ newData.inventory      /**/ = loaded.inventory
    //     if (loaded.caughtMoney && loaded.caughtMoney.length)                                 /**/ newData.caughtMoney    /**/ = loaded.caughtMoney
    //     if (loaded.letters && loaded.letters.length)                                         /**/ newData.letters        /**/ = loaded.letters
    //     if (loaded.quests && loaded.quests.length)                                           /**/ newData.quests         /**/ = loaded.quests
    //     if (loaded.upgrades && loaded.upgrades.length)                                       /**/newData.upgrades       /**/ = loaded.upgrades
    //     if (typeof loaded.hasJob === "boolean")                                              /**/ newData.hasJob         /**/ = loaded.hasJob
    //     if (typeof loaded.learnedToday === "boolean")                                        /**/ newData.learnedToday   /**/ = loaded.learnedToday
    //     return newData;
    // }
    load(): Data {
        const init = this.makeInit(this.tryLoad());
        return {
            money: init("money", 0),
            career: init("career", 0),
            knowledge: init("knowledge", 0),
            daysPassed: init("daysPassed", 0),
            playerX: init("playerX", PLAYER_START.x),
            playerY: init("playerY", PLAYER_START.y),
            promotion: init("promotion", 0),
            inventory: init("inventory", []),
            caughtMoney: init("caughtMoney", []),
            letters: init("letters", []),
            quests: init("quests", []),
            upgrades: init("upgrades", []),
            hasJob: init("hasJob", false),
            learnedToday: init("learnedToday", false),
        };
    }

    makeInit(saved: unknown) {
        const src = (saved && typeof saved === "object" ? saved : {}) as Record<string, unknown>;

        /** Returns the saved value if it exists and has the right type, otherwise the default. */
        return function init<K extends keyof Data>(key: K, fallback: Data[K]): Data[K] {
            const v = src[key];
            const valid =
                Array.isArray(fallback) ? Array.isArray(v) :
                    typeof fallback === "number" ? typeof v === "number" && Number.isFinite(v) :
                        typeof v === typeof fallback;
            return valid ? (v as Data[K]) : fallback;
        };
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

    onShop(id: string) {
        const dialog = this.dialog;
        const req = REQUESTS_BY_SHOP[id];

        dialog.show([{
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
                    dialog.showEasy("You purchased " + opt.preposition + " " + opt.itemName + " for " + opt.price + "$.")
                } else {
                    dialog.showEasy("Not enough money.")
                }
            }
        }])
    }

    onUpgrader(id: UpgraderId) {

        const dialog = this.dialog;

        switch (id) {

            case "Used Cars": {

                if (this.data.upgrades.includes("car"))
                    return dialog.showEasy("Only one deal per person!");

                return dialog.show([{
                    text: () => "Would you like to buy a used car? We have great deals as low as 500$!",
                    options: ["no", "yes"],
                    callback: (_opt) => {
                        if (_opt === 0) return;
                        if (this.data.money >= 500) {
                            this.data.money -= 500
                            this.data.upgrades.push("car")
                            dialog.showEasy("You purchased a used car for 500$. Press C to drive.")
                            this.save();
                        } else {
                            dialog.showEasy("Not enough money.")
                        }
                    }
                }]);
            }

            case "Shoes": {

                const opts = SHOE_UPGRADE_OPTIONS;
                return dialog.show([{
                    text: () => "We have the best running shoes!",
                    options: ["cancel", ...opts.map(x => x.name + " " + x.price + "$")],
                    callback: (_opt) => {
                        if (_opt === 0) return;
                        const opt = opts[_opt - 1];
                        if (this.data.upgrades.includes(opt.name))
                            dialog.showEasy("You already own this.")
                        else {
                            if (this.data.money >= opt.price) {
                                dialog.showEasy("You purchased " + opt.name + " for " + opt.price + "$.")
                                this.data.money -= opt.price
                                this.data.upgrades.push(opt.name)
                            } else {
                                dialog.showEasy("Not enough money.")
                            }
                        }
                    }
                }]);
            }


            case "School": {

                if (this.data.learnedToday)
                    return dialog.showEasy("Only once per day!")

                if (this.data.upgrades.includes("school")) {
                    this.data.learnedToday = true;
                    this.data.knowledge++;
                    return dialog.show([{ text: () => "Your knowledge increased to " + this.data.knowledge }])
                }
                return dialog.show([{
                    text: () => "Would you like to sign up for our lessons? Only 100$. Each lesson increases your chance to be promoted!",
                    options: ["no", "yes"],
                    callback: (_opt) => {
                        if (_opt === 0) return;
                        if (this.data.money >= 100) {
                            this.data.knowledge++;
                            this.data.learnedToday = true;
                            dialog.show([
                                { text: () => "You signed up for school lessons for 100$." },
                                { text: () => "Your knowledge increased to " + this.data.knowledge },
                                { text: () => "Come back every day to increase your knowledge" },
                            ])
                            this.data.money -= 100
                            this.data.upgrades.push("school")
                        } else {
                            dialog.showEasy("Not enough money.")
                        }
                    }
                }]);
            }

        }
    }

    onPostDoor() {
        if (!this.data.hasJob) return this.dialog.show(
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
        )

        if (this.hasLetters)
            return this.dialog.showEasy("I have not delivered all letters yet.");

        return this.dialog.show([

            {
                text: () => 'End work day?', options: ["yes", "not yet"], callback: (option: number) => {
                    if (option !== 0) return;
                    this.beginDay();
                    this.dialog.show([{
                        text: () => "Day " + this.data.daysPassed + "\n" + "Letters to deliver: " + this.data.letters.length
                    }])
                }
            },
        ])
    }

    deliver(_id: number) {
        const id = _id;

        let letter: Letter | null = null;
        let quest: Quest | null = null;
        for (const _letter of this.data.letters)
            if (_letter.houseId === id) letter = _letter;
        for (const _quest of this.data.quests)
            if (_quest.houseId === id) quest = _quest;

        if (letter === null && quest === null) {
            this.dialog.showEasy("I have nothing to deliver here...")
            return;
        }

        if (letter) {
            this.data.letters.splice(this.data.letters.findIndex(x => x.houseId === id), 1)
            this.dialog.showEasy("Letter Delivered!");
        }

        if (quest) {

            if (!quest.accepted) {
                this.dialog.showEasy(quest.text)
                quest.accepted = true;
                return;
            }

            //already accepted
            if (this.data.inventory.includes(quest.item)) {
                this.dialog.show([{
                    text: () => "Thank you! Please accept this!",
                }, {
                    text: () => "*You receive " + quest.reward + "$*",
                    callback: () => {
                        this.data.inventory.splice(this.data.inventory.indexOf(quest.item), 1)
                        this.data.quests.splice(this.data.quests.indexOf(quest), 1)
                    }
                }]);
            } else {
                this.dialog.showEasy(quest.text)
            }

        }

    }

    beginDay() {
        this.data.daysPassed++;
        this.data.letters = this.letterGen.genLetters();
        this.data.learnedToday = false;
        this.addRandomQuest();

        if (this.data.knowledge > 0) {
            const diff = this.data.knowledge - this.data.career
            if (diff > 0 && Math.random() < diff * .1) {
                this.data.career++;
                const newEarn = 25 + 10 * this.data.career;
                this.dialog.showEasy("You have been promoted! You will now earn " + newEarn + "$ per day.")
            }
        }

        this.data.money += 25 + 10 * this.data.career;

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
    }

    onUpdate(g: Graphics): void {
        const dt = Math.min(g.deltaTime / 1000, 0.1);

        if (this.dialog.hasParts) {
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

        if (!this.player.isInCar && this.nearest && Input.interactPressed()) {
            this.nearest.interact();
        }
    }

    onRender(g: Graphics): void {
        if (Keys.justPressed(Keys.KEY_F10)) this.player.pos.set(PLAYER_START.x, PLAYER_START.y);// toggleDebug()
        if (Keys.justPressed(Keys.KEY_F9)) this.clearSave()

        g.sketch.background(0);

        this.camera.begin(g);

        this.world.renderBackground(g, this.camera.visibleRect(g));

        for (const obj of this.world.interactibles) {
            obj.render(g, obj.pos, !this.player.isInCar && obj === this.nearest);
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