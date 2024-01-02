import Phaser from 'phaser'
import { CHRISTMAS_TREE_HEIGHT, CHRISTMAS_TREE_LEFT, CHRISTMAS_TREE_SIZE, CHRISTMAS_TREE_TOP, CHRISTMAS_TREE_WIDTH, GRID_HEIGHT, GRID_WIDTH, GRID_X, GRID_Y, MAX_PLAY_SPEED, MIN_PLAY_SPEED, PROGRESS_PRESENT_MAX_X, PROGRESS_PRESENT_MIN_X, TILE_SIZE } from './constants';
import { Action, Bauble, Grid, GridEntry, Piece, Position, Step, TestResult } from './types';
import { GameState, find_piece, init_game_state, test_level_solution } from './logic';
import { LEVELS } from './levels';

export default class PlayScene extends Phaser.Scene {
    game_state!: GameState;
    grid!: Grid;
    test_result!: TestResult;
    play_speed!: number;
    playing!: boolean;
    active_baubles!: Bauble[];
    active_step!: number;

    exit_selected!: boolean;
    replay_selected!: boolean;
    play_selected!: boolean;
    pause_selected!: boolean;
    speed_up_selected!: boolean;
    slow_down_selected!: boolean;
    exit_button!: Phaser.GameObjects.Image;
    replay_button!: Phaser.GameObjects.Image;
    play_button!: Phaser.GameObjects.Image;
    pause_button!: Phaser.GameObjects.Image;
    speed_up_button!: Phaser.GameObjects.Image;
    slow_down_button!: Phaser.GameObjects.Image;
    present!: Phaser.GameObjects.Image;
    progress_present!: Phaser.GameObjects.Image;
    christmas_tree_baubles: Phaser.GameObjects.Image[] = [];
    christmas_tree_tinsel: Phaser.GameObjects.Image[] = [];
    write_elf!: Phaser.GameObjects.Image;

    constructor() {
		super('play')
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
    }

    get_grid(): Grid {
        return this.game_state.level_solutions[this.game_state.current_level];
    }

    preload() {
		this.load.image("running", "assets/Running.png");
		this.load.image("exit_door_belt", "assets/Return_01.png");
        this.load.image("replay", "assets/Repeat_01.png");
        this.load.image("printer_blue", "assets/Printer_Blue_01.png");
        this.load.image("printer_green", "assets/Printer_Green_01.png");
        this.load.image("printer_orange", "assets/Printer_Orange_01.png");
        this.load.image("printer_red", "assets/Printer_Red_01.png");
        this.load.image("splitter_orange_blue", "assets/Splitter_Orange_Blue_01.png");
        this.load.image("splitter_red_green", "assets/Splitter_Red_Green_01.png");
        this.load.image("present", "assets/Present.png");
        this.load.image("belt", "assets/Belt_01.png");
        this.load.image("play", "assets/Play_01.png");
        this.load.image("pause", "assets/Pause_02.png");
        this.load.image("elf", "assets/Elf_02.png");
        this.load.image("sleigh", "assets/Sleigh.png");
        this.load.image("fast_forward", "assets/Fast_Forward.png");
        this.load.image("bauble_red", "assets/Bauble_Red.png");
        this.load.image("bauble_green", "assets/Bauble_Green.png");
        this.load.image("bauble_orange", "assets/Bauble_Orange.png");
        this.load.image("bauble_blue", "assets/Bauble_Blue.png");
        this.load.spritesheet("tinsel", "assets/Tinsel.png", { frameWidth: 16, frameHeight: 16});
        this.load.image("write_elf", "assets/Write_Head.png");
        this.load.image("read_elf", "assets/Read_Head.png");
	}

    reset_pointer_up_flags()
    {
        this.exit_selected = false;
        this.replay_selected = false;
        this.play_selected = false;
        this.pause_selected = false;
        this.speed_up_selected = false;
        this.slow_down_selected = false;
    }

