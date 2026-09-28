import { monthKey } from '../utils/period';

const INTERVALS = [
  { value: 'monthly', label: 'Varje månad' },
  { value: 'quarterly', label: 'Kvartalsvis' },
  { value: 'halfyear', label: 'Halvårsvis' },
];

export default function FixedExpenseRow({
  expense, currency, onUpdate, onRemove, showInterval,
}) {
  const interval = expense.interval || 'monthly';
  return (
    <div className={`mp-fixed-row ${expense.active ? '' : 'mp-fixed-row--inactive'}`}>
      <div className="mp-fixed-row-main">
        <button
          type="button"
          className="mp-fixed-toggle"
          aria-label={expense.active ? 'Inaktivera' : 'Aktivera'}
          onClick={() => onUpdate({ active: !expense.active })}
        >
          {expense.active ? '✓' : '—'}
        </button>
        <input
          className="mp-fixed-name"
          value={expense.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
        />
        <input
          type="number"
          className="mp-fixed-amount"
          value={expense.amount || ''}
          min="0"
          onChange={(e) => onUpdate({ amount: Number(e.target.value) || 0 })}
        />
        <span className="mp-fixed-currency">{currency}</span>
        <button type="button" className="mp-fixed-remove" aria-label="Ta bort" onClick={onRemove}>✕</button>
      </div>
      {showInterval && (
        <div className="mp-fixed-row-interval">
          <select
            aria-label={`Intervall för ${expense.name}`}
            value={interval}
            onChange={(e) => {
              const nextInterval = e.target.value;
              const patch = { interval: nextInterval };
              if (nextInterval !== 'monthly' && !expense.startMonth) patch.startMonth = monthKey(new Date());
              onUpdate(patch);
            }}
          >
            {INTERVALS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
          {interval !== 'monthly' && (
            <input
              type="month"
              aria-label={`Startmånad för ${expense.name}`}
              value={expense.startMonth || ''}
              onChange={(e) => onUpdate({ startMonth: e.target.value })}
            />
          )}
        </div>
      )}
    </div>
  );
}
