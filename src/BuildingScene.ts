import Phaser from 'phaser'
import { FONT_FAMILY, GRID_HEIGHT, GRID_WIDTH, GRID_X, GRID_Y, INSTRUCTION_FONT_SIZE, INSTRUCTION_TITLE_FONT_SIZE, TEXT_COLOR, TILE_SIZE } from './constants';
import { Grid, GridEntry, Level, Piece } from './types';
import { GameState, init_game_state } from './logic';
import { LEVELS } from './levels';

export default class BuildingScene extends Phaser.Scene {

    // UI elements
    printer_red_button!: Phaser.GameObjects.Image;
    printer_orange_button!: Phaser.GameObjects.Image;
    printer_green_button!: Phaser.GameObjects.Image;
    printer_blue_button!: Phaser.GameObjects.Image;
    switch_blue_orange_button!: Phaser.GameObjects.Image;
    switch_red_green_button!: Phaser.GameObjects.Image;
    belt_button!: Phaser.GameObjects.Image;
    highlight_button!: Phaser.GameObjects.Image;
    eraser_button!: Phaser.GameObjects.Image;

    exit_selected!: boolean;
    rotate_selected!: boolean;
    reflect_selected!: boolean;
    play_selected!: boolean;
    exit_button!: Phaser.GameObjects.Image;
    rotate_button!: Phaser.GameObjects.Image;
    reflect_button!: Phaser.GameObjects.Image;
    play_button!: Phaser.GameObjects.Image;

    // Game state
    game_state!: GameState;
    level_number_sprites: { [id: number]: Phaser.GameObjects.Sprite } = {};
    // The grid index is a number of x + y * <number of tiles in grid>
    grid: { [id: number]: Phaser.GameObjects.Image } = {};
    grid_elf: Phaser.GameObjects.Image | undefined;
    grid_sleigh: Phaser.GameObjects.Image | undefined;

    constructor()
    {
        super("building");
    }

    preload() {
		this.load.image("building", "assets/Building.png");
		this.load.image("exit_door_belt", "assets/Return_01.png");
        this.load.image("eraser_belt", "assets/Eraser_01.png");
        this.load.image("rotate_belt", "assets/Repeat_01.png");
        this.load.image("reflect_belt", "assets/Mirror_01.png");
        this.load.image("printer_blue", "assets/Printer_Blue_01.png");
        this.load.image("printer_green", "assets/Printer_Green_01.png");
        this.load.image("printer_orange", "assets/Printer_Orange_01.png");
        this.load.image("printer_red", "assets/Printer_Red_01.png");
        this.load.image("splitter_orange_blue", "assets/Splitter_Orange_Blue_01.png");
        this.load.image("splitter_red_green", "assets/Splitter_Red_Green_01.png");
        this.load.image("belt", "assets/Belt_01.png");
        this.load.image("play", "assets/Play_01.png");
        this.load.image("highlight_belt", "assets/Belt_Highlight.png");
        this.load.image("elf", "assets/Elf_02.png");
        this.load.image("sleigh", "assets/Sleigh.png");
	}

    init(data: {game_state: GameState})
    {
		if (!data || !data.game_state)
		{
			this.game_state = init_game_state();
		}
		else
		{
			this.game_state = data.game_state;
		}
        LEVELS[this.game_state.current_level].grid_scale = Math.floor(GRID_WIDTH / this.game_state.level_solutions[this.game_state.current_level].width);
    }

    reset_pointer_up_flags()
    {
        this.exit_selected = false;
        this.rotate_selected = false;
        this.reflect_selected = false;
        this.play_selected = false;
    }

