import CategoryBudgetCard from './CategoryBudgetCard';
import { categorySpent, categoryBudgetAmount } from '../utils/calc';

export default function CategoryBudgetGrid({ categories, period, currency, onChangeBudget }) {
  if (!categories.length) {
    return <p className="mp-empty-hint">Inga kategorier än. Lägg till en längre ner för att börja budgetera.</p>;
  }
  return (
    <div className="mp-cat-grid">
      {categories.map((cat) => (
        <CategoryBudgetCard
          key={cat.id}
          category={cat}
          spent={categorySpent(period, cat.id)}
          allocated={categoryBudgetAmount(period, cat.id)}
          currency={currency}
          onChangeBudget={(amount) => onChangeBudget(cat.id, amount)}
        />
      ))}
    </div>
  );
}
