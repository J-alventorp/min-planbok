import { MESSAGES } from '../data/messages';

function pickRandom(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickMessage(situation) {
  const pool = MESSAGES[situation];
  if (!pool || !pool.length) return null;
  return pickRandom(pool);
}

const THRESHOLDS = [
  { value: 50, situation: 'halfway' },
  { value: 80, situation: 'nearLimit' },
  { value: 100, situation: 'hitLimit' },
  { value: 125, situation: 'overBudget' },
  { value: 150, situation: 'overBudget' },
  { value: 200, situation: 'overBudget' },
];

// Fires only when a threshold is newly crossed between two percentages, not
// on every log — returns the highest threshold crossed by this one change.
export function detectCrossedSituation(oldPercent, newPercent) {
  let crossed = null;
  for (const t of THRESHOLDS) {
    if (oldPercent < t.value && newPercent >= t.value) crossed = t.situation;
  }
  return crossed;
}
