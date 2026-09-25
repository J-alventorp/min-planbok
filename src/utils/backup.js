const BACKUP_VERSION = 1;

export function exportState(state) {
  const payload = { version: BACKUP_VERSION, exportedAt: new Date().toISOString(), state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `min-planbok-${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseImportFile(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: 'Filen kunde inte läsas som JSON.' };
  }
  const state = parsed?.state ?? parsed;
  if (!state || !Array.isArray(state.budgets)) {
    return { ok: false, error: 'Filen innehåller ingen giltig Min Plånbok-data.' };
  }
  return { ok: true, state };
}
