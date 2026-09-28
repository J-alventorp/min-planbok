import { useState } from 'react';
import ProgressBar from './ProgressBar';
import { ExpenseFields } from './AddExpenseForm';
import { formatMoney } from '../utils/money';

export default function CategoryBudgetCard({
  category, spent, allocated, currency, onChangeBudget, onOpenDetail, onLog, onRequestRemove,
}) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <div className="mp-cat-card">
      <button
        type="button"
        className="mp-cat-card-remove"
        aria-label={`Ta bort ${category.name}`}
        onClick={(e) => {
          e.stopPropagation();
          onRequestRemove(category.id);
        }}
      >
        ✕
      </button>
      <button type="button" className="mp-cat-card-tap" onClick={() => onOpenDetail(category.id)}>
        <div className="mp-cat-card-head">
          <span className="mp-cat-icon" aria-hidden="true">{category.icon}</span>
          <span className="mp-cat-name">{category.name}</span>
          <span className="mp-cat-spent">{formatMoney(spent, currency)}</span>
        </div>
        <ProgressBar spent={spent} allocated={allocated} currency={currency} />
      </button>

      <div className="mp-cat-amounts">
        <span className="mp-cat-of">Budget</span>
        <input
          type="number"
          className="mp-cat-input"
          min="0"
          value={allocated || ''}
          placeholder="0"
          onChange={(e) => onChangeBudget(Number(e.target.value) || 0)}
        />
        <button
          type="button"
          className="mp-cat-quickadd-btn"
          aria-label={`Logga utgift i ${category.name}`}
          onClick={() => setQuickAddOpen((o) => !o)}
        >
          {quickAddOpen ? '−' : '+'}
        </button>
      </div>

      {quickAddOpen && (
        <ExpenseFields
          categories={[category]}
          categoryId={category.id}
          onLog={onLog}
          onDone={() => setQuickAddOpen(false)}
        />
      )}
    </div>
  );
}
