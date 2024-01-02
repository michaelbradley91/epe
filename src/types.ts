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
    RedBlueSwitch = 7,
    GreenOrangeSwitch = 8,
    Belt = 9,
    Nothing = 10
}

export type Position = {
    x: number,
    y: number
};

export enum Action {
    Write_Blue = "Write Blue",
    Write_Red = "Write Red",
    Write_Orange = "Write Orange",
    Write_Green = "Write Green",
    Reject = "Reject",
    Accept = "Accept",
    GiveUp = "Give Up", // Used when the path is just too long to compute
    Read = "Read",
    None = "None"
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
    Red = "red",
    Orange = "orange",
    Blue = "blue",
    Green = "green"
}

// Outcome of testing a grid against the level criteria
export type TestResult = {
    passed: boolean,
    baubles: Bauble[],
    path: Step[],
    next_test_case: number | undefined
}

export enum LevelType {
    Output = 1,  // The level requires the player to change the baubles to something specific
    Accept = 2   // The level requires the player to accept or reject presents on some condition
}

export const NO_CONDITION = (_: Bauble[]) => true;
export const NO_OUTPUT = (baubles: Bauble[]) => baubles;

export type Level = {
    type: LevelType,
    title: string,
    text: string,
    grid_scale: number,
    good_case: Bauble[],
    test: (input_baubles: Bauble[], proposed_baubles: Bauble[]) => boolean
}
