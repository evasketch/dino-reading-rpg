// tests/phonemeRenderer.test.js
import { describe, it, expect } from 'vitest'
import { renderWord } from '../src/utils/phonemeRenderer.js'

const COLORS = ['#fde68a', '#bfdbfe', '#ddd6fe']

describe('renderWord', () => {
  it('wraps each phoneme in a span with background color', () => {
    const result = renderWord(['ch', 'o', 'mp'])
    expect(result).toContain('<span')
    expect(result).toContain('ch')
    expect(result).toContain('o')
    expect(result).toContain('mp')
    expect(result).toContain(COLORS[0])
    expect(result).toContain(COLORS[1])
    expect(result).toContain(COLORS[2])
  })

  it('cycles colors for words with more than 3 phonemes', () => {
    const result = renderWord(['a', 'b', 'c', 'd'])
    expect(result).toContain(COLORS[0]) // 4th phoneme wraps back to color 0
  })

  it('handles single-phoneme words', () => {
    const result = renderWord(['a'])
    expect(result).toContain('a')
    expect(result).toContain(COLORS[0])
  })

  it('returns an HTML string', () => {
    const result = renderWord(['b', 'i', 't'])
    expect(typeof result).toBe('string')
    expect(result).toMatch(/<span/)
  })
})
