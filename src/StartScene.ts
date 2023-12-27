import Phaser from 'phaser'
import { FONT_FAMILY, HIGHLIGHTED_TEXT, START_MENU_FONT_SIZE, TEXT } from './constants';

export default class StartScene extends Phaser.Scene {
	start_text: Phaser.GameObjects.Text | undefined;
	options_text: Phaser.GameObjects.Text | undefined;
	quit_text: Phaser.GameObjects.Text | undefined;

	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('start', 'assets/StartScreen.png');
	}

	// Highlight the menu option the user is about to click
	highlight_menu_option(text: Phaser.GameObjects.Text | undefined)
	{
		if (text !== this.start_text)
		{
			this.start_text?.setStyle({
				fontFamily: FONT_FAMILY,
				fontSize: START_MENU_FONT_SIZE,
				color: TEXT});
		}
		if (text !== this.options_text)
		{
			this.options_text?.setStyle({
				fontFamily: FONT_FAMILY,
				fontSize: START_MENU_FONT_SIZE,
				color: TEXT});
		}
		if (text !== this.quit_text)
		{
			this.quit_text?.setStyle({
				fontFamily: FONT_FAMILY,
				fontSize: START_MENU_FONT_SIZE,
				color: TEXT});
		}
		text?.setStyle({
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: HIGHLIGHTED_TEXT});
	}

	is_highlighted(text: Phaser.GameObjects.Text | undefined): boolean
	{
		if (text === this.start_text)
		{
			return this.start_text?.style.color == HIGHLIGHTED_TEXT;
		}
		if (text === this.options_text)
		{
			return this.options_text?.style.color == HIGHLIGHTED_TEXT;
		}
		if (text === this.quit_text)
		{
			return this.quit_text?.style.color == HIGHLIGHTED_TEXT;
		}
		return false;
	}

	create() {
		const startImage = this.add.image(0, 0, 'start').setOrigin(0, 0)

		this.start_text = this.add.text(197, 184, 'Start', {
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: HIGHLIGHTED_TEXT
		}).setInteractive();

		this.options_text = this.add.text(198, 242, 'Options', {
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: TEXT
		}).setInteractive();

		this.quit_text = this.add.text(198, 306, 'Quit', {
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: TEXT
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
	}

	start_game()
	{
		console.log("start!");
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
