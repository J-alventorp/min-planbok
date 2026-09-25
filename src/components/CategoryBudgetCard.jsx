import ProgressBar from './ProgressBar';
import { formatMoney } from '../utils/money';

export default function CategoryBudgetCard({
  category, spent, allocated, currency, sliderMax, sliderStep, onChangeBudget, onOpenDetail,
}) {
  return (
    <div className="mp-cat-card">
      <button type="button" className="mp-cat-card-tap" onClick={() => onOpenDetail(category.id)}>
        <div className="mp-cat-card-head">
          <span className="mp-cat-icon" aria-hidden="true">{category.icon}</span>
          <span className="mp-cat-name">{category.name}</span>
          <span className="mp-cat-spent">{formatMoney(spent, currency)}</span>
        </div>
        <ProgressBar spent={spent} allocated={allocated} currency={currency} />
      </button>

      <div className="mp-cat-amounts">
        <span className="mp-cat-of">Budget</span>
        <input
          type="number"
          className="mp-cat-input"
          min="0"
          value={allocated || ''}
          placeholder="0"
          onChange={(e) => onChangeBudget(Number(e.target.value) || 0)}
        />
      </div>
      <input
        type="range"
        className="mp-cat-slider"
        min="0"
        max={sliderMax}
        step={sliderStep}
        value={Math.min(allocated || 0, sliderMax)}
        onChange={(e) => onChangeBudget(Number(e.target.value))}
        aria-label={`Budget för ${category.name}`}
      />
    </div>
  );
}
