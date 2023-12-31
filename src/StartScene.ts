import Phaser from 'phaser'
import { FONT_FAMILY, HIGHLIGHTED_TEXT_COLOR, START_MENU_FONT_SIZE, TEXT_COLOR } from './constants';
import { GameState, init_game_state } from './logic';

const PRESENT_START_X = 288;
const PRESENT_END_X = 666;

export default class StartScene extends Phaser.Scene {
	start_text: Phaser.GameObjects.Text | undefined;
	options_text: Phaser.GameObjects.Text | undefined;
	quit_text: Phaser.GameObjects.Text | undefined;
	present: Phaser.GameObjects.Sprite | undefined;
	game_state!: GameState;

	constructor() {
		super('start')
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
		this.load.image("start", "assets/StartScreen.png");
		this.load.spritesheet("animated_long_belt", "assets/Long_Belt_Animated.png", { frameWidth: 192, frameHeight: 32 });
		this.load.image("present", "assets/Present.png");
	}

	// Highlight the menu option the user is about to click
	highlight_menu_option(text: Phaser.GameObjects.Text | undefined)
	{
		if (text !== this.start_text)
		{
			this.start_text?.setStyle({
				fontFamily: FONT_FAMILY,
				fontSize: START_MENU_FONT_SIZE,
				color: TEXT_COLOR});
		}
		if (text !== this.options_text)
		{
			this.options_text?.setStyle({
				fontFamily: FONT_FAMILY,
				fontSize: START_MENU_FONT_SIZE,
				color: TEXT_COLOR});
		}
		if (text !== this.quit_text)
		{
			this.quit_text?.setStyle({
				fontFamily: FONT_FAMILY,
				fontSize: START_MENU_FONT_SIZE,
				color: TEXT_COLOR});
		}
		text?.setStyle({
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: HIGHLIGHTED_TEXT_COLOR});
	}

	is_highlighted(text: Phaser.GameObjects.Text | undefined): boolean
	{
		if (text === this.start_text)
		{
			return this.start_text?.style.color == HIGHLIGHTED_TEXT_COLOR;
		}
		if (text === this.options_text)
		{
			return this.options_text?.style.color == HIGHLIGHTED_TEXT_COLOR;
		}
		if (text === this.quit_text)
		{
			return this.quit_text?.style.color == HIGHLIGHTED_TEXT_COLOR;
		}
		return false;
	}

	create() {
		const startImage = this.add.image(0, 0, 'start').setOrigin(0, 0)

		this.start_text = this.add.text(197, 184, 'Start', {
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: HIGHLIGHTED_TEXT_COLOR
		}).setInteractive();

		this.options_text = this.add.text(198, 242, 'Options', {
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: TEXT_COLOR
		}).setInteractive();

		this.quit_text = this.add.text(198, 306, 'Quit', {
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: TEXT_COLOR
		}).setInteractive();

		// Centre the text
		this.start_text.setX((startImage.width - this.start_text.getBounds().width) / 2);
		this.options_text.setX((startImage.width - this.options_text.getBounds().width) / 2);
		this.quit_text.setX((startImage.width - this.quit_text.getBounds().width) / 2);
		
		// Set up the menu events
		this.start_text.on('pointerup', () => {
			if (this.is_highlighted(this.start_text))
			{
				this.start_game();
			}
		}, this);
		this.start_text.on('pointerdown', () => {
			this.highlight_menu_option(this.start_text);
		}, this);

		this.options_text.on('pointerup', () => {
			if (this.is_highlighted(this.options_text))
			{
				this.open_options();
			}
		}, this);
		this.options_text.on('pointerdown', () => {
			this.highlight_menu_option(this.options_text);
		}, this);

		this.quit_text.on('pointerup', () => {
			if (this.is_highlighted(this.quit_text))
			{
				this.quit_game();
			}
		}, this);
		this.quit_text.on('pointerdown', () => {
			this.highlight_menu_option(this.quit_text);
		}, this);

		this.anims.create({
			key: "menu_belt",
			frames: this.anims.generateFrameNumbers("animated_long_belt", {start: 0, end: 7}),
			frameRate: 30,
			repeat: -1,
		})

		this.add.sprite(288, 464, "animated_long_belt").setOrigin(0, 0).setScale(2).play("menu_belt");
		this.present = this.add.sprite(PRESENT_START_X, 490, "present").setScale(2);
	}

	update(time: number, delta: number): void {
		this.present?.setX(this.present?.x + (delta / 30) * 4.125);
		if (this.present && this.present?.x > PRESENT_END_X)
		{
			this.present?.setX(PRESENT_START_X);
		}
	}

	start_game()
	{
		this.scene.start("level-select", {game_state: this.game_state});
	}

	open_options()
	{
		console.log("options!");
	}

	quit_game()
	{
		// Quit the entire game!
		console.log("Closing!");
		this.game.destroy(true, false);
		window.close();
	}
}
