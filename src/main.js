// src/main.js
import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene.js'
import { WorldScene } from './scenes/WorldScene.js'
import { BattleScene } from './scenes/BattleScene.js'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#2d5a27',
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [BootScene, WorldScene, BattleScene],
}

new Phaser.Game(config)
