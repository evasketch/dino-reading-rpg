// src/ui/overlay.js

const overlayEl = document.getElementById('ui-overlay')

/**
 * Mount an HTML panel into the overlay.
 * Returns the mounted element.
 * @param {string} html
 * @param {string} id - unique id for this panel
 */
export function mountPanel(html, id) {
  removePanel(id)
  const div = document.createElement('div')
  div.className = 'panel'
  div.id = id
  div.innerHTML = html
  overlayEl.appendChild(div)
  return div
}

export function removePanel(id) {
  const existing = document.getElementById(id)
  if (existing) existing.remove()
}

export function removeAllPanels() {
  overlayEl.innerHTML = ''
}
