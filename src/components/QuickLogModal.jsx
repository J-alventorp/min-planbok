import { useState } from 'react';
import { useActiveBudget } from '../hooks/useActiveBudget';
import AddExpenseForm from './AddExpenseForm';

export default function QuickLogModal({ budgetId, state, setState, onClose }) {
  const { budget, actions } = useActiveBudget(state, setState, budgetId);
  const [categoryId, setCategoryId] = useState(null);

  if (!budget) return null;

  const category = budget.categories.find((c) => c.id === categoryId) || null;

  return (
    <div className="mp-modal-overlay">
      <div className="mp-modal">
        {category && (
          <button type="button" className="mp-modal-back" onClick={() => setCategoryId(null)} aria-label="Tillbaka">
            ‹
          </button>
        )}
        <button type="button" className="mp-modal-close" onClick={onClose} aria-label="Stäng">✕</button>
        <h2>Snabblogga utgift</h2>

        {!category && (
          <>
            <p className="mp-hint">Välj en kategori för att logga en utgift direkt.</p>
            {budget.categories.length === 0 ? (
              <p className="mp-empty-hint">Inga kategorier ännu — öppna appen för att lägga till en.</p>
            ) : (
              <div className="mp-choice-row">
                {budget.categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="mp-choice-btn"
                    onClick={() => setCategoryId(c.id)}
                  >
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {category && (
          <AddExpenseForm
            categories={[category]}
            categoryId={category.id}
            renderAsCard={false}
            onLog={actions.logExpense}
            onDone={onClose}
          />
        )}
      </div>
    </div>
  );
}
