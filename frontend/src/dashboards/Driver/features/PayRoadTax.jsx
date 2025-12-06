import '../../../styles/verify-modal.css';

export default function PayRoadTax({ onClose, mode }) {
    const title = mode === 'insurance' ? 'Pay Insurance' : 'Pay Road Tax';

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                paddingTop: 20,
                background: 'rgba(0,0,0,0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 320,
            }}
        >
            <div
                className="verify-modal"
                style={{
                    width: '92%',
                    maxWidth: 420,
                    background: '#0f172a',
                    color: '#fff',
                    padding: '60px 22px 26px',
                    borderRadius: 20,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                    position: 'relative',
                    overflowY: 'auto',
                    margin: '0 12px',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 60,
                        right: 12,
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontSize: 18,
                        cursor: 'pointer',
                    }}
                >
                    ×
                </button>

                <h3 style={{ margin: '0 0 16px', fontSize: 20 }}>{title}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={{ fontSize: 13, opacity: 0.85 }}>Vehicle Plate</label>
                    <input placeholder="Enter plate number" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#0b1220', color: '#fff' }} />

                    <label style={{ fontSize: 13, opacity: 0.85 }}>Amount (ADA)</label>
                    <input placeholder="0.00" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#0b1220', color: '#fff' }} />

                    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                        <button onClick={onClose} style={{ flex: 1, background: 'transparent', border: '1px solid #334155', color: '#fff', padding: '10px 12px', borderRadius: 10 }}>Cancel</button>
                        <button style={{ flex: 1, background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 10 }}>Pay</button>
                    </div>
                </div>
            </div>
        </div>
    );
}