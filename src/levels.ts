/*
 * Definitions for all the levels
 */

import { GRID_HEIGHT, GRID_WIDTH } from "./constants";
import { Grid } from "./types";

export function init_grid(level: number): Grid
{
    const grid: Grid = {};
    grid.width = Math.floor(GRID_WIDTH / 64);
    grid.height = Math.floor(GRID_HEIGHT / 64);
}