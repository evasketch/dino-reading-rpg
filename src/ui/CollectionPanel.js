// src/ui/CollectionPanel.js
import { mountPanel, removePanel } from './overlay.js'
import { getBefriended } from '../systems/storage.js'
import dinosData from '../data/dinos.json'

const PANEL_ID = 'collection-panel'

const styles = `
  #collection-panel {
    position: absolute; inset: 0;
    background: #fff8e1;
    font-family: 'OpenDyslexic', 'Comic Sans MS', cursive;
    padding: 1.5rem;
    overflow-y: auto;
  }
  #collection-panel h2 {
    font-size: 1.4rem; color: #5d4037;
    margin-bottom: 1rem; text-align: center;
  }
  #collection-panel .cp-grid {
    display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;
  }
  #collection-panel .cp-card {
    background: #fff;
    border: 3px solid #8d6e63;
    border-radius: 12px;
    padding: 1rem;
    width: 180px; text-align: center;
  }
  #collection-panel .cp-card.locked {
    opacity: 0.4; filter: grayscale(1);
  }
  #collection-panel .cp-emoji { font-size: 3rem; }
  #collection-panel .cp-name {
    font-size: 1rem; color: #3e2723; margin: 0.4rem 0 0.2rem;
  }
  #collection-panel .cp-species {
    font-size: 0.7rem; color: #795548; text-transform: uppercase;
    letter-spacing: 0.06em; margin-bottom: 0.5rem;
  }
  #collection-panel .cp-fact {
    font-size: 0.78rem; color: #5d4037; line-height: 1.4;
  }
  #collection-panel .cp-locked-msg {
    font-size: 0.78rem; color: #aaa; font-style: italic;
  }
  #collection-panel .cp-back {
    display: block; margin: 1.5rem auto 0;
    background: #5d4037; color: #fff;
    border: none; border-radius: 8px;
    padding: 0.6rem 2rem;
    font-family: 'OpenDyslexic', 'Comic Sans MS', cursive;
    font-size: 1rem; cursor: pointer;
  }
  #collection-panel .cp-back:hover { background: #795548; }
`

export function showCollection(onClose) {
  injectStyles()
  const befriended = getBefriended()

  const cardsHtml = dinosData.map(dino => {
    const isUnlocked = befriended.includes(dino.id)
    return `
      <div class="cp-card ${isUnlocked ? '' : 'locked'}">
        <div class="cp-emoji">${dino.emoji}</div>
        <div class="cp-name">${dino.name}</div>
        <div class="cp-species">${dino.species}</div>
        ${isUnlocked
          ? `<div class="cp-fact">${dino.fun_fact}</div>`
          : `<div class="cp-locked-msg">Not yet found…</div>`
        }
      </div>
    `
  }).join('')

  const html = `
    <h2>🦕 Your Dino Pals</h2>
    <div class="cp-grid">${cardsHtml}</div>
    <button class="cp-back" id="cp-back-btn">← Back to World</button>
  `

  const panel = mountPanel(html, PANEL_ID)
  document.getElementById('cp-back-btn').addEventListener('click', () => {
    removePanel(PANEL_ID)
    onClose?.()
  })
}

function injectStyles() {
  if (document.getElementById('collection-panel-styles')) return
  const style = document.createElement('style')
  style.id = 'collection-panel-styles'
  style.textContent = styles
  document.head.appendChild(style)
}
