import { useEffect, useMemo, useState } from 'react';
import { currentPeriodKey, shiftPeriodKey } from '../utils/period';
import { createPeriod, categoryPercent, previousPeriodEndSituation } from '../utils/calc';
import { detectCrossedSituation } from '../utils/motivational';
import { makeId } from '../utils/id';

export function useActiveBudget(state, setState, budgetId) {
  const budget = state.budgets.find((b) => b.id === budgetId);
  const todayKey = budget ? currentPeriodKey(budget.periodType) : null;
  const [viewKey, setViewKey] = useState(todayKey);
  const [motivation, setMotivation] = useState(null);

  useEffect(() => {
    setViewKey(todayKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetId]);

  const periodKeysSignature = budget ? Object.keys(budget.periods).sort().join(',') : '';

  // Lazily create "today"'s period the first time it's needed, snapshotting
  // fixed expenses and firing a one-time period-end / new-budget message.
  useEffect(() => {
    if (!budget || !todayKey) return;
    if (budget.periods[todayKey]) return;
    const endSituation = previousPeriodEndSituation(budget, todayKey);
    const isFirstPeriod = Object.keys(budget.periods).length === 0;
    const newPeriod = createPeriod(budget, todayKey);
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) => (b.id === budgetId && !b.periods[todayKey]
        ? { ...b, periods: { ...b.periods, [todayKey]: newPeriod } }
        : b)),
    }));
    if (endSituation) setMotivation({ situation: endSituation, nonce: Date.now() });
    else if (isFirstPeriod) setMotivation({ situation: 'newBudget', nonce: Date.now() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetId, todayKey, periodKeysSignature]);

  // Keep the live (today) period's fixed-expense snapshot synced to the
  // template while it's still in progress — past periods stay frozen.
  useEffect(() => {
    if (!budget || viewKey !== todayKey) return;
    const period = budget.periods[todayKey];
    if (!period) return;
    const active = budget.fixedExpenses.filter((f) => f.active);
    const changed = active.length !== period.fixedExpenseSnapshot.length
      || active.some((f) => {
        const snap = period.fixedExpenseSnapshot.find((s) => s.id === f.id);
        return !snap || snap.amount !== f.amount || snap.name !== f.name;
      });
    if (!changed) return;
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) => (b.id === budgetId
        ? {
          ...b,
          periods: {
            ...b.periods,
            [todayKey]: {
              ...b.periods[todayKey],
              fixedExpenseSnapshot: active.map((f) => ({ id: f.id, name: f.name, amount: f.amount })),
            },
          },
        }
        : b)),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget?.fixedExpenses, viewKey, todayKey, budgetId]);

  // Falls back to a virtual (unsaved) period for display when navigating to
  // a period that hasn't been written yet — first mutation persists it.
  const period = budget ? (budget.periods[viewKey] || createPeriod(budget, viewKey)) : null;

  function writeBudget(nextBudget) {
    setState((prev) => ({ ...prev, budgets: prev.budgets.map((b) => (b.id === budgetId ? nextBudget : b)) }));
  }

  function writePeriod(nextPeriod) {
    if (!budget) return;
    writeBudget({ ...budget, periods: { ...budget.periods, [viewKey]: nextPeriod } });
  }

  const actions = useMemo(() => ({
    setIncome: (amount) => writePeriod({ ...period, income: amount }),

    addFixedExpense: (name, amount) => {
      const fe = { id: makeId('fe'), name, amount, active: true };
      writeBudget({ ...budget, fixedExpenses: [...budget.fixedExpenses, fe] });
    },
    updateFixedExpense: (id, patch) => {
      writeBudget({ ...budget, fixedExpenses: budget.fixedExpenses.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
    },
    removeFixedExpense: (id) => {
      writeBudget({ ...budget, fixedExpenses: budget.fixedExpenses.filter((f) => f.id !== id) });
    },

    addCategory: (name, icon) => {
      writeBudget({ ...budget, categories: [...budget.categories, { id: makeId('cat'), name, icon }] });
    },
    removeCategory: (categoryId) => {
      writeBudget({ ...budget, categories: budget.categories.filter((c) => c.id !== categoryId) });
    },

    setCategoryBudget: (categoryId, amount) => {
      writePeriod({ ...period, categoryBudgets: { ...period.categoryBudgets, [categoryId]: amount } });
    },

    logExpense: (categoryId, amount, note) => {
      const oldPercent = categoryPercent(period, categoryId);
      const tx = { id: makeId('tx'), categoryId, amount, note: note || '', date: new Date().toISOString() };
      const nextPeriod = { ...period, transactions: [...(period.transactions || []), tx] };
      const newPercent = categoryPercent(nextPeriod, categoryId);
      const situation = detectCrossedSituation(oldPercent, newPercent);
      writePeriod(nextPeriod);
      setMotivation({ situation: situation || 'logged', nonce: Date.now(), subtle: !situation });
      return situation;
    },
    removeTransaction: (txId) => {
      writePeriod({ ...period, transactions: period.transactions.filter((t) => t.id !== txId) });
    },

    applySuggestions: (categoryIds) => {
      if (!period.suggestions) return;
      const ids = categoryIds || Object.keys(period.suggestions);
      const nextCategoryBudgets = { ...period.categoryBudgets };
      for (const id of ids) {
        if (period.suggestions[id]) nextCategoryBudgets[id] = period.suggestions[id].amount;
      }
      const allApplied = !categoryIds;
      writePeriod({
        ...period,
        categoryBudgets: nextCategoryBudgets,
        suggestionsApplied: allApplied || period.suggestionsApplied,
      });
    },
    dismissSuggestions: () => writePeriod({ ...period, suggestionsApplied: true }),

    goPrev: () => setViewKey((k) => shiftPeriodKey(budget.periodType, k, -1)),
    goNext: () => setViewKey((k) => {
      const next = shiftPeriodKey(budget.periodType, k, 1);
      return next > todayKey ? k : next;
    }),
    goToday: () => setViewKey(todayKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [budget, viewKey, period, todayKey]);

  return {
    budget,
    period,
    viewKey,
    todayKey,
    motivation,
    clearMotivation: () => setMotivation(null),
    actions,
  };
}
