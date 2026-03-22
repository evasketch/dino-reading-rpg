// src/systems/progression.js
const MIN_STAGE = 1
const MAX_STAGE = 8
const WINDOW_SIZE = 10
const ADVANCE_THRESHOLD = 0.8
const DROP_THRESHOLD = 0.5

/**
 * Given the current stage and full exchange history,
 * return the new stage using a rolling 10-exchange window.
 * Returns the same stage if fewer than 10 exchanges exist.
 */
export function evaluateStage(currentStage, exchanges) {
  if (exchanges.length < WINDOW_SIZE) return currentStage

  const window = exchanges.slice(-WINDOW_SIZE)
  const correct = window.filter(e => e.correct).length
  const accuracy = correct / WINDOW_SIZE

  if (accuracy >= ADVANCE_THRESHOLD) {
    return Math.min(currentStage + 1, MAX_STAGE)
  }
  if (accuracy < DROP_THRESHOLD) {
    return Math.max(currentStage - 1, MIN_STAGE)
  }
  return currentStage
}
