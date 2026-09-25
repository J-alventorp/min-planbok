import { useState } from 'react';
import GoalCard from './GoalCard';

const ICONS = ['🎯', '✈️', '🏖️', '💻', '🚗', '🏡', '🎓', '🎁'];

export default function GoalsList({
  goals, currency, onAdd, onContribute, onRemove,
}) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [target, setTarget] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !target) return;
    onAdd(name.trim(), icon, Number(target));
    setName('');
    setTarget('');
  };

  return (
    <section className="mp-card">
      <h2 className="mp-card-title">Sparmål</h2>
      {goals.length === 0 ? (
        <p className="mp-empty-hint">Inga sparmål ännu, t.ex. en resa eller en buffert.</p>
      ) : (
        <div className="mp-cat-grid">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              currency={currency}
              onContribute={(amount) => onContribute(g.id, amount)}
              onRemove={() => onRemove(g.id)}
            />
          ))}
        </div>
      )}
      <form className="mp-add-row mp-cat-add-row" onSubmit={submit}>
        <select value={icon} onChange={(e) => setIcon(e.target.value)}>
          {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <input placeholder="Nytt mål, t.ex. Resa" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Målbelopp" min="0" value={target} onChange={(e) => setTarget(e.target.value)} />
        <button type="submit">Lägg till</button>
      </form>
    </section>
  );
}
