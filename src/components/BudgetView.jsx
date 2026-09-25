import { useActiveBudget } from '../hooks/useActiveBudget';
import PeriodHeader from './PeriodHeader';
import IncomeCard from './IncomeCard';
import FixedExpensesList from './FixedExpensesList';
import CategoryBudgetGrid from './CategoryBudgetGrid';
import AddExpenseForm from './AddExpenseForm';
import CategoryManager from './CategoryManager';
import SuggestionBanner from './SuggestionBanner';
import MotivationalMessage from './MotivationalMessage';
import { totalFixedExpenses, freeToAllocate } from '../utils/calc';

export default function BudgetView({ state, setState, budgetId }) {
  const {
    budget, period, viewKey, todayKey, motivation, clearMotivation, actions,
  } = useActiveBudget(state, setState, budgetId);

  if (!budget || !period) return null;

  const fixedTotal = totalFixedExpenses(period);
  const free = freeToAllocate(period);
  const showSuggestions = period.suggestions
    && !period.suggestionsApplied
    && Object.values(period.suggestions).some((s) => s && s.amount > 0);

  return (
    <div className="mp-budget-view">
      <PeriodHeader
        periodType={budget.periodType}
        periodKey={viewKey}
        isCurrent={viewKey === todayKey}
        onPrev={actions.goPrev}
        onNext={actions.goNext}
        onToday={actions.goToday}
      />

      {showSuggestions && (
        <SuggestionBanner
          suggestions={period.suggestions}
          categories={budget.categories}
          currency={budget.currency}
          onApplyAll={() => actions.applySuggestions()}
          onApplyOne={(id) => actions.applySuggestions([id])}
          onDismiss={actions.dismissSuggestions}
        />
      )}

      <IncomeCard
        income={period.income}
        currency={budget.currency}
        fixedTotal={fixedTotal}
        freeToAllocate={free}
        onChange={actions.setIncome}
      />

      <FixedExpensesList
        expenses={budget.fixedExpenses}
        currency={budget.currency}
        onAdd={actions.addFixedExpense}
        onUpdate={actions.updateFixedExpense}
        onRemove={actions.removeFixedExpense}
      />

      <CategoryBudgetGrid
        categories={budget.categories}
        period={period}
        currency={budget.currency}
        onChangeBudget={actions.setCategoryBudget}
      />

      <AddExpenseForm categories={budget.categories} onLog={actions.logExpense} />

      <CategoryManager
        categories={budget.categories}
        onAdd={actions.addCategory}
        onRemove={actions.removeCategory}
      />

      <MotivationalMessage event={motivation} onDone={clearMotivation} />
    </div>
  );
}
