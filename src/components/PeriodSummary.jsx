import { useState } from 'react';
import ProgressBar from './ProgressBar';
import { periodLabel } from '../utils/period';
import {
  totalFixedExpenses, totalCategoryBudgets, totalOutflow, totalRemaining, freeToAllocate,
  totalLoans, totalSavings,
} from '../utils/calc';
import { formatMoney } from '../utils/money';

export default function PeriodSummary({ budget, period, periodKey }) {
  const [expanded, setExpanded] = useState(false);
  const free = freeToAllocate(period);
  const outflow = totalOutflow(period);
  const left = period.income - outflow;

  return (
    <section className="mp-card mp-summary-card">
      <h2 className="mp-card-title">Sammanfattning – {periodLabel(budget.periodType, periodKey)}</h2>

      <ProgressBar spent={outflow} allocated={period.income} currency={budget.currency} />

      <div className="mp-summary-headline">
        <div>
          <span className="mp-summary-headline-label">Spenderat</span>
          <span className="mp-summary-headline-value">{formatMoney(outflow, budget.currency)}</span>
        </div>
        <div>
          <span className="mp-summary-headline-label">Kvar</span>
          <span className={`mp-summary-headline-value ${left < 0 ? 'mp-negative' : ''}`}>
            {formatMoney(left, budget.currency)}
          </span>
        </div>
      </div>

      <button type="button" className="mp-collapse-toggle" onClick={() => setExpanded((e) => !e)}>
        <span className="mp-hint" style={{ margin: 0 }}>Visa detaljer</span>
        <span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
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
            <span>Lån och avbetalningar</span>
            <span>{formatMoney(totalLoans(period), budget.currency)}</span>
          </div>
          <div className="mp-summary-row">
            <span>Spar och investeringar</span>
            <span>{formatMoney(totalSavings(period), budget.currency)}</span>
          </div>
          <div className="mp-summary-row">
            <span>Budgeterat totalt</span>
            <span>{formatMoney(totalCategoryBudgets(period), budget.currency)}</span>
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
      )}
    </section>
  );
}
