const SECTIONS = [
  { id: 'fixed', label: 'Fasta utgifter' },
  { id: 'loans', label: 'Lån & Avbetalningar' },
  { id: 'savings', label: 'Spar & Investeringar' },
  { id: 'categories', label: 'Rörliga kostnader' },
  { id: 'trends', label: 'Trender' },
];

export default function SectionTabs({ active, onChange }) {
  return (
    <div className="mp-tabs mp-section-tabs" role="tablist">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={s.id === active}
          className={`mp-tab ${s.id === active ? 'active' : ''}`}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