    create()
    {
        const running_image = this.add.image(0, 0, 'running').setOrigin(0, 0);
        const button_y = running_image.height - 74;
        this.exit_button = this.add.image(16, button_y, "exit_door_belt").setOrigin(0, 0).setInteractive().setScale(2);
        this.replay_button = this.add.image(104, button_y, "replay").setOrigin(0, 0).setInteractive().setScale(2);
        this.play_button = this.add.image(192, button_y, "play").setOrigin(0, 0).setInteractive().setScale(2);
        this.pause_button = this.add.image(192, button_y, "pause").setOrigin(0, 0).setInteractive().setScale(2);
        this.progress_present = this.add.image(PROGRESS_PRESENT_MIN_X, button_y - 6, "present").setOrigin(0, 0).setScale(2);
        
        // Place the baubles on the Christmas Tree
        for (let y = 0; y < CHRISTMAS_TREE_HEIGHT; y += 1)
        {
            for (let x = 0; x < CHRISTMAS_TREE_WIDTH; x += 1)
            {
                this.christmas_tree_baubles.push(this.add.image(CHRISTMAS_TREE_LEFT + (x * 64), CHRISTMAS_TREE_TOP + (y * 64), "bauble_red").setOrigin(0, 0).setScale(2).setVisible(false));
            }
        }
        this.christmas_tree_baubles.reverse();
        // Add the read head and the writer
        this.write_elf = this.add.image(CHRISTMAS_TREE_LEFT, CHRISTMAS_TREE_TOP - 64, "write_elf").setOrigin(0, 0).setScale(2);
        this.add.image(CHRISTMAS_TREE_LEFT + (64 * (CHRISTMAS_TREE_WIDTH - 1)), CHRISTMAS_TREE_TOP + ((CHRISTMAS_TREE_HEIGHT - 1) * 64), "read_elf").setOrigin(0, 0).setScale(2);

        // Add the tinsel, which is a bit complicated.
        for (let y = 0; y < CHRISTMAS_TREE_HEIGHT; y += 1)
        {
            this.christmas_tree_tinsel.push(this.add.image(CHRISTMAS_TREE_LEFT + 32, CHRISTMAS_TREE_TOP + (64 * y), "tinsel", 1).setOrigin(0, 0).setScale(2).setVisible(false));
            this.christmas_tree_tinsel.push(this.add.image(CHRISTMAS_TREE_LEFT + 64, CHRISTMAS_TREE_TOP + (64 * y), "tinsel", 2).setOrigin(0, 0).setScale(2).setVisible(false));
            this.christmas_tree_tinsel.push(this.add.image(CHRISTMAS_TREE_LEFT + 96, CHRISTMAS_TREE_TOP + (64 * y), "tinsel", 1).setOrigin(0, 0).setScale(2).setVisible(false));
            this.christmas_tree_tinsel.push(this.add.image(CHRISTMAS_TREE_LEFT + 128, CHRISTMAS_TREE_TOP + (64 * y), "tinsel", 2).setOrigin(0, 0).setScale(2).setVisible(false));
            this.christmas_tree_tinsel.push(this.add.image(CHRISTMAS_TREE_LEFT + 160, CHRISTMAS_TREE_TOP + (64 * y), "tinsel", 1).setOrigin(0, 0).setScale(2).setVisible(false));
            this.christmas_tree_tinsel.push(this.add.image(CHRISTMAS_TREE_LEFT + 192, CHRISTMAS_TREE_TOP + (64 * y), "tinsel", 2).setOrigin(0, 0).setScale(2).setVisible(false));
        }
        this.christmas_tree_tinsel.reverse();

        // Hide play to toggle with pause
        this.play_button.setVisible(false).setActive(false);

        this.speed_up_button = this.add.image(816, button_y, "fast_forward").setOrigin(0, 0).setInteractive().setScale(2);
        this.slow_down_button = this.add.image(352, button_y, "fast_forward").setOrigin(0, 0).setInteractive().setScale(2).setFlipX(true);
        this.draw_grid();

        this.exit_button.on("pointerdown", () => {
            this.exit_selected = true;
        }, this);
        this.replay_button.on("pointerdown", () => {
            this.replay_selected = true;
        }, this);
        this.play_button.on("pointerdown", () => {
            this.play_selected = true;
        }, this);
        this.pause_button.on("pointerdown", () => {
            this.pause_selected = true;
        }, this);
        this.speed_up_button.on("pointerdown", () => {
            this.speed_up_selected = true;
        }, this);
        this.slow_down_button.on("pointerdown", () => {
            this.slow_down_selected = true;
        }, this);

        this.exit_button.on("pointerup", () => {
            if (this.exit_selected)
            {
                this.reset_pointer_up_flags();
                this.scene.start("building", {game_state: this.game_state});
            }
            this.reset_pointer_up_flags();
        }, this);
        this.replay_button.on("pointerup", () => {
            if (this.replay_selected)
            {
                this.replay();
            }
            this.reset_pointer_up_flags();
        }, this);
        this.play_button.on("pointerup", () => {
            if (this.play_selected)
            {
                this.play();
            }
            this.reset_pointer_up_flags();
        }, this);
        this.pause_button.on("pointerup", () => {
            if (this.pause_selected)
            {
                this.pause();
            }
            this.reset_pointer_up_flags();
        }, this);
        this.speed_up_button.on("pointerup", () => {
            if (this.speed_up_selected)
            {
                this.speed_up();
            }
            this.reset_pointer_up_flags();
        }, this);
        this.slow_down_button.on("pointerup", () => {
            if (this.slow_down_selected)
            {
                this.slow_down();
            }
            this.reset_pointer_up_flags();
        }, this);

        // Test the player's creation
        this.test_result = test_level_solution(LEVELS[this.game_state.current_level], this.get_grid());
        this.active_baubles = Object.assign([], this.test_result.baubles);
        this.active_step = 0;
        this.playing = true;
        this.update_baubles();

        // Decide what a sensible play speed is!!
        this.play_speed = 2;

        // Add the present and watch it fly!
        const elf_location = find_piece(this.get_grid(), Piece.Elf);
        if (elf_location)
        {
            const tile_size = GRID_WIDTH / this.get_grid().width;
            const scaling = tile_size / TILE_SIZE;
            const elf_position = this.get_real_coordinates(elf_location.x, elf_location.y);
            this.present = this.add.image(elf_position.x, elf_position.y, "present").setOrigin(0, 0).setScale(scaling);
        }
    }

