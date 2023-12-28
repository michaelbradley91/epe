import Phaser from 'phaser'
import { GRID_HEIGHT, GRID_WIDTH, GRID_X, GRID_Y, TILE_SIZE } from './constants';
import { Grid, GridEntry, Piece } from './types';

export default class PlayScene extends Phaser.Scene {
    grid!: Grid;

    constructor() {
		super('play')
	}

    init(data: {grid: Grid})
    {
        this.grid = data.grid;

        if (!this.grid)
        {
            this.grid = { width: Math.floor(GRID_WIDTH / 64), height: Math.floor(GRID_HEIGHT / 64), entries: []};
            for (let x = 0; x < this.grid.width; x += 1)
            {
                this.grid.entries[x] = [];
                for (let y = 0; y < this.grid.height; y += 1)
                {
                    this.grid.entries[x][y] = {
                        angle: 0,
                        flipped: false,
                        piece: Piece.Nothing
                    }
                }
            }
            this.grid.entries[0][0].piece = Piece.Elf;
            this.grid.entries[0][1].piece = Piece.Sleigh;
        }
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

    create()
    {
        const running_image = this.add.image(0, 0, 'running').setOrigin(0, 0);
        const button_y = running_image.height - 74;

        this.draw_grid();
    }

    /*
     * Draw the grid with the pieces provided by the player
     */
    draw_grid()
    {
        for (let x = 0; x < this.grid.width; x += 1)
        {
            for (let y = 0; y < this.grid.height; y += 1)
            {
                this.draw_entry(x, y, this.grid.entries[x][y]);
            }
        }
    }

    draw_entry(x: number, y: number, entry: GridEntry)
    {
        // How wide is each tile?
        const tile_size = GRID_WIDTH / this.grid.width;
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

    update(time: number, delta: number): void {}
}