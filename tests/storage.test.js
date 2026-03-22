// tests/storage.test.js
import { describe, it, expect, beforeEach } from 'vitest'

// Minimal localStorage mock for Node environment
const store = {}
global.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = v },
  removeItem: (k) => { delete store[k] },
}

import { getStage, setStage, getExchanges, addExchange, getBefriended, addBefriended, resetAll } from '../src/systems/storage.js'

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k])
  resetAll()
})

describe('getStage / setStage', () => {
  it('returns 1 by default', () => {
    expect(getStage()).toBe(1)
  })
  it('persists stage', () => {
    setStage(3)
    expect(getStage()).toBe(3)
  })
})

describe('addExchange / getExchanges', () => {
  it('returns empty array by default', () => {
    expect(getExchanges()).toEqual([])
  })
  it('adds an exchange', () => {
    addExchange({ word: 'hop', correct: true, timeMs: 1200 })
    expect(getExchanges()).toHaveLength(1)
    expect(getExchanges()[0].word).toBe('hop')
  })
  it('keeps only the last 20 exchanges', () => {
    for (let i = 0; i < 25; i++) addExchange({ word: 'x', correct: true, timeMs: 100 })
    expect(getExchanges().length).toBeLessThanOrEqual(20)
  })
})

describe('befriended dinos', () => {
  it('returns empty set by default', () => {
    expect(getBefriended()).toEqual([])
  })
  it('adds a dino id', () => {
    addBefriended('trex')
    expect(getBefriended()).toContain('trex')
  })
  it('does not duplicate ids', () => {
    addBefriended('trex')
    addBefriended('trex')
    expect(getBefriended().filter(id => id === 'trex')).toHaveLength(1)
  })
})

describe('resetAll', () => {
  it('resets stage to 1 and clears exchanges and befriended', () => {
    setStage(4)
    addExchange({ word: 'hop', correct: true, timeMs: 500 })
    addBefriended('trex')
    resetAll()
    expect(getStage()).toBe(1)
    expect(getExchanges()).toEqual([])
    expect(getBefriended()).toEqual([])
  })
})
