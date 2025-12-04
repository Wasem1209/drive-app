import ConnectWallet from './ConnectWallet';

export default function Profile({ onClose }) {
	return (
		<div style={{ position: 'absolute', inset: 0, paddingTop: 20, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
			<div className="verify-modal" style={{ width: '92%', maxWidth: 420, maxHeight: '100%', background: '#0f172a', color: '#fff', padding: '60px 22px 26px', borderRadius: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.5)', position: 'relative', margin: '0 12px' }}>
				<button onClick={onClose} style={{ position: 'absolute', top: 60, right: 12, background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
				<h3 style={{ margin: '0 0 16px', fontSize: 20 }}>Officer Profile</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
					<div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: 12 }}>
						<strong style={{ fontSize: 14 }}>Identity</strong>
						<div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>Officer: Mock Officer</div>
						<div style={{ fontSize: 12, opacity: 0.8 }}>Unit: Enforcement Team A</div>
						<div style={{ fontSize: 12, opacity: 0.8 }}>Badge: OFF-001</div>
					</div>
					<div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
						<strong style={{ fontSize: 14 }}>Connect Wallet</strong>
						<ConnectWallet onConnected={() => { /* could persist */ }} />
					</div>
					<div style={{ fontSize: 11, opacity: 0.6 }}>Wallet will be used to sign digital fines and future on-chain actions.</div>
				</div>
			</div>
		</div>
	);
}
