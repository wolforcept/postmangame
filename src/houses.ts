import { rect, Rect, RectLike, vec, Vec2 } from "miglib";

export interface House {
    id: number
    nr: number
    pos: Vec2
    residents: string[]
}

export const HOUSES: House[] = [

    // Plinth Boulevard
    { id: 4, residents: ["Mr. Maximus", "Mrs. Brianna"],                   /**/ nr: 1, pos: vec(44, 237) },
    { id: 9, residents: ["Miss. Delilah"],                                 /**/ nr: 2, pos: vec(52, 237) },
    { id: 12, residents: ["Mrs. Emmy"],                                    /**/ nr: 3, pos: vec(58, 237) },
    { id: 17, residents: ["Mr. Phillip", "Pierce", "Gabriella"],           /**/ nr: 4, pos: vec(63, 237) },
    { id: 19, residents: ["Mr. Braden"],                                   /**/ nr: 5, pos: vec(67, 237) },
    { id: 25, residents: ["Mr. Jagger"],                                   /**/ nr: 6, pos: vec(74, 237) },
    { id: 26, residents: ["Mr. Cecil"],                                    /**/ nr: 7, pos: vec(78, 237) },
    { id: 30, residents: ["Miss. Isla", "Mrs. Parker"],                    /**/ nr: 8, pos: vec(82, 237) },
    { id: 33, residents: ["Mr. Tyree"],                                    /**/ nr: 9, pos: vec(86, 237) },
    { id: 43, residents: ["Miss. Madison"],                                /**/ nr: 10, pos: vec(104, 237) },
    { id: 50, residents: ["Miss. Everley", "Mrs. Lennox"],                 /**/ nr: 11, pos: vec(111, 237) },
    { id: 55, residents: ["Mr. Bodhi"],                                    /**/ nr: 12, pos: vec(115, 237) },

    // Vivid Street
    { id: 11, residents: ["Mr. Slade", "Miss. Ruby"],                      /**/ nr: 1, pos: vec(58, 218) },
    { id: 22, residents: ["Mrs. Georgia", "Mrs. Samantha"],                /**/ nr: 2, pos: vec(72, 218) },
    { id: 28, residents: ["Mr. Greyson", "Mr. Bruno"],                     /**/ nr: 3, pos: vec(80, 218) },
    { id: 42, residents: ["Miss. Antonia"],                                /**/ nr: 4, pos: vec(102, 218) },
    { id: 47, residents: ["Miss. Easton"],                                 /**/ nr: 5, pos: vec(110, 218) },
    { id: 52, residents: ["Miss. Emery", "Mr. Kamrin"],                    /**/ nr: 6, pos: vec(114, 218) },
    { id: 59, residents: ["Mr. Saul"],                                     /**/ nr: 7, pos: vec(122, 218) },
    { id: 65, residents: ["Mr. Clyde"],                                    /**/ nr: 8, pos: vec(131, 218) },
    { id: 67, residents: ["Mr. Sheldon"],                                  /**/ nr: 9, pos: vec(139, 218) },
    { id: 70, residents: ["Mr. Joseph", "Miss. Aila"],                     /**/ nr: 10, pos: vec(145, 218) },
    { id: 75, residents: ["Mrs. Sydney"],                                  /**/ nr: 11, pos: vec(152, 218) },

    //"Hymnal Park
    { id: 60, residents: ["Miss. Saffron"],                                /**/ nr: 1, pos: vec(122, 231) },
    { id: 63, residents: ["Mrs. Elle"],                                    /**/ nr: 2, pos: vec(129, 235) },
    { id: 68, residents: ["Mrs. Quinn", "Miss. Kristen"],                  /**/ nr: 3, pos: vec(139, 258) },
    { id: 71, residents: ["Mrs. Alice"],                                   /**/ nr: 4, pos: vec(145, 232) },
    { id: 72, residents: ["Miss. Kate"],                                   /**/ nr: 5, pos: vec(145, 247) },
    { id: 76, residents: ["Mr. Nehemiah"],                                 /**/ nr: 6, pos: vec(154, 233) },
    { id: 77, residents: ["Mr. Ezekiel", "Miss. Jessica"],                 /**/ nr: 7, pos: vec(155, 246) },
    { id: 78, residents: ["Mr. Eli"],                                      /**/ nr: 8, pos: vec(155, 258) },

    // Studio Street
    { id: 6, residents: ["Mr. Xavier", "Miss. Emmeline"],                  /**/ nr: 1, pos: vec(52, 177) },
    { id: 10, residents: ["Mrs. Amelia", "Mrs. Beatrix"],                  /**/ nr: 2, pos: vec(56, 171) },
    { id: 14, residents: ["Mrs. Olivia", "Mr. Kenny"],                     /**/ nr: 3, pos: vec(59, 171) },
    { id: 20, residents: ["Miss. Noelle"],                                 /**/ nr: 4, pos: vec(68, 171) },
    { id: 27, residents: ["Miss. Lake"],                                   /**/ nr: 5, pos: vec(79, 171) },
    { id: 32, residents: ["Mr. Billy", "Mr. Leonardo"],                    /**/ nr: 6, pos: vec(86, 171) },
    { id: 36, residents: ["Miss. Diana"],                                  /**/ nr: 7, pos: vec(91, 171) },

    // Last Flurry Ave
    { id: 13, residents: ["Mr. Archibald"],                                /**/ nr: 1, pos: vec(58, 252) },
    { id: 18, residents: ["Mr. Billy"],                                    /**/ nr: 2, pos: vec(65, 252) },
    { id: 23, residents: ["Miss. Avery", "Mr. Derek"],                     /**/ nr: 3, pos: vec(73, 252) },
    { id: 29, residents: ["Miss. Kyra", "Miss. Laura"],                    /**/ nr: 4, pos: vec(81, 252) },
    { id: 34, residents: ["Mr. Christian"],                                /**/ nr: 5, pos: vec(89, 252) },
    { id: 38, residents: ["Mr. Nicholas", "Mrs. Estelle"],                 /**/ nr: 6, pos: vec(94, 252) },
    { id: 48, residents: ["Mr. Bellamy", "Mr. Kamrin"],                    /**/ nr: 7, pos: vec(110, 252) },
    { id: 56, residents: ["Mr. Tristan"],                                  /**/ nr: 8, pos: vec(115, 252) },

    // Obson Corner
    { id: 2, residents: ["Mr. Reese"],                                     /**/ nr: 1, pos: vec(43, 177) },

    // Lumina Hawk Street
    { id: 1, residents: ["Mr. Kade", "Mr. Holden", "Mrs. Journey"],        /**/ nr: 1, pos: vec(36, 191) },
    { id: 3, residents: ["Miss. Rebecca", "Miss. Kristen"],                /**/ nr: 2, pos: vec(44, 191) },
    { id: 16, residents: ["Mr. Woodrow"],                                  /**/ nr: 3, pos: vec(62, 191) },
    { id: 21, residents: ["Mrs. Tatum"],                                   /**/ nr: 4, pos: vec(68, 191) },
    { id: 24, residents: ["Mr. Milton", "Mrs. Bryony"],                    /**/ nr: 5, pos: vec(74, 191) },
    { id: 31, residents: ["Miss. Gracelyn"],                               /**/ nr: 6, pos: vec(83, 191) },
    { id: 37, residents: ["Mrs. Harlow"],                                  /**/ nr: 7, pos: vec(94, 191) },
    { id: 39, residents: ["Mr. Turner"],                                   /**/ nr: 8, pos: vec(100, 191) },
    { id: 45, residents: ["Mr. Royce", "Mr. Stephen"],                     /**/ nr: 9, pos: vec(106, 191) },
    { id: 46, residents: ["Miss. Scarlett"],                               /**/ nr: 10, pos: vec(109, 191) },
    { id: 54, residents: ["Miss. Marilyn"],                                /**/ nr: 11, pos: vec(115, 191) },

    // Typing Street
    { id: 61, residents: ["Mr. Gabriel"],                                  /**/ nr: 1, pos: vec(123, 269) },
    { id: 62, residents: ["Mr. Gray", "Mr. Adrian"],                       /**/ nr: 2, pos: vec(126, 269) },
    { id: 64, residents: ["Mrs. Hadleigh"],                                /**/ nr: 3, pos: vec(130, 269) },
    { id: 66, residents: ["Mr. Ash"],                                      /**/ nr: 4, pos: vec(133, 269) },
    { id: 69, residents: ["Miss. Lila", "Miss. Gloria"],                   /**/ nr: 5, pos: vec(140, 269) },
    { id: 73, residents: ["Mrs. Leila"],                                   /**/ nr: 6, pos: vec(146, 269) },
    { id: 74, residents: ["Miss. Dani", "Mr. Walter"],                     /**/ nr: 7, pos: vec(151, 269) },

    // Strime Alley
    { id: 40, residents: ["Miss. Lainey"],                                 /**/ nr: 1, pos: vec(101, 205) },
    { id: 44, residents: ["Mr. Jordy", "Mr. Moses"],                       /**/ nr: 2, pos: vec(104, 205) },
    { id: 49, residents: ["Mrs. Erin"],                                    /**/ nr: 3, pos: vec(111, 205) },

    // King Street
    { id: 41, residents: ["Mr. Jean"],                                     /**/ nr: 1, pos: vec(52, 203) },
    { id: 5, residents: ["Miss. Lennox", "Mrs. Regina"],                   /**/ nr: 2, pos: vec(51, 218) },
    { id: 8, residents: ["Mr. Alton"],                                     /**/ nr: 3, pos: vec(48, 226) },
    { id: 15, residents: ["Miss. Kyra"],                                   /**/ nr: 4, pos: vec(59, 228) },
    { id: 7, residents: ["Mr. Juni"],                                      /**/ nr: 5, pos: vec(52, 229) },

    // beverley street
    { id: 57, residents: ["Miss. Julie"],                                  /**/ nr: 1, pos: vec(74, 205) },
    { id: 90, residents: ["Mr. Juliann"],                                  /**/ nr: 2, pos: vec(78, 205) },
    { id: 89, residents: ["Mr. Michael"],                                  /**/ nr: 3, pos: vec(81, 207) },

    // sanley alley
    { id: 35, residents: ["Mr. Kade", "Mr. Vincent"],                      /**/ nr: 1, pos: vec(90, 228) },

    // other?
    { id: 51, residents: ["Miss. Jolie"],                                  /**/ nr: 0, pos: vec(114, 168) },
    { id: 53, residents: ["Mr. Boden", "Mr. Philip"],                      /**/ nr: 0, pos: vec(115, 175) },
    { id: 58, residents: ["Mr. Bruno"],                                    /**/ nr: 0, pos: vec(121, 210) },

    // green island
    { id: 79, residents: ["Mr. Kylo"],                                     /**/ nr: 1, pos: vec(169, 138) },

    // little family hamlet
    { id: 80, residents: ["Miss. Blake"],                                  /**/ nr: 1, pos: vec(225, 86) },
    { id: 81, residents: ["Miss. Embry"],                                  /**/ nr: 2, pos: vec(225, 94) },
    { id: 82, residents: ["Mr. Nolan", "Mr. Aaron"],                       /**/ nr: 3, pos: vec(236, 88) },
    { id: 83, residents: ["Mrs. Kylie"],                                   /**/ nr: 4, pos: vec(244, 102) },
    { id: 84, residents: ["Miss. Star", "Mrs. Evangeline"],                /**/ nr: 5, pos: vec(244, 109) },
    { id: 85, residents: ["Mrs. Gwyneth"],                                 /**/ nr: 6, pos: vec(250, 108) },
    { id: 86, residents: ["Mrs. Antonia"],                                 /**/ nr: 7, pos: vec(253, 88) },
    { id: 87, residents: ["Mr. Kamden", "Mrs. Talia"],                     /**/ nr: 8, pos: vec(256, 102) },
    { id: 88, residents: ["Miss Willa"],                                   /**/ nr: 9, pos: vec(257, 94) },
];

