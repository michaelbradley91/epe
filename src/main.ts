import Phaser from 'phaser'

import StartScene from './StartScene'
import LevelSelectScene from './LevelSelectScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 960,
	height: 540,
	antialias: false,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},
	scene: [StartScene, LevelSelectScene],
	pixelArt: true,
	scale: {
		parent: 'app',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		zoom: 1,
	}
}

const game = new Phaser.Game(config);
export default game
