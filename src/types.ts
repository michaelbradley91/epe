/*
 * Grid structures
 */

export enum Piece {
    Elf = 1,
    Sleigh = 2,
    RedPrinter = 3,
    BluePrinter = 4,
    GreenPrinter = 5,
    OrangePrinter = 6,
    RedGreenSwitch = 7,
    BlueOrangeSwitch = 8,
    Belt = 9,
    Nothing = 10
}

export type Position = {
    x: number,
    y: number
};

export enum Action {
    Write_Blue = 1,
    Write_Red = 2,
    Write_Orange = 3,
    Write_Green = 4,
    Reject = 5,
    Accept = 6,
    GiveUp = 7, // Used when the path is just too long to compute
    Read = 8,
    None = 9
}

// Describes what to do at a step. Where to go, whether to write a bauble or pop one off, etc
// Next position of undefined means this is the end
export type Step = {
    next_position?: Position
    action: Action
}

export type GridEntry = {
    angle: number
    flipped: boolean
    piece: Piece
}

export type Grid = {
    width: number,
    height: number,
    entries: GridEntry[][]
}

export enum Bauble {
    Red = 1,
    Orange = 2,
    Blue = 3,
    Green = 4
}

// Outcome of testing a grid against the level criteria
export type TestResult = {
    passed: boolean,
    baubles: Bauble[],
    path: Step[]
}
