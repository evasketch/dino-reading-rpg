// src/ui/BattlePanel.js
import { mountPanel, removePanel } from './overlay.js'
import { renderWord } from '../utils/phonemeRenderer.js'

const PANEL_ID = 'battle-panel'

const styles = `
  #battle-panel {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: #fff8e1;
    border-top: 3px solid #5d4037;
    font-family: 'OpenDyslexic', 'Comic Sans MS', cursive;
  }
  #battle-panel .bp-hud {
    background: #4e342e;
    padding: 0.5rem 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 0.8rem;
  }
  #battle-panel .bp-hud-side { display: flex; flex-direction: column; gap: 3px; }
  #battle-panel .bp-hp-bar {
    background: #333; border-radius: 4px; height: 8px; width: 120px; overflow: hidden;
  }
  #battle-panel .bp-hp-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
  #battle-panel .bp-hp-fill.dino { background: #ef5350; }
  #battle-panel .bp-hp-fill.player { background: #66bb6a; }
  #battle-panel .bp-label { font-size: 0.6rem; color: #ffcc80; text-transform: uppercase; }
  #battle-panel .bp-attack {
    text-align: center;
    padding: 0.75rem 1rem 0.5rem;
    border-bottom: 2px solid #e0d0b0;
  }
  #battle-panel .bp-attack-label {
    font-size: 0.7rem; color: #795548;
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem;
  }
  #battle-panel .bp-word { font-size: 2.2rem; letter-spacing: 0.05em; }
  #battle-panel .bp-instruction {
    font-size: 0.78rem; color: #8d6e63; margin-top: 0.3rem;
  }
  #battle-panel .bp-choices {
    background: #efebe9;
    padding: 0.75rem 1.25rem;
    display: flex; gap: 0.6rem;
  }
  #battle-panel .bp-choice {
    flex: 1; background: #fff;
    border: 2.5px solid #8d6e63;
    border-radius: 10px; padding: 0.6rem 0.5rem;
    text-align: center; cursor: pointer;
    font-family: 'OpenDyslexic', 'Comic Sans MS', cursive;
    font-size: 1.1rem; color: #3e2723;
    display: flex; flex-direction: column;
    align-items: center; gap: 0.2rem;
    transition: background 0.15s;
  }
  #battle-panel .bp-choice:hover { background: #fff9c4; border-color: #f9a825; }
  #battle-panel .bp-choice.correct { background: #c8e6c9; border-color: #388e3c; pointer-events: none; }
  #battle-panel .bp-choice.wrong { background: #ffcdd2; border-color: #e53935; pointer-events: none; }
  #battle-panel .bp-choice .bp-icon { font-size: 1.5rem; }
  #battle-panel .bp-choice .bp-word-small { font-size: 1rem; }
`

const ACTION_ICONS = {
  run: '🏃', jump: '🦘', duck: '🙇', dodge: '💨',
  block: '🛡️', hop: '🐸', sit: '🪑', nap: '😴',
  hide: '🫣', spin: '🌀', roll: '🎳', back: '👣',
}

const ACTION_PHONEMES = {
  run:   ['r', 'u', 'n'],
  jump:  ['j', 'u', 'mp'],
  duck:  ['d', 'u', 'ck'],
  dodge: ['d', 'o', 'dge'],
  block: ['bl', 'o', 'ck'],
  hop:   ['h', 'o', 'p'],
  sit:   ['s', 'i', 't'],
  nap:   ['n', 'a', 'p'],
  hide:  ['h', 'i', 'de'],
  spin:  ['sp', 'i', 'n'],
  roll:  ['r', 'o', 'll'],
  back:  ['b', 'a', 'ck'],
}

/**
 * Show the battle UI panel.
 * @param {object} opts
 * @param {object} opts.dino
 * @param {object} opts.entry - word database entry
 * @param {number} opts.dinoHp
 * @param {number} opts.maxHp
 * @param {number} opts.playerHp
 * @param {function} opts.onChoice - called with (correct: boolean)
 */
export function showBattle({ dino, entry, dinoHp, maxHp, playerHp, onChoice }) {
  injectStyles()

  // Build shuffled choices: [counter, ...distractors]
  const allChoices = [entry.counter, ...entry.distractors]
  const shuffled = allChoices.sort(() => Math.random() - 0.5)

  const choicesHtml = shuffled.map(word => {
    const icon = ACTION_ICONS[word] ?? '❓'
    const phonemes = ACTION_PHONEMES[word] ?? [word]
    return `<button class="bp-choice" data-word="${word}" data-correct="${word === entry.counter}">
      <span class="bp-icon">${icon}</span>
      <span class="bp-word-small">${renderWord(phonemes)}</span>
    </button>`
  }).join('')

  const dinoHpPct = Math.round((dinoHp / maxHp) * 100)
  const playerHpPct = Math.round((playerHp / 5) * 100)

  const html = `
    <div class="bp-hud">
      <div class="bp-hud-side">
        <div class="bp-label">${dino.name}</div>
        <div class="bp-hp-bar"><div class="bp-hp-fill dino" style="width:${dinoHpPct}%"></div></div>
      </div>
      <div style="color:#ffcc80;font-size:0.85rem;">⚔️</div>
      <div class="bp-hud-side" style="align-items:flex-end">
        <div class="bp-label">You</div>
        <div class="bp-hp-bar"><div class="bp-hp-fill player" style="width:${playerHpPct}%"></div></div>
      </div>
    </div>
    <div class="bp-attack">
      <div class="bp-attack-label">${dino.name} used…</div>
      <div class="bp-word">${renderWord(entry.phonemes)}</div>
      <div class="bp-instruction">What do you do?</div>
    </div>
    <div class="bp-choices">${choicesHtml}</div>
  `

  const panel = mountPanel(html, PANEL_ID)

  let choiceTimer = null
  panel.querySelectorAll('.bp-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      if (choiceTimer) return // prevent double-click
      const correct = btn.dataset.correct === 'true'
      btn.classList.add(correct ? 'correct' : 'wrong')
      // Disable all buttons
      panel.querySelectorAll('.bp-choice').forEach(b => b.style.pointerEvents = 'none')
      choiceTimer = setTimeout(() => onChoice(correct), 800)
    })
  })
}

export function hideBattle() {
  removePanel(PANEL_ID)
}

function injectStyles() {
  if (document.getElementById('battle-panel-styles')) return
  const style = document.createElement('style')
  style.id = 'battle-panel-styles'
  style.textContent = styles
  document.head.appendChild(style)
}
