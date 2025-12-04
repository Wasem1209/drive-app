// Minimal CIP-30 wallet utilities (stub)
// Replace/extend with Lucid or full SDK as needed.

const WALLET_KEYS = [
  { key: 'nami', label: 'Nami' },
  { key: 'eternl', label: 'Eternl' },
  { key: 'lace', label: 'Lace' },
  { key: 'gero', label: 'Gero' },
];

export function detectWallets() {
  const w = typeof window !== 'undefined' ? window : undefined;
  const cardano = w && w.cardano ? w.cardano : undefined;
  if (!cardano) return [];
  const list = [];
  for (const meta of WALLET_KEYS) {
    const provider = cardano[meta.key];
    if (!provider) continue;
    list.push({
      key: meta.key,
      label: provider.name || meta.label,
      icon: provider.icon || null,
      version: provider.apiVersion || provider.version || null,
    });
  }
  return list;
}

export async function enableWallet(key) {
  const cardano = window?.cardano;
  if (!cardano || !cardano[key]) throw new Error('Wallet not found: ' + key);
  if (typeof cardano[key].enable !== 'function') throw new Error('Wallet cannot enable: ' + key);
  const api = await cardano[key].enable();
  return api;
}

export async function getUsedAddresses(api) {
  try {
    const addrs = await api.getUsedAddresses?.();
    return Array.isArray(addrs) ? addrs : [];
  } catch {
    return [];
  }
}

export function shorten(value, left = 8, right = 6) {
  if (!value || typeof value !== 'string') return '';
  if (value.length <= left + right + 3) return value;
  return `${value.slice(0, left)}...${value.slice(-right)}`;
}
