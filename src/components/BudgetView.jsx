import { useEffect, useState } from 'react';
import { useActiveBudget } from '../hooks/useActiveBudget';
import { getContrastInk } from '../utils/color';
import PeriodHeader from './PeriodHeader';
import IncomeCard from './IncomeCard';
import RecurringItemsList from './RecurringItemsList';
import SectionTabs from './SectionTabs';
import CategoryBudgetGrid from './CategoryBudgetGrid';
import AddExpenseForm from './AddExpenseForm';
import CategoryManager from './CategoryManager';
import CategoryDetailModal from './CategoryDetailModal';
import PeriodSummary from './PeriodSummary';
import SuggestionBanner from './SuggestionBanner';
import MotivationalMessage from './MotivationalMessage';
import GoalsList from './GoalsList';
import RecurringTransactionManager from './RecurringTransactionManager';
import TrendChart from './TrendChart';
import {
  totalFixedExpenses, totalLoans, totalSavings, freeToAllocate, categoryTransactions,
} from '../utils/calc';

export default function BudgetView({ state, setState, budgetId }) {
  const {
    budget, period, viewKey, todayKey, motivation, clearMotivation, actions,
  } = useActiveBudget(state, setState, budgetId);
  const [detailCategoryId, setDetailCategoryId] = useState(null);
  const [section, setSection] = useState('fixed');

  useEffect(() => {
    if (!budget?.color) return;
    document.documentElement.style.setProperty('--accent', budget.color);
    document.documentElement.style.setProperty('--accent-ink', getContrastInk(budget.color));
  }, [budget?.color]);

  if (!budget || !period) return null;

  const fixedTotal = totalFixedExpenses(period);
  const loansTotal = totalLoans(period);
  const savingsTotal = totalSavings(period);
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

      <IncomeCard
        income={period.income}
        currency={budget.currency}
        fixedTotal={fixedTotal}
        loansTotal={loansTotal}
        savingsTotal={savingsTotal}
        freeToAllocate={free}
        onChange={actions.setIncome}
      />

      <SectionTabs active={section} onChange={setSection} />

      {section === 'fixed' && (
        <RecurringItemsList
          title="Fasta utgifter"
          items={budget.fixedExpenses}
          currency={budget.currency}
          onAdd={actions.addFixedExpense}
          onUpdate={actions.updateFixedExpense}
          onRemove={actions.removeFixedExpense}
          emptyHint="Inga fasta utgifter ännu, t.ex. hyra eller el."
          namePlaceholder="Namn, t.ex. Hyra"
          totalLabel="Totalt fasta utgifter"
        />
      )}

      {section === 'loans' && (
        <RecurringItemsList
          title="Lån och avbetalningar"
          items={budget.loans || []}
          currency={budget.currency}
          onAdd={actions.addLoan}
          onUpdate={actions.updateLoan}
          onRemove={actions.removeLoan}
          emptyHint="Inga lån eller avbetalningar ännu."
          namePlaceholder="Namn, t.ex. Billån"
          totalLabel="Totalt lån och avbetalningar"
        />
      )}

      {section === 'savings' && (
        <RecurringItemsList
          title="Spar och investeringar"
          items={budget.savings || []}
          currency={budget.currency}
          onAdd={actions.addSavings}
          onUpdate={actions.updateSavings}
          onRemove={actions.removeSavings}
          emptyHint="Inget sparande eller investeringar ännu."
          namePlaceholder="Namn, t.ex. Fondsparande"
          totalLabel="Totalt spar och investeringar"
        />
      )}

      {section === 'savings' && (
        <GoalsList
          goals={budget.goals || []}
          currency={budget.currency}
          period={period}
          onAdd={actions.addGoal}
          onContribute={actions.contributeToGoal}
          onRemove={actions.removeGoal}
        />
      )}

      {section === 'categories' && (
        <>
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

          <RecurringTransactionManager
            items={budget.recurringTransactions || []}
            categories={budget.categories}
            currency={budget.currency}
            onAdd={actions.addRecurringTransaction}
            onUpdate={actions.updateRecurringTransaction}
            onRemove={actions.removeRecurringTransaction}
          />
        </>
      )}

      {section === 'trends' && (
        <TrendChart budget={budget} periodKey={viewKey} currency={budget.currency} />
      )}

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
