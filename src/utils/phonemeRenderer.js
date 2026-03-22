// src/utils/phonemeRenderer.js
const COLORS = ['#fde68a', '#bfdbfe', '#ddd6fe']

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Given an array of phoneme strings, returns an HTML string
 * where each phoneme is wrapped in a highlighted <span>.
 * Colors cycle through the COLORS array.
 * Phoneme values are HTML-escaped before interpolation.
 *
 * @param {string[]} phonemes - e.g. ['ch', 'o', 'mp']
 * @returns {string} HTML string
 */
export function renderWord(phonemes) {
  return phonemes.map((ph, i) => {
    const bg = COLORS[i % COLORS.length]
    return `<span style="background:${bg};color:#1a1a1a;padding:2px 5px;border-radius:4px;font-family:inherit;font-size:inherit;">${escapeHtml(ph)}</span>`
  }).join('')
}
