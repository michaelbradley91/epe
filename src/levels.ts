/*
 * Definitions for all the levels
 */

import { GRID_HEIGHT, GRID_WIDTH, TILE_SIZE } from "./constants";
import { Grid, Piece } from "./types";

export function get_level_grid_scale(level: number): number
{
    return 2;
}

export function init_grid(level: number): Grid
{
    const grid: Grid = {
        width: Math.floor(GRID_WIDTH / (TILE_SIZE * get_level_grid_scale(level))),
        height: Math.floor(GRID_HEIGHT / (TILE_SIZE * get_level_grid_scale(level))),
        entries: []
    };

    for (let x = 0; x < grid.width; x += 1)
    {
        grid.entries.push([]);
        for (let y = 0; y < grid.height; y += 1)
        {
            grid.entries[x][y] = { angle: 0, flipped: false, piece: Piece.Nothing };
        }
    }

    // Place the elf and sleigh
    const y_coord = Math.floor((grid.height / 2) - 0.5);
    
    grid.entries[0][y_coord].piece = Piece.Elf;
    grid.entries[grid.width - 1][y_coord].piece = Piece.Sleigh;
    return grid;
}