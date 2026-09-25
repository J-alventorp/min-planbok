import { useState } from 'react';
import { formatMoney } from '../utils/money';

export default function GoalCard({
  goal, currency, onContribute, onRemove,
}) {
  const [amount, setAmount] = useState('');
  const pct = goal.targetAmount > 0 ? Math.min(100, (goal.savedAmount / goal.targetAmount) * 100) : 0;
  const reached = goal.targetAmount > 0 && goal.savedAmount >= goal.targetAmount;

  const submit = (e) => {
    e.preventDefault();
    if (!amount) return;
    onContribute(Number(amount));
    setAmount('');
  };

  return (
    <div className="mp-cat-card">
      <div className="mp-cat-card-head">
        <span className="mp-cat-icon" aria-hidden="true">{goal.icon}</span>
        <span className="mp-cat-name">{goal.name}</span>
        <button type="button" className="mp-fixed-remove" aria-label={`Ta bort ${goal.name}`} onClick={onRemove}>✕</button>
      </div>
      <div className="mp-bar">
        <div className="mp-bar-track">
          <div
            className={`mp-bar-fill ${reached ? 'mp-bar-fill--green' : 'mp-bar-fill--amber'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mp-bar-meta">
          <span>{formatMoney(goal.savedAmount, currency)} av {formatMoney(goal.targetAmount, currency)}</span>
          <span>{reached ? 'Klart! 🎉' : `${Math.round(pct)}%`}</span>
        </div>
      </div>
      <form className="mp-add-row" onSubmit={submit}>
        <input
          type="number"
          min="0"
          placeholder="Lägg till sparande"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Spara</button>
      </form>
    </div>
  );
}
