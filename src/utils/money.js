export function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch (e) {
    return `${Math.round(amount || 0)} ${currency}`;
  }
}

// Rounds a suggestion to a "friendly" number so it doesn't look like a raw average.
export function roundFriendly(n) {
  if (n <= 0) return 0;
  const step = n < 200 ? 10 : 50;
  return Math.round(n / step) * step;
}
