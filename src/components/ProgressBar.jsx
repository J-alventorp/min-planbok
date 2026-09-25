import { formatMoney } from '../utils/money';

export default function ProgressBar({ spent, allocated, currency }) {
  const pct = allocated > 0 ? (spent / allocated) * 100 : (spent > 0 ? 100 : 0);
  const shown = Math.min(pct, 100);
  const remaining = allocated - spent;

  let tone = 'green';
  if (pct >= 100) tone = 'red';
  else if (pct >= 80) tone = 'amber';

  return (
    <div className="mp-bar">
      <div className="mp-bar-track">
        <div className={`mp-bar-fill mp-bar-fill--${tone}`} style={{ width: `${shown}%` }} />
      </div>
      <div className="mp-bar-meta">
        <span className={`mp-bar-remaining mp-bar-remaining--${tone}`}>
          {remaining >= 0
            ? `${formatMoney(remaining, currency)} kvar`
            : `${formatMoney(Math.abs(remaining), currency)} över`}
        </span>
        <span className="mp-bar-pct">{Math.round(pct)}%</span>
      </div>
      {pct > 100 && (
        <span className="mp-bar-badge">+{formatMoney(spent - allocated, currency)} över</span>
      )}
    </div>
  );
}
