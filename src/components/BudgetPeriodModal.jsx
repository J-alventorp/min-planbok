import { useState } from 'react';
import PeriodStartDayField from './PeriodStartDayField';

export default function BudgetPeriodModal({ budget, onSave, onClose }) {
  const [periodStartDay, setPeriodStartDay] = useState(budget.periodStartDay || 1);

  const submit = (e) => {
    e.preventDefault();
    onSave(periodStartDay);
    onClose();
  };

  return (
    <div className="mp-modal-overlay">
      <div className="mp-modal">
        <button type="button" className="mp-modal-close" onClick={onClose} aria-label="Stäng">✕</button>
        <h2>Budgetperiod</h2>
        <p className="mp-hint">Ändringen gäller direkt, även för innevarande period.</p>
        <form onSubmit={submit} className="mp-modal-form">
          <PeriodStartDayField periodType={budget.periodType} value={periodStartDay} onChange={setPeriodStartDay} />
          <button type="submit" className="mp-primary-btn">Spara</button>
        </form>
      </div>
    </div>
  );
}
