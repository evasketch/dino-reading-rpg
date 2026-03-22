// src/main.js
import Phaser from 'phaser'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#2d5a27',
  scene: [], // scenes added in later tasks
}

new Phaser.Game(config)
