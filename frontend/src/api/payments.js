// Mocked payments API for frontend integration
// In production, these will call the backend which interacts with Cardano smart contracts

export async function initiateFarePayment({ walletId, route, amount, wallet }) {
  await delay(900);
  // simulate success
  return {
    ok: true,
    receiptId: `rcpt-${Math.random().toString(36).slice(2,8)}`,
    txHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    split: { driver: 95, gov: 5 },
    driverId: 'drv-mock-001',
    driverName: 'John Doe',
    walletId,
    route,
    amount,
    wallet,
    timestamp: Date.now(),
  };
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
