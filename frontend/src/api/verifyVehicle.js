// Mock vehicle verification API
// In production, replace with real backend call and on-chain reads.

export async function verifyVehicle(plateOrId) {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 700));

  // Basic normalization
  const key = plateOrId.trim().toUpperCase();

  // Mock datasource
  const mockDB = {
    'ABC123': {
      vehicleId: 'veh-0xabc123',
      plate: 'ABC123',
      ownerWallet: 'addr_test1qxyz...123',
      roadworthiness: { status: 'Valid', expires: '2026-04-12' },
      insurance: { status: 'Valid', expires: '2026-02-01' },
      tax: { status: 'Paid', nextDue: '2026-01-10' },
      driver: {
        name: 'Emeka Dominic',
        rating: 4.7,
        reviews: [
          { id: 1, by: 'Passenger A', text: 'Very safe and courteous.' },
          { id: 2, by: 'Passenger B', text: 'Drives smoothly, clean vehicle.' }
        ],
        weeklySafeScore: 92,
        violationsThisYear: 1,
        lastViolation: { type: 'Speeding', date: '2025-07-22', cleared: true }
      },
      compliance: {
        outstandingFines: 0,
        lastScan: new Date().toISOString(),
      }
    },
    'XYZ987': {
      vehicleId: 'veh-0xdeadbeef',
      plate: 'XYZ987',
      ownerWallet: 'addr_test1qabc...987',
      roadworthiness: { status: 'Expired', expires: '2025-10-01' },
      insurance: { status: 'Valid', expires: '2026-06-30' },
      tax: { status: 'Due Soon', nextDue: '2025-12-15' },
      driver: {
        name: 'Kola Ade',
        rating: 3.9,
        reviews: [
          { id: 1, by: 'Passenger C', text: 'Drives okay but sometimes late.' }
        ],
        weeklySafeScore: 76,
        violationsThisYear: 3,
        lastViolation: { type: 'Illegal Parking', date: '2025-11-05', cleared: false }
      },
      compliance: {
        outstandingFines: 2,
        lastScan: new Date().toISOString(),
      }
    }
  };

  if (!mockDB[key]) {
    return { found: false, query: key };
  }

  return { found: true, data: mockDB[key] };
}
