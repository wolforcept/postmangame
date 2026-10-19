import { Vec2 } from "miglib"

export interface Letter {
    from: string
    to: string
    houseId: number
}

export interface Quest {
    item: string
    houseId: number
    text: string
    locationId: string
    personImg: string
    accepted: boolean
    reward: number
}

export interface Data {
    daysPassed: number
    hasJob: boolean
    playerX: number
    playerY: number
    letters: Letter[]
    quests: Quest[]
    money: number
    knowledge: number
    learnedToday: boolean
    promotion: number
    caughtMoney: number[]
    inventory: string[]
    upgrades: string[]
}
