// src/ui/EndPanel.js
import { mountPanel, removePanel } from './overlay.js'
import { resetAll } from '../systems/storage.js'
import dinosData from '../data/dinos.json'

const PANEL_ID = 'end-panel'

const styles = `
  #end-panel {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #fff8e1 0%, #e8f5e9 100%);
    font-family: 'OpenDyslexic', 'Comic Sans MS', cursive;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 2rem;
  }
  #end-panel h1 { font-size: 1.8rem; color: #5d4037; margin-bottom: 0.5rem; }
  #end-panel .ep-subtitle { font-size: 1rem; color: #795548; margin-bottom: 2rem; }
  #end-panel .ep-dinos { display: flex; gap: 1.5rem; margin-bottom: 2rem; }
  #end-panel .ep-dino { font-size: 4rem; }
  #end-panel .ep-play-again {
    background: #5d4037; color: #fff;
    border: none; border-radius: 10px;
    padding: 0.75rem 2.5rem;
    font-family: 'OpenDyslexic', 'Comic Sans MS', cursive;
    font-size: 1.1rem; cursor: pointer;
  }
  #end-panel .ep-play-again:hover { background: #795548; }
`

export function showEndScreen(onRestart) {
  injectStyles()

  const dinosHtml = dinosData.map(d => `<div class="ep-dino">${d.emoji}</div>`).join('')

  const html = `
    <h1>You did it! 🎉</h1>
    <div class="ep-subtitle">You made friends with all the dinos!</div>
    <div class="ep-dinos">${dinosHtml}</div>
    <button class="ep-play-again" id="ep-restart">Play Again</button>
  `

  const panel = mountPanel(html, PANEL_ID)
  document.getElementById('ep-restart').addEventListener('click', () => {
    resetAll()
    removePanel(PANEL_ID)
    onRestart()
  })
}

function injectStyles() {
  if (document.getElementById('end-panel-styles')) return
  const style = document.createElement('style')
  style.id = 'end-panel-styles'
  style.textContent = styles
  document.head.appendChild(style)
}
