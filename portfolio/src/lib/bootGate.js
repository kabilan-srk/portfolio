const KEY = 'boot-shown';

export function shouldShowBoot({ storage, reducedMotion }) {
  if (reducedMotion) return false;
  try {
    return storage.getItem(KEY) !== '1';
  } catch {
    return true;
  }
}

export function markBootShown(storage) {
  try {
    storage.setItem(KEY, '1');
  } catch { /* storage unavailable: boot shows once per page load */ }
}
