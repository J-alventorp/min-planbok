import { useState } from 'react';

export default function AddExpenseForm({ categories, onLog }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [flash, setFlash] = useState(false);

  if (categories.length === 0) return null;

  const submit = (e) => {
    e.preventDefault();
    const cat = categoryId || categories[0].id;
    if (!amount) return;
    onLog(cat, Number(amount), note.trim());
    setAmount('');
    setNote('');
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
  };

  return (
    <section className="mp-card">
      <h2 className="mp-card-title">Logga utgift</h2>
      <form className={`mp-expense-form ${flash ? 'mp-bounce' : ''}`} onSubmit={submit}>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
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
    </section>
  );
}
