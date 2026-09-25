export default function BudgetTabs({ budgets, activeId, onSelect, onNew }) {
  return (
    <div className="mp-tabs" role="tablist">
      {budgets.map((b) => (
        <button
          key={b.id}
          type="button"
          role="tab"
          aria-selected={b.id === activeId}
          className={`mp-tab ${b.id === activeId ? 'active' : ''}`}
          style={b.id === activeId ? { background: b.color, borderColor: b.color } : { borderColor: b.color }}
          onClick={() => onSelect(b.id)}
        >
          {b.name}
        </button>
      ))}
      <button type="button" className="mp-tab mp-tab-new" onClick={onNew} aria-label="Ny budget">+</button>
    </div>
  );
}
