import Phaser from 'phaser'
import { GameState, init_game_state } from './logic';

const PRESENT_START_X = 288;
const PRESENT_END_X = 666;

export default class LevelSelectScene extends Phaser.Scene {
	game_state!: GameState;
	present: Phaser.GameObjects.Sprite | undefined;
	level_selected: number = 0;
	exit_selected: boolean = false;
	level_number_sprites: { [id: number]: Phaser.GameObjects.Sprite } = {};
	level_highlighted_number_sprites: { [id: number]: Phaser.GameObjects.Sprite } = {};

    constructor() {
		super('level-select')
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

	preload() {
		this.load.image("level_select", "assets/LevelSelect.png");
		this.load.spritesheet("animated_long_belt", "assets/Long_Belt_Animated.png", { frameWidth: 192, frameHeight: 32 });
		this.load.image("present", "assets/Present.png");
		this.load.spritesheet("level_select_numbers", "assets/Numbers.png", { frameWidth: 32, frameHeight: 32 });
		this.load.image("exit_door", "assets/Exit_Door.png");
	}

	add_number_images()
	{
		for (let i = 0; i < 30; i++)
		{
			const column = i % 10;
			const row = Math.floor(i / 10);
			const frame = column + (row * 20);

			const level_sprite = this.add.sprite(120 + (column * 72), 192 + (row * 80), "level_select_numbers", frame).setOrigin(0, 0).setScale(2).setInteractive();
			this.level_number_sprites[i] = level_sprite;

			const level_highlighted_sprite = this.add.sprite(120 + (column * 72), 192 + (row * 80), "level_select_numbers", frame + 10).setOrigin(0, 0).setScale(2).setInteractive();
			this.level_highlighted_number_sprites[i] = level_highlighted_sprite;

			if (this.game_state.level_solved[i])
			{
				level_highlighted_sprite.setVisible(true);
				level_sprite.setVisible(false);
			}
			else
			{
				level_highlighted_sprite.setVisible(false);
				level_sprite.setVisible(true);
			}

			level_sprite.on("pointerdown", () => {
				this.update_numbers(i);
			}, this);
			level_highlighted_sprite.on("pointerdown", () => {
				this.update_numbers(i);
			}, this);

			level_sprite.on("pointerup", () => {
				if (this.level_selected == i)
				{
					this.start_level(i);
				}
			}, this);
			level_highlighted_sprite.on("pointerup", () => {
				if (this.level_selected == i)
				{
					this.start_level(i);
				}
			}, this);
		}
	}

	start_level(level: number)
	{
		this.game_state.current_level = level;
		this.scene.start("building", {game_state: this.game_state});
	}

	update_numbers(new_level_selected: number)
	{
		this.level_selected = new_level_selected;
	}

    create() {
		const level_select_image = this.add.image(0, 0, 'level_select').setOrigin(0, 0)
		const exit_door = this.add.image(0, level_select_image.height - 64, "exit_door").setOrigin(0, 0).setScale(2).setInteractive();

		exit_door.on("pointerdown", () => {
			this.exit_selected = true;
		}, this);
		exit_door.on("pointerup", () => {
			if (this.exit_selected)
			{
				this.scene.start("start", {game_state: this.game_state});
			}
		}, this);
		this.input.on("pointerup", () => {
			this.exit_selected = false;
		});
		this.add_number_images();
		this.anims.create({
			key: "menu_belt_level_select",
			frames: this.anims.generateFrameNumbers("animated_long_belt", {start: 0, end: 6}),
			frameRate: 30,
			repeat: -1,
		})

		this.add.sprite(288, 464, "animated_long_belt").setOrigin(0, 0).setScale(2).play("menu_belt_level_select");
		this.present = this.add.sprite(PRESENT_START_X, 490, "present").setScale(2);
    }

    update(time: number, delta: number): void {
		this.present?.setX(this.present?.x + (delta / 30) * 4.125);
		if (this.present && this.present?.x > PRESENT_END_X)
		{
			this.present?.setX(PRESENT_START_X);
		}
	}
}
