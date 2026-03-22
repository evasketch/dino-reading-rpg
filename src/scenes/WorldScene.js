// src/scenes/WorldScene.js
import Phaser from 'phaser'
import { getBefriended } from '../systems/storage.js'
import dinosData from '../data/dinos.json'

// Map layout: where each dino NPC stands (x, y in pixels)
const DINO_POSITIONS = {
  trex:   { x: 600, y: 150 },
  brachi: { x: 200, y: 200 },
  ankylo: { x: 400, y: 450 },
}

const TRIGGER_DISTANCE = 80 // pixels — how close to trigger dialog

export class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene')
  }

  create() {
    this.drawMap()
    this.createPlayer()
    this.createDinoNPCs()
    this.createCursors()
    this.createCollectionButton()

    // Listen for return from battle
    this.events.on('resume', (scene, data) => {
      if (data?.befriended) {
        this.refreshNPCs()
      }
    })
  }

  drawMap() {
    const g = this.add.graphics()

    // Ground
    g.fillStyle(0x4a7c59)
    g.fillRect(0, 0, 800, 600)

    // Path (light dirt strip down the center)
    g.fillStyle(0xc8a96e)
    g.fillRect(340, 0, 120, 600)

    // Decorative patches
    g.fillStyle(0x3d6b4a)
    g.fillRect(50, 50, 80, 60)
    g.fillRect(650, 80, 70, 70)
    g.fillRect(100, 400, 90, 70)
    g.fillRect(600, 380, 80, 80)

    // Rocks
    g.fillStyle(0x888888)
    g.fillCircle(150, 300, 20)
    g.fillCircle(680, 250, 15)
  }

  createPlayer() {
    this.player = this.physics.add.sprite(400, 520, 'player')
    this.player.setCollideWorldBounds(true)

    // Fallback if no sprite loaded: draw a colored rectangle
    if (!this.textures.exists('player')) {
      const g = this.add.graphics()
      g.fillStyle(0x3498db)
      g.fillRect(-16, -16, 32, 32)
    }
  }

  createDinoNPCs() {
    this.npcs = {}
    const befriended = getBefriended()

    dinosData.forEach(dino => {
      const pos = DINO_POSITIONS[dino.id]
      if (!pos) return

      const isFriendly = befriended.includes(dino.id)
      const key = this.textures.exists(dino.id) ? dino.id : null

      let sprite
      if (key) {
        sprite = this.add.image(pos.x, pos.y, key)
      } else {
        // Colored rectangle fallback
        const g = this.add.graphics()
        g.fillStyle(parseInt(dino.color.replace('#', ''), 16))
        g.fillRect(pos.x - 20, pos.y - 20, 40, 40)
        sprite = g
      }

      // Name label
      this.add.text(pos.x, pos.y - 35, dino.name, {
        fontFamily: 'OpenDyslexic, Comic Sans MS',
        fontSize: '12px',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5)

      // Friendly indicator
      if (isFriendly) {
        this.add.text(pos.x, pos.y - 52, '⭐', { fontSize: '16px' }).setOrigin(0.5)
      }

      this.npcs[dino.id] = { sprite, data: dino, pos, triggered: isFriendly }
    })
  }

  createCursors() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys('W,A,S,D')
  }

  createCollectionButton() {
    const btn = this.add.text(760, 20, '📋', {
      fontSize: '28px',
      backgroundColor: '#00000066',
      padding: { x: 6, y: 4 },
    })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showCollection())
  }

  update() {
    const speed = 180
    const { left, right, up, down } = this.cursors
    const { A, D, W, S } = this.wasd

    this.player.setVelocity(0)

    if (left.isDown || A.isDown) this.player.setVelocityX(-speed)
    else if (right.isDown || D.isDown) this.player.setVelocityX(speed)

    if (up.isDown || W.isDown) this.player.setVelocityY(-speed)
    else if (down.isDown || S.isDown) this.player.setVelocityY(speed)

    this.checkNPCProximity()
  }

  checkNPCProximity() {
    const px = this.player.x
    const py = this.player.y

    Object.values(this.npcs).forEach(npc => {
      if (npc.triggered) return

      const dist = Phaser.Math.Distance.Between(px, py, npc.pos.x, npc.pos.y)
      if (dist < TRIGGER_DISTANCE) {
        npc.triggered = true
        this.startDialog(npc.data)
      }
    })
  }

  startDialog(dinoData) {
    this.player.setVelocity(0)
    this.scene.pause()
    import('../ui/DialogPanel.js')
      .then(({ showDialog }) => {
        showDialog(dinoData, () => this.startBattle(dinoData))
      })
      .catch(err => {
        console.error('Failed to load DialogPanel:', err)
        this.scene.resume() // unpause so game isn't stuck
      })
  }

  startBattle(dinoData) {
    this.scene.resume()
    this.scene.launch('BattleScene', { dino: dinoData })
    this.scene.pause()
  }

  refreshNPCs() {
    const befriended = getBefriended()
    const allFriended = dinosData.every(d => befriended.includes(d.id))

    if (allFriended) {
      import('../ui/EndPanel.js')
        .then(({ showEndScreen }) => showEndScreen(() => this.scene.restart()))
        .catch(err => console.error('Failed to load EndPanel:', err))
      return
    }

    this.scene.restart()
  }

  showCollection() {
    import('../ui/CollectionPanel.js')
      .then(({ showCollection }) => showCollection())
      .catch(err => console.error('Failed to load CollectionPanel:', err))
  }
}
