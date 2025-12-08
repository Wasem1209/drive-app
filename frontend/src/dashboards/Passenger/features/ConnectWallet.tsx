import '../../../styles/passangerdashboard.css'
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { detectWallets, enableWallet, getUsedAddresses, shorten } from '../../../blockchain/cardanoWallet';
import { hexToBech32, parseBalance } from '../../../utils/cardano';

interface ConnectedWallet {
	key: string;
	label: string;
	api: any; // Replace with precise CIP-30 type later
	address: string;
	balance?: string;
}

interface Props {
	onConnected?: (wallet: ConnectedWallet) => void;
}

export default function ConnectWallet({ onConnected }: Props) {
	const [available, setAvailable] = useState<Array<{ key: string; label: string }>>([]);
	const [availableProviders, setAvailableProviders] = useState<string[]>([]);
	const [connecting, setConnecting] = useState(false);
	const [connectingProvider, setConnectingProvider] = useState('');
	const [error, setError] = useState('');
	const [walletConnected, setWalletConnected] = useState(false);
	const [connected, setConnected] = useState<ConnectedWallet | null>(null);
	const [chooserOpen, setChooserOpen] = useState(false);
	const [walletModalOpen, setWalletModalOpen] = useState(false);
	const [availableInfo, setAvailableInfo] = useState<Array<any>>([]);
	const [connectionNotice, setConnectionNotice] = useState('');
	const [balance, setBalance] = useState('0.00');

	const discoverProviders = () => {
		try {
			const keys = (window as any).cardano ? Object.keys((window as any).cardano) : [];
			const found = keys.filter(Boolean);
			setAvailableProviders(found);
			// build some metadata for quick label display
			const meta = (found || []).map((k: string) => ({ key: k, label: k[0].toUpperCase() + k.slice(1) }));
			setAvailable(meta);
			if (!found.length) {
				setConnectionNotice('No wallet extensions detected. Please install Nami, Lace, Eternl, or Flint.');
			} else {
				setConnectionNotice('');
			}
		} catch (e) {
			setAvailableProviders([]);
			setConnectionNotice('Unable to detect wallet extensions. Check browser extensions or try a different browser.');
		}
	};

<<<<<<< HEAD
	const renderChooser = () => (
		<div style={{
				position: 'absolute',
				top: '100%',
				left: 0,
				marginTop: 8,
				background: '#0f172a',
				padding: '10px 12px',
				borderRadius: 12,
				width: 100,
				boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
				zIndex: 20 
			}}>
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
				<div style={{ color: '#fff', fontSize: 12 }}>
					No Cardano wallet detected.<br /> Install Nami / Eternl / Lace.
				</div>
			)}
		</div>
