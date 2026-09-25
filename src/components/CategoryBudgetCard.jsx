import ProgressBar from './ProgressBar';
import { formatMoney } from '../utils/money';

export default function CategoryBudgetCard({ category, spent, allocated, currency, onChangeBudget }) {
  return (
    <div className="mp-cat-card">
      <div className="mp-cat-card-head">
        <span className="mp-cat-icon" aria-hidden="true">{category.icon}</span>
        <span className="mp-cat-name">{category.name}</span>
      </div>
      <div className="mp-cat-amounts">
        <span className="mp-cat-spent">{formatMoney(spent, currency)}</span>
        <span className="mp-cat-of">av</span>
        <input
          type="number"
          className="mp-cat-input"
          min="0"
          value={allocated || ''}
          placeholder="0"
          onChange={(e) => onChangeBudget(Number(e.target.value) || 0)}
        />
      </div>
      <ProgressBar spent={spent} allocated={allocated} currency={currency} />
    </div>
  );
}
