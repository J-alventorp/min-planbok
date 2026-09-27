import { useRef, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';

export default function InfoPopover({ label, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));
  return (
    <div className="mp-info-popover" ref={ref}>
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
