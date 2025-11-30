// Mock transactions API for passenger payment history
// Replace with real REST calls (e.g. GET /payments/history) when backend is ready.

const STORAGE_KEY = 'passenger.transactions';

function seedIfEmpty() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return;
    const seed = [
      {
        id: 'tx-seed-001',
        driverWallet: 'DRV12345',
        route: 'Ojota-CMS',
        amountAda: 2.2,
        split: { driver: 94, gov: 6 },
        txHash: '0xseedabc123',
        timestamp: Date.now() - 1000 * 60 * 60 * 5,
      },
      {
        id: 'tx-seed-002',
        driverWallet: 'DRV77799',
        route: 'Ikeja-Yaba',
        amountAda: 1.8,
        split: { driver: 93, gov: 7 },
        txHash: '0xseeddef456',
        timestamp: Date.now() - 1000 * 60 * 60 * 26,
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch {}
}

export function listPassengerTransactions() {
  seedIfEmpty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

export function addPassengerTransaction(tx) {
  try {
    const existing = listPassengerTransactions();
    existing.push(tx);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {}
}

export function clearPassengerTransactions() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
