import { random } from "./consts"

const asks = [
    "Oh, postman, since you're out on your rounds anyway, could you pick up <thing> for me?",
    "Good morning, postman! Would you mind bringing me <thing> on your next trip through town?",
    "I hate to add to your bag, but could you fetch <thing> for me, please?",
    "If it's not too much trouble, could you drop <thing> by my door on your way back?",
    "You know this town better than anyone, postman. Would you help me find <thing>?",
]

const requests = [
    { locationId: "Bakery",                   /**/ item: "some bread" },
    { locationId: "Bakery",                   /**/ item: "some croissants" },
    { locationId: "Bakery",                   /**/ item: "a birthday cake" },
    { locationId: "Grocery",                  /**/ item: "some apples" },
    { locationId: "Grocery",                  /**/ item: "some milk" },
    { locationId: "Grocery",                  /**/ item: "some eggs" },
    { locationId: "Butcher",                  /**/ item: "some sausages" },
    { locationId: "Butcher",                  /**/ item: "some ham" },
    { locationId: "Florist",                  /**/ item: "some roses" },
    { locationId: "Florist",                  /**/ item: "a bouquet" },
    { locationId: "Florist",                  /**/ item: "some seeds" },
    { locationId: "Pharmacy",                 /**/ item: "some cough syrup" },
    { locationId: "Pharmacy",                 /**/ item: "some bandages" },
    { locationId: "Hardware store",           /**/ item: "a hammer" },
    { locationId: "Hardware store",           /**/ item: "some nails" },
    { locationId: "Hardware store",           /**/ item: "some paint" },
    { locationId: "Bookshop",                 /**/ item: "a novel" },
    { locationId: "Bookshop",                 /**/ item: "a map" },
    { locationId: "Bookshop",                 /**/ item: "a storybook" },
    { locationId: "Tailor",                   /**/ item: "a wool coat" },
    { locationId: "Tailor",                   /**/ item: "a scarf" },
    { locationId: "Tailor",                   /**/ item: "some buttons" },
    { locationId: "Toy shop",                 /**/ item: "a teddy bear" },
    { locationId: "Toy shop",                 /**/ item: "a kite" },
    { locationId: "Toy shop",                 /**/ item: "a puzzle" },
    { locationId: "Antique shop",             /**/ item: "a pocket watch" },
    { locationId: "Antique shop",             /**/ item: "a music box" },
    { locationId: "Antique shop",             /**/ item: "an old key" },
    { locationId: "General store",            /**/ item: "some rope" },
    { locationId: "General store",            /**/ item: "some matches" },
    { locationId: "General store",            /**/ item: "some candles" },
]


export interface Quest {
    text: string
    locationId: string
}

export function genQuest(): Quest {

    const ask = random(asks);
    const request = random(requests);

    return {
        text: ask.replace("<thing>", request.item),
        locationId: request.locationId,
    }
}