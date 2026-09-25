import { useState } from 'react';

function ExpenseFields({ categories, categoryId, onLog, onDone }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || categories[0]?.id || '');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [flash, setFlash] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const cat = categoryId || selectedCategoryId || categories[0]?.id;
    if (!cat || !amount) return;
    onLog(cat, title.trim(), Number(amount), note.trim());
    setTitle('');
    setAmount('');
    setNote('');
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
    if (onDone) onDone();
  };

  return (
    <form className={`mp-expense-form ${flash ? 'mp-bounce' : ''}`} onSubmit={submit}>
      {!categoryId && (
        <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      )}
      <input
        type="text"
        placeholder="Titel (valfritt)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        min="0"
        placeholder="Belopp"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Anteckning (valfritt)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="submit">Logga</button>
    </form>
  );
}

export default function AddExpenseForm({
  categories, categoryId, renderAsCard = true, onLog, onDone,
}) {
  const [open, setOpen] = useState(false);

  if (categories.length === 0) return null;

  if (!renderAsCard) {
    return <ExpenseFields categories={categories} categoryId={categoryId} onLog={onLog} onDone={onDone} />;
  }

  return (
    <section className="mp-card">
      <button type="button" className="mp-collapse-toggle" onClick={() => setOpen((o) => !o)}>
        <h2 className="mp-card-title">Logga utgift</h2>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <ExpenseFields categories={categories} categoryId={categoryId} onLog={onLog} onDone={onDone} />
      )}
    </section>
  );
}
