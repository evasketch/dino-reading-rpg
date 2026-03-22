// src/ui/DialogPanel.js
import { mountPanel, removePanel } from './overlay.js'

const PANEL_ID = 'dialog-panel'

const styles = `
  #dialog-panel {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: #fff8e1;
    border-top: 4px solid #5d4037;
    padding: 1rem 1.25rem 1.1rem;
    font-family: 'OpenDyslexic', 'Comic Sans MS', cursive;
  }
  #dialog-panel .dp-speaker {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.6rem;
  }
  #dialog-panel .dp-portrait {
    width: 52px; height: 52px;
    border: 3px solid #5d4037;
    border-radius: 8px;
    background: #ffe0b2;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; flex-shrink: 0;
  }
  #dialog-panel .dp-name {
    font-size: 0.7rem; color: #795548;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 0.25rem;
  }
  #dialog-panel .dp-text {
    font-size: 1rem; color: #3e2723;
    line-height: 1.55; max-width: 42ch;
  }
  #dialog-panel .dp-choices {
    display: flex; gap: 0.5rem;
    padding-left: 64px; margin-top: 0.6rem;
  }
  #dialog-panel .dp-btn {
    background: #fff; border: 2.5px solid #8d6e63;
    border-radius: 8px; padding: 0.45rem 1rem;
    font-family: 'OpenDyslexic', 'Comic Sans MS', cursive;
    font-size: 0.9rem; color: #3e2723; cursor: pointer;
    transition: background 0.15s;
  }
  #dialog-panel .dp-btn:hover { background: #fff9c4; border-color: #f9a825; }
  #dialog-panel .dp-wrong {
    font-size: 0.85rem; color: #b71c1c;
    padding-left: 64px; margin-top: 0.4rem;
    font-style: italic;
  }
  #dialog-panel .dp-leave {
    position: absolute; top: 0.6rem; right: 0.75rem;
    background: none; border: none;
    font-family: 'OpenDyslexic', 'Comic Sans MS', cursive;
    font-size: 0.75rem; color: #aaa; cursor: pointer;
    padding: 0.2rem 0.4rem;
  }
  #dialog-panel .dp-leave:hover { color: #795548; }
`

/**
 * Show the dialog sequence for a dino.
 * Calls onBattleStart() when the dialog reaches a battle trigger.
 * Calls onClose() if the player dismisses the dialog without battling.
 *
 * @param {object} dino - dino data object from dinos.json
 * @param {function} onBattleStart
 * @param {function} onClose
 */
export function showDialog(dino, onBattleStart, onClose) {
  injectStyles()
  let stepIndex = 0

  function close() {
    removePanel(PANEL_ID)
    onClose?.()
  }

  function renderStep() {
    const step = dino.dialog[stepIndex]
    if (!step) {
      close()
      return
    }

    const choicesHtml = step.choices.map((c, i) =>
      `<button class="dp-btn" data-index="${i}" data-correct="${!!c.correct}" data-battle="${!!c.leads_to_battle}" data-wrong="${c.wrong_text || ''}">${c.text}</button>`
    ).join('')

    const html = `
      <button class="dp-leave" id="dp-leave-btn">← Leave</button>
      <div class="dp-speaker">
        <div class="dp-portrait">${dino.emoji}</div>
        <div>
          <div class="dp-name">${dino.name} the ${dino.species}</div>
          <div class="dp-text">${step.text}</div>
        </div>
      </div>
      <div class="dp-choices">${choicesHtml}</div>
      <div class="dp-wrong" id="dp-wrong-msg" style="display:none"></div>
    `

    const panel = mountPanel(html, PANEL_ID)

    document.getElementById('dp-leave-btn').addEventListener('click', close)

    panel.querySelectorAll('.dp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.correct === 'true'
        const leadsToBattle = btn.dataset.battle === 'true'
        const wrongText = btn.dataset.wrong

        if (isCorrect) {
          if (leadsToBattle) {
            removePanel(PANEL_ID)
            onBattleStart()
          } else {
            stepIndex++
            renderStep()
          }
        } else {
          // Show wrong response, then loop back
          const msg = document.getElementById('dp-wrong-msg')
          msg.textContent = wrongText
          msg.style.display = 'block'
          const t = setTimeout(() => renderStep(), 1600)
          panel._wrongTimer = t
        }
      })
    })
  }

  renderStep()
}

function injectStyles() {
  if (document.getElementById('dialog-panel-styles')) return
  const style = document.createElement('style')
  style.id = 'dialog-panel-styles'
  style.textContent = styles
  document.head.appendChild(style)
}
