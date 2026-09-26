import { useState } from 'react';
import { spendHistory, savingsHistory } from '../utils/calc';
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

function BarChart({ bars, periodType, barClass }) {
  const max = Math.max(1, ...bars.map((h) => h.value));
  const barWidth = bars.length > 0 ? (CHART_WIDTH - BAR_GAP * (bars.length - 1)) / bars.length : 0;
  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="mp-trend-chart"
      role="img"
      aria-label="Stapeldiagram per period"
    >
      {bars.map((h, i) => {
        const barH = (h.value / max) * (CHART_HEIGHT - 24);
        const x = i * (barWidth + BAR_GAP);
        const y = CHART_HEIGHT - 24 - barH;
        const isLast = i === bars.length - 1;
        return (
          <g key={h.key}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(barH, h.value > 0 ? 2 : 0)}
              rx="2"
              className={isLast ? `${barClass} ${barClass}--current` : barClass}
            />
            <text x={x + barWidth / 2} y={CHART_HEIGHT - 8} textAnchor="middle" className="mp-trend-label">
              {shortLabel(periodType, h.key)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function TrendChart({ budget, periodKey, currency }) {
  const [categoryId, setCategoryId] = useState('all');

  const history = spendHistory(budget, periodKey, 5, categoryId === 'all' ? undefined : categoryId);
  const savingsHist = savingsHistory(budget, periodKey, 5);

  const totalSaved = savingsHist.reduce((s, h) => s + h.saved, 0);
  const avgSaved = savingsHist.length > 0 ? totalSaved / savingsHist.length : 0;
  const bestPeriod = savingsHist.reduce((best, h) => (!best || h.saved > best.saved ? h : best), null);
  const worstPeriod = savingsHist.reduce((worst, h) => (!worst || h.saved < worst.saved ? h : worst), null);

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
        <BarChart
          bars={history.map((h) => ({ key: h.key, value: h.spent }))}
          periodType={budget.periodType}
          barClass="mp-trend-bar"
        />
      )}

      <div className="mp-summary-row">
        <span>Senaste perioden</span>
        <span>{formatMoney(history[history.length - 1]?.spent || 0, currency)}</span>
      </div>

      <h2 className="mp-card-title" style={{ marginTop: 8 }}>Sparande mellan perioder</h2>

      {savingsHist.every((h) => h.saved === 0) ? (
        <p className="mp-empty-hint">Inget sparande loggat ännu i tidigare perioder.</p>
      ) : (
        <BarChart
          bars={savingsHist.map((h) => ({ key: h.key, value: h.saved }))}
          periodType={budget.periodType}
          barClass="mp-trend-bar-savings"
        />
      )}

      {totalSaved > 0 && (
        <div className="mp-summary-stats">
          <div className="mp-summary-row">
            <span>Totalt sparat (visad period)</span>
            <span>{formatMoney(totalSaved, currency)}</span>
          </div>
          <div className="mp-summary-row">
            <span>Snitt per period</span>
            <span>{formatMoney(avgSaved, currency)}</span>
          </div>
          {bestPeriod && (
            <div className="mp-summary-row">
              <span>Bästa perioden</span>
              <span>{shortLabel(budget.periodType, bestPeriod.key)} · {formatMoney(bestPeriod.saved, currency)}</span>
            </div>
          )}
          {worstPeriod && worstPeriod.saved !== bestPeriod?.saved && (
            <div className="mp-summary-row">
              <span>Lägsta perioden</span>
              <span>{shortLabel(budget.periodType, worstPeriod.key)} · {formatMoney(worstPeriod.saved, currency)}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
