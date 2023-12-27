import Phaser from 'phaser'

export default class BuildingScene extends Phaser.Scene {

    level: number = -1;
    button_rotate: number = 0;
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
	}

    init(level: number)
    {
        this.level = level;
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
                this.scene.start("level-select");
            }
        }, this);
        this.reflect_button.on("pointerup", () => {
            if (this.reflect_selected)
            {
                this.reflect_button_pressed();
                this.reflect_selected = false;
            }
        }, this);
        this.rotate_button.on("pointerup", () => {
            if (this.rotate_selected)
            {
                this.rotate_button_pressed();
                this.rotate_selected = false;
            }
        }, this);
        this.play_button.on("pointerup", () => {
            if (this.play_selected)
            {
                this.play_selected = false;
            }
        }, this);
        
        // Turn off button selection when it hits somewhere else
        this.input.on("pointerup", () => {
			this.exit_selected = false;
			this.rotate_selected = false;
			this.reflect_selected = false;
            this.play_selected = false;
		});
    }

    reflect_button_pressed()
    {
        // Reflect all of the buttons...
        if (this.button_rotate % 90 !== 0)
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

    }

    highlight_build_button(button: Phaser.GameObjects.Image)
    {
        this.highlight_button.setX(button.x);
        this.highlight_button.setY(button.y);
    }

    update(time: number, delta: number): void {}
}