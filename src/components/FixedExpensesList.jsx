import { useState } from 'react';
import FixedExpenseRow from './FixedExpenseRow';
import { formatMoney } from '../utils/money';

export default function FixedExpensesList({ expenses, currency, onAdd, onUpdate, onRemove }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    onAdd(name.trim(), Number(amount));
    setName('');
    setAmount('');
  };

  const total = expenses.filter((f) => f.active).reduce((s, f) => s + f.amount, 0);

  return (
    <section className="mp-card">
      <h2 className="mp-card-title">Fasta utgifter</h2>
      {expenses.length === 0 ? (
        <p className="mp-empty-hint">Inga fasta utgifter ännu, t.ex. hyra eller el.</p>
      ) : (
        <div className="mp-fixed-list">
          {expenses.map((f) => (
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
        <input placeholder="Namn, t.ex. Hyra" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Belopp" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button type="submit">Lägg till</button>
      </form>
      {expenses.length > 0 && (
        <p className="mp-fixed-total">Totalt fasta utgifter: {formatMoney(total, currency)}</p>
      )}
    </section>
  );
}
