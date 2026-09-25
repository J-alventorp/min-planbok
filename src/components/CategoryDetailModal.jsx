import { useEffect, useState } from 'react';
import AddExpenseForm from './AddExpenseForm';
import { formatMoney } from '../utils/money';

function transactionTitle(tx, category) {
  return tx.title?.trim() || category?.name || 'Utlägg';
}

export default function CategoryDetailModal({
  category, transactions, currency, onClose, onLog, onUpdate, onRemove,
}) {
  const [step, setStep] = useState('choice');
  const [activeTxId, setActiveTxId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    setStep('choice');
    setActiveTxId(null);
  }, [category?.id]);

  if (!category) return null;

  const sorted = transactions.slice().sort((a, b) => b.date.localeCompare(a.date));
  const activeTx = sorted.find((t) => t.id === activeTxId) || null;

  const openEdit = (tx) => {
    setActiveTxId(tx.id);
    setEditTitle(tx.title || '');
    setEditAmount(String(tx.amount));
    setEditNote(tx.note || '');
    setStep('edit');
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editAmount) return;
    onUpdate(activeTxId, { title: editTitle.trim(), amount: Number(editAmount), note: editNote.trim() });
    setStep('list');
  };

  const removeActive = () => {
    onRemove(activeTxId);
    setStep('list');
  };

  const backTarget = () => {
    if (step === 'edit' || step === 'add') return 'list';
    return 'choice';
  };

  return (
    <div className="mp-modal-overlay">
      <div className="mp-modal">
        {step !== 'choice' && (
          <button
            type="button"
            className="mp-modal-back"
            onClick={() => setStep(backTarget())}
            aria-label="Tillbaka"
          >
            ‹
          </button>
        )}
        <button type="button" className="mp-modal-close" onClick={onClose} aria-label="Stäng">✕</button>
        <h2>{category.icon} {category.name}</h2>

        {step === 'choice' && (
          <div className="mp-choice-row">
            <button type="button" className="mp-choice-btn" onClick={() => setStep('list')}>
              📋 Se utlägg
            </button>
            <button type="button" className="mp-choice-btn" onClick={() => setStep('add')}>
              ➕ Logga ny utgift
            </button>
          </div>
        )}

        {step === 'list' && (
          <>
            {sorted.length === 0 ? (
              <p className="mp-empty-hint">Inga utlägg loggade ännu.</p>
            ) : (
              <div className="mp-tx-list">
                {sorted.map((tx) => (
                  <button key={tx.id} type="button" className="mp-tx-row" onClick={() => openEdit(tx)}>
                    <span className="mp-tx-info">
                      <span className="mp-tx-title">{transactionTitle(tx, category)}</span>
                      {tx.note && <span className="mp-tx-note">{tx.note}</span>}
                    </span>
                    <span className="mp-tx-meta">
                      <span className="mp-tx-amount">{formatMoney(tx.amount, currency)}</span>
                      <span className="mp-tx-date">{new Date(tx.date).toLocaleDateString('sv-SE')}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            <button type="button" className="mp-primary-btn" onClick={() => setStep('add')}>
              + Logga ny utgift
            </button>
          </>
        )}

        {step === 'edit' && activeTx && (
          <form className="mp-expense-form" onSubmit={saveEdit}>
            <input
              type="text"
              placeholder="Titel (valfritt)"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="Belopp"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Anteckning (valfritt)"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
            />
            <button type="submit" className="mp-primary-btn">Spara</button>
            <button type="button" className="mp-danger-btn" onClick={removeActive}>Ta bort</button>
          </form>
        )}

        {step === 'add' && (
          <AddExpenseForm
            categories={[category]}
            categoryId={category.id}
            renderAsCard={false}
            onLog={onLog}
            onDone={() => setStep('list')}
          />
        )}
      </div>
    </div>
  );
}
