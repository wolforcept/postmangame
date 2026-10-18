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

const requests = [
    { locationPrefix: "the ", locationId: "Bakery",                   /**/ item: "some bread" },
    { locationPrefix: "the ", locationId: "Bakery",                   /**/ item: "some croissants" },
    { locationPrefix: "the ", locationId: "Bakery",                   /**/ item: "a birthday cake" },
    { locationPrefix: "the ", locationId: "Grocery",                  /**/ item: "some apples" },
    { locationPrefix: "the ", locationId: "Grocery",                  /**/ item: "some milk" },
    { locationPrefix: "the ", locationId: "Grocery",                  /**/ item: "some eggs" },
    { locationPrefix: "the ", locationId: "Butcher",                  /**/ item: "some sausages" },
    { locationPrefix: "the ", locationId: "Butcher",                  /**/ item: "some ham" },
    { locationPrefix: "the ", locationId: "Florist",                  /**/ item: "some roses" },
    { locationPrefix: "the ", locationId: "Florist",                  /**/ item: "a bouquet" },
    { locationPrefix: "the ", locationId: "Florist",                  /**/ item: "some seeds" },
    { locationPrefix: "the ", locationId: "Pharmacy",                 /**/ item: "some cough syrup" },
    { locationPrefix: "the ", locationId: "Pharmacy",                 /**/ item: "some bandages" },
    { locationPrefix: "the ", locationId: "Hardware store",           /**/ item: "a hammer" },
    { locationPrefix: "the ", locationId: "Hardware store",           /**/ item: "some nails" },
    { locationPrefix: "the ", locationId: "Hardware store",           /**/ item: "some paint" },
    { locationPrefix: "the ", locationId: "Library",                  /**/ item: "a map" },
    { locationPrefix: "the ", locationId: "Library",                  /**/ item: "a storybook" },
    { locationPrefix: "the ", locationId: "Library",                  /**/ item: "this book" },
    { locationPrefix: "the ", locationId: "Tailor",                   /**/ item: "a wool coat" },
    { locationPrefix: "the ", locationId: "Tailor",                   /**/ item: "a scarf" },
    { locationPrefix: "the ", locationId: "Tailor",                   /**/ item: "some buttons" },
    { locationPrefix: "the ", locationId: "Toy shop",                 /**/ item: "a teddy bear" },
    { locationPrefix: "the ", locationId: "Toy shop",                 /**/ item: "a kite" },
    { locationPrefix: "the ", locationId: "Toy shop",                 /**/ item: "a puzzle" },
    { locationPrefix: "the ", locationId: "Antique shop",             /**/ item: "a pocket watch" },
    { locationPrefix: "the ", locationId: "Antique shop",             /**/ item: "a music box" },
    { locationPrefix: "the ", locationId: "Antique shop",             /**/ item: "an old key" },
    { locationPrefix: "the ", locationId: "General store",            /**/ item: "some rope" },
    { locationPrefix: "the ", locationId: "General store",            /**/ item: "some matches" },
    { locationPrefix: "the ", locationId: "General store",            /**/ item: "some candles" },
]

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
    let houseId: number | undefined;
    let i = 0;
    do {
        const tempId = random(data.letters).houseId;
        console.log(typeof HOUSES_BY_ID[tempId].nr)
        if (typeof HOUSES_BY_ID[tempId].nr !== "number")
            houseId = undefined;
        else
            houseId = tempId
        i++;
        if (i > 100) return null;
    } while (houseId === undefined)

    return {
        houseId,
        text: ask.replace("<thing>", request.item + " from " + request.locationPrefix + request.locationId),
        locationId: request.locationId,
        personImg: random(personImages),
        accepted: false,
    }
}