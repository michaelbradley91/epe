/*
 * This module contains all the "thinking" parts of the game
 */

import { MAX_PATH_LENGTH, NUMBER_LEVELS } from "./constants";
import { Action, Bauble, Grid, Piece, Position, Step, TestResult } from "./types";

const POSITION_DELTAS: { [id: number] : Position; } = {};
POSITION_DELTAS[0] = { x: 0, y: 1 };
POSITION_DELTAS[90] = { x: -1, y: 0 };
POSITION_DELTAS[180] = { x: 0, y: -1 };
POSITION_DELTAS[270] = { x: 1, y: 0 };

/*
 * Handles all persistent game state
 */
export type GameState = {
    level_solutions: [Grid],
    level_solved: [boolean],
    current_level: number,
    options: {}
}

export function init_game_state()
{
    const level_solutions: [Grid] = [];
    const level_solved: [boolean] = [];
    for (let level = 0; level < NUMBER_LEVELS; level += 1)
    {
        level_solutions.push()
    }
}

/* 
 * Return the location of a piece or undefined if it does not exist.
 */
export function find_piece(grid: Grid, piece: Piece): Position | undefined
{
    for (let x = 0; x < grid.width; x++)
    {
        for (let y = 0; y < grid.height; y++)
        {
            if (grid.entries[x][y].piece == piece)
            {
                return {x: x, y: y};
            }
        }
    }
}

/* 
 * Compute the sequence of steps that should be carried out when moving this present through the grid
 */
export function compute_path(baubles: Bauble[], grid: Grid): Step[]
{
    // Refuse to compute the path if no starting point can be identified...
    const start_position = find_piece(grid, Piece.Elf);
    if (!start_position) return [];

    let step: Step = {
        action: Action.None,
        next_position: {x: start_position.x + 1, y: start_position.y}
    };

    const steps = [step];
    const current_baubles = Object.assign([], baubles);
    while(steps.length < MAX_PATH_LENGTH && step.next_position)
    {
        // What does the next position tell us?
        if (step.next_position.x >= grid.width || step.next_position.y >= grid.height || step.next_position.x < 0 || step.next_position.y < 0)
        {
            step = {action: Action.Reject};
        }
        else
        {
            const entry = grid.entries[step.next_position.x][step.next_position.y];
            if (!entry || entry.piece == Piece.Elf)
            {
                step = {action: Action.Reject};
            }
            else if (entry.piece == Piece.Sleigh)
            {
                step = {action: Action.Accept};
            }
            else if (entry.piece == Piece.Belt)
            {
                step = {
                    action: Action.None,
                    next_position: {x: step.next_position.x + POSITION_DELTAS[entry.angle].x, y: step.next_position.y + POSITION_DELTAS[entry.angle].y}
                };
            }
            else if (entry.piece == Piece.RedPrinter)
            {
                step = {
                    action: Action.Write_Red,
                    next_position: {x: step.next_position.x + POSITION_DELTAS[entry.angle].x, y: step.next_position.y + POSITION_DELTAS[entry.angle].y}
                };
                current_baubles.push(Bauble.Red);
            }
            else if (entry.piece == Piece.BluePrinter)
            {
                step = {
                    action: Action.Write_Blue,
                    next_position: {x: step.next_position.x + POSITION_DELTAS[entry.angle].x, y: step.next_position.y + POSITION_DELTAS[entry.angle].y}
                };
                current_baubles.push(Bauble.Blue);
            }
            else if (entry.piece == Piece.OrangePrinter)
            {
                step = {
                    action: Action.Write_Orange,
                    next_position: {x: step.next_position.x + POSITION_DELTAS[entry.angle].x, y: step.next_position.y + POSITION_DELTAS[entry.angle].y}
                };
                current_baubles.push(Bauble.Orange);
            }
            else if (entry.piece == Piece.GreenPrinter)
            {
                step = {
                    action: Action.Write_Green,
                    next_position: {x: step.next_position.x + POSITION_DELTAS[entry.angle].x, y: step.next_position.y + POSITION_DELTAS[entry.angle].y}
                };
                current_baubles.push(Bauble.Green);
            }
            else if (entry.piece == Piece.BlueOrangeSwitch || entry.piece == Piece.RedGreenSwitch)
            {
                if (current_baubles.length == 0)
                {
                    step = {
                        action: Action.None,
                        next_position: {x: step.next_position.x + POSITION_DELTAS[entry.angle].x, y: step.next_position.y + POSITION_DELTAS[entry.angle].y}
                    };
                }
                else
                {
                    const next_bauble = current_baubles.at(0);
                    let new_angle = entry.angle;
                    let action = Action.None;
                    // This is where it gets fiddly... which way is everything facing?
                    if (entry.piece == Piece.BlueOrangeSwitch)
                    {
                        if (next_bauble == Bauble.Blue)
                        {
                            action = Action.Read;
                            if (entry.flipped)
                            {
                                new_angle -= 90;
                            }
                            else
                            {
                                new_angle += 90;
                            }
                        }
                        else if (next_bauble == Bauble.Orange)
                        {
                            action = Action.Read;
                            if (entry.flipped)
                            {
                                new_angle += 90;
                            }
                            else
                            {
                                new_angle -= 90;
                            }
                        }
                    }
                    else if (entry.piece == Piece.RedGreenSwitch)
                    {
                        if (next_bauble == Bauble.Red)
                        {
                            action = Action.Read;
                            if (entry.flipped)
                            {
                                new_angle -= 90;
                            }
                            else
                            {
                                new_angle += 90;
                            }
                        }
                        else if (next_bauble == Bauble.Green)
                        {
                            action = Action.Read;
                            if (entry.flipped)
                            {
                                new_angle += 90;
                            }
                            else
                            {
                                new_angle -= 90;
                            }
                        }
                    }
                    new_angle = ((new_angle % 360) + 360) % 360;
                    step = {
                        action: action,
                        next_position: {x: step.next_position.x + POSITION_DELTAS[new_angle].x, y: step.next_position.y + POSITION_DELTAS[entry.angle].y}
                    };
                }
            }
        }
        steps.push(step);
    }

    // If the path is too long, give up
    if (steps.length >= MAX_PATH_LENGTH)
    {
        steps.push({action: Action.GiveUp});
    }

    return steps;
}

/*
 Test against the given condition and grid, trying to find a case that fails
 */
export function test_condition(grid: Grid, include_blue_orange_baubles: boolean, condition: (baubles: Bauble[]) => boolean): TestResult
{
    // TODO: do this sensibly...
    const baubles: Bauble[] = [Bauble.Red];
    const path = compute_path(baubles, grid);
    
    const last_entry = path.at(-1);
    if (!last_entry)
    {
        return {passed: false, baubles: baubles, path: path};
    }
    
    if ((last_entry.action == Action.Accept && condition(baubles)) || (last_entry.action == Action.Reject && !condition(baubles)))
    {
        return {passed: true, baubles: baubles, path: path};
    }
    return {passed: false, baubles: baubles, path: path};
}

