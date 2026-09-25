const TITLES = {
  nearLimit: 'Nästan i mål med budgeten 👀',
  hitLimit: 'Du är i mål med budgeten 🎯',
  overBudget: 'Lite över budget nu',
};

const BODIES = {
  nearLimit: 'du börjar närma dig taket i',
  hitLimit: 'du har nått taket i',
  overBudget: 'du har gått lite över i',
};

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission() {
  return notificationsSupported() ? Notification.permission : 'unsupported';
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return Notification.permission;
  }
}

export async function fireThresholdNotification(situation, categoryName) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  const title = TITLES[situation];
  if (!title) return;
  const options = {
    body: categoryName ? `Hej! ${BODIES[situation]} ${categoryName}.` : undefined,
    icon: '/min-planbok/icon.svg',
    tag: 'mp-threshold',
  };
  // Installed PWAs (notably Android Chrome) require notifications to be shown
  // via the service worker registration rather than the Notification() ctor.
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, options);
      return;
    } catch (e) { /* fall through to direct constructor */ }
  }
  try {
    // eslint-disable-next-line no-new
    new Notification(title, options);
  } catch (e) { /* ignore — platform blocks Notification() outside a service worker */ }
}
