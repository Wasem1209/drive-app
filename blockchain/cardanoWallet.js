// Minimal Cardano wallet bootstrap utilities.
// This file is a starting point for the blockchain engineer.
// It detects installed CIP-30 Cardano wallets (e.g. Nami, Eternl, Lace) and enables one.
// Extend with transaction building, signing, submitting as needed.

const KNOWN_WALLETS = [
  { key: 'nami', label: 'Nami' },
  { key: 'eternl', label: 'Eternl' },
  { key: 'lace', label: 'Lace' },
  { key: 'gero', label: 'Gero' },
];

export function detectWallets() {
  const cardano = window.cardano || {};
  return KNOWN_WALLETS.map(w => ({
    key: w.key,
    label: w.label,
    isAvailable: !!cardano[w.key],
    icon: cardano[w.key]?.icon || null,
    version: cardano[w.key]?.apiVersion || null,
  })).filter(w => w.isAvailable);
}

export async function enableWallet(key) {
  const wallet = window.cardano?.[key];
  if (!wallet) throw new Error(`Wallet ${key} not found in window.cardano`);
  const api = await wallet.enable();
  // Dispatch a global event so other parts of the app can react.
  window.dispatchEvent(new CustomEvent('cardano:walletEnabled', { detail: { key, api } }));
  return api;
}

export async function getUsedAddresses(api) {
  try {
    const raw = await api.getUsedAddresses();
    return raw.map(a => a); // blockchain engineer: decode bech32 here if needed.
  } catch (e) {
    return [];
  }
}

export async function getBalance(api) {
  try {
    return await api.getBalance(); // Returns CBOR hex string. Needs parsing.
  } catch (e) {
    return null;
  }
}

// Placeholders for blockchain dev to flesh out later:
export async function buildUnsignedTx(/* params */) {
  throw new Error('buildUnsignedTx not implemented yet');
}

export async function signTx(api, unsignedTxHex) {
  return api.signTx(unsignedTxHex, true); // partialSign=true
}

export async function submitTx(api, signedTxHex) {
  return api.submitTx(signedTxHex);
}

// Helper to shorten long hex/bech32 strings for UI.
export function shorten(str, head = 8, tail = 6) {
  if (!str) return '';
  if (str.length <= head + tail + 3) return str;
  return `${str.slice(0, head)}...${str.slice(-tail)}`;
}

// High-level convenience: enable first available wallet.
export async function autoConnectFirst() {
  const wallets = detectWallets();
  if (!wallets.length) throw new Error('No Cardano wallet detected');
  const api = await enableWallet(wallets[0].key);
  return { api, wallet: wallets[0] };
}
