// tests/progression.test.js
import { describe, it, expect } from 'vitest'
import { evaluateStage } from '../src/systems/progression.js'

describe('evaluateStage', () => {
  it('returns same stage when fewer than 10 exchanges', () => {
    const exchanges = Array(9).fill({ correct: true })
    expect(evaluateStage(2, exchanges)).toBe(2)
  })

  it('advances stage when accuracy >= 80% over last 10', () => {
    const exchanges = [
      ...Array(8).fill({ correct: true }),
      ...Array(2).fill({ correct: false }),
    ]
    expect(evaluateStage(2, exchanges)).toBe(3)
  })

  it('drops stage when accuracy < 50% over last 10', () => {
    const exchanges = [
      ...Array(4).fill({ correct: true }),
      ...Array(6).fill({ correct: false }),
    ]
    expect(evaluateStage(2, exchanges)).toBe(1)
  })

  it('keeps stage when accuracy is 50-79%', () => {
    const exchanges = [
      ...Array(6).fill({ correct: true }),
      ...Array(4).fill({ correct: false }),
    ]
    expect(evaluateStage(2, exchanges)).toBe(2)
  })

  it('does not advance past stage 8', () => {
    const exchanges = Array(10).fill({ correct: true })
    expect(evaluateStage(8, exchanges)).toBe(8)
  })

  it('does not drop below stage 1', () => {
    const exchanges = Array(10).fill({ correct: false })
    expect(evaluateStage(1, exchanges)).toBe(1)
  })

  it('uses only the last 10 exchanges (rolling window)', () => {
    // First 5 wrong, last 10 all correct — should advance
    const exchanges = [
      ...Array(5).fill({ correct: false }),
      ...Array(10).fill({ correct: true }),
    ]
    expect(evaluateStage(2, exchanges)).toBe(3)
  })
})
