import { Vec2 } from "miglib"

export interface Letter {
    from: string
    to: string
    houseId: number
}

export interface Quest {
    houseId: number
    text: string
    locationId: string
    personImg: string
    accepted: boolean
}

export interface Data {
    daysPassed: number
    hasJob: boolean
    playerX: number
    playerY: number
    letters: Letter[]
    quests: Quest[]
}
