import { useState } from 'react';

export default function InfoPopover({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mp-info-popover">
      <button
        type="button"
        className="mp-info-btn"
        aria-label={label || 'Mer information'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        ⓘ
      </button>
      {open && <div className="mp-info-panel">{children}</div>}
    </div>
  );
}
