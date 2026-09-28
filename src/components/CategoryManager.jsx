import { useState } from 'react';

const ICONS = ['🛒', '🎉', '🚌', '🛍️', '✨', '🏠', '💊', '🐾', '🎁', '📚', '☕', '🎮'];

export default function CategoryManager({ onAdd }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [open, setOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), icon);
    setName('');
  };

  return (
    <section className="mp-card">
      <button type="button" className="mp-collapse-toggle" onClick={() => setOpen((o) => !o)}>
        <h2 className="mp-card-title">Lägg till kategori</h2>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <form className="mp-add-row mp-cat-add-row" onSubmit={submit}>
          <select value={icon} onChange={(e) => setIcon(e.target.value)}>
            {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <input placeholder="Ny kategori" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit">Lägg till</button>
        </form>
      )}
    </section>
  );
}
