// src/systems/storage.js
const KEYS = {
  STAGE: 'dino_stage',
  EXCHANGES: 'dino_exchanges',
  BEFRIENDED: 'dino_befriended',
}

export function getStage() {
  return parseInt(localStorage.getItem(KEYS.STAGE) ?? '1', 10)
}

export function setStage(n) {
  localStorage.setItem(KEYS.STAGE, String(n))
}

export function getExchanges() {
  return JSON.parse(localStorage.getItem(KEYS.EXCHANGES) ?? '[]')
}

/**
 * Exchange object shape: { word: string, correct: boolean, timeMs: number }
 * The `correct` boolean is required — progression.js depends on it.
 */
export function addExchange(exchange) {
  if (typeof exchange.correct !== 'boolean') {
    throw new Error('addExchange: exchange.correct must be a boolean')
  }
  const exchanges = getExchanges()
  exchanges.push(exchange)
  // Keep only last 20 to cap storage use
  const trimmed = exchanges.slice(-20)
  localStorage.setItem(KEYS.EXCHANGES, JSON.stringify(trimmed))
}

export function getBefriended() {
  return JSON.parse(localStorage.getItem(KEYS.BEFRIENDED) ?? '[]')
}

export function addBefriended(dinoId) {
  const current = getBefriended()
  if (!current.includes(dinoId)) {
    current.push(dinoId)
    localStorage.setItem(KEYS.BEFRIENDED, JSON.stringify(current))
  }
}

export function resetAll() {
  localStorage.removeItem(KEYS.STAGE)
  localStorage.removeItem(KEYS.EXCHANGES)
  localStorage.removeItem(KEYS.BEFRIENDED)
}
