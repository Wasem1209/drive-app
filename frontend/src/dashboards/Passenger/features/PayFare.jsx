import { useState } from 'react';
import { initiateFarePayment } from '../../../api/payments';
import { addPassengerTransaction } from '../../../api/transactions';
import { detectWallets, enableWallet, getUsedAddresses, shorten } from '../../../blockchain/cardanoWallet';
import { parseBalance } from '../../../utils/cardano';
import '../../../styles/verify-modal.css';

export default function PayFare({ onClose, onPaymentSuccess }) {
	const [step, setStep] = useState('details'); // details | confirm | success | error
	const [walletId, setWalletId] = useState('');
	const [route, setRoute] = useState('');
	const [amount, setAmount] = useState('');
	const [wallet, setWallet] = useState('cardano');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [receipt, setReceipt] = useState(null);

	const canProceed = walletId.trim() && route.trim() && Number(amount) > 0;
	const [connectedProvider, setConnectedProvider] = useState(null);
	const [connectedAddress, setConnectedAddress] = useState('');
	const [connectedBalance, setConnectedBalance] = useState('0');

	const handleNext = () => {
		// If user selected Cardano wallet, attempt to detect/connect first
		if (wallet === 'cardano') {
			setStep('confirm');
			// connection will occur when user confirms Pay, or they can connect beforehand
			return;
		}
		setStep('confirm');
	};

	const connectCardanoWallet = async () => {
		setError('');
		try {
			const wallets = detectWallets();
			if (!wallets || wallets.length === 0) throw new Error('No Cardano wallet detected.');
			const providerKey = wallets[0].key;
			const api = await enableWallet(providerKey);
			setConnectedProvider(providerKey);
			const addrs = await getUsedAddresses(api);
			const fromAddress = (addrs && addrs.length > 0) ? addrs[0] : '';
			setConnectedAddress(fromAddress);
			try {
				if (typeof api.getBalance === 'function') {
					setConnectedBalance(parseBalance(await api.getBalance()));
				}
			} catch (e) { }
		} catch (e) {
			setError(e?.message || 'Failed to connect wallet');
		}
	};

	const handlePay = async () => {
		setLoading(true); setError('');
		try {
			let res = null;
			let providerKey = null;
			let fromAddress = '';
			let balance = '0';
			if (wallet === 'cardano') {
				// Try to detect and enable a browser wallet (CIP-30). This will only work in-browser with an injected wallet.
				const wallets = detectWallets();
				if (!wallets || wallets.length === 0) throw new Error('No Cardano wallet detected. Please install Nami, Eternl, Lace, etc.');
				providerKey = wallets[0].key;
				const api = await enableWallet(providerKey);
				setConnectedProvider(providerKey);
				// attempt to read addresses and balance
				const addrs = await getUsedAddresses(api);
				fromAddress = (addrs && addrs.length > 0) ? addrs[0] : '';
				try {
					// Some wallets expose getBalance; parse it if present.
					if (typeof api.getBalance === 'function') {
						balance = parseBalance(await api.getBalance());
						setConnectedBalance(balance);
					}
				} catch (e) {
					// ignore balance parse errors
				}
				setConnectedAddress(fromAddress);
				// For MVP we pass wallet info to backend/mock which can orchestrate the on-chain send or return instructions.
				res = await initiateFarePayment({
					walletId: walletId.trim(),
					route: route.trim(),
					amount: Number(amount),
					wallet,
					fromAddress,
					provider: providerKey,
				});
			} else {
				res = await initiateFarePayment({
					walletId: walletId.trim(),
					route: route.trim(),
					amount: Number(amount),
					wallet,
				});
			}
			setReceipt(res);
			// Persist transaction to local history
			addPassengerTransaction({
				id: res.receiptId,
				driverWallet: walletId.trim(),
				route: route.trim(),
				amountAda: Number(amount),
				split: res.split,
				txHash: res.txHash,
				fromAddress,
				provider: providerKey,
				timestamp: Date.now()
			});
			setStep('success');
		} catch (e) {
			setError(e?.message || 'Payment failed.');
			setStep('error');
		} finally {
			setLoading(false);
		}
	};

	const handleReviewDriver = () => {
		const driverInfo = {
			id: receipt?.driverId || 'drv-mock-001',
			name: receipt?.driverName || 'Mock Driver',
			walletId: walletId.trim(),
		};
		onPaymentSuccess?.(driverInfo);
	};

	return (
		<div style={{ position: 'absolute', inset: 0, paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
			<div className="verify-modal" style={{ width: '92%', maxWidth: 420, maxHeight: '100%', background: '#0f172a', color: '#fff', padding: '60px 22px 26px', borderRadius: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.5)', position: 'relative', margin: '0 12px' }}>
				<button onClick={onClose} style={{ position: 'absolute', top: 10, right: 12, background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
				<h3 style={{ margin: '0 0 16px', fontSize: 20 }}>Pay Transportation Fare</h3>

				{step === 'details' && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
						<input
							value={walletId}
							onChange={(e) => setWalletId(e.target.value)}
							placeholder="Driver Wallet ID"
							style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}
						/>
						<input
							value={route}
							onChange={(e) => setRoute(e.target.value)}
							placeholder="Route (e.g., Ojota → CMS)"
							style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}
						/>
						<input
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Fare Amount (ADA)"
							type="number"
							min="0"
							style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}
						/>
						<div style={{ display: 'flex', gap: 8 }}>
							<select value={wallet} onChange={(e) => setWallet(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}>
								<option value="cardano">Cardano Wallet</option>
								<option value="mock">Mock Wallet</option>
							</select>
						</div>
						<button disabled={!canProceed} onClick={handleNext} style={{ background: canProceed ? 'linear-gradient(90deg,#2563eb,#3b82f6)' : '#334155', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: canProceed ? 'pointer' : 'not-allowed', fontSize: 14 }}>Continue</button>
					</div>
				)}

				{step === 'confirm' && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: 12 }}>
							<strong style={{ fontSize: 14 }}>Review Details</strong>
							<div style={{ fontSize: 12, marginTop: 6 }}>Driver Wallet: {walletId}</div>
							<div style={{ fontSize: 12 }}>Route: {route}</div>
							<div style={{ fontSize: 12 }}>Amount: {amount}</div>
							<div style={{ fontSize: 12 }}>Wallet: {wallet}</div>
							{wallet === 'cardano' && (
								<div style={{ marginTop: 8, fontSize: 12 }}>
									{connectedAddress ? (
										<div>Connected: {shorten(connectedAddress)}</div>
									) : (
										<div style={{ display: 'flex', gap: 8 }}>
											<button onClick={connectCardanoWallet} style={{ background: '#2563eb', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Connect Wallet</button>
											<span style={{ opacity: 0.85 }}>Not connected</span>
										</div>
									)}
								</div>
							)}
						</div>
						{error && <div style={{ fontSize: 13, color: '#f87171' }}>{error}</div>}
						<div style={{ display: 'flex', gap: 8 }}>
							<button onClick={() => setStep('details')} style={{ flex: 1, background: '#334155', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Back</button>
							<button onClick={handlePay} disabled={loading} style={{ flex: 1, background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>{loading ? 'Processing…' : 'Pay'}</button>
						</div>
						<div style={{ fontSize: 11, opacity: 0.65 }}>This will call a backend that interacts with a Cardano smart contract, splits revenue (Driver + Govt micro-tax), and returns an on-chain receipt hash.</div>
					</div>
				)}

				{step === 'success' && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: 12 }}>
							<strong style={{ fontSize: 14 }}>Payment Successful</strong>
							<div style={{ fontSize: 12, marginTop: 6 }}>Ride Receipt: {receipt?.receiptId}</div>
							<div style={{ fontSize: 12 }}>Txn Hash: {receipt?.txHash?.slice(0,12)}…</div>
							<div style={{ fontSize: 12 }}>Split: Driver {receipt?.split?.driver}% • Govt {receipt?.split?.gov}%</div>
						</div>
						<div style={{ display: 'flex', gap: 8 }}>
							<button onClick={onClose} style={{ flex: 1, background: '#334155', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Done</button>
							<button onClick={handleReviewDriver} style={{ flex: 1, background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Review Driver</button>
						</div>
					</div>
				)}

				{step === 'error' && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						<div style={{ fontSize: 13, color: '#f87171' }}>{error || 'Payment failed.'}</div>
						<button onClick={() => setStep('confirm')} style={{ background: '#334155', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Try Again</button>
					</div>
				)}
				<div style={{ marginTop: 18, fontSize: 11, opacity: 0.5, lineHeight: '16px' }}>
					Mocked for MVP. Backend will generate on-chain receipt and splits.
				</div>
			</div>
		</div>
	);
}

