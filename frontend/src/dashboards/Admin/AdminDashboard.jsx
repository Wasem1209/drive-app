import React, { useEffect, useMemo, useState } from 'react';
import PhoneFrame from "../../components/PhoneFrame";
import '../../styles/driverdashboard.css';
import '../../styles/admin.css';
import * as api from '../../api/adminMock';
import { useNavigate } from 'react-router-dom';

// Minimal Admin Dashboard MVP (local/mock implementation)
export default function AdminDashboard() {
    const navigate = useNavigate();
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

    const navItems = [
        { key: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { key: 'transactions', label: 'Transactions', icon: WalletIcon },
    ];

    return (
        // <PhoneFrame>
            <div className="admin-shell">
                <div className="admin-layout">
                    <aside className="admin-nav">
                        <div className="nav-brand">
                            <div className="brand-mark">DA</div>
                            <div>
                                <div className="brand-title">Drive Admin</div>
                                <div className="brand-sub">Control Center</div>
                            </div>
                        </div>
                        <nav>
                            <ul className="nav-list">
                                {navItems.map(item => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.key} className="nav-item">
                                            <button className="nav-link" type="button">
                                                <Icon />
                                                <span>{item.label}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                        <div className="nav-foot">
                            <div className="nav-foot-title">Secure by design</div>
                            <div className="nav-foot-sub">Role-based access</div>
                        </div>
                    </aside>

                    <main className="admin-main">
                        <header className="admin-hero">
                                <div className="admin-hero-left">
                                    <button className="back-btn-admin" onClick={() => navigate(-1)} aria-label="Go back">←</button>
                                    <div>
                                        <p className="eyebrow">Admin Console</p>
                                        <h1 className="page-title">High-security control</h1>
                                        <p className="muted">Multisig approvals, officer actions, and token controls in one place.</p>
                                    </div>
                                </div>
                            <div className="hero-meta">
                                <div className="pill pill-success">Operational</div>
                                <div className="pill">Last sync {new Date().toLocaleTimeString()}</div>
                            </div>
                        </header>

                        <div className="content-grid">
                            <section className="panel">
                                <div className="panel-head">
                                    <div>
                                        <p className="eyebrow">Access</p>
                                        <h2 className="panel-title">Multi-Sig Admin Authentication</h2>
                                        <p className="muted">Onboard admins and simulate multisig approvals.</p>
                                    </div>
                                </div>
                                <div className="chip-row">
                                    {adminAddresses.map(a => (
                                        <div key={a} className="chip">{a}</div>
                                    ))}
                                </div>
                                <div className="form-row">
                                    <input placeholder='admin address' id='admin-sig-input' className="input" />
                                    <button onClick={() => { const v = document.getElementById('admin-sig-input').value; addSignature(v); }} className="btn primary">Add Signature</button>
                                    <button onClick={clearSignatures} className="btn ghost">Clear</button>
                                </div>
                                <div className="form-row align-center">
                                    <label className="muted">Threshold</label>
                                    <input type='number' min={1} max={adminAddresses.length} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="input input-sm" />
                                    <div className={`status ${authenticated ? 'success' : 'warn'}`}>{authenticated ? 'Authenticated' : 'Not authenticated'}</div>
                                    <div className="muted ml-auto">Signatures: {signatures.length}</div>
                                </div>
                            </section>

                            <section className="panel">
                                <div className="panel-head">
                                    <div>
                                        <p className="eyebrow">Pulse</p>
                                        <h2 className="panel-title">Global Transport Analytics</h2>
                                    </div>
                                </div>
                                <div className="card-grid">
                                    {analyticsCards.map(c => (
                                        <div key={c.key} className="card compact">
                                            <div className="card-meta">
                                                <span className="card-icon" aria-hidden>●</span>
                                                <span className="card-label">{c.label}</span>
                                            </div>
                                            <div className="card-value">{c.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="panel">
                                <div className="panel-head">
                                    <div>
                                        <p className="eyebrow">Team</p>
                                        <h2 className="panel-title">Officer Management</h2>
                                    </div>
                                    <div className="panel-actions">
                                        <button className="btn ghost">Export</button>
                                    </div>
                                </div>
                                <div className="form-row stack">
                                    <input id='new-officer-name' placeholder='New officer name' className="input" />
                                    <button onClick={() => { const v = document.getElementById('new-officer-name').value; if (v) { addOfficer(v); document.getElementById('new-officer-name').value = ''; } }} className="btn primary">Add Officer</button>
                                </div>
                                <div className="list">
                                    {officers.map(o => (
                                        <div key={o.id} className="list-item">
                                            <div className={`dot ${o.status}`}></div>
                                            <div className="list-content">
                                                <div className="list-title">{o.name}</div>
                                                <div className="muted">{o.id}</div>
                                            </div>
                                            <div className="badge">{o.status}</div>
                                            <div className="list-actions">
                                                <button onClick={() => approveOfficer(o.id)} className="btn success">Approve</button>
                                                <button onClick={() => suspendOfficer(o.id)} className="btn danger">Suspend</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="panel">
                                <div className="panel-head">
                                    <div>
                                        <p className="eyebrow">Economy</p>
                                        <h2 className="panel-title">Tokenomics Management</h2>
                                    </div>
                                </div>
                                <div className="summary-row">
                                    <div>
                                        <p className="muted">Reward reserve</p>
                                        <p className="summary-value">₳{tokenomics.rewardReserve}</p>
                                    </div>
                                    <div className="pill">Weekly batch {tokenomics.weeklyBatchSize}</div>
                                </div>
                                <div className="form-row stack">
                                    <input id='mint-amount' placeholder='Amount to mint' className="input" />
                                    <button onClick={() => { const v = document.getElementById('mint-amount').value; if (v) { mintRewards(Number(v)); document.getElementById('mint-amount').value = ''; } }} className="btn primary">Mint</button>
                                </div>
                                <div className="form-row">
                                    <label className="muted">Weekly batch size</label>
                                    <input type='number' value={tokenomics.weeklyBatchSize} onChange={(e) => setTokenomics((t) => ({ ...t, weeklyBatchSize: Number(e.target.value) }))} className="input input-sm" />
                                </div>
                            </section>

                            <section className="panel">
                                <div className="panel-head">
                                    <div>
                                        <p className="eyebrow">Policy</p>
                                        <h2 className="panel-title">Governance Controls</h2>
                                    </div>
                                </div>
                                <div className="card-grid split">
                                    <div className="card">
                                        <label className="muted">Roadworthiness threshold</label>
                                        <input type='number' value={governance.roadworthyThreshold} onChange={(e) => saveGovernance({ roadworthyThreshold: Number(e.target.value) })} className="input" />
                                    </div>
                                    <div className="card">
                                        <label className="muted">Base fine (₳)</label>
                                        <input type='number' value={governance.fineBase} onChange={(e) => saveGovernance({ fineBase: Number(e.target.value) })} className="input" />
                                    </div>
                                    <div className="card">
                                        <label className="muted">Tax rate (%)</label>
                                        <input type='number' value={governance.taxRatePct} onChange={(e) => saveGovernance({ taxRatePct: Number(e.target.value) })} className="input" />
                                    </div>
                                    <div className="card">
                                        <label className="muted">Safety thresholds (notes)</label>
                                        <input value={governance.safetyNotes || ''} onChange={(e) => saveGovernance({ safetyNotes: e.target.value })} placeholder='Notes' className="input" />
                                    </div>
                                </div>
                            </section>

                            <section className="panel video-panel">
                                <div className="panel-head">
                                    <div>
                                        <p className="eyebrow">Briefing</p>
                                        <h2 className="panel-title">Latest Incident Review</h2>
                                        <p className="muted">Keep primary footage visible for quick decision-making.</p>
                                    </div>
                                </div>
                                <div className="video-thumb">
                                    <div className="video-overlay">Play</div>
                                </div>
                            </section>

                            <section className="panel">
                                <div className="panel-head">
                                    <div>
                                        <p className="eyebrow">History</p>
                                        <h2 className="panel-title">Audit Log</h2>
                                    </div>
                                </div>
                                <div className="audit-list">
                                    {auditLogs.map(a => (
                                        <div className="audit-item" key={a.id}>
                                            <div className="list-title">{a.action}</div>
                                            <time>{new Date(a.ts).toLocaleString()}</time>
                                            <div className="muted">{JSON.stringify(a.detail)}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </main>
                </div>

                {confirmState && (
                    <div className="admin-modal-backdrop" role="presentation" onClick={() => setConfirmState(null)}>
                        <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc" onClick={(e) => e.stopPropagation()}>
                            <h3 id="confirm-title">{confirmState.title}</h3>
                            <div id="confirm-desc" className="muted">{confirmState.message}</div>
                            <div className="actions">
                                <button ref={confirmBtnRef} aria-label="Confirm action" onClick={async () => { await confirmState.onConfirm(); }} className="btn primary">Confirm</button>
                                <button ref={cancelBtnRef} aria-label="Cancel" onClick={() => setConfirmState(null)} className="btn ghost">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        // </PhoneFrame>
    );
}

function DashboardIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
    );
}

function WalletIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
            <path d="M16 12h4" />
            <circle cx="16" cy="12" r="1.5" />
        </svg>
    );
}