// function checkIds(items: { id: number }[]): void {
//     const counts = new Map<number, number>();
//     for (const { id } of items) {
//         counts.set(id, (counts.get(id) ?? 0) + 1);
//     }

//     const ids = [...counts.keys()];
//     const min = Math.min(...ids);
//     const max = Math.max(...ids);

//     const missing: number[] = [];
//     for (let id = min; id <= max; id++) {
//         if (!counts.has(id)) missing.push(id);
//     }

//     const duplicated = [...counts.entries()]
//         .filter(([, n]) => n > 1)
//         .map(([id, n]) => `${id} (x${n})`);

//     console.log(`IDs from ${min} to ${max}`);
//     console.log('Missing:', missing.length ? missing.join(', ') : 'none');
//     console.log('Duplicated:', duplicated.length ? duplicated.join(', ') : 'none');
// }

// checkIds(HOUSES);

export interface Street {
    difficulty: number | null
    houses: number[]
}

export const STREETS: { [key: string]: Street } = {

    "Plinth Boulevard": {
        difficulty: 1,
        houses: [4, 9, 12, 17, 19, 25, 26, 30, 33, 43, 50, 55]
    },

    "King Street": {
        difficulty: 1,
        houses: [5, 7, 8, 15]
    },

    "Vivid Street": {
        difficulty: 2,
        houses: [11, 22, 28, 42, 46, 52, 59, 65, 67, 70, 75]
    },

    "Lumina Hawk Street": {
        difficulty: 3,
        houses: [1, 3, 16, 21, 24, 31, 37, 39, 45, 46, 54]
    },

    "Last Flurry Ave": {
        difficulty: 4,
        houses: [13, 18, 23, 29, 34, 38, 41, 48, 56]
    },

    "Library Alley": {
        difficulty: 5,
        houses: [57]
    },

    "Studio Street": {
        difficulty: 6,
        houses: [6, 10, 14, 20, 27, 32, 36]
    },

    "Hymnal Park": {
        difficulty: 7,
        houses: [60, 63, 68, 71, 72, 76, 77, 78]
    },

    "Little Family Hamlet": {
        difficulty: 8,
        houses: [80, 81, 82, 83, 84, 85, 86, 87, 88]
    },

    "Typing Street": {
        difficulty: 9,
        houses: [61, 62, 64, 66, 69, 73, 74]
    },

    "Green Island": {
        difficulty: 10,
        houses: [79]
    },

    "Strime Alley": {
        difficulty: 10,
        houses: [40, 44, 49]
    },

    "Beverley Alley": {
        difficulty: 10,
        houses: [89, 90]
    },

    "Sanley Alley": {
        difficulty: 10,
        houses: [35]
    },

    "Peach Alley": {
        difficulty: 10,
        houses: []
    },

    "Longlows Alley": {
        difficulty: 10,
        houses: []
    },

    "Old Road": {
        difficulty: null,
        houses: [],
    },

    "Obson Corner": {
        difficulty: 5,
        houses: [2]
    },
}

