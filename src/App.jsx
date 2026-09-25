import { useState } from 'react';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import BudgetTabs from './components/BudgetTabs';
import NewBudgetModal from './components/NewBudgetModal';
import BudgetView from './components/BudgetView';
import { makeId } from './utils/id';
import { defaultCategories } from './data/defaultCategories';

function defaultState() {
  return { budgets: [], activeBudgetId: null };
}

export default function App() {
  const [state, setState] = useLocalStorageState('mp_state', defaultState);
  const [showNewBudget, setShowNewBudget] = useState(false);

  const createBudget = ({ name, currency, periodType, color }) => {
    const budget = {
      id: makeId('budget'),
      name,
      color,
      currency,
      periodType,
      categories: defaultCategories(),
      fixedExpenses: [],
      periods: {},
    };
    setState((prev) => ({
      ...prev,
      budgets: [...prev.budgets, budget],
      activeBudgetId: budget.id,
    }));
    setShowNewBudget(false);
  };

  const needsOnboarding = state.budgets.length === 0;
  const activeId = state.activeBudgetId && state.budgets.some((b) => b.id === state.activeBudgetId)
    ? state.activeBudgetId
    : state.budgets[0]?.id;

  return (
    <div className="mp-app">
      <header className="mp-header">
        <h1 className="mp-brand">Min <span>Plånbok</span></h1>
        <p className="mp-tagline">Koll på pengarna, utan tråkigheten</p>
      </header>

      {!needsOnboarding && (
        <BudgetTabs
          budgets={state.budgets}
          activeId={activeId}
          onSelect={(id) => setState((prev) => ({ ...prev, activeBudgetId: id }))}
          onNew={() => setShowNewBudget(true)}
        />
      )}

      {!needsOnboarding && activeId && (
        <BudgetView state={state} setState={setState} budgetId={activeId} />
      )}

      {(needsOnboarding || showNewBudget) && (
        <NewBudgetModal
          canClose={!needsOnboarding}
          onClose={() => setShowNewBudget(false)}
          onCreate={createBudget}
        />
      )}

      <footer className="mp-footer">Min Plånbok · sparas lokalt i din webbläsare</footer>
    </div>
  );
}
