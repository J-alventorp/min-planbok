import { useEffect, useState } from 'react';
import { useActiveBudget } from '../hooks/useActiveBudget';
import { getContrastInk } from '../utils/color';
import PeriodHeader from './PeriodHeader';
import BudgetPeriodModal from './BudgetPeriodModal';
import IncomeCard from './IncomeCard';
import RecurringItemsList from './RecurringItemsList';
import SectionAccordionItem from './SectionAccordionItem';
import CategoryBudgetGrid from './CategoryBudgetGrid';
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
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const toggleSection = (id) => setSection((cur) => (cur === id ? null : id));

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
        periodStartDay={budget.periodStartDay}
        isCurrent={viewKey === todayKey}
        onPrev={actions.goPrev}
        onNext={actions.goNext}
        onToday={actions.goToday}
        onEditPeriod={() => setShowPeriodModal(true)}
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

      <div className="mp-accordion">
        <SectionAccordionItem id="fixed" label="Fasta utgifter" active={section} onToggle={toggleSection}>
          <RecurringItemsList
            title="Fasta utgifter"
            items={budget.fixedExpenses}
            currency={budget.currency}
            onAdd={actions.addFixedExpense}
            onUpdate={actions.updateFixedExpense}
            onRemove={actions.removeFixedExpense}
            emptyHint="Inga fasta utgifter ännu, t.ex. hyra eller el. Bra koll här ger dig full koll på resten av budgeten!"
            namePlaceholder="Namn, t.ex. Hyra"
            totalLabel="Totalt fasta utgifter"
            showInterval
          />
        </SectionAccordionItem>

        <SectionAccordionItem id="loans" label="Lån & Avbetalningar" active={section} onToggle={toggleSection}>
          <RecurringItemsList
            title="Lån och avbetalningar"
            items={budget.loans || []}
            currency={budget.currency}
            onAdd={actions.addLoan}
            onUpdate={actions.updateLoan}
            onRemove={actions.removeLoan}
            emptyHint="Inga lån eller avbetalningar ännu. Skönt läge – eller lägg till om du har något att hålla koll på."
            namePlaceholder="Namn, t.ex. Billån"
            totalLabel="Totalt lån och avbetalningar"
          />
        </SectionAccordionItem>

        <SectionAccordionItem id="savings" label="Spar & Investeringar" active={section} onToggle={toggleSection}>
          <RecurringItemsList
            title="Spar och investeringar"
            items={budget.savings || []}
            currency={budget.currency}
            onAdd={actions.addSavings}
            onUpdate={actions.updateSavings}
            onRemove={actions.removeSavings}
            emptyHint="Inget sparande eller investeringar ännu. Varje krona du lägger undan nu gör skillnad sen!"
            namePlaceholder="Namn, t.ex. Fondsparande"
            totalLabel="Totalt spar och investeringar"
          />
          <GoalsList
            goals={budget.goals || []}
            currency={budget.currency}
            period={period}
            onAdd={actions.addGoal}
            onContribute={actions.contributeToGoal}
            onRemove={actions.removeGoal}
          />
        </SectionAccordionItem>

        <SectionAccordionItem id="categories" label="Rörliga kostnader" active={section} onToggle={toggleSection}>
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
            onLog={actions.logExpense}
            onRemoveCategory={actions.removeCategory}
          />

          <CategoryManager
            onAdd={actions.addCategory}
          />

          <RecurringTransactionManager
            items={budget.recurringTransactions || []}
            categories={budget.categories}
            currency={budget.currency}
            onAdd={actions.addRecurringTransaction}
            onUpdate={actions.updateRecurringTransaction}
            onRemove={actions.removeRecurringTransaction}
          />
        </SectionAccordionItem>

        <SectionAccordionItem id="trends" label="Trender" active={section} onToggle={toggleSection}>
          <TrendChart budget={budget} periodKey={viewKey} currency={budget.currency} />
        </SectionAccordionItem>
      </div>

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

      {showPeriodModal && (
        <BudgetPeriodModal
          budget={budget}
          onSave={actions.setPeriodStartDay}
          onClose={() => setShowPeriodModal(false)}
        />
      )}

      <MotivationalMessage event={motivation} onDone={clearMotivation} />
    </div>
  );
}
