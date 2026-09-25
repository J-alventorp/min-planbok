export default function FixedExpenseRow({ expense, currency, onUpdate, onRemove }) {
  return (
    <div className={`mp-fixed-row ${expense.active ? '' : 'mp-fixed-row--inactive'}`}>
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
  );
}
