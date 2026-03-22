// src/scenes/BattleScene.js
import Phaser from 'phaser'
import wordsData from '../data/words.json'
import { getStage, setStage, addExchange, getExchanges, addBefriended } from '../systems/storage.js'
import { evaluateStage } from '../systems/progression.js'
import { showBattle, hideBattle } from '../ui/BattlePanel.js'

const MAX_DINO_HP = 5 // number of correct answers to win

export class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene')
  }

  init(data) {
    this.dino = data.dino
    this.dinoHp = MAX_DINO_HP
    // playerHp is cosmetic only — reaching 0 does NOT end the battle.
    // The player always gets another attempt. HP bar is visual feedback only.
    this.playerHp = 5
    // Snapshot the stage at battle start. Word difficulty stays fixed
    // for the entire battle — stage only updates between encounters.
    this.battleStage = getStage()
  }

  create() {
    this.drawArena()
    this.nextAttack()
  }

  drawArena() {
    // Simple colored background
    const g = this.add.graphics()
    g.fillStyle(0x87ceeb) // sky
    g.fillRect(0, 0, 800, 350)
    g.fillStyle(0x4a7c59) // ground
    g.fillRect(0, 350, 800, 250)

    // Dino sprite or colored rectangle
    const key = this.textures.exists(this.dino.id) ? this.dino.id : null
    if (key) {
      this.dinoSprite = this.add.image(400, 260, key).setScale(3)
    } else {
      const rect = this.add.graphics()
      const col = parseInt(this.dino.color.replace('#', ''), 16)
      rect.fillStyle(col)
      rect.fillRect(340, 210, 120, 100)
      this.dinoSprite = rect
    }

    // Battle intro text
    this.add.text(400, 30, this.dino.battle_intro, {
      fontFamily: 'OpenDyslexic, Comic Sans MS',
      fontSize: '18px',
      color: '#1a1a1a',
      backgroundColor: '#ffffffcc',
      padding: { x: 10, y: 6 },
      wordWrap: { width: 500 },
    }).setOrigin(0.5, 0)
  }

  nextAttack() {
    // Use the stage snapshotted at battle start — never mid-battle
    const pool = wordsData.filter(w => w.stage === this.battleStage)
    const wordPool = pool.length > 0 ? pool : wordsData.filter(w => w.stage === 1)
    const entry = Phaser.Utils.Array.GetRandom(wordPool)

    showBattle({
      dino: this.dino,
      entry,
      dinoHp: this.dinoHp,
      maxHp: MAX_DINO_HP,
      playerHp: this.playerHp,
      onChoice: (correct) => this.handleChoice(correct, entry),
    })
  }

  handleChoice(correct, entry) {
    addExchange({ word: entry.word, correct: correct, timeMs: Date.now() })

    if (correct) {
      this.dinoHp--
      if (this.dinoHp <= 0) {
        this.winBattle()
        return
      }
    } else {
      // Cosmetic HP decrease — player can never be knocked out
      this.playerHp = Math.max(1, this.playerHp - 1)
      this.cameras.main.shake(300, 0.01)
    }

    this.time.delayedCall(800, () => this.nextAttack())
  }

  winBattle() {
    hideBattle()
    addBefriended(this.dino.id)

    // Evaluate and update stage NOW — between encounters, not mid-battle
    const exchanges = getExchanges()
    const newStage = evaluateStage(getStage(), exchanges)
    if (newStage !== getStage()) setStage(newStage)

    // Show win message on the Phaser canvas
    this.add.text(400, 300, this.dino.win_text, {
      fontFamily: 'OpenDyslexic, Comic Sans MS',
      fontSize: '20px',
      color: '#1a1a1a',
      backgroundColor: '#fff9c4cc',
      padding: { x: 16, y: 10 },
      wordWrap: { width: 500 },
    }).setOrigin(0.5)

    this.time.delayedCall(2500, () => {
      this.scene.stop()
      this.scene.resume('WorldScene', { befriended: this.dino.id })
    })
  }
}
