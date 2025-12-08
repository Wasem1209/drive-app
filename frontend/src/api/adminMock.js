// Minimal mock backend for Admin actions (client-side simulated)

function delay(ms = 400) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fetchAnalytics() {
  await delay();
  const raw = localStorage.getItem('admin.analytics');
  if (raw) return JSON.parse(raw);
  const defaultVal = {
    registeredVehicles: 12458,
    violationsPerDay: 43,
    complianceHealth: 87,
    revenueFromRenewals: 32540,
    rewardsExpenditure: 4200,
  };
  localStorage.setItem('admin.analytics', JSON.stringify(defaultVal));
  return defaultVal;
}

export async function updateOfficerStatus(id, status) {
  await delay(250);
  const raw = localStorage.getItem('admin.officers');
  const list = raw ? JSON.parse(raw) : [];
  const next = list.map(o => o.id === id ? { ...o, status } : o);
  localStorage.setItem('admin.officers', JSON.stringify(next));
  return next.find(o => o.id === id);
}

export async function addOfficerBackend(name) {
  await delay(300);
  const id = 'off-' + Math.random().toString(36).slice(2, 8);
  const raw = localStorage.getItem('admin.officers');
  const list = raw ? JSON.parse(raw) : [];
  const next = [{ id, name, status: 'pending' }, ...list];
  localStorage.setItem('admin.officers', JSON.stringify(next));
  return { id, name, status: 'pending' };
}

export async function mintRewardsBackend(amount) {
  await delay(500);
  const raw = localStorage.getItem('admin.tokenomics');
  const t = raw ? JSON.parse(raw) : { rewardReserve: 1000000, weeklyBatchSize: 1000, rules: 'default' };
  const next = { ...t, rewardReserve: (t.rewardReserve || 0) + Number(amount) };
  localStorage.setItem('admin.tokenomics', JSON.stringify(next));
  return next;
}

export async function updateGovernanceBackend(patch) {
  await delay(300);
  const raw = localStorage.getItem('admin.governance');
  const g = raw ? JSON.parse(raw) : { roadworthyThreshold: 75, fineBase: 50, taxRatePct: 2.5 };
  const next = { ...g, ...patch };
  localStorage.setItem('admin.governance', JSON.stringify(next));
  return next;
}

export async function logAudit(entry) {
  await delay(80);
  try {
    const raw = localStorage.getItem('admin.auditLogs');
    const list = raw ? JSON.parse(raw) : [];
    const next = [entry, ...list].slice(0, 200);
    localStorage.setItem('admin.auditLogs', JSON.stringify(next));
    return entry;
  } catch (e) { return null; }
}

export async function fetchAuditLogs() {
  await delay(120);
  const raw = localStorage.getItem('admin.auditLogs');
  return raw ? JSON.parse(raw) : [];
}
