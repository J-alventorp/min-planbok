import { useState } from 'react';

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return typeof fallback === 'function' ? fallback() : fallback;
    return JSON.parse(raw);
  } catch (e) {
    return typeof fallback === 'function' ? fallback() : fallback;
  }
}

export function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
}

export function useLocalStorageState(key, fallback) {
  const [value, setValue] = useState(() => loadJSON(key, fallback));
  const setAndPersist = (next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      saveJSON(key, resolved);
      return resolved;
    });
  };
  return [value, setAndPersist];
}
