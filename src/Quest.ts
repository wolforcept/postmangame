import { random } from "./consts"
import { Data, Quest } from "./Data";
import { HOUSES_BY_ID } from "./houses";

const asks = [
    "Oh, postman, since you're out on your rounds anyway, could you pick up <thing> for me?",
    "Good morning, postman! Would you mind bringing me <thing> on your next trip through town?",
    "I hate to add to your bag, but could you fetch <thing> for me, please?",
    "If it's not too much trouble, could you drop <thing> by my door on your way back?",
    "You know this town better than anyone, postman. Would you help me find <thing>?",
]

export interface Request {
    locationPrefix: string
    price: number
    locationId: string
    itemName: string
    preposition: string
}

const requests: Request[] = [
    { locationPrefix: "the ", price: 5, locationId: "Bakery",              /**/ itemName: "bread", preposition: "some" },
    { locationPrefix: "the ", price: 10, locationId: "Bakery",              /**/ itemName: "croissants", preposition: "some" },
    { locationPrefix: "the ", price: 20, locationId: "Bakery",              /**/ itemName: "birthday cake", preposition: "a" },
    { locationPrefix: "the ", price: 8, locationId: "Groceries",           /**/ itemName: "apples", preposition: "some" },
    { locationPrefix: "the ", price: 12, locationId: "Groceries",           /**/ itemName: "milk", preposition: "some" },
    { locationPrefix: "the ", price: 15, locationId: "Groceries",           /**/ itemName: "eggs", preposition: "some" },
    // { locationPrefix: "the ", price:20, locationId: "Butcher",          /**/ item: "sausages" , preposition: some""},
    // { locationPrefix: "the ", price:20, locationId: "Butcher",          /**/ item: "ham" , preposition: some""},
    // { locationPrefix: "the ", price:20, locationId: "Florist",          /**/ item: "roses" , preposition: some""},
    // { locationPrefix: "the ", price:20, locationId: "Florist",          /**/ item: "bouquet" , preposition: a""},
    // { locationPrefix: "the ", price:20, locationId: "Florist",          /**/ item: "seeds" , preposition: some""},
    // { locationPrefix: "the ", price:20, locationId: "Pharmacy",         /**/ item: "cough syrup" , preposition: some""},
    // { locationPrefix: "the ", price:20, locationId: "Pharmacy",         /**/ item: "bandages" , preposition: some""},
    { locationPrefix: "the ", price: 50, locationId: "Hardware store",      /**/ itemName: "hammer", preposition: "a" },
    { locationPrefix: "the ", price: 18, locationId: "Hardware store",      /**/ itemName: "nails", preposition: "some" },
    { locationPrefix: "the ", price: 32, locationId: "Hardware store",      /**/ itemName: "paint", preposition: "some" },
    { locationPrefix: "the ", price: 40, locationId: "Library",             /**/ itemName: "map", preposition: "a" },
    { locationPrefix: "the ", price: 44, locationId: "Library",             /**/ itemName: "storybook", preposition: "a" },
    { locationPrefix: "the ", price: 25, locationId: "Library",             /**/ itemName: "book", preposition: "this" },
    // { locationPrefix: "the ", price:20, locationId: "Tailor",           /**/ item: "wool coat" , preposition: "a"},
    // { locationPrefix: "the ", price:20, locationId: "Tailor",           /**/ item: "scarf" , preposition: "a"},
    // { locationPrefix: "the ", price:20, locationId: "Tailor",           /**/ item: "buttons" , preposition: "some"},
    { locationPrefix: "the ", price: 80, locationId: "Toy Shop",            /**/ itemName: "teddy bear", preposition: "a" },
    { locationPrefix: "the ", price: 120, locationId: "Toy Shop",            /**/ itemName: "kite", preposition: "a" },
    { locationPrefix: "the ", price: 75, locationId: "Toy Shop",            /**/ itemName: "puzzle", preposition: "a" },
    // { locationPrefix: "the ", price:20, locationId: "Antique shop",     /**/ item: "pocket watch" , preposition: "a"},
    // { locationPrefix: "the ", price:20, locationId: "Antique shop",     /**/ item: "music box" , preposition: "a"},
    // { locationPrefix: "the ", price:20, locationId: "Antique shop",     /**/ item: "old key" , preposition: "an"},
    // { locationPrefix: "the ", price:20, locationId: "General store",    /**/ item: "rope" , preposition: "some"},
    // { locationPrefix: "the ", price:20, locationId: "General store",    /**/ item: "matches" , preposition: "some"},
    // { locationPrefix: "the ", price:20, locationId: "General store",    /**/ item: "candles" , preposition: "some"},
]

export const REQUESTS_BY_SHOP: { [key: string]: Request[] } = {}
for (const request of requests) {
    if (!REQUESTS_BY_SHOP[request.locationId]) REQUESTS_BY_SHOP[request.locationId] = []
    REQUESTS_BY_SHOP[request.locationId].push(request)
}

const personImages = [
    "person1",
    "person2",
    "person3",
    "person4",
    "person5",
    "person6",
    "person7",
    "person8",
    "person9",
    "person10",
]

export function genQuest(data: Data): Quest | null {

    const ask = random(asks);
    const request = random(requests);
    let houseId = random(data.letters).houseId;
    // let i = 0;
    // do {
    //     console.log(typeof HOUSES_BY_ID[tempId].nr)
    //     if (typeof HOUSES_BY_ID[tempId].nr !== "number")
    //         houseId = undefined;
    //     else
    //         houseId = tempId
    //     i++;
    //     if (i > 100) return null;
    // } while (houseId === undefined)

    return {
        completed: false,
        item: request.itemName,
        houseId,
        text: ask.replace("<thing>", request.preposition + " " + request.itemName + " from " + request.locationPrefix + request.locationId),
        locationId: request.locationId,
        personImg: random(personImages),
        accepted: false,
        reward: Math.floor(request.price * (1.5 + Math.random()))
    }
}