=======
	const enableWithTimeout = async (wallet: any, timeoutMs = 8000) => {
		return new Promise(async (resolve, reject) => {
			let settled = false;
			const timer = setTimeout(() => {
				if (!settled) {
					settled = true;
					reject(new Error('timeout'));
				}
			}, timeoutMs);

			try {
				const api = await wallet.enable();
				if (!settled) {
					settled = true;
					clearTimeout(timer);
					resolve(api);
				}
			} catch (e) {
				if (!settled) {
					settled = true;
					clearTimeout(timer);
					reject(e);
				}
			}
		});
	};

	const enableProvider = async (provider: string) => {
		try {
			setConnectionNotice('');
			if (typeof window === 'undefined' || !(window as any).cardano || !(window as any).cardano[provider])
				throw new Error('provider not available');

			const wallet = (window as any).cardano[provider];

			// Try detect previous enable state
			let wasEnabled = false;
			try {
				if (typeof wallet.isEnabled === 'function') {
					wasEnabled = await wallet.isEnabled();
				} else if (typeof wallet.isEnabled !== 'undefined') {
					wasEnabled = Boolean(wallet.isEnabled);
				}
			} catch (e) {
				/* ignore */
			}

			if (wasEnabled) {
				let disabled = false;
				try {
					if (typeof wallet.disable === 'function') {
						await wallet.disable();
						disabled = true;
					} else if (typeof wallet.disconnect === 'function') {
						await wallet.disconnect();
						disabled = true;
					} else if (wallet.experimental && typeof wallet.experimental.disconnect === 'function') {
						await wallet.experimental.disconnect();
						disabled = true;
					}
				} catch (e) {
					// ignore any errors while trying to disable
				}

				if (!disabled) {
					setConnectionNotice('It appears you previously granted this site access. To force the wallet to prompt again, open the wallet extension and revoke site permission for this site, then try connecting.');
				}
			}

			let api: any;
			try {
				api = await enableWithTimeout(wallet, 8000);
			} catch (e: any) {
				if (e && e.message === 'timeout') {
					setConnectionNotice('The wallet extension did not respond. Make sure the extension is enabled, site permissions are granted, or try reinstalling the extension.');
					return;
				}
				throw e;
			}

			// extract a bech32 address (try used -> change -> reward)
			let addr = '';
			try {
				const used = api.getUsedAddresses ? await api.getUsedAddresses() : [];
				if (used && used.length) addr = used[0].startsWith('addr') ? used[0] : hexToBech32(used[0]);
			} catch (e) {}
			try {
				if (!addr && api.getChangeAddress) {
					const change = await api.getChangeAddress();
					if (change) addr = change.startsWith('addr') ? change : hexToBech32(change);
				}
			} catch (e) {}
			try {
				if (!addr && api.getRewardAddresses) {
					const r = await api.getRewardAddresses();
					if (r && r.length) addr = r[0].startsWith('addr') ? r[0] : hexToBech32(r[0]);
				}
			} catch (e) {}
			if (!addr) addr = 'addr_test1qpxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

			setConnected({ key: provider, label: provider[0].toUpperCase() + provider.slice(1), api, address: addr });
			setWalletConnected(true);

			let finalBalance = '10000.00';
			try {
				if (api.getBalance) {
					const b = await api.getBalance();
					const parsed = parseBalance(b);
					try {
						const lov = BigInt(parsed);
						const whole = lov / BigInt(1000000);
						const frac = lov % BigInt(1000000);
						let fracStr = frac.toString().padStart(6, '0');
						fracStr = fracStr.replace(/0+$/, '');
						if (fracStr.length < 2) fracStr = frac.toString().padStart(2, '0');
						finalBalance = fracStr === '' ? whole.toString() : `${whole.toString()}.${fracStr}`;
					} catch (e) {
						finalBalance = parsed;
					}
				}
			} catch (e) {
				finalBalance = '10000.00';
			}
			setBalance(finalBalance);

			setWalletModalOpen(false);
			onConnected?.({ key: provider, label: provider, api, address: addr, balance: finalBalance });
            
			window.dispatchEvent(new CustomEvent('cardano:walletConnected', { detail: { key: provider, address: addr } }));
		} catch (e: any) {
			setError((e && e.message) || 'Failed to enable provider.');
		} finally {
			setConnecting(false);
			setConnectingProvider('');
		}
	};

	const connectToProvider = async (provider: string) => {
		try {
			setConnecting(true);
			setConnectingProvider(provider);
			setError('');
			setConnectionNotice('');
			await enableProvider(provider);
		} catch (e: any) {
			setError(e && e.message ? e.message : 'Failed to connect to provider.');
		} finally {
			setConnecting(false);
			setConnectingProvider('');
		}
	};

	const disconnectWallet = () => {
		if (connected?.api && typeof connected.api.disable === 'function') {
			try { connected.api.disable(); } catch { }
		}
		setConnected(null);
		setWalletConnected(false);
		setBalance('0.00');
		// inform parent to reset display
		onConnected?.({ key: '', label: '', api: null, address: '', balance: '0.00' });
	};

	const modalOverlay = {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		background: 'rgba(0,0,0,0.5)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 999,
	} as const;
	const modalBox = {
		width: '92%',
		maxWidth: 420,
		background: '#0f172a',
		color: '#fff',
		padding: '22px',
		borderRadius: 12,
	} as const;
	const modalBtn = {
		background: 'linear-gradient(90deg,#2563eb,#3b82f6)',
		border: 'none',
		color: '#fff',
		padding: '10px 12px',
		borderRadius: 10,
		cursor: 'pointer',
		width: '100%',
		marginBottom: 8,
	} as const;
	const modalBtnRed = {
		background: 'linear-gradient(90deg,#ef4444,#dc2626)',
		border: 'none',
		color: '#fff',
		padding: '10px 12px',
		borderRadius: 10,
		cursor: 'pointer',
		width: '100%',
		marginBottom: 8,
	} as const;
	const modalCancel = {
		background: 'transparent',
		border: '1px solid #334155',
		color: '#fff',
		padding: '10px 12px',
		borderRadius: 10,
		cursor: 'pointer',
		width: '100%',
	} as const;

	const renderModal = () => createPortal(
		<div style={modalOverlay}>
			<div style={modalBox}>
				{!walletConnected ? (
					<>
						<h2 style={{ marginBottom: 10 }}>{walletConnected ? 'Wallet Connected' : 'Connect Wallet'}</h2>
						<p style={{ marginBottom: 8 }}>Choose a wallet to connect (click will trigger the extension prompt)</p>

						<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
							{availableProviders.length === 0 ? (
								<div style={{ fontSize: 13, opacity: 0.9 }}>No wallet extensions detected. Install Nami, Lace, Eternl, or Flint.</div>
							) : (
								availableProviders.map((p) => (
									<button
										key={p}
										style={modalBtn}
										onClick={() => connectToProvider(p)}
										disabled={Boolean(connectingProvider) && connectingProvider !== p}
									>
										{connectingProvider === p ? 'Connecting...' : `Connect ${p[0].toUpperCase() + p.slice(1)}`}
									</button>
								))
							)}
						</div>

						<div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>
							{connectionNotice && <div style={{ marginTop: 8, color: '#f59e0b' }}>{connectionNotice}</div>}
							{error && <div style={{ marginTop: 8, color: '#ef4444' }}>{error}</div>}
						</div>

						<div style={{ marginTop: 12 }}>
							<button style={modalCancel} onClick={() => setWalletModalOpen(false)}>Cancel</button>
						</div>
					</>
				) : (
					<>
						<p style={{ marginBottom: 20 }}>Connected as <br /><b>{connected?.address ? `${connected.address.slice(0, 12)}...${connected.address.slice(-6)}` : ''}</b></p>
						<button style={modalBtnRed} onClick={disconnectWallet}>Disconnect Wallet</button>
						<button style={modalCancel} onClick={() => setWalletModalOpen(false)}>Close</button>
					</>
				)}
			</div>
		</div>,
		document.body
>>>>>>> 993b6db23f45bad76087871123ed694352753687
	);

	useEffect(() => {
		// keep a light initial detect so the button can show known wallets
		setAvailable(detectWallets());
	}, []);

	return (
		<div className="cw-wrapper">
			<button
				className="connect-wallet-btn"
				onClick={() => { discoverProviders(); setWalletModalOpen(v => !v); }}
			>
				{walletConnected ? 'Wallet Connected ✔' : (connecting ? 'Connecting...' : 'Connect Wallet')}
			</button>
			{walletConnected && connected && (
				<div className="cw-connected" style={{ marginTop: 8 }}>
					<span className="label">{connected.label}</span>
					<span className="cw-address-badge">{connected.address ? `${connected.address.slice(0,12)}...${connected.address.slice(-6)}` : ''}</span>
				</div>
			)}
			{walletModalOpen && renderModal()}
		</div>
	);
}

