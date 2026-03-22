// src/scenes/BootScene.js
import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // Load sprite assets
    this.load.image('player', '/assets/sprites/player.png')
    this.load.image('trex', '/assets/sprites/trex.png')
    this.load.image('brachi', '/assets/sprites/brachi.png')
    this.load.image('ankylo', '/assets/sprites/ankylo.png')
  }

  create() {
    this.scene.start('WorldScene')
  }
}
