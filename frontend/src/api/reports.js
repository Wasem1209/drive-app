// Mocked reports API for safety reporting
export async function submitDriverReport(payload) {
  await delay(800);
  // Basic validation simulation
  if (!payload.driverWallet && !payload.vehiclePlate) {
    throw new Error('Missing driver wallet or vehicle plate');
  }
  return {
    ok: true,
    referenceId: `rpt-${Math.random().toString(36).slice(2,8)}`,
    timestamp: Date.now(),
    category: payload.category,
    driverWallet: payload.driverWallet || null,
    vehiclePlate: payload.vehiclePlate || null,
    location: payload.location || null,
  };
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }
