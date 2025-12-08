import React, { useEffect, useMemo, useState } from 'react';
import PhoneFrame from "../../components/PhoneFrame";
import '../../styles/driverdashboard.css';
import '../../styles/admin.css';
import * as api from '../../api/adminMock';

// Minimal Admin Dashboard MVP (local/mock implementation)
export default function AdminDashboard() {
    // --- Multisig auth simulation ---
    const [adminAddresses, setAdminAddresses] = useState(['addr_admin1', 'addr_admin2', 'addr_admin3']);
    const [threshold, setThreshold] = useState(2);
    const [signatures, setSignatures] = useState([]);
    const authenticated = signatures.length >= threshold;

    // --- Analytics (mock) ---
    const [analytics, setAnalytics] = useState({
        registeredVehicles: 12458,
        violationsPerDay: 43,
        complianceHealth: 87, // percent
        revenueFromRenewals: 32540, // ADA
        rewardsExpenditure: 4200, // ADA
    });

    // --- Officers ---
    const [officers, setOfficers] = useState(() => {
        try {
            const raw = localStorage.getItem('admin.officers');
            return raw ? JSON.parse(raw) : [
                { id: 'off-001', name: 'Aminu Bello', status: 'pending' },
                { id: 'off-002', name: 'Ngozi Okafor', status: 'approved' },
                { id: 'off-003', name: 'John Doe', status: 'suspended' },
            ];
        } catch (e) { return []; }
    });

    // --- Tokenomics ---
    const [tokenomics, setTokenomics] = useState(() => {
        try { return JSON.parse(localStorage.getItem('admin.tokenomics')) || { rewardReserve: 1000000, weeklyBatchSize: 1000, rules: 'default' }; } catch { return { rewardReserve: 1000000, weeklyBatchSize: 1000, rules: 'default' }; }
    });

    // --- Governance ---
    const [governance, setGovernance] = useState(() => {
        try { return JSON.parse(localStorage.getItem('admin.governance')) || { roadworthyThreshold: 75, fineBase: 50, taxRatePct: 2.5 }; } catch { return { roadworthyThreshold: 75, fineBase: 50, taxRatePct: 2.5 }; }
    });

    // Persist officers/tokenomics/governance when changed
    useEffect(() => { try { localStorage.setItem('admin.officers', JSON.stringify(officers)); } catch {} }, [officers]);
    useEffect(() => { try { localStorage.setItem('admin.tokenomics', JSON.stringify(tokenomics)); } catch {} }, [tokenomics]);
    useEffect(() => { try { localStorage.setItem('admin.governance', JSON.stringify(governance)); } catch {} }, [governance]);

    // Audit logs
    const [auditLogs, setAuditLogs] = useState(() => {
        try { const raw = localStorage.getItem('admin.auditLogs'); return raw ? JSON.parse(raw) : []; } catch { return []; }
    });

    useEffect(() => { try { localStorage.setItem('admin.auditLogs', JSON.stringify(auditLogs)); } catch {} }, [auditLogs]);

    // Helpers
    const [confirmState, setConfirmState] = useState(null);

    const pushAudit = async (action, detail) => {
        const entry = { id: 'a-' + Math.random().toString(36).slice(2, 9), ts: Date.now(), action, detail };
        setAuditLogs(l => [entry, ...l].slice(0, 200));
        try { await api.logAudit(entry); } catch {}
    };

    const toggleOfficerStatus = async (id) => {
        const target = officers.find(o => o.id === id);
        if (!target) return;
        const nextStatus = target.status === 'approved' ? 'suspended' : 'approved';
        setConfirmState({ title: 'Confirm', message: `Change status of ${target.name} to ${nextStatus}?`, onConfirm: async () => {
            await api.updateOfficerStatus(id, nextStatus);
            setOfficers(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
            await pushAudit('officer.status_changed', { id, name: target.name, status: nextStatus });
            setConfirmState(null);
        }});
    };

    const approveOfficer = (id) => toggleOfficerStatus(id);
    const suspendOfficer = (id) => toggleOfficerStatus(id);

    const addOfficer = async (name) => {
        setConfirmState({ title: 'Confirm add', message: `Add officer named ${name}?`, onConfirm: async () => {
            const res = await api.addOfficerBackend(name);
            setOfficers(p => [res, ...p]);
            await pushAudit('officer.added', { id: res.id, name });
            setConfirmState(null);
        }});
    };

    // Multisig simulation helpers
    const addSignature = (addr) => {
        if (!adminAddresses.includes(addr)) return;
        setSignatures((s) => Array.from(new Set([...s, addr])));
    };
    const clearSignatures = () => setSignatures([]);

    // Tokenomics: minting simulation
    const mintRewards = (amount) => {
        setConfirmState({ title: 'Mint rewards', message: `Mint ₳${amount} to reward reserve?`, onConfirm: async () => {
            const next = await api.mintRewardsBackend(Number(amount));
            setTokenomics(next);
            await pushAudit('tokenomics.minted', { amount: Number(amount) });
            window.dispatchEvent(new CustomEvent('admin:tokenomics:mint', { detail: { amount: Number(amount) } }));
            setConfirmState(null);
        }});
    };

    // Governance update -> simulate storing on-chain
    const saveGovernance = (patch) => {
        setConfirmState({ title: 'Update governance', message: `Apply governance changes?`, onConfirm: async () => {
            const next = await api.updateGovernanceBackend(patch);
            setGovernance(next);
            await pushAudit('governance.updated', patch);
            window.dispatchEvent(new CustomEvent('admin:governance:update', { detail: patch }));
            setConfirmState(null);
        }});
    };

    // Small derived values for display
    const analyticsCards = useMemo(() => ([
        { key: 'registeredVehicles', label: 'Registered vehicles', value: analytics.registeredVehicles },
        { key: 'violationsPerDay', label: 'Violations / day', value: analytics.violationsPerDay },
        { key: 'complianceHealth', label: 'Compliance health', value: `${analytics.complianceHealth}%` },
        { key: 'revenueFromRenewals', label: 'Revenue (renewals)', value: `₳${analytics.revenueFromRenewals}` },
        { key: 'rewardsExpenditure', label: 'Rewards expenditure', value: `₳${analytics.rewardsExpenditure}` },
    ]), [analytics]);

    // refs for modal accessibility
    const confirmBtnRef = React.useRef(null);
    const cancelBtnRef = React.useRef(null);
    const prevActiveRef = React.useRef(null);

    // Accessibility: focus management & keyboard handling for confirm modal
    useEffect(() => {
        const onKey = (e) => {
            if (!confirmState) return;
            if (e.key === 'Escape') {
                setConfirmState(null);
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                confirmState.onConfirm && confirmState.onConfirm();
            }
            // simple focus trap between confirm and cancel
            if (e.key === 'Tab') {
                const focusables = [confirmBtnRef.current, cancelBtnRef.current].filter(Boolean);
                if (focusables.length === 0) return;
                const idx = focusables.indexOf(document.activeElement);
                if (e.shiftKey) {
                    const next = focusables[(idx - 1 + focusables.length) % focusables.length];
                    next && next.focus();
                    e.preventDefault();
                } else {
                    const next = focusables[(idx + 1) % focusables.length];
                    next && next.focus();
                    e.preventDefault();
                }
            }
        };
        if (confirmState) {
            prevActiveRef.current = document.activeElement;
            setTimeout(() => { confirmBtnRef.current && confirmBtnRef.current.focus(); }, 0);
            window.addEventListener('keydown', onKey);
        }
        return () => { window.removeEventListener('keydown', onKey); if (!confirmState && prevActiveRef.current) try { prevActiveRef.current.focus(); } catch {} };
    }, [confirmState]);

    // --- Simple UI ---
    return (
        <PhoneFrame>
            <div className="admin-shell">
                <div className="admin-hero">
                    <h2>Admin Console</h2>
                    <div className="admin-small">High-security control center </div>
                </div>

                {/* Multisig */}
                <section className="admin-panel">
                    <h3 style={{ margin: 0, fontSize: 14 }}>Multi-Sig Admin Authentication</h3>
                    <div className="admin-small">Onboard admins and simulate multisig approvals.</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                        {adminAddresses.map(a => (
                            <div key={a} className="admin-badge">{a}</div>
                        ))}
                    </div>
                    <div style={{ marginTop: 10 }} className="admin-row">
                        <input placeholder='admin address' id='admin-sig-input' className="admin-input" />
                        <button onClick={() => { const v = document.getElementById('admin-sig-input').value; addSignature(v); }} className="admin-btn">Add Signature</button>
                        <button onClick={clearSignatures} className="admin-btn-muted">Clear</button>
                    </div>
                    <div style={{ marginTop: 10 }} className="admin-row">
                        <div className="admin-small">Threshold:</div>
                        <input type='number' min={1} max={adminAddresses.length} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="admin-input" style={{ width: 80 }} />
                        <div style={{ color: authenticated ? 'var(--success)' : '#f97316', marginLeft: 8 }}>{authenticated ? 'Authenticated' : 'Not authenticated'}</div>
                        <div style={{ marginLeft: 'auto' }} className="admin-small">Signatures: {signatures.length}</div>
                    </div>
                </section>

                {/* Analytics */}
                <section>
                    <h3 style={{ marginTop: 16 }}>Global Transport Analytics</h3>
                    <div className="admin-grid">
                        {analyticsCards.map(c => (
                            <div key={c.key} className="admin-card">
                                <div className="admin-small">{c.label}</div>
                                <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>{c.value}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Officer management */}
                <section>
                    <h3 style={{ marginTop: 16 }}>Officer Management</h3>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input id='new-officer-name' placeholder='New officer name' className="admin-input" style={{ flex: 1 }} />
                        <button onClick={() => { const v = document.getElementById('new-officer-name').value; if (v) { addOfficer(v); document.getElementById('new-officer-name').value = ''; } }} className="admin-btn">Add</button>
                    </div>
                    <div className="officer-list">
                        {officers.map(o => (
                            <div key={o.id} className="officer-item">
                                <div style={{ width: 10, height: 10, borderRadius: 6, background: o.status === 'approved' ? 'var(--success)' : o.status === 'suspended' ? 'var(--danger)' : '#f59e0b' }} />
                                <div style={{ fontSize: 14, flex: 1 }}>{o.name} <div className="admin-small">{o.id}</div></div>
                                <div className="officer-actions">
                                    <button onClick={() => approveOfficer(o.id)} className="admin-btn" style={{ background: '#10b981' }}>Approve</button>
                                    <button onClick={() => suspendOfficer(o.id)} className="admin-btn" style={{ background: 'var(--danger)' }}>Suspend</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tokenomics */}
                <section>
                    <h3 style={{ marginTop: 16 }}>Tokenomics Management</h3>
                    <div className="admin-row" style={{ marginTop: 8 }}>
                        <div className="admin-small">Reward reserve:</div>
                        <div style={{ fontWeight: 700 }}>₳{tokenomics.rewardReserve}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <input id='mint-amount' placeholder='Amount to mint' className="admin-input" />
                        <button onClick={() => { const v = document.getElementById('mint-amount').value; if (v) { mintRewards(Number(v)); document.getElementById('mint-amount').value = ''; } }} className="admin-btn">Mint</button>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <label className="admin-small">Weekly batch size</label>
                        <input type='number' value={tokenomics.weeklyBatchSize} onChange={(e) => setTokenomics((t) => ({ ...t, weeklyBatchSize: Number(e.target.value) }))} className="admin-input" style={{ width: 120 }} />
                    </div>
                </section>

                {/* Governance Controls */}
                <section style={{ marginBottom: 40 }}>
                    <h3 style={{ marginTop: 16 }}>Governance Controls</h3>
                    <div className="admin-grid" style={{ marginTop: 8 }}>
                        <div className="admin-card">
                            <label className="admin-small">Roadworthiness threshold</label>
                            <input type='number' value={governance.roadworthyThreshold} onChange={(e) => saveGovernance({ roadworthyThreshold: Number(e.target.value) })} className="admin-input" />
                        </div>
                        <div className="admin-card">
                            <label className="admin-small">Base fine (₳)</label>
                            <input type='number' value={governance.fineBase} onChange={(e) => saveGovernance({ fineBase: Number(e.target.value) })} className="admin-input" />
                        </div>
                        <div className="admin-card">
                            <label className="admin-small">Tax rate (%)</label>
                            <input type='number' value={governance.taxRatePct} onChange={(e) => saveGovernance({ taxRatePct: Number(e.target.value) })} className="admin-input" />
                        </div>
                        <div className="admin-card">
                            <label className="admin-small">Safety thresholds (notes)</label>
                            <input value={governance.safetyNotes || ''} onChange={(e) => saveGovernance({ safetyNotes: e.target.value })} placeholder='Notes' className="admin-input" />
                        </div>
                    </div>

                    {/* Audit logs */}
                    <div style={{ marginTop: 14 }}>
                        <h4 style={{ margin: 0 }}>Audit Log</h4>
                        <div className="audit-list">
                            {auditLogs.map(a => (
                                <div className="audit-item" key={a.id}>
                                    <div style={{ fontWeight: 700 }}>{a.action}</div>
                                    <time>{new Date(a.ts).toLocaleString()}</time>
                                    <div style={{ opacity: 0.9, marginTop: 6 }}>{JSON.stringify(a.detail)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Confirmation modal */}
                {confirmState && (
                    <div className="admin-modal-backdrop" role="presentation" onClick={() => setConfirmState(null)}>
                        <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc" onClick={(e) => e.stopPropagation()}>
                            <h3 id="confirm-title">{confirmState.title}</h3>
                            <div id="confirm-desc" style={{ marginTop: 8 }}>{confirmState.message}</div>
                            <div className="actions">
                                <button ref={confirmBtnRef} aria-label="Confirm action" onClick={async () => { await confirmState.onConfirm(); }} className="admin-btn">Confirm</button>
                                <button ref={cancelBtnRef} aria-label="Cancel" onClick={() => setConfirmState(null)} className="admin-btn-muted">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PhoneFrame>
    );
}
