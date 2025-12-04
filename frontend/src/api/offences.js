// Mock offences/fines API for officers
// Replace with backend REST when available

const STORAGE_KEY = 'officer.fines';

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

export async function issueFine({ plate, driverWallet, violation, amount, notes, photoBase64, officerId }) {
  // simulate network delay
  await new Promise(r => setTimeout(r, 600));
  const id = `fine-${Date.now().toString(36)}`;
  const item = {
    id,
    plate: plate || null,
    driverWallet: driverWallet || null,
    violation,
    amount,
    notes: notes || '',
    photoBase64: photoBase64 || null,
    officerId: officerId || 'off-mock-001',
    timestamp: Date.now()
  };
  const all = loadAll();
  all.push(item);
  saveAll(all);
  return { ticketId: id };
}

export async function listFinesByPlate(plate) {
  await new Promise(r => setTimeout(r, 300));
  const all = loadAll();
  const normalized = (plate || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return all.filter(f => (f.plate || '').toUpperCase().replace(/[^A-Z0-9]/g, '') === normalized)
            .sort((a,b) => b.timestamp - a.timestamp);
}

export async function listRecentFines(limit = 5) {
  await new Promise(r => setTimeout(r, 250));
  const all = loadAll();
  const sorted = all.sort((a,b) => b.timestamp - a.timestamp);
  return sorted.slice(0, limit);
}
