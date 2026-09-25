import { useState } from 'react';

const ICONS = ['🛒', '🎉', '🚌', '🛍️', '✨', '🏠', '💊', '🐾', '🎁', '📚', '☕', '🎮'];

export default function CategoryManager({ categories, onAdd, onRemove }) {
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
        <h2 className="mp-card-title">Kategorier</h2>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <>
          <div className="mp-edit-list">
            {categories.map((c) => (
              <span key={c.id} className="mp-edit-chip">
                {c.icon} {c.name}
                <button type="button" onClick={() => onRemove(c.id)} aria-label={`Ta bort ${c.name}`}>✕</button>
              </span>
            ))}
          </div>
          <form className="mp-add-row mp-cat-add-row" onSubmit={submit}>
            <select value={icon} onChange={(e) => setIcon(e.target.value)}>
              {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <input placeholder="Ny kategori" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit">Lägg till</button>
          </form>
        </>
      )}
    </section>
  );
}