export interface StreetRect {
    name: string
    rects: Rect[]
}

export const STREETS_RECTS: StreetRect[] = [
    { name: "Studio Street", rects: [rect(18, 36, 12, 1), rect(18, 37, 1, 5)] },
    { name: "Lumina Hawk Street", rects: [rect(9, 42, 31, 1)] },
    { name: "Vivid Street", rects: [rect(18, 51, 35, 1)] },
    { name: "Plinth Boulevard", rects: [rect(11, 57, 29, 1)] },
    { name: "Last Flurry Ave", rects: [rect(18, 62, 22, 1)] },
    { name: "Typing Street", rects: [rect(39, 68, 14, 1)] },
    { name: "Library Alley", rects: [rect(39, 61, 1, 8)] },
    { name: "Obson Corner", rects: [rect(13, 36, 1, 6)] },
    { name: "King Street", rects: [rect(18, 43, 1, 20)] },

    { name: "Newache Road", rects: [rect(39, 32, 1, 26)] },
    { name: "Oldache Road", rects: [rect(52, 52, 1, 26)] },
    { name: "Beverley Alley", rects: [rect(21, 47, 6, 1), rect(21, 43, 1, 4)] },
    { name: "Strime Alley", rects: [rect(32, 47, 6, 1), rect(32, 48, 1, 3)] },
    { name: "Sanley Alley", rects: [rect(30, 54, 1, 3)] },
    { name: "Peach Alley", rects: [rect(33, 54, 1, 3)] },
    { name: "Longlows Alley", rects: [rect(36, 54, 1, 3)] },

    { name: "Hymnal Park", rects: [rect(41, 53, 10, 14)] },

    // { name: "1", rects: [rect(76, 8, 9, 1)] },
    // { name: "2", rects: [rect(39, 10, 46, 1)] },
    // { name: "21", rects: [rect(39, 0, 1, 10)] },
    // { name: "29", rects: [rect(76, 6, 1, 2)] },
    // { name: "30", rects: [rect(76, 9, 1, 1)] },
    // { name: "31", rects: [rect(82, 9, 1, 1)] },
    // { name: "32", rects: [rect(82, 11, 1, 4)] },
];

export const STREET_BY_HOUSE: { [key: number | string]: string } = {}
for (const streetName of Object.keys(STREETS)) {
    const street = STREETS[streetName]
    for (const houseId of street.houses) {
        STREET_BY_HOUSE[houseId] = streetName;
    }
}

export const HOUSES_BY_ID: { [key: number | string]: House } = {}
for (const house of HOUSES) {
    HOUSES_BY_ID[house.id] = house
}