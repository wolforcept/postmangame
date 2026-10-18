import { random, randomName } from "./consts";
import { Data, Letter } from "./Data";
import { HOUSES, HOUSES_BY_ID, STREETS } from "./houses";

// Source - https://stackoverflow.com/a/48083382
// Posted by Sergii Rudenko, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-18, License - CC BY-SA 4.0

export function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};


export class LetterGen {

    streetIds = Object.keys(STREETS);

    constructor(private data: Data) { }

    genLetters(): Letter[] {

        const allPossibleHouses = this.streetIds
            .map(id => STREETS[id])
            .filter(s => s.difficulty !== null && s.difficulty <= this.data.daysPassed)
            .map(s => s.houses)
            .reduce((acc, v) => acc.concat(v), []);

        return shuffle(allPossibleHouses)
            .splice(0, this.nOfLetters())
            .map(houseId => {

                return {
                    houseId,
                    from: randomName(),
                    to: random(HOUSES_BY_ID[houseId].residents),
                }
            });
    }

    nOfLetters(): number {
        if (this.data.daysPassed < 2) return 3
        if (this.data.daysPassed < 5) return 4
        return 6 + Math.random() * (this.data.daysPassed - 4)
    }
}