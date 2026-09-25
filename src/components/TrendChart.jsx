import { useState } from 'react';
import { spendHistory } from '../utils/calc';
import { formatMoney } from '../utils/money';

const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

function shortLabel(periodType, key) {
  if (periodType === 'week') {
    const w = key.split('-W')[1];
    return `v${parseInt(w, 10)}`;
  }
  const m = key.split('-')[1];
  return MONTHS_SHORT[parseInt(m, 10) - 1];
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 140;
const BAR_GAP = 10;

export default function TrendChart({ budget, periodKey, currency }) {
  const [categoryId, setCategoryId] = useState('all');

  const history = spendHistory(budget, periodKey, 5, categoryId === 'all' ? undefined : categoryId);
  const max = Math.max(1, ...history.map((h) => h.spent));
  const barWidth = history.length > 0 ? (CHART_WIDTH - BAR_GAP * (history.length - 1)) / history.length : 0;

  return (
    <section className="mp-card">
      <h2 className="mp-card-title">Trender</h2>
      <p className="mp-hint">Spenderat per period, senaste {history.length}.</p>

      {budget.categories.length > 0 && (
        <select
          className="mp-currency-select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="all">Alla kategorier</option>
          {budget.categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      )}

      {history.every((h) => h.spent === 0) ? (
        <p className="mp-empty-hint">Ingen historik att visa ännu — logga några utgifter över ett par perioder.</p>
      ) : (
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="mp-trend-chart"
          role="img"
          aria-label="Stapeldiagram över spenderat per period"
        >
          {history.map((h, i) => {
            const barH = (h.spent / max) * (CHART_HEIGHT - 24);
            const x = i * (barWidth + BAR_GAP);
            const y = CHART_HEIGHT - 24 - barH;
            const isLast = i === history.length - 1;
            return (
              <g key={h.key}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barH, h.spent > 0 ? 2 : 0)}
                  rx="2"
                  className={isLast ? 'mp-trend-bar mp-trend-bar--current' : 'mp-trend-bar'}
                />
                <text x={x + barWidth / 2} y={CHART_HEIGHT - 8} textAnchor="middle" className="mp-trend-label">
                  {shortLabel(budget.periodType, h.key)}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      <div className="mp-summary-row">
        <span>Senaste perioden</span>
        <span>{formatMoney(history[history.length - 1]?.spent || 0, currency)}</span>
      </div>
    </section>
  );
}
