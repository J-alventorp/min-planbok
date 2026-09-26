import { totalFixedExpenses, totalLoans } from '../utils/calc';

// Two ready-made savings goals every budget starts with, alongside the
// user's own free-form goals.
export const PRESET_GOALS = [
  {
    presetKey: 'buffer',
    name: 'Buffertspar',
    icon: '🛟',
    defaultTarget: 15000,
    description: 'En buffert är pengar du har lätt tillgängliga för oförutsedda utgifter, t.ex. en trasig tvättmaskin eller ett akut tandläkarbesök — så att du slipper låna eller bryta annat sparande.',
  },
  {
    presetKey: 'long_term',
    name: 'Långsiktigt spar',
    icon: '📈',
    defaultTarget: 0,
    description: 'Långsiktigt sparande är pengar du inte rör på flera år, t.ex. i fonder eller aktier, så att de hinner växa. Bra att komma igång med så tidigt som möjligt tack vare ränta-på-ränta-effekten.',
  },
];

// A dynamic recommendation based on the current period's numbers, or null
// when there isn't enough data yet to suggest anything meaningful.
export function getPresetRecommendation(presetKey, period) {
  if (presetKey === 'buffer') {
    const base = totalFixedExpenses(period) + totalLoans(period);
    if (base <= 0) return null;
    return { min: base * 3, max: base * 6, text: '3–6 månaders fasta utgifter och lån' };
  }
  if (presetKey === 'long_term') {
    const income = period?.income || 0;
    if (income <= 0) return null;
    return { min: income * 0.10, max: income * 0.20, text: '10–20% av din månadsinkomst' };
  }
  return null;
}
