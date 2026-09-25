import { useState } from 'react';
import FixedExpenseRow from './FixedExpenseRow';
import { formatMoney } from '../utils/money';

export default function RecurringItemsList({
  title, items, currency, onAdd, onUpdate, onRemove,
  emptyHint, namePlaceholder, totalLabel,
}) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    onAdd(name.trim(), Number(amount));
    setName('');
    setAmount('');
  };

  const total = items.filter((f) => f.active).reduce((s, f) => s + f.amount, 0);

  return (
    <section className="mp-card">
      <h2 className="mp-card-title">{title}</h2>
      {items.length === 0 ? (
        <p className="mp-empty-hint">{emptyHint}</p>
      ) : (
        <div className="mp-fixed-list">
          {items.map((f) => (
            <FixedExpenseRow
              key={f.id}
              expense={f}
              currency={currency}
              onUpdate={(patch) => onUpdate(f.id, patch)}
              onRemove={() => onRemove(f.id)}
            />
          ))}
        </div>
      )}
      <form className="mp-add-row" onSubmit={submit}>
        <input placeholder={namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Belopp" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button type="submit">Lägg till</button>
      </form>
      {items.length > 0 && (
        <p className="mp-fixed-total">{totalLabel}: {formatMoney(total, currency)}</p>
      )}
    </section>
  );
}
