import { CURRENCIES } from '../data/currencies';

export default function CurrencySelector({ value, onChange }) {
  return (
    <select className="mp-currency-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>{c.label}</option>
      ))}
    </select>
  );
}
