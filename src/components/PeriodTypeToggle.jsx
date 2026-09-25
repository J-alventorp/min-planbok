const OPTIONS = [
  { key: 'month', label: 'Månad' },
  { key: 'week', label: 'Vecka' },
];

export default function PeriodTypeToggle({ value, onChange }) {
  return (
    <div className="mp-toggle-row" role="radiogroup" aria-label="Periodtyp">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          role="radio"
          aria-checked={value === opt.key}
          className={`mp-toggle-btn ${value === opt.key ? 'active' : ''}`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
