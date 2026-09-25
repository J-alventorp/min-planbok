import { computeSuggestions } from './suggestions';
import { previousPeriodKeys } from './period';

export function categoryTransactions(period, categoryId) {
  return (period?.transactions || []).filter((t) => t.categoryId === categoryId);
}

export function categorySpent(period, categoryId) {
  return categoryTransactions(period, categoryId).reduce((s, t) => s + t.amount, 0);
}

export function categoryBudgetAmount(period, categoryId) {
  return period?.categoryBudgets?.[categoryId] || 0;
}

export function categoryRemaining(period, categoryId) {
  return categoryBudgetAmount(period, categoryId) - categorySpent(period, categoryId);
}

export function categoryPercent(period, categoryId) {
  const allocated = categoryBudgetAmount(period, categoryId);
  const spent = categorySpent(period, categoryId);
  if (allocated <= 0) return spent > 0 ? 100 : 0;
  return (spent / allocated) * 100;
}

export function totalFixedExpenses(period) {
  return (period?.fixedExpenseSnapshot || []).reduce((s, f) => s + f.amount, 0);
}

export function totalLoans(period) {
  return (period?.loanSnapshot || []).reduce((s, l) => s + l.amount, 0);
}

export function totalSavings(period) {
  return (period?.savingsSnapshot || []).reduce((s, v) => s + v.amount, 0);
}

export function totalCategoryBudgets(period) {
  return Object.values(period?.categoryBudgets || {}).reduce((s, v) => s + v, 0);
}

export function totalSpent(period) {
  return (period?.transactions || []).reduce((s, t) => s + t.amount, 0);
}

export function freeToAllocate(period) {
  return (period?.income || 0) - totalFixedExpenses(period) - totalLoans(period)
    - totalSavings(period) - totalCategoryBudgets(period);
}

export function totalRemaining(period) {
  return totalCategoryBudgets(period) - totalSpent(period);
}

// Builds a period that hasn't been persisted yet: snapshots active fixed
// expenses (so later template edits never rewrite history), carries the
// previous period's income forward as a starting default, and computes
// suggested category budgets from history.
export function createPeriod(budget, periodKey) {
  const existingKeys = Object.keys(budget.periods).sort();
  const lastKey = existingKeys.filter((k) => k < periodKey).pop();
  const lastPeriod = lastKey ? budget.periods[lastKey] : null;
  const income = lastPeriod ? lastPeriod.income : 0;
  const fixedExpenseSnapshot = budget.fixedExpenses
    .filter((f) => f.active)
    .map((f) => ({ id: f.id, name: f.name, amount: f.amount }));
  const loanSnapshot = (budget.loans || [])
    .filter((l) => l.active)
    .map((l) => ({ id: l.id, name: l.name, amount: l.amount }));
  const savingsSnapshot = (budget.savings || [])
    .filter((v) => v.active)
    .map((v) => ({ id: v.id, name: v.name, amount: v.amount }));
  const fixedTotal = fixedExpenseSnapshot.reduce((s, f) => s + f.amount, 0);
  const suggestions = computeSuggestions(budget, periodKey, { income, fixedTotal });
  const categoryIds = new Set(budget.categories.map((c) => c.id));
  const categoryBudgets = lastPeriod
    ? Object.fromEntries(
      Object.entries(lastPeriod.categoryBudgets || {}).filter(([id]) => categoryIds.has(id)),
    )
    : {};
  return {
    income,
    categoryBudgets,
    fixedExpenseSnapshot,
    loanSnapshot,
    savingsSnapshot,
    transactions: [],
    suggestions,
    suggestionsApplied: false,
  };
}

// Spend per period across the last `count` periods (oldest first) plus the
// current one, for the trend chart. categoryId is optional — omit it for
// total spend across all categories.
export function spendHistory(budget, periodKey, count, categoryId) {
  const keys = [...previousPeriodKeys(budget.periodType, periodKey, count).reverse(), periodKey];
  return keys.map((key) => {
    const period = budget.periods[key];
    const spent = categoryId
      ? categorySpent(period, categoryId)
      : totalSpent(period);
    return { key, spent };
  });
}

export function totalGoalsSaved(budget) {
  return (budget?.goals || []).reduce((s, g) => s + (g.savedAmount || 0), 0);
}

export function totalGoalsTarget(budget) {
  return (budget?.goals || []).reduce((s, g) => s + (g.targetAmount || 0), 0);
}

export function previousPeriodEndSituation(budget, periodKey) {
  const existingKeys = Object.keys(budget.periods).sort();
  const lastKey = existingKeys.filter((k) => k < periodKey).pop();
  if (!lastKey) return null;
  const lastPeriod = budget.periods[lastKey];
  const spent = totalSpent(lastPeriod);
  const allocated = totalCategoryBudgets(lastPeriod);
  if (allocated <= 0) return null;
  return spent > allocated ? 'periodEndedOver' : 'periodEndedUnder';
}
