import { useState } from 'react';
import { formatMoney } from '../utils/money';

export default function RecurringTransactionManager({
  items, categories, currency, onAdd, onUpdate, onRemove,
}) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  if (categories.length === 0) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || !categoryId) return;
    onAdd(categoryId, title.trim(), Number(amount));
    setTitle('');
    setAmount('');
  };

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || '?';

  return (
    <section className="mp-card">
      <h2 className="mp-card-title">Återkommande kostnader</h2>
      <p className="mp-hint">Loggas automatiskt i varje ny period, t.ex. prenumerationer.</p>
      {items.length === 0 ? (
        <p className="mp-empty-hint">Inga återkommande kostnader ännu.</p>
      ) : (
        <div className="mp-fixed-list">
          {items.map((rt) => (
            <div key={rt.id} className={`mp-fixed-row ${rt.active ? '' : 'mp-fixed-row--inactive'}`}>
              <button
                type="button"
                className="mp-fixed-toggle"
                aria-label={rt.active ? 'Inaktivera' : 'Aktivera'}
                onClick={() => onUpdate(rt.id, { active: !rt.active })}
              >
                {rt.active ? '✓' : '—'}
              </button>
              <span className="mp-fixed-currency">{categoryName(rt.categoryId)}</span>
              <input
                className="mp-fixed-name"
                value={rt.title}
                onChange={(e) => onUpdate(rt.id, { title: e.target.value })}
              />
              <input
                type="number"
                className="mp-fixed-amount"
                value={rt.amount || ''}
                min="0"
                onChange={(e) => onUpdate(rt.id, { amount: Number(e.target.value) || 0 })}
              />
              <span className="mp-fixed-currency">{currency}</span>
              <button type="button" className="mp-fixed-remove" aria-label="Ta bort" onClick={() => onRemove(rt.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
      <form className="mp-add-row" onSubmit={submit}>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
        <input placeholder="Namn, t.ex. Netflix" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" placeholder="Belopp" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button type="submit">Lägg till</button>
      </form>
      {items.some((rt) => rt.active) && (
        <p className="mp-fixed-total">
          Totalt per period: {formatMoney(items.filter((rt) => rt.active).reduce((s, rt) => s + rt.amount, 0), currency)}
        </p>
      )}
    </section>
  );
}
