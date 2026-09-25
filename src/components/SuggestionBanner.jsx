import { formatMoney } from '../utils/money';

export default function SuggestionBanner({ suggestions, categories, currency, onApplyAll, onApplyOne, onDismiss }) {
  const entries = Object.entries(suggestions).filter(([, s]) => s && s.amount > 0);
  if (entries.length === 0) return null;

  return (
    <section className="mp-suggestion-banner">
      <div className="mp-suggestion-head">
        <span className="mp-suggestion-title">💡 Förslag baserat på din historik</span>
        <button type="button" className="mp-ghost-btn" onClick={onDismiss}>Ignorera</button>
      </div>
      <ul className="mp-suggestion-list">
        {entries.map(([categoryId, s]) => {
          const cat = categories.find((c) => c.id === categoryId);
          if (!cat) return null;
          return (
            <li key={categoryId} className="mp-suggestion-item">
              <span className="mp-suggestion-cat">{cat.icon} {cat.name}</span>
              <span className="mp-suggestion-amount">{formatMoney(s.amount, currency)}</span>
              <span className="mp-suggestion-note">{s.note}</span>
              <button type="button" className="mp-suggestion-apply" onClick={() => onApplyOne(categoryId)}>
                Använd
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" className="mp-primary-btn" onClick={onApplyAll}>Använd förslag</button>
    </section>
  );
}
