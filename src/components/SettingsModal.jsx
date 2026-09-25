import { useRef, useState } from 'react';
import { exportState, parseImportFile } from '../utils/backup';
import {
  notificationsSupported, notificationPermission, requestNotificationPermission,
} from '../utils/notify';

const THEME_OPTIONS = [
  { key: 'system', label: 'Auto' },
  { key: 'light', label: 'Ljust' },
  { key: 'dark', label: 'Mörkt' },
];

const NOTIF_LABELS = {
  granted: 'Notiser är på',
  denied: 'Notiser är blockerade i webbläsaren',
  default: 'Notiser är avstängda',
  unsupported: 'Notiser stöds inte i den här webbläsaren',
};

export default function SettingsModal({
  state, setState, theme, setTheme, onClose,
}) {
  const fileInputRef = useRef(null);
  const [importMsg, setImportMsg] = useState(null);
  const [notifStatus, setNotifStatus] = useState(notificationPermission());

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = parseImportFile(String(reader.result));
      if (!result.ok) {
        setImportMsg({ ok: false, text: result.error });
        return;
      }
      const count = result.state.budgets.length;
      const confirmed = window.confirm(
        `Importera ${count} budget${count === 1 ? '' : 'ar'}? Detta ersätter all data som just nu finns sparad i appen.`,
      );
      if (!confirmed) return;
      setState(result.state);
      setImportMsg({ ok: true, text: 'Data importerad!' });
    };
    reader.readAsText(file);
  };

  const requestNotifs = async () => {
    const result = await requestNotificationPermission();
    setNotifStatus(result);
  };

  return (
    <div className="mp-modal-overlay">
      <div className="mp-modal">
        <button type="button" className="mp-modal-close" onClick={onClose} aria-label="Stäng">✕</button>
        <h2>Inställningar</h2>

        <section className="mp-settings-section">
          <h3 className="mp-settings-heading">Utseende</h3>
          <div className="mp-toggle-row" role="radiogroup" aria-label="Tema">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={theme === opt.key}
                className={`mp-toggle-btn ${theme === opt.key ? 'active' : ''}`}
                onClick={() => setTheme(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mp-settings-section">
          <h3 className="mp-settings-heading">Notiser</h3>
          <p className="mp-hint">
            Visas när du närmar dig eller går över en budgetgräns, medan appen är öppen eller körs i bakgrunden.
            Fungerar inte om appen är helt stängd.
          </p>
          <p className="mp-hint">{NOTIF_LABELS[notifStatus] || NOTIF_LABELS.default}</p>
          {notificationsSupported() && notifStatus !== 'granted' && notifStatus !== 'denied' && (
            <button type="button" className="mp-ghost-btn" onClick={requestNotifs}>Tillåt notiser</button>
          )}
        </section>

        <section className="mp-settings-section">
          <h3 className="mp-settings-heading">Data</h3>
          <p className="mp-hint">
            Allt sparas bara lokalt i den här webbläsaren. Exportera en säkerhetskopia, eller flytta din
            data till en annan enhet genom att exportera här och importera filen där.
          </p>
          <button type="button" className="mp-ghost-btn" onClick={() => exportState(state)}>
            Exportera data
          </button>
          <button type="button" className="mp-ghost-btn" onClick={() => fileInputRef.current?.click()}>
            Importera data
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
          {importMsg && (
            <p className={importMsg.ok ? 'mp-hint' : 'mp-negative'}>{importMsg.text}</p>
          )}
        </section>
      </div>
    </div>
  );
}
