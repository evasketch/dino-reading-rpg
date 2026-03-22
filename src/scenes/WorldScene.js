// src/scenes/WorldScene.js
import Phaser from 'phaser'

export class WorldScene extends Phaser.Scene {
  constructor() { super('WorldScene') }
  create() {
    this.add.text(400, 300, 'World Scene — coming soon', {
      fontFamily: 'OpenDyslexic, Comic Sans MS',
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5)
  }
}
