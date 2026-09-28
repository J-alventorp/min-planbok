import CategoryBudgetCard from './CategoryBudgetCard';
import {
  categorySpent, categoryBudgetAmount, categoryTransactions,
} from '../utils/calc';
import { formatMoney } from '../utils/money';

export default function CategoryBudgetGrid({
  categories, period, currency, freeToAllocate, onChangeBudget, onOpenDetail, onLog, onRemoveCategory,
}) {
  if (!categories.length) {
    return <p className="mp-empty-hint">Inga kategorier än. Lägg till en längre ner för att börja budgetera.</p>;
  }

  const requestRemove = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;
    const txs = categoryTransactions(period, categoryId);
    const spent = categorySpent(period, categoryId);
    const message = txs.length > 0
      ? `Kategorin "${category.name}" har ${txs.length} loggade utgifter på totalt ${formatMoney(spent, currency)} denna period. Ta bort ändå?`
      : `Ta bort kategorin "${category.name}"?`;
    // eslint-disable-next-line no-alert
    if (window.confirm(message)) onRemoveCategory(categoryId);
  };

  return (
    <>
      <div className="mp-cat-grid-head">
        <span className={freeToAllocate < 0 ? 'mp-negative' : ''}>
          Kvar att fördela: {formatMoney(freeToAllocate, currency)}
        </span>
      </div>
      <div className="mp-cat-grid">
        {categories.map((cat) => (
          <CategoryBudgetCard
            key={cat.id}
            category={cat}
            spent={categorySpent(period, cat.id)}
            allocated={categoryBudgetAmount(period, cat.id)}
            currency={currency}
            onChangeBudget={(amount) => onChangeBudget(cat.id, amount)}
            onOpenDetail={onOpenDetail}
            onLog={onLog}
            onRequestRemove={requestRemove}
          />
        ))}
      </div>
    </>
  );
}