    create()
    {
        const function_button_separator = 88;
        const function_button_left = 16;
        const select_button_separator = 70;
        const select_button_left = 299;
        const building_image = this.add.image(0, 0, 'building').setOrigin(0, 0);
        const button_y = building_image.height - 74;
        this.exit_button = this.add.image(function_button_left + function_button_separator * 0, button_y, "exit_door_belt").setOrigin(0, 0).setInteractive().setScale(2);
        this.rotate_button = this.add.image(function_button_left + function_button_separator * 1, button_y, "rotate_belt").setOrigin(0, 0).setInteractive().setScale(2);
        this.reflect_button = this.add.image(function_button_left + function_button_separator * 2, button_y, "reflect_belt").setOrigin(0, 0).setInteractive().setScale(2);
        this.belt_button = this.add.image(select_button_left + 32 + select_button_separator * 0, button_y + 32, "belt").setInteractive().setScale(2);
        this.printer_red_button = this.add.image(select_button_left + 32 + select_button_separator * 1, button_y + 32, "printer_red").setInteractive().setScale(2);
        this.printer_orange_button = this.add.image(select_button_left + 32 + select_button_separator * 2, button_y + 32, "printer_orange").setInteractive().setScale(2);
        this.printer_green_button = this.add.image(select_button_left + 32 + select_button_separator * 3, button_y + 32, "printer_green").setInteractive().setScale(2);
        this.printer_blue_button = this.add.image(select_button_left + 32 + select_button_separator * 4, button_y + 32, "printer_blue").setInteractive().setScale(2);
        this.switch_blue_orange_button = this.add.image(select_button_left + 32 + select_button_separator * 5, button_y + 32, "splitter_orange_blue").setInteractive().setScale(2);
        this.switch_red_green_button = this.add.image(select_button_left + 32 + select_button_separator * 6, button_y + 32, "splitter_red_green").setInteractive().setScale(2);
        this.eraser_button = this.add.image(select_button_left + 32 + select_button_separator * 7, button_y + 32, "eraser_belt").setInteractive().setScale(2);
        this.play_button = this.add.image(888, button_y, "play").setOrigin(0, 0).setInteractive().setScale(2);
        this.highlight_button = this.add.image(-1000, -1000, "highlight_belt").setScale(1.8);

        // Set up the event handlers
        this.printer_red_button.on("pointerdown", () => {
            this.highlight_build_button(this.printer_red_button);
        }, this);
        this.printer_orange_button.on("pointerdown", () => {
            this.highlight_build_button(this.printer_orange_button);
        }, this);
        this.printer_green_button.on("pointerdown", () => {
            this.highlight_build_button(this.printer_green_button);
        }, this);
        this.printer_blue_button.on("pointerdown", () => {
            this.highlight_build_button(this.printer_blue_button);
        }, this);
        this.switch_blue_orange_button.on("pointerdown", () => {
            this.highlight_build_button(this.switch_blue_orange_button);
        }, this);
        this.switch_red_green_button.on("pointerdown", () => {
            this.highlight_build_button(this.switch_red_green_button);
        }, this);
        this.belt_button.on("pointerdown", () => {
            this.highlight_build_button(this.belt_button);
        }, this);
        this.eraser_button.on("pointerdown", () => {
            this.highlight_build_button(this.eraser_button);
        }, this);

        this.highlight_build_button(this.belt_button);

        // Setup more careful buttons
        this.exit_button.on("pointerdown", () => {
            this.exit_selected = true;
        }, this);
        this.rotate_button.on("pointerdown", () => {
            this.rotate_selected = true;
        }, this);
        this.reflect_button.on("pointerdown", () => {
            this.reflect_selected = true;
        }, this);
        this.play_button.on("pointerdown", () => {
            this.play_selected = true;
        }, this);

        this.exit_button.on("pointerup", () => {
            if (this.exit_selected)
            {
                this.reset_pointer_up_flags();
                this.scene.start("level-select", {game_state: this.game_state});
            }
            this.reset_pointer_up_flags();
        }, this);
        this.reflect_button.on("pointerup", () => {
            if (this.reflect_selected)
            {
                this.reflect_button_pressed();
            }
        }, this);
        this.rotate_button.on("pointerup", () => {
            if (this.rotate_selected)
            {
                this.rotate_button_pressed();
            }
            this.reset_pointer_up_flags();
        }, this);
        this.play_button.on("pointerup", () => {
            if (this.play_selected)
            {
                this.play_button_pressed();
            }
            this.reset_pointer_up_flags();
        }, this);
        
        // Turn off button selection when it hits somewhere else
        this.input.on("pointerup", () => {
			this.reset_pointer_up_flags();
		}, this);
        this.input.on("pointerdown", () => {
            const position = {x: this.input.activePointer.position.x, y: this.input.activePointer.position.y};
            if (this.is_inside_grid(position.x, position.y))
            {
                const grid_coordinate = this.get_grid_coordinates(position.x, position.y);
                const highlighted_button = this.get_highlighted_button();
                if (!highlighted_button) return;

                if (this.eraser_button === highlighted_button)
                {
                    this.erase_tile(grid_coordinate.x, grid_coordinate.y);
                    this.game_state.level_solutions[this.game_state.current_level] = this.extract_grid();
                    return;
                }

                // Work out what to set
                let flipped = false;
                if (highlighted_button === this.switch_blue_orange_button || this.switch_red_green_button === highlighted_button)
                {
                    flipped = this.switch_blue_orange_button.flipX || this.switch_red_green_button.flipY;
                }
                const angle = this.belt_button.angle;
                this.set_tile(grid_coordinate.x, grid_coordinate.y, highlighted_button.texture.key, angle, flipped);
                this.game_state.level_solutions[this.game_state.current_level] = this.extract_grid();
            }
        }, this);

        // Setup the level details
        this.setup_level();
    }