    /*
     * Convert grid coordinates back to real coordinates
     */
    get_real_coordinates(grid_x: number, grid_y: number): {x: number, y: number}
    {
        const grid_size = Math.floor(GRID_WIDTH / this.get_grid().width);
        const x = (grid_x * grid_size) + GRID_X;
        const y = (grid_y * grid_size) + GRID_Y;
        return {x: x, y: y};
    }

    speed_up()
    {
        this.play_speed += 1;
        if (this.play_speed > MAX_PLAY_SPEED)
        {
            this.play_speed = MAX_PLAY_SPEED;
        }
    }

    slow_down()
    {
        this.play_speed -= 1;
        if (this.play_speed < MIN_PLAY_SPEED)
        {
            this.play_speed = MIN_PLAY_SPEED;
        }
    }

    replay()
    {
        this.play_button.setVisible(false).setActive(false);
        this.pause_button.setVisible(true).setActive(true);
        this.playing = true;
        this.active_baubles = Object.assign([], this.test_result.baubles);
        this.active_step = 0;
        const elf_location = find_piece(this.get_grid(), Piece.Elf);
        if (elf_location)
        {
            const elf_position = this.get_real_coordinates(elf_location.x, elf_location.y);
            this.present.setX(elf_position.x);
            this.present.setY(elf_position.y);
        }
    }

    play()
    {
        this.play_button.setVisible(false).setActive(false);
        this.pause_button.setVisible(true).setActive(true);
        this.playing = true;
    }

    pause()
    {
        this.pause_button.setVisible(false).setActive(false);
        this.play_button.setVisible(true).setActive(true);
        this.playing = false;
    }

    /*
     * Draw the grid with the pieces provided by the player
     */
    draw_grid()
    {
        for (let x = 0; x < this.get_grid().width; x += 1)
        {
            for (let y = 0; y < this.get_grid().height; y += 1)
            {
                this.draw_entry(x, y, this.get_grid().entries[x][y]);
            }
        }
    }

