import { useEffect, useRef, useState } from 'react';
import { verifyVehicle } from '../../../api/verifyVehicle';
import { submitFrameForALPR } from '../../../api/alpr';
import '../../../styles/verify-modal.css';

export default function CarStatus({ onClose, onFine }) {
	const [plate, setPlate] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [result, setResult] = useState(null);
	const [cameraOn, setCameraOn] = useState(false);
	const videoRef = useRef(null);
	const streamRef = useRef(null);

	const normalize = (t) => (t || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

	const query = async () => {
		const p = normalize(plate);
		if (!p) return;
		setLoading(true); setError(''); setResult(null);
		try {
			const res = await verifyVehicle(p);
			setResult(res);
			// eslint-disable-next-line no-unused-vars
		} catch (e) {
			setError('Lookup failed.');
		} finally {
			setLoading(false);
		}
	};

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
				// eslint-disable-next-line no-unused-vars
			} catch (e) {
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

	const captureAndScan = async () => {
		if (!videoRef.current) return;
		setLoading(true); setError('');
		try {
			const video = videoRef.current;
			const vw = video.videoWidth || 640;
			const vh = video.videoHeight || 360;
			const canvas = document.createElement('canvas');
			canvas.width = vw; canvas.height = vh;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(video, 0, 0, vw, vh);
			const dataUrl = canvas.toDataURL('image/png');
			const ocr = await submitFrameForALPR(dataUrl);
			const normalized = normalize(ocr?.plate || '');
			if (!normalized) {
				setError('Could not read plate. Try again.');
			} else {
				setPlate(normalized);
				await query();
			}
			// eslint-disable-next-line no-unused-vars
		} catch (e) {
			setError('Scan failed.');
		} finally {
			setLoading(false);
			setCameraOn(false);
		}
	};

	return (
		<div style={{ position: 'absolute', inset: 0, paddingTop: 20, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
			<div className="verify-modal" style={{ width: '92%', maxWidth: 420, maxHeight: '100%', background: '#0f172a', color: '#fff', padding: '60px 22px 26px', borderRadius: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.5)', position: 'relative', overflowY: 'auto', margin: '0 12px' }}>
				<button onClick={onClose} style={{ position: 'absolute', top: 60, right: 12, background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
				<h3 style={{ margin: '0 0 16px', fontSize: 20 }}>Vehicle Status</h3>
				<div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
					<input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Enter Plate e.g. ABC123JK" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }} />
					<button onClick={query} disabled={loading} style={{ background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>{loading ? 'Checking…' : 'Check'}</button>
					<button onClick={() => setCameraOn(true)} disabled={cameraOn} style={{ background: '#334155', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 10, cursor: cameraOn ? 'not-allowed' : 'pointer', fontSize: 14 }}>Scan</button>
				</div>
				{cameraOn && (
					<div style={{ border: '1px solid #1e293b', borderRadius: 12, padding: 12, marginBottom: 12 }}>
						<video ref={videoRef} playsInline muted style={{ width: '100%', borderRadius: 10, background: '#0f172a', aspectRatio: '16/9', objectFit: 'cover' }} />
						<div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
							<button onClick={captureAndScan} style={{ flex: 1, background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Scan Now</button>
							<button onClick={() => setCameraOn(false)} style={{ flex: 1, background: '#334155', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Cancel</button>
						</div>
					</div>
				)}
				{error && <div style={{ fontSize: 13, color: '#f87171' }}>{error}</div>}

				{result && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
						{!result.found && (
							<div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: 12 }}>
								<strong style={{ fontSize: 14 }}>Not Found</strong>
								<div style={{ fontSize: 12, opacity: 0.7 }}>No record for this vehicle: {result.query}</div>
							</div>
						)}
						{result.found && (
							<>
								<div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: 12 }}>
									<strong style={{ fontSize: 14 }}>Driver</strong>
									<div style={{ fontSize: 13, marginTop: 4 }}>{result.data.driver.name}</div>
									<div style={{ fontSize: 12, opacity: 0.75 }}>Rating: {result.data.driver.rating} ⭐</div>
								</div>
								<div style={{ display: 'grid', gap: 10 }}>
									<div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: 12 }}>
										<strong style={{ fontSize: 13 }}>Roadworthiness</strong>
										<div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{result.data.roadworthiness.status}</div>
									</div>
									<div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: 12 }}>
										<strong style={{ fontSize: 13 }}>Insurance</strong>
										<div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{result.data.insurance.status}</div>
									</div>
									<div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: 12 }}>
										<strong style={{ fontSize: 13 }}>Tax</strong>
										<div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{result.data.tax.status}</div>
									</div>
								</div>
								<button onClick={() => onFine?.(normalize(result.query || plate))} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Issue Fine</button>
							</>
						)}
					</div>
				)}
				<div style={{ marginTop: 18, fontSize: 11, opacity: 0.5, lineHeight: '16px' }}>Data mocked. Backend should supply compliance snapshot.</div>
			</div>
		</div>
	);
}