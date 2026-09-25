import { computeSuggestions } from './suggestions';

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

export function totalCategoryBudgets(period) {
  return Object.values(period?.categoryBudgets || {}).reduce((s, v) => s + v, 0);
}

export function totalSpent(period) {
  return (period?.transactions || []).reduce((s, t) => s + t.amount, 0);
}

export function freeToAllocate(period) {
  return (period?.income || 0) - totalFixedExpenses(period) - totalCategoryBudgets(period);
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
  const fixedTotal = fixedExpenseSnapshot.reduce((s, f) => s + f.amount, 0);
  const suggestions = computeSuggestions(budget, periodKey, { income, fixedTotal });
  return {
    income,
    categoryBudgets: {},
    fixedExpenseSnapshot,
    transactions: [],
    suggestions,
    suggestionsApplied: false,
  };
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
