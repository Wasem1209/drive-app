import { useEffect, useMemo, useState } from 'react';
import PhoneFrame from "../../components/PhoneFrame";
import CarStatus from './features/CarStatus';
import FineCar from './features/FineCar';
import Profile from './features/Profile';
import { listRecentFines } from '../../api/offences';
import '../../styles/officer-dashboard.css';

export default function OfficersDashboard() {
    const [showStatus, setShowStatus] = useState(false);
    const [showFine, setShowFine] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [pendingPlate, setPendingPlate] = useState('');
    const [recentFines, setRecentFines] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const items = await listRecentFines(5);
            if (mounted) setRecentFines(items);
        })();
        return () => { mounted = false; };
    }, []);

    const summaryStats = useMemo(() => ([
        { label: 'Tickets issued', value: '18', hint: 'Mock week-to-date' },
        { label: 'Pending follow-ups', value: '4', hint: 'Awaiting driver proof' },
        { label: 'Compliance rate', value: '88%', hint: 'City-wide snapshot' }
    ]), []);

    const cards = useMemo(() => ([
        {
            title: 'Vehicle Status',
            description: 'Scan QR or plate to fetch compliance snapshot instantly.',
            icon: '🚓',
            action: () => setShowStatus(true)
        },
        {
            title: 'Issue Fine',
            description: 'Create digital ticket, attach evidence, sync to driver profile.',
            icon: '⚠️',
            action: () => setShowFine(true)
        },
        {
            title: 'Officer Profile',
            description: 'Badge identity, wallet binding, and shift notes.',
            icon: '🪪',
            action: () => setShowProfile(true)
        }
    ]), []);

    return (
        <PhoneFrame>
            <div className="officer-screen">
                <div className="officer-shell">
                    <section className="officer-hero">
                        <p className="officer-stat-label" style={{ margin: 0, opacity: 0.85 }}>FRSC Enforcement</p>
                        <h2 className="officer-hero-heading">Officer Console</h2>
                        <p className="officer-hero-sub">Verify vehicles, issue digital tickets, and keep your wallet connected for tamper-proof accountability.</p>
                        <div className="officer-stat-grid">
                            {summaryStats.map((stat) => (
                                <div key={stat.label} className="officer-stat-card">
                                    <span className="officer-stat-value">{stat.value}</span>
                                    <span className="officer-stat-label">{stat.label}</span>
                                    <span style={{ fontSize: 11, opacity: 0.55 }}>{stat.hint}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="officer-actions-grid">
                        {cards.map((card) => (
                            <button key={card.title} onClick={card.action} className="officer-action-card">
                                <span className="officer-action-icon" aria-hidden>{card.icon}</span>
                                <div className="officer-action-title">{card.title}</div>
                                <p className="officer-action-desc">{card.description}</p>
                            </button>
                        ))}
                    </section>

                    <section className="officer-recent-panel">
                        <div className="officer-recent-header">
                            <h3 className="officer-recent-title">Recent tickets</h3>
                            <button
                                onClick={() => setShowFine(true)}
                                style={{ background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: 999, fontSize: 12, cursor: 'pointer' }}
                            >
                                Issue new
                            </button>
                        </div>
                        <div className="officer-recent-list">
                            {recentFines.length === 0 && (
                                <div className="officer-empty">No tickets yet. Issue one to see it listed here.</div>
                            )}
                            {recentFines.map((fine) => (
                                <div key={fine.id} className="officer-recent-item">
                                    <strong style={{ fontSize: 13 }}>#{fine.id}</strong>
                                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                                        {fine.violation} • {fine.amount ? `${fine.amount} ADA` : 'Amount pending'}
                                    </div>
                                    <div className="officer-recent-meta">
                                        <span>{fine.plate || 'No plate logged'}</span>
                                        <span>{new Date(fine.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            {showStatus && <CarStatus onClose={() => setShowStatus(false)} onFine={(plate)=>{ setPendingPlate(plate); setShowStatus(false); setShowFine(true); }} />}
            {showFine && <FineCar onClose={() => setShowFine(false)} defaultPlate={pendingPlate} />}
            {showProfile && <Profile onClose={() => setShowProfile(false)} />}
        </PhoneFrame>
    );
}
