import { describe, it, expect, beforeEach } from 'vitest';
import * as api from '../adminMock';

beforeEach(() => {
  // reset localStorage between tests
  localStorage.clear();
});

describe('adminMock API', () => {
  it('fetchAnalytics returns default analytics object', async () => {
    const a = await api.fetchAnalytics();
    expect(a).toHaveProperty('registeredVehicles');
    expect(a).toHaveProperty('violationsPerDay');
  });

  it('mintRewardsBackend increases reward reserve', async () => {
    const before = (await api.fetchAnalytics());
    // tokenomics default
    const tBefore = JSON.parse(localStorage.getItem('admin.tokenomics') || JSON.stringify({ rewardReserve: 1000000, weeklyBatchSize: 1000 }));
    const res = await api.mintRewardsBackend(5000);
    expect(res).toHaveProperty('rewardReserve');
    expect(res.rewardReserve).toBe(tBefore.rewardReserve + 5000);
  });

  it('logAudit and fetchAuditLogs persist and retrieve entries', async () => {
    const entry = { id: 'test-1', action: 'unit.test', ts: Date.now(), detail: { ok: true } };
    const logged = await api.logAudit(entry);
    expect(logged).toEqual(entry);
    const logs = await api.fetchAuditLogs();
    expect(Array.isArray(logs)).toBe(true);
    expect(logs[0]).toEqual(entry);
  });

  it('addOfficerBackend and updateOfficerStatus work and persist', async () => {
    const newOfficer = await api.addOfficerBackend('Test Officer');
    expect(newOfficer).toHaveProperty('id');
    expect(newOfficer.status).toBe('pending');
    const updated = await api.updateOfficerStatus(newOfficer.id, 'approved');
    expect(updated.status).toBe('approved');
    const raw = JSON.parse(localStorage.getItem('admin.officers') || '[]');
    const found = raw.find(o => o.id === newOfficer.id);
    expect(found.status).toBe('approved');
  });
});