    add_instructions(title: string, text: string)
    {
        // TODO: switch based on the level number
        const instructions_x = 40;
        const instructions_y = 150;
        const instructions_width = 200;

        const title_text = this.add.text(instructions_x, instructions_y, title, {
			fontFamily: FONT_FAMILY,
			fontSize: INSTRUCTION_TITLE_FONT_SIZE,
			color: TEXT_COLOR,
            wordWrap: { width: instructions_width, useAdvancedWrap: true }
		});

        this.add.text(instructions_x, instructions_y + title_text.height + 8, text, {
			fontFamily: FONT_FAMILY,
			fontSize: INSTRUCTION_FONT_SIZE,
			color: TEXT_COLOR,
            wordWrap: { width: instructions_width, useAdvancedWrap: true }
		});
    }

    /* 
     * Return true if and only if the given coordinates fall inside the grid
     */
    is_inside_grid(x: number, y: number): boolean
    {
        return x >= GRID_X && x < GRID_X + GRID_WIDTH && y >= GRID_Y && y < GRID_Y + GRID_HEIGHT;
    }

    /*
     * Get the grid tile corresponding to the coordinates, assuming they are inside the grid.
     * Uses grid size to determine the size of each grid tile
     */
    get_grid_coordinates(x: number, y: number): {x: number, y: number}
    {
        const grid_tile_x = Math.floor((x - GRID_X) / LEVELS[this.game_state.current_level].grid_scale);
        const grid_tile_y = Math.floor((y - GRID_Y) / LEVELS[this.game_state.current_level].grid_scale);
        return {x: grid_tile_x, y: grid_tile_y};
    }

    /*
     * Convert grid coordinates back to real coordinates
     */
    get_real_coordinates(grid_x: number, grid_y: number): {x: number, y: number}
    {
        const x = (grid_x * LEVELS[this.game_state.current_level].grid_scale) + GRID_X;
        const y = (grid_y * LEVELS[this.game_state.current_level].grid_scale) + GRID_Y;
        return {x: x, y: y};
    }

    get_grid_number_of_tiles_wide(): number
    {
        return Math.floor(GRID_WIDTH / LEVELS[this.game_state.current_level].grid_scale);
    }

    get_grid_number_of_tiles_tall(): number
    {
        return Math.floor(GRID_HEIGHT / LEVELS[this.game_state.current_level].grid_scale);
    }

    get_grid_index(grid_x: number, grid_y: number): number
    {
        return grid_x + (grid_y * this.get_grid_number_of_tiles_wide());
    }
    
