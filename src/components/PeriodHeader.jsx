import { periodLabel } from '../utils/period';

export default function PeriodHeader({
  periodType, periodKey, periodStartDay, isCurrent, onPrev, onNext, onToday, onEditPeriod,
}) {
  return (
    <div className="mp-period-header">
      <button type="button" className="mp-icon-btn" aria-label="Föregående period" onClick={onPrev}>‹</button>
      <div className="mp-period-label-wrap">
        <span className="mp-period-label">{periodLabel(periodType, periodKey, periodStartDay || 1)}</span>
        <div className="mp-period-label-links">
          {!isCurrent && (
            <button type="button" className="mp-today-link" onClick={onToday}>Till nuvarande</button>
          )}
          {periodType === 'month' && onEditPeriod && (
            <button type="button" className="mp-today-link" onClick={onEditPeriod} aria-label="Ändra budgetperiod">
              Ändra period
            </button>
          )}
        </div>
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
