import { useState } from 'react';
import { useActiveBudget } from '../hooks/useActiveBudget';
import PeriodHeader from './PeriodHeader';
import IncomeCard from './IncomeCard';
import FixedExpensesList from './FixedExpensesList';
import CategoryBudgetGrid from './CategoryBudgetGrid';
import AddExpenseForm from './AddExpenseForm';
import CategoryManager from './CategoryManager';
import CategoryDetailModal from './CategoryDetailModal';
import PeriodSummary from './PeriodSummary';
import SuggestionBanner from './SuggestionBanner';
import MotivationalMessage from './MotivationalMessage';
import { totalFixedExpenses, freeToAllocate, categoryTransactions } from '../utils/calc';

export default function BudgetView({ state, setState, budgetId }) {
  const {
    budget, period, viewKey, todayKey, motivation, clearMotivation, actions,
  } = useActiveBudget(state, setState, budgetId);
  const [detailCategoryId, setDetailCategoryId] = useState(null);

  if (!budget || !period) return null;

  const fixedTotal = totalFixedExpenses(period);
  const free = freeToAllocate(period);
  const showSuggestions = period.suggestions
    && !period.suggestionsApplied
    && Object.values(period.suggestions).some((s) => s && s.amount > 0);
  const detailCategory = budget.categories.find((c) => c.id === detailCategoryId) || null;

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
        freeToAllocate={free}
        onChangeBudget={actions.setCategoryBudget}
        onOpenDetail={setDetailCategoryId}
      />

      <AddExpenseForm categories={budget.categories} onLog={actions.logExpense} />

      <CategoryManager
        categories={budget.categories}
        onAdd={actions.addCategory}
        onRemove={actions.removeCategory}
      />

      <PeriodSummary budget={budget} period={period} periodKey={viewKey} />

      {detailCategory && (
        <CategoryDetailModal
          category={detailCategory}
          transactions={categoryTransactions(period, detailCategory.id)}
          currency={budget.currency}
          onClose={() => setDetailCategoryId(null)}
          onLog={actions.logExpense}
          onUpdate={actions.updateTransaction}
          onRemove={actions.removeTransaction}
        />
      )}

      <MotivationalMessage event={motivation} onDone={clearMotivation} />
    </div>
  );
}
