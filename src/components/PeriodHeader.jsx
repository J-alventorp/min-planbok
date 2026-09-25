import { periodLabel } from '../utils/period';

export default function PeriodHeader({ periodType, periodKey, isCurrent, onPrev, onNext, onToday }) {
  return (
    <div className="mp-period-header">
      <button type="button" className="mp-icon-btn" aria-label="Föregående period" onClick={onPrev}>‹</button>
      <div className="mp-period-label-wrap">
        <span className="mp-period-label">{periodLabel(periodType, periodKey)}</span>
        {!isCurrent && (
          <button type="button" className="mp-today-link" onClick={onToday}>Till nuvarande</button>
        )}
      </div>
      <button
        type="button"
        className="mp-icon-btn"
        aria-label="Nästa period"
        onClick={onNext}
        disabled={isCurrent}
      >
        ›
      </button>
    </div>
  );
}
