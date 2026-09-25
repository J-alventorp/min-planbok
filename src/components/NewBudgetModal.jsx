import { useState } from 'react';
import PeriodTypeToggle from './PeriodTypeToggle';
import CurrencySelector from './CurrencySelector';

const COLORS = ['#FFB833', '#FF6F59', '#4CAF6D', '#5AA9E6', '#C77DFF', '#F25C9B'];

export default function NewBudgetModal({ onCreate, onClose, canClose }) {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('SEK');
  const [periodType, setPeriodType] = useState('month');
  const [color, setColor] = useState(COLORS[0]);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), currency, periodType, color });
  };

  return (
    <div className="mp-modal-overlay">
      <div className="mp-modal">
        {canClose && (
          <button type="button" className="mp-modal-close" onClick={onClose} aria-label="Stäng">✕</button>
        )}
        <h2>Ny budget</h2>
        <p className="mp-hint">Ge din budget ett namn och kom igång direkt.</p>
        <form onSubmit={submit} className="mp-modal-form">
          <label>
            Namn
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="T.ex. Hushåll" autoFocus />
          </label>
          <label>
            Valuta
            <CurrencySelector value={currency} onChange={setCurrency} />
          </label>
          <label>
            Period
            <PeriodTypeToggle value={periodType} onChange={setPeriodType} />
          </label>
          <div className="mp-color-row">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                className={`mp-color-dot ${color === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={`Färg ${c}`}
              />
            ))}
          </div>
          <button type="submit" className="mp-primary-btn">Skapa budget</button>
        </form>
      </div>
    </div>
  );
}
