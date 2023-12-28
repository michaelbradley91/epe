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
