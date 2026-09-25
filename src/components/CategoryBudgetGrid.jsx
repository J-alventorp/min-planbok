import CategoryBudgetCard from './CategoryBudgetCard';
import { categorySpent, categoryBudgetAmount } from '../utils/calc';
import { formatMoney } from '../utils/money';

export default function CategoryBudgetGrid({
  categories, period, currency, freeToAllocate, onChangeBudget, onOpenDetail,
}) {
  if (!categories.length) {
    return <p className="mp-empty-hint">Inga kategorier än. Lägg till en längre ner för att börja budgetera.</p>;
  }
  return (
    <>
      <div className="mp-cat-grid-head">
        <span className={freeToAllocate < 0 ? 'mp-negative' : ''}>
          Kvar att fördela: {formatMoney(freeToAllocate, currency)}
        </span>
      </div>
      <div className="mp-cat-grid">
        {categories.map((cat) => {
          const allocated = categoryBudgetAmount(period, cat.id);
          const sliderMax = Math.max(1000, allocated + Math.max(freeToAllocate, 0));
          const sliderStep = Math.max(10, Math.round(sliderMax / 200 / 10) * 10);
          return (
            <CategoryBudgetCard
              key={cat.id}
              category={cat}
              spent={categorySpent(period, cat.id)}
              allocated={allocated}
              sliderMax={sliderMax}
              sliderStep={sliderStep}
              currency={currency}
              onChangeBudget={(amount) => onChangeBudget(cat.id, amount)}
              onOpenDetail={onOpenDetail}
            />
          );
        })}
      </div>
    </>
  );
}
