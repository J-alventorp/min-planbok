function clampDay(n) {
  if (Number.isNaN(n)) return 1;
  return Math.min(28, Math.max(1, n));
}

export default function PeriodStartDayField({ periodType, value, onChange }) {
  if (periodType === 'week') return null;
  const custom = value !== 1;
  const endDay = value === 1 ? 1 : (value - 1 === 0 ? 28 : value - 1);

  return (
    <div className="mp-period-startday">
      <div className="mp-toggle-row" role="radiogroup" aria-label="Budgetperiod">
        <button
          type="button"
          role="radio"
          aria-checked={!custom}
          className={`mp-toggle-btn ${!custom ? 'active' : ''}`}
          onClick={() => onChange(1)}
        >
          Kalendermånad
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={custom}
          className={`mp-toggle-btn ${custom ? 'active' : ''}`}
          onClick={() => onChange(value === 1 ? 25 : value)}
        >
          Anpassad period
        </button>
      </div>
      {custom && (
        <>
          <label className="mp-period-startday-input">
            Startdag varje månad
            <input
              type="number"
              min="1"
              max="28"
              value={value}
              onChange={(e) => onChange(clampDay(Number(e.target.value)))}
            />
          </label>
          <p className="mp-hint">Perioden löper från den {value}:e till den {endDay}:e nästa månad.</p>
        </>
      )}
    </div>
  );
}
