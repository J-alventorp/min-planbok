import ProgressBar from './ProgressBar';
import { periodLabel } from '../utils/period';
import {
  totalFixedExpenses, totalCategoryBudgets, totalSpent, totalRemaining, freeToAllocate,
  categorySpent, categoryBudgetAmount,
} from '../utils/calc';
import { formatMoney } from '../utils/money';

export default function PeriodSummary({ budget, period, periodKey }) {
  const free = freeToAllocate(period);

  return (
    <section className="mp-card mp-summary-card">
      <h2 className="mp-card-title">Sammanfattning – {periodLabel(budget.periodType, periodKey)}</h2>
      <div className="mp-summary-stats">
        <div className="mp-summary-row">
          <span>Inkomst</span>
          <span>{formatMoney(period.income, budget.currency)}</span>
        </div>
        <div className="mp-summary-row">
          <span>Fasta utgifter</span>
          <span>{formatMoney(totalFixedExpenses(period), budget.currency)}</span>
        </div>
        <div className="mp-summary-row">
          <span>Budgeterat totalt</span>
          <span>{formatMoney(totalCategoryBudgets(period), budget.currency)}</span>
        </div>
        <div className="mp-summary-row">
          <span>Spenderat totalt</span>
          <span>{formatMoney(totalSpent(period), budget.currency)}</span>
        </div>
        <div className="mp-summary-row">
          <span>Kvar totalt</span>
          <span>{formatMoney(totalRemaining(period), budget.currency)}</span>
        </div>
        <div className="mp-summary-row">
          <span>Kvar att fördela</span>
          <span className={free < 0 ? 'mp-negative' : ''}>{formatMoney(free, budget.currency)}</span>
        </div>
      </div>

      {budget.categories.length > 0 && (
        <div className="mp-summary-cats">
          {budget.categories.map((c) => (
            <div key={c.id} className="mp-summary-cat-row">
              <span className="mp-cat-icon" aria-hidden="true">{c.icon}</span>
              <span className="mp-cat-name">{c.name}</span>
              <div className="mp-summary-cat-bar">
                <ProgressBar
                  spent={categorySpent(period, c.id)}
                  allocated={categoryBudgetAmount(period, c.id)}
                  currency={budget.currency}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