    /*
     * Place a tile on the grid
     */
    set_tile(grid_x: number, grid_y: number, image: string, angle: number, flipped: boolean): Phaser.GameObjects.Image | undefined
    {
        // You cannot change the elf or Santa's sleigh
        const grid_index = this.get_grid_index(grid_x, grid_y);
        const grid_entry = this.grid[grid_index];

        if (grid_entry && grid_entry === this.grid_elf && this.image_to_piece(image) != Piece.Elf) return;
        if (grid_entry && grid_entry === this.grid_sleigh && this.image_to_piece(image) != Piece.Sleigh) return;

        this.erase_tile(grid_x, grid_y);

        // Now place the new image
        const position = this.get_real_coordinates(grid_x, grid_y);
        const scaling = Math.floor(LEVELS[this.game_state.current_level].grid_scale / TILE_SIZE);
        const new_image = this.add.image(position.x + (TILE_SIZE / 2) * scaling, position.y + (TILE_SIZE / 2) * scaling, image).setScale(scaling);
        new_image.setAngle(angle);

        if (angle % 90 !== 0 && flipped)
        {
            new_image.toggleFlipY();
        }
        else if(flipped)
        {
            new_image.toggleFlipX();
        }

        this.grid[this.get_grid_index(grid_x, grid_y)] = new_image;
        return new_image;
    }

    piece_to_image(piece: Piece): string | undefined
    {
        if (!piece)
        {
            return;
        }
        else if (piece == Piece.Belt)
        {
            return this.belt_button.texture.key;
        }
        else if (piece == Piece.BluePrinter)
        {
            return this.printer_blue_button.texture.key;
        }
        else if (piece == Piece.GreenPrinter)
        {
            return this.printer_green_button.texture.key
        }
        else if (piece == Piece.OrangePrinter)
        {
            return this.printer_orange_button.texture.key
        }
        else if (piece == Piece.RedPrinter)
        {
            return this.printer_red_button.texture.key;
        }
        else if (piece == Piece.BlueOrangeSwitch)
        {
            return this.switch_blue_orange_button.texture.key;
        }
        else if (piece == Piece.RedGreenSwitch)
        {
            return this.switch_red_green_button.texture.key;
        }
        else if (piece == Piece.Elf)
        {
            return "elf";
        }
        else if (piece == Piece.Sleigh)
        {
            return "sleigh";
        }
    }

    image_to_piece(image: string): Piece
    {
        if (!image)
        {
            return Piece.Nothing;
        }
        else if (image == this.belt_button.texture.key)
        {
            return Piece.Belt;
        }
        else if (image == this.printer_blue_button.texture.key)
        {
            return Piece.BluePrinter;
        }
        else if (image == this.printer_green_button.texture.key)
        {
            return Piece.GreenPrinter;
        }
        else if (image == this.printer_orange_button.texture.key)
        {
            return Piece.OrangePrinter;
        }
        else if (image == this.printer_red_button.texture.key)
        {
            return Piece.RedPrinter;
        }
        else if (image == this.switch_blue_orange_button.texture.key)
        {
            return Piece.BlueOrangeSwitch;
        }
        else if (image == this.switch_red_green_button.texture.key)
        {
            return Piece.RedGreenSwitch;
        }
        else if (image == this.grid_elf?.texture.key)
        {
            return Piece.Elf;
        }
        else if (image == this.grid_sleigh?.texture.key)
        {
            return Piece.Sleigh;
        }
        return Piece.Nothing;
    }

    /*
     * Populate what is drawn into a semantic grid
     */
    extract_grid(): Grid
    {
        const grid: Grid = { width: Math.floor(GRID_WIDTH / LEVELS[this.game_state.current_level].grid_scale), height: Math.floor(GRID_HEIGHT / LEVELS[this.game_state.current_level].grid_scale), entries: []};
        for(let x = 0; x < grid.width; x += 1)
        {
            grid.entries[x] = [];
            for (let y = 0; y < grid.height; y += 1)
            {
                const image = this.grid[this.get_grid_index(x, y)];
                const entry: GridEntry = {
                    angle: ((((image?.angle ?? 0) % 360) + 360) % 360),
                    flipped: (image?.flipX || image?.flipY),
                    piece: this.image_to_piece(image?.texture.key)
                };
                grid.entries[x][y] = entry;
            }
        }
        return grid;
    }

