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
		if (text != this.start_text)
		{
			this.start_text?.setStyle({
				fontFamily: FONT_FAMILY,
				fontSize: START_MENU_FONT_SIZE,
				color: TEXT});
		}
		if (text != this.options_text)
		{
			this.start_text?.setStyle({
				fontFamily: FONT_FAMILY,
				fontSize: START_MENU_FONT_SIZE,
				color: TEXT});
		}
		if (text != this.quit_text)
		{
			this.start_text?.setStyle({
				fontFamily: FONT_FAMILY,
				fontSize: START_MENU_FONT_SIZE,
				color: TEXT});
		}
		text?.setStyle({
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: HIGHLIGHTED_TEXT});
	}

	create() {
		const startImage = this.add.image(0, 0, 'start').setOrigin(0, 0).setInteractive()
		startImage.on('pointerup',  () =>
        {
			const pointer_position = this.input.activePointer.position;
			
			// Where does this fall?
            if (!this.scale.isFullscreen)
			{
                this.scale.startFullscreen();
            }
        }, this);

		this.start_text = this.add.text(197, 184, 'Start', {
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: HIGHLIGHTED_TEXT
		});

		this.options_text = this.add.text(198, 242, 'Options', {
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: TEXT
		});

		this.quit_text = this.add.text(198, 306, 'Quit', {
			fontFamily: FONT_FAMILY,
			fontSize: START_MENU_FONT_SIZE,
			color: TEXT
		});

		// Centre the text
		this.start_text.setX((startImage.width - this.start_text.getBounds().width) / 2);
		this.options_text.setX((startImage.width - this.options_text.getBounds().width) / 2);
		this.quit_text.setX((startImage.width - this.quit_text.getBounds().width) / 2);
		
		// Set up the menu events
		this.start_text.on('pointerup', () => {
			console.log("Start!");
		}, this);
		this.start_text.on('pointerdown', () => {
			this.highlight_menu_option(this.start_text);
		}, this);

		this.options_text.on('pointerup', () => {
			console.log("Options!");
		}, this);
		this.start_text.on('pointerdown', () => {
			this.highlight_menu_option(this.options_text);
		}, this);

		this.quit_text.on('pointerup', () => {
			console.log("Quit!");
		}, this);
		this.quit_text.on('pointerdown', () => {
			this.highlight_menu_option(this.quit_text);
		}, this);
	}

	update(time: number, delta: number): void {
		
	}
}