    draw_entry(x: number, y: number, entry: GridEntry)
    {
        // How wide is each tile?
        const tile_size = GRID_WIDTH / this.get_grid().width;
        const scaling = tile_size / TILE_SIZE;

        // Where is this on the screen?
        const real_x = GRID_X + (x * tile_size) + ((TILE_SIZE / 2) * scaling);
        const real_y = GRID_Y + (y * tile_size) + ((TILE_SIZE / 2) * scaling);
        
        let image: Phaser.GameObjects.Image | undefined;
        if (entry.piece == Piece.Belt)
        {
            image = this.add.image(real_x, real_y, "belt");
        }
        else if (entry.piece == Piece.BlueOrangeSwitch)
        {
            image = this.add.image(real_x, real_y, "splitter_orange_blue");
        }
        else if (entry.piece == Piece.RedGreenSwitch)
        {
            image = this.add.image(real_x, real_y, "splitter_red_green");
        }
        else if (entry.piece == Piece.BluePrinter)
        {
            image = this.add.image(real_x, real_y, "printer_blue");
        }
        else if (entry.piece == Piece.RedPrinter)
        {
            image = this.add.image(real_x, real_y, "printer_red");
        }
        else if (entry.piece == Piece.GreenPrinter)
        {
            image = this.add.image(real_x, real_y, "printer_green");
        }
        else if (entry.piece == Piece.OrangePrinter)
        {
            image = this.add.image(real_x, real_y, "printer_orange");
        }
        else if (entry.piece == Piece.Elf)
        {
            image = this.add.image(real_x, real_y, "elf");
        }
        else if (entry.piece == Piece.Sleigh)
        {
            image = this.add.image(real_x, real_y, "sleigh");
        }

        if (!image) return;
        
        image.setScale(scaling).setAngle(entry.angle);
        if (entry.angle % 90 !== 0 && entry.flipped)
        {
            image.toggleFlipY();
        }
        else if(entry.flipped)
        {
            image.toggleFlipX();
        }
    }

    update(time: number, delta: number): void {
        // Do nothing if we aren't playing
        if (!this.playing)
        {
            return;
        }

        // Nothing to do if we hit the final step...
        if (this.active_step >= this.test_result.path.length)
        {
            return;
        }
        const heading = this.test_result.path[this.active_step].next_position;
        if (!heading)
        {
            return;
        }
        const next_position = this.get_real_coordinates(heading.x, heading.y);
        // Calculate how far to travel...
        const distance = (delta / 1000) * (this.play_speed ** 2) * 32;
        
        // What direction are we travelling in?
        if (next_position.x > this.present.x)
        {
            this.present.setX(this.present.x + distance);
            if (this.present.x > next_position.x)
            {
                this.present.setX(next_position.x);
            }
        }
        else if (next_position.x < this.present.x)
        {
            this.present.setX(this.present.x - distance);
            if (this.present.x < next_position.x)
            {
                this.present.setX(next_position.x);
            }
        }
        else if (next_position.y > this.present.y)
        {
            this.present.setY(this.present.y + distance);
            if (this.present.y > next_position.y)
            {
                this.present.setY(next_position.y);
            }
        }
        else if (next_position.y < this.present.y)
        {
            this.present.setY(this.present.y - distance);
            if (this.present.y < next_position.y)
            {
                this.present.setY(next_position.y);
            }
        }

        // If we have arrived at the next position - update the step
        if (this.present.x == next_position.x && this.present.y == next_position.y)
        {
            this.active_step += 1;
            // Update the baubles for the next step...
            this.process_step_baubles(this.test_result.path[this.active_step]);
        }

        // Update the present location
        const present_progress = this.get_progress_percentage();
        const present_position = PROGRESS_PRESENT_MIN_X + (present_progress * (PROGRESS_PRESENT_MAX_X - PROGRESS_PRESENT_MIN_X));
        this.progress_present.setX(present_position);
    }

    process_step_baubles(step: Step)
    {
        if (step.action == Action.Write_Blue)
        {
            this.add_bauble(Bauble.Blue);
        }
        else if (step.action == Action.Write_Green)
        {
            this.add_bauble(Bauble.Green);
        }
        else if (step.action == Action.Write_Orange)
        {
            this.add_bauble(Bauble.Orange);
        }
        else if (step.action == Action.Write_Red)
        {
            this.add_bauble(Bauble.Red);
        }
        else if (step.action == Action.Read)
        {
            this.remove_bauble();
        }
    }
    
