import { useEffect, useRef, useState } from 'react';
import { issueFine } from '../../../api/offences';
import '../../../styles/verify-modal.css';

const VIOLATIONS = [
	'Speeding',
	'No Insurance',
	'Roadworthiness Expired',
	'Illegal Operation',
	'Obstruction',
	'Other'
];

export default function FineCar({ onClose, defaultPlate }) {
	const [plate, setPlate] = useState(defaultPlate || '');
	const [driverWallet, setDriverWallet] = useState('');
	const [violation, setViolation] = useState('Speeding');
	const [amount, setAmount] = useState('');
	const [notes, setNotes] = useState('');
	const [photoData, setPhotoData] = useState(null);
	const [cameraOn, setCameraOn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [submitted, setSubmitted] = useState(null);

	const videoRef = useRef(null);
	const streamRef = useRef(null);

	useEffect(() => {
		if (!cameraOn) return;
		let active = true;
		(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
				if (!active) return;
				streamRef.current = stream;
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					await videoRef.current.play();
				}
			} catch {
				setError('Camera access denied.');
				setCameraOn(false);
			}
		})();
		return () => {
			active = false;
			if (streamRef.current) {
				streamRef.current.getTracks().forEach(t => t.stop());
				streamRef.current = null;
			}
		};
	}, [cameraOn]);

	const capturePhoto = () => {
		if (!videoRef.current) return;
		const canvas = document.createElement('canvas');
		const w = videoRef.current.videoWidth || 640;
		const h = videoRef.current.videoHeight || 360;
		canvas.width = w; canvas.height = h;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(videoRef.current, 0, 0, w, h);
		setPhotoData(canvas.toDataURL('image/jpeg', 0.85));
		setCameraOn(false);
	};

	const submit = async () => {
		if (!plate.trim() && !driverWallet.trim()) {
			setError('Provide plate or driver wallet.');
			return;
		}
		if (!violation) { setError('Select a violation.'); return; }
		if (!Number(amount)) { setError('Enter fine amount.'); return; }
		setLoading(true); setError('');
		try {
			const res = await issueFine({
				plate: plate.trim(),
				driverWallet: driverWallet.trim(),
				violation,
				amount: Number(amount),
				notes: notes.trim(),
				photoBase64: photoData,
				officerId: 'off-mock-001'
			});
			setSubmitted(res);
		} catch (e) {
			setError(e?.message || 'Failed to issue fine.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ position: 'absolute', inset: 0, paddingTop: 20, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 320 }}>
			<div className="verify-modal" style={{ width: '92%', maxWidth: 420, maxHeight: '100%', background: '#0f172a', color: '#fff', padding: '60px 22px 26px', borderRadius: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.5)', position: 'relative', overflowY: 'auto', margin: '0 12px' }}>
				<button onClick={onClose} style={{ position: 'absolute', top: 60, right: 12, background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
				<h3 style={{ margin: '0 0 16px', fontSize: 20 }}>Issue Fine</h3>
				{!submitted ? (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
						<input value={plate} onChange={(e)=>setPlate(e.target.value)} placeholder="Vehicle Plate (optional if wallet)" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }} />
						<input value={driverWallet} onChange={(e)=>setDriverWallet(e.target.value)} placeholder="Driver Wallet (optional if plate)" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }} />
						<select value={violation} onChange={(e)=>setViolation(e.target.value)} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}>
							{VIOLATIONS.map(v => <option key={v} value={v}>{v}</option>)}
						</select>
						<input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount (₦/ADA)" type="number" min="0" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }} />
						<textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes (optional)" rows={3} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }} />

						<div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
							<strong style={{ fontSize: 13 }}>Evidence (Optional)</strong>
							{!photoData && !cameraOn && (
								<div style={{ display: 'flex', gap: 8 }}>
									<button onClick={()=>setCameraOn(true)} style={{ flex: 1, background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>Capture</button>
									<label style={{ flex: 1 }}>
										<input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e)=>{ const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload=()=>setPhotoData(r.result); r.readAsDataURL(f); }} />
										<span style={{ display: 'block', textAlign: 'center', background: '#334155', padding: '10px 14px', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>Upload</span>
									</label>
								</div>
							)}
							{cameraOn && (
								<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
									<video ref={videoRef} playsInline muted style={{ width: '100%', borderRadius: 10, background: '#0f172a', aspectRatio: '16/9', objectFit: 'cover' }} />
									<div style={{ display: 'flex', gap: 10 }}>
										<button onClick={capturePhoto} style={{ flex: 1, background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>Snap</button>
										<button onClick={()=>setCameraOn(false)} style={{ flex: 1, background: '#334155', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
									</div>
								</div>
							)}
							{photoData && (
								<div style={{ position: 'relative' }}>
									<img src={photoData} alt="Evidence" style={{ width: '100%', borderRadius: 10, display: 'block' }} />
									<button onClick={()=>setPhotoData(null)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', lineHeight: '30px', textAlign: 'center', fontSize: 16 }}>×</button>
								</div>
							)}
						</div>

						{error && <div style={{ fontSize: 13, color: '#f87171' }}>{error}</div>}
						<button onClick={submit} disabled={loading} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>{loading ? 'Issuing…' : 'Issue Fine'}</button>
					</div>
				) : (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
						<div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: 12 }}>
							<strong style={{ fontSize: 14 }}>Fine Issued</strong>
							<div style={{ fontSize: 12, marginTop: 6 }}>Ticket ID: {submitted.ticketId}</div>
						</div>
						<button onClick={onClose} style={{ background: '#334155', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Close</button>
					</div>
				)}
				<div style={{ marginTop: 18, fontSize: 11, opacity: 0.5, lineHeight: '16px' }}>Backend should persist tickets and notify driver profile.</div>
			</div>
		</div>
	);
}
