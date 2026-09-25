import { formatMoney } from '../utils/money';

export default function IncomeCard({ income, currency, fixedTotal, freeToAllocate, onChange }) {
  return (
    <section className="mp-card mp-income-card">
      <h2 className="mp-card-title">Inkomst</h2>
      <div className="mp-income-row">
        <input
          type="number"
          className="mp-income-input"
          min="0"
          value={income || ''}
          placeholder="0"
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        <span className="mp-income-currency">{currency}</span>
      </div>
      <div className="mp-income-stats">
        <span>Fasta utgifter: {formatMoney(fixedTotal, currency)}</span>
        <span className={freeToAllocate < 0 ? 'mp-negative' : ''}>
          Kvar att fördela: {formatMoney(freeToAllocate, currency)}
        </span>
      </div>
    </section>
  );
}
