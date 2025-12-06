import '../../../styles/passangerdashboard.css'
import React, { useEffect, useState } from 'react';
import { detectWallets, enableWallet, getUsedAddresses, shorten } from '../../../blockchain/cardanoWallet';

interface ConnectedWallet {
	key: string;
	label: string;
	api: any; // Replace with precise CIP-30 type later
	address: string;
}

interface Props {
	onConnected?: (wallet: ConnectedWallet) => void;
}

export default function ConnectWallet({ onConnected }: Props) {
	const [available, setAvailable] = useState<Array<{ key: string; label: string; icon: string | null; version: string | null }>>([]);
	const [connecting, setConnecting] = useState(false);
	const [error, setError] = useState('');
	const [connected, setConnected] = useState<ConnectedWallet | null>(null);
	const [chooserOpen, setChooserOpen] = useState(false);

	useEffect(() => {
		setAvailable(detectWallets());
	}, []);

	const attemptConnect = async (key: string) => {
		setError('');
		setConnecting(true);
		try {
			const api = await enableWallet(key);
			const addresses = await getUsedAddresses(api);
			const address = addresses[0] || '';
			const walletMeta = available.find(w => w.key === key);
			const conn: ConnectedWallet = { key, label: walletMeta?.label || key, api, address };
			setConnected(conn);
			setChooserOpen(false);
			onConnected?.(conn);
			window.dispatchEvent(new CustomEvent('cardano:walletConnected', { detail: conn }));
		} catch (e: any) {
			setError(e.message || String(e));
		} finally {
			setConnecting(false);
		}
	};

	const renderChooser = () => (
		<div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, background: '#0f172a', padding: '10px 12px', borderRadius: 12, width: 220, boxShadow: '0 6px 16px rgba(0,0,0,0.35)', zIndex: 20 }}>
			<p style={{ color: '#fff', fontSize: 12, margin: '0 0 8px' }}>Select Cardano Wallet</p>
			{available.map(w => (
				<button
					key={w.key}
					disabled={connecting}
					onClick={
						() => attemptConnect(w.key)
					}
					style={{
						display: 'flex',
						width: '100%',
						alignItems: 'center',
						gap: 8,
						background: '#1e293b',
						color: '#fff',
						border: '1px solid #334155',
						borderRadius: 8,
						padding: '6px 8px',
						marginBottom: 6,
						cursor: 'pointer'
					}}>
						{w.icon && <img src={w.icon} alt={w.label} style={{ width: 20, height: 20 }} />}
						<span style={{ flex: 1, textAlign: 'left', fontSize: 12 }}>{w.label}</span>
						<span style={{ fontSize: 10, opacity: 0.6 }}>{w.version || ''}</span>
				</button>
			))}
			{!available.length && (
				<div style={{ color: '#fff', fontSize: 12, maxWidth: '200px' }}>
					No Cardano wallet detected.<br /> Install Nami / Eternl / Lace.
				</div>
			)}
		</div>
	);

	return (
		<div style={{ position: 'relative' }}>
			{!connected && (
				<button
					className="connect-wallet-btn"
					disabled={connecting}
					onClick={() => setChooserOpen(v => !v)}
					style={{
							position: 'relative',
							background: '#FFF3B0',
							border: 'none',
							padding: '10px 20px',
							borderRadius: '6px',
							cursor: 'pointer',

					}}
				>
					{connecting ? 'Connecting...' : 'Connect Wallet'}
				</button>
			)}
			{connected && (
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
					<span style={{ fontSize: 12, color: '#94a3b8' }}>Wallet Connected</span>
					<span style={{ fontSize: 14, fontWeight: 600 }}>{connected.label}</span>
					<span style={{ fontSize: 12, background: '#1e293b', color: '#fff', padding: '4px 8px', borderRadius: 8 }}>{shorten(connected.address)}</span>
				</div>
			)}
			{chooserOpen && !connected && renderChooser()}
			{error && (
				<div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, color: '#ef4444', fontSize: 11 }}>{error}</div>
			)}
		</div>
	);
}