    update_baubles()
    {
        // Draw all the baubles on the Christmas tree (that can fit)
        // Clear the screen...
        for (let i = 0; i < this.christmas_tree_baubles.length; i += 1)
        {
            this.christmas_tree_baubles[i].setVisible(false);
        }
        for (let i = 0; i < this.christmas_tree_tinsel.length; i += 1)
        {
            this.christmas_tree_tinsel[i].setVisible(false);
        }
        
        // Now make the baubles have the correct colours...
        for (let i = 0; i < this.active_baubles.length; i += 1)
        {
            if (i >= CHRISTMAS_TREE_SIZE)
            {
                break;
            }
            if (this.active_baubles[i] == Bauble.Red)
            {
                this.christmas_tree_baubles[i].setTexture("bauble_red");
            }
            else if (this.active_baubles[i] == Bauble.Blue)
            {
                this.christmas_tree_baubles[i].setTexture("bauble_blue");
            }
            else if (this.active_baubles[i] == Bauble.Green)
            {
                this.christmas_tree_baubles[i].setTexture("bauble_green");
            }
            else if (this.active_baubles[i] == Bauble.Orange)
            {
                this.christmas_tree_baubles[i].setTexture("bauble_orange");
            }
            this.christmas_tree_baubles[i].setVisible(true);
        }

        // Make the right tinsel visible.
        for (let i = 0; i < this.active_baubles.length; i += 4)
        {
            if (i >= CHRISTMAS_TREE_SIZE) 
            {
                break;
            }
            const tinsel_base_index = (Math.floor(i / 4)) * 3;

            // This is fiddly enough we just brute force the calculation...
            this.christmas_tree_tinsel[tinsel_base_index * 2].setVisible(true);
            this.christmas_tree_tinsel[(tinsel_base_index * 2) + 1].setVisible(true);
            
            if (i + 1 < this.active_baubles.length)
            {
                this.christmas_tree_tinsel[(tinsel_base_index * 2) + 2].setVisible(true);
                this.christmas_tree_tinsel[(tinsel_base_index * 2) + 3].setVisible(true);
            }
            if (i + 2 < this.active_baubles.length)
            {
                this.christmas_tree_tinsel[(tinsel_base_index * 2) + 4].setVisible(true);
                this.christmas_tree_tinsel[(tinsel_base_index * 2) + 5].setVisible(true);
            }
        }

        // Finally place the write head
        let write_index = this.active_baubles.length;
        if (this.active_baubles.length >= CHRISTMAS_TREE_SIZE - 1)
        {
            write_index = CHRISTMAS_TREE_SIZE - 1;
        }
        this.write_elf.setX(this.christmas_tree_baubles[write_index].x);
        this.write_elf.setY(this.christmas_tree_baubles[write_index].y - 64);
    }

    add_bauble(bauble: Bauble)
    {
        // TODO: add the bauble to the tree
        this.active_baubles.push(bauble);
        this.update_baubles();
    }

    remove_bauble()
    {
        // TODO: remove the bauble from the tree
        this.active_baubles.shift();
        this.update_baubles();
    }

    /*
     * Calculate how far the present has travelled along its route
     */
    get_progress_percentage(): number
    {
        // Work out how far along the individual step we are
        if (this.active_step >= this.test_result.path.length)
        {
            return 1;
        }
        const heading = this.test_result.path[this.active_step].next_position;
        if (!heading)
        {
            return 1;
        }
        const next_position = this.get_real_coordinates(heading.x, heading.y);
        const current_position: Position = {x: this.present.x, y: this.present.y};

        // Work out how far along the step we are...
        const tile_size = Math.floor(GRID_WIDTH / this.get_grid().width);
        const step_progress = (tile_size - Math.abs(((next_position.x - current_position.x) + (next_position.y - current_position.y)))) / tile_size;
        // Work out how much percent each step is worth...
        const step_percent = 1 / (this.test_result.path.length - 1);
        // Then the step progress is a fraction of this...
        return (step_percent * this.active_step) + (step_percent * step_progress);
    }
}