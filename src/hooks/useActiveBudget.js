import { useEffect, useMemo, useState } from 'react';
import { currentPeriodKey, shiftPeriodKey } from '../utils/period';
import { createPeriod, categoryPercent, previousPeriodEndSituation } from '../utils/calc';
import { detectCrossedSituation } from '../utils/motivational';
import { fireThresholdNotification } from '../utils/notify';
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
    const recurringTxs = (budget.recurringTransactions || [])
      .filter((rt) => rt.active)
      .map((rt) => ({
        id: `rtx_${rt.id}_${todayKey}`,
        categoryId: rt.categoryId,
        title: rt.title,
        amount: rt.amount,
        note: '',
        date: new Date().toISOString(),
      }));
    newPeriod.transactions = [...newPeriod.transactions, ...recurringTxs];
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

  // Keep the live (today) period's fixed-expense/loan/savings snapshots
  // synced to their templates while it's still in progress — past periods
  // stay frozen.
  useEffect(() => {
    if (!budget || viewKey !== todayKey) return;
    const period = budget.periods[todayKey];
    if (!period) return;

    const buildSnap = (list) => (list || [])
      .filter((x) => x.active)
      .map((x) => ({ id: x.id, name: x.name, amount: x.amount }));
    const activeFixed = buildSnap(budget.fixedExpenses);
    const activeLoans = buildSnap(budget.loans);
    const activeSavings = buildSnap(budget.savings);

    const snapChanged = (snap, active) => active.length !== (snap || []).length
      || active.some((x) => {
        const s = (snap || []).find((s) => s.id === x.id);
        return !s || s.amount !== x.amount || s.name !== x.name;
      });

    const changed = snapChanged(period.fixedExpenseSnapshot, activeFixed)
      || snapChanged(period.loanSnapshot, activeLoans)
      || snapChanged(period.savingsSnapshot, activeSavings);
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
              fixedExpenseSnapshot: activeFixed,
              loanSnapshot: activeLoans,
              savingsSnapshot: activeSavings,
            },
          },
        }
        : b)),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget?.fixedExpenses, budget?.loans, budget?.savings, viewKey, todayKey, budgetId]);

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

    addLoan: (name, amount) => {
      const l = { id: makeId('loan'), name, amount, active: true };
      writeBudget({ ...budget, loans: [...(budget.loans || []), l] });
    },
    updateLoan: (id, patch) => {
      writeBudget({ ...budget, loans: (budget.loans || []).map((l) => (l.id === id ? { ...l, ...patch } : l)) });
    },
    removeLoan: (id) => {
      writeBudget({ ...budget, loans: (budget.loans || []).filter((l) => l.id !== id) });
    },

    addSavings: (name, amount) => {
      const v = { id: makeId('sav'), name, amount, active: true };
      writeBudget({ ...budget, savings: [...(budget.savings || []), v] });
    },
    updateSavings: (id, patch) => {
      writeBudget({ ...budget, savings: (budget.savings || []).map((v) => (v.id === id ? { ...v, ...patch } : v)) });
    },
    removeSavings: (id) => {
      writeBudget({ ...budget, savings: (budget.savings || []).filter((v) => v.id !== id) });
    },

    addRecurringTransaction: (categoryId, title, amount) => {
      const rt = {
        id: makeId('rt'), categoryId, title: title.trim(), amount, active: true,
      };
      writeBudget({ ...budget, recurringTransactions: [...(budget.recurringTransactions || []), rt] });
    },
    updateRecurringTransaction: (id, patch) => {
      writeBudget({
        ...budget,
        recurringTransactions: (budget.recurringTransactions || []).map((rt) => (rt.id === id ? { ...rt, ...patch } : rt)),
      });
    },
    removeRecurringTransaction: (id) => {
      writeBudget({
        ...budget,
        recurringTransactions: (budget.recurringTransactions || []).filter((rt) => rt.id !== id),
      });
    },

    addGoal: (name, icon, targetAmount) => {
      const g = {
        id: makeId('goal'), name: name.trim(), icon, targetAmount, savedAmount: 0, active: true,
      };
      writeBudget({ ...budget, goals: [...(budget.goals || []), g] });
    },
    updateGoal: (id, patch) => {
      writeBudget({ ...budget, goals: (budget.goals || []).map((g) => (g.id === id ? { ...g, ...patch } : g)) });
    },
    removeGoal: (id) => {
      writeBudget({ ...budget, goals: (budget.goals || []).filter((g) => g.id !== id) });
    },
    contributeToGoal: (id, amount) => {
      writeBudget({
        ...budget,
        goals: (budget.goals || []).map((g) => (g.id === id ? { ...g, savedAmount: Math.max(0, (g.savedAmount || 0) + amount) } : g)),
      });
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

    logExpense: (categoryId, title, amount, note) => {
      const oldPercent = categoryPercent(period, categoryId);
      const tx = {
        id: makeId('tx'), categoryId, title: (title || '').trim(), amount, note: note || '', date: new Date().toISOString(),
      };
      const nextPeriod = { ...period, transactions: [...(period.transactions || []), tx] };
      const newPercent = categoryPercent(nextPeriod, categoryId);
      const situation = detectCrossedSituation(oldPercent, newPercent);
      writePeriod(nextPeriod);
      setMotivation({ situation: situation || 'logged', nonce: Date.now(), subtle: !situation });
      if (situation === 'nearLimit' || situation === 'hitLimit' || situation === 'overBudget') {
        const category = budget.categories.find((c) => c.id === categoryId);
        fireThresholdNotification(situation, category?.name);
      }
      return situation;
    },
    updateTransaction: (txId, patch) => {
      writePeriod({ ...period, transactions: period.transactions.map((t) => (t.id === txId ? { ...t, ...patch } : t)) });
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
