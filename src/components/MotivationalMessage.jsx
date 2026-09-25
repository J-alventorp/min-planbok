import { useEffect, useState } from 'react';
import { pickMessage } from '../utils/motivational';

export default function MotivationalMessage({ event, onDone }) {
  const [text, setText] = useState(null);

  useEffect(() => {
    if (!event) return undefined;
    setText(pickMessage(event.situation));
    const t = setTimeout(() => {
      setText(null);
      onDone?.();
    }, event.subtle ? 1800 : 3600);
    return () => clearTimeout(t);
  }, [event, onDone]);

  if (!text) return null;

  return (
    <div className={`mp-motivation ${event?.subtle ? 'mp-motivation--subtle' : ''}`} role="status">
      {text}
    </div>
  );
}
