const MONTHS_SV = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
];

function toUTCDate(date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

// Standard ISO-8601 week algorithm: shift to the Thursday of the same week,
// then count weeks from that ISO year's Jan 1. Done entirely in UTC so DST
// transitions never shift the calendar day out from under the math.
function getISOWeek(utcDate) {
  const d = new Date(utcDate.getTime());
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return { isoYear: d.getUTCFullYear(), week };
}

function isoWeekMonday(isoYear, week) {
  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  const jan4Day = (jan4.getUTCDay() + 6) % 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4Day);
  const monday = new Date(week1Monday);
  monday.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
  return monday;
}

function isoWeekKeyFromUTC(utcDate) {
  const { isoYear, week } = getISOWeek(utcDate);
  return `${isoYear}-W${String(week).padStart(2, '0')}`;
}

export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function isoWeekKey(date = new Date()) {
  return isoWeekKeyFromUTC(toUTCDate(date));
}

export function currentPeriodKey(periodType, date = new Date()) {
  return periodType === 'week' ? isoWeekKey(date) : monthKey(date);
}

export function periodLabel(periodType, key) {
  if (periodType === 'week') {
    const [y, w] = key.split('-W');
    return `Vecka ${parseInt(w, 10)}, ${y}`;
  }
  const [y, m] = key.split('-');
  return `${MONTHS_SV[parseInt(m, 10) - 1]} ${y}`;
}

export function shiftPeriodKey(periodType, key, delta) {
  if (periodType === 'week') {
    const [yStr, wStr] = key.split('-W');
    const monday = isoWeekMonday(parseInt(yStr, 10), parseInt(wStr, 10));
    monday.setUTCDate(monday.getUTCDate() + delta * 7);
    return isoWeekKeyFromUTC(monday);
  }
  const [yStr, mStr] = key.split('-');
  let y = parseInt(yStr, 10);
  let m = parseInt(mStr, 10) - 1 + delta;
  y += Math.floor(m / 12);
  m = ((m % 12) + 12) % 12;
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}

export function previousPeriodKeys(periodType, key, count) {
  const out = [];
  for (let i = 1; i <= count; i += 1) out.push(shiftPeriodKey(periodType, key, -i));
  return out;
}
