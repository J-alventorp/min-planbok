import { previousPeriodKeys } from './period';
import { roundFriendly } from './money';

function median(nums) {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Rule-based, local, no network: median of up to the last 6 periods that have
// data, nudged for a consistent over/under trend, then scaled down if the
// total would outgrow income together with the fixed expenses.
export function computeSuggestions(budget, periodKey, { income = 0, fixedTotal = 0 } = {}) {
  const keys = previousPeriodKeys(budget.periodType, periodKey, 6).filter((k) => budget.periods[k]);
  const suggestions = {};

  for (const cat of budget.categories) {
    const spends = [];
    const allocs = [];
    for (const k of keys) {
      const p = budget.periods[k];
      const spent = (p.transactions || [])
        .filter((t) => t.categoryId === cat.id)
        .reduce((s, t) => s + t.amount, 0);
      spends.push(spent);
      allocs.push(p.categoryBudgets?.[cat.id] ?? null);
    }
    if (!spends.length) continue;

    let base = median(spends);
    if (base <= 0) continue;

    const recentSpends = spends.slice(0, 3);
    const recentAllocs = allocs.slice(0, 3);
    const overCount = recentSpends.filter((s, i) => recentAllocs[i] && s > recentAllocs[i]).length;
    const underCount = recentSpends.filter((s, i) => recentAllocs[i] && s < recentAllocs[i] * 0.7).length;

    let note = 'Baserat på historik';
    if (overCount >= 2) {
      base *= 1.1;
      note = 'Höjt lite – du brukar gå över här';
    } else if (underCount >= 2) {
      base *= 0.95;
      note = 'Sänkt lite – du brukar spendera mindre';
    }
    suggestions[cat.id] = { amount: roundFriendly(base), note };
  }

  // No spend history at all: carry forward the most recent non-zero allocation.
  for (const cat of budget.categories) {
    if (suggestions[cat.id]) continue;
    for (const k of keys) {
      const alloc = budget.periods[k]?.categoryBudgets?.[cat.id];
      if (alloc) {
        suggestions[cat.id] = { amount: alloc, note: 'Samma som senast' };
        break;
      }
    }
  }

  const suggestedTotal = Object.values(suggestions).reduce((s, v) => s + v.amount, 0);
  if (income > 0 && fixedTotal + suggestedTotal > income) {
    const available = Math.max(income - fixedTotal, 0);
    const scale = suggestedTotal > 0 ? available / suggestedTotal : 0;
    for (const id in suggestions) {
      suggestions[id] = {
        amount: roundFriendly(suggestions[id].amount * scale),
        note: `${suggestions[id].note} (justerat efter inkomst)`,
      };
    }
  }

  return suggestions;
}
