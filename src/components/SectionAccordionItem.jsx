export default function SectionAccordionItem({
  id, label, active, onToggle, children,
}) {
  const isOpen = active === id;
  return (
    <section className="mp-accordion-item">
      <button
        type="button"
        className={`mp-accordion-header ${isOpen ? 'active' : ''}`}
        aria-expanded={isOpen}
        onClick={() => onToggle(id)}
      >
        <span>{label}</span>
        <span className="mp-accordion-chevron" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="mp-accordion-body">{children}</div>}
    </section>
  );
}