    /*
     * Remove a tile from the grid
     */
    erase_tile(grid_x: number, grid_y: number)
    {
        // You cannot remove the elf or Santa's sleigh
        const grid_index = this.get_grid_index(grid_x, grid_y);
        const grid_entry = this.grid[grid_index];

        if (!grid_entry) return;
        if (grid_entry && grid_entry === this.grid_elf) return;
        if (grid_entry && grid_entry === this.grid_sleigh) return;

        grid_entry.destroy();
        delete this.grid[grid_index];
    }

    setup_level()
    {
        // Start by clearing out the grid
        for (let index in this.grid)
        {
            if (this.grid[index])
            {
                this.grid[index].destroy();
                delete this.grid[index];
            }
        }

        // Now repopulate with the level solution
        const level_solution: Grid = this.game_state.level_solutions[this.game_state.current_level];
        for (let x = 0; x < level_solution.width; x += 1)
        {
            for (let y = 0; y < level_solution.height; y += 1)
            {
                const image_key = this.piece_to_image(level_solution.entries[x][y].piece);
                if (image_key)
                {
                    const image = this.set_tile(x, y, image_key, level_solution.entries[x][y].angle, level_solution.entries[x][y].flipped);
                    if (level_solution.entries[x][y].piece == Piece.Elf)
                    {
                        this.grid_elf = image;
                    }
                    if (level_solution.entries[x][y].piece == Piece.Sleigh)
                    {
                        this.grid_sleigh = image;
                    }
                }
            }
        }
        const level: Level = LEVELS[this.game_state.current_level];
        this.add_instructions(level.title, level.text);
    }

    reflect_button_pressed()
    {
        // Reflect all of the buttons...
        if (this.belt_button.angle % 90 !== 0)
        {
            this.switch_blue_orange_button.toggleFlipY();
            this.switch_red_green_button.toggleFlipY();
        }
        else
        {
            this.switch_blue_orange_button.toggleFlipX();
            this.switch_red_green_button.toggleFlipX();
        }
    }

    rotate_button_pressed()
    {
        this.belt_button.setAngle(this.belt_button.angle + 90);
        this.printer_blue_button.setAngle(this.printer_blue_button.angle + 90);
        this.printer_green_button.setAngle(this.printer_green_button.angle + 90);
        this.printer_orange_button.setAngle(this.printer_orange_button.angle + 90);
        this.printer_red_button.setAngle(this.printer_red_button.angle + 90);
        this.switch_blue_orange_button.setAngle(this.switch_blue_orange_button.angle + 90);
        this.switch_red_green_button.setAngle(this.switch_red_green_button.angle + 90);
    }

    play_button_pressed()
    {
        this.scene.start("play", {game_state: this.game_state});
    }

    is_highlighted(button: Phaser.GameObjects.Image)
    {
        return button.x === this.highlight_button.x && button.y === this.highlight_button.y;
    }

    get_highlighted_button(): Phaser.GameObjects.Image | undefined
    {
        if (this.is_highlighted(this.switch_blue_orange_button))
        {
            return this.switch_blue_orange_button;
        }
        if (this.is_highlighted(this.switch_red_green_button))
        {
            return this.switch_red_green_button;
        }
        if (this.is_highlighted(this.printer_blue_button))
        {
            return this.printer_blue_button;
        }
        if (this.is_highlighted(this.printer_green_button))
        {
            return this.printer_green_button;
        }
        if (this.is_highlighted(this.printer_orange_button))
        {
            return this.printer_orange_button;
        }
        if (this.is_highlighted(this.printer_red_button))
        {
            return this.printer_red_button;
        }
        if (this.is_highlighted(this.belt_button))
        {
            return this.belt_button;
        }
        if (this.is_highlighted(this.eraser_button))
        {
            return this.eraser_button;
        }
    }

    highlight_build_button(button: Phaser.GameObjects.Image)
    {
        this.highlight_button.setX(button.x);
        this.highlight_button.setY(button.y);
    }

    update(time: number, delta: number): void {}
}