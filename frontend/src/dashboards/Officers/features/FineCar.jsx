import { useEffect, useRef, useState } from 'react';
import '../../../styles/verify-modal.css';
import cardanoMock from "../../../mock/cardanoMock.jsx";

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
	const [violation, setViolation] = useState('Speeding');
	const [amount, setAmount] = useState('');
	const [notes, setNotes] = useState('');
	const [photoData, setPhotoData] = useState(null);
	const [cameraOn, setCameraOn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(null);

	const videoRef = useRef(null);
	const streamRef = useRef(null);

	useEffect(() => {
		if (!cameraOn) return;
		let active = true;

		(async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: 'environment' }
				});

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

		canvas.width = w;
		canvas.height = h;

		const ctx = canvas.getContext('2d');
		ctx.drawImage(videoRef.current, 0, 0, w, h);

		setPhotoData(canvas.toDataURL('image/jpeg', 0.9));
		setCameraOn(false);
	};

	const submitFine = async () => {
		if (!plate.trim()) {
			setError("Vehicle plate is required.");
			return;
		}
		if (!Number(amount)) {
			setError("Enter a valid ADA amount.");
			return;
		}

		setError('');
		setLoading(true);

		try {
			// ------- MOCK CARDANO FINE PAYMENT --------
			const tx = await cardanoMock.payFine({
				plate,
				amount: Number(amount),
				violation,
				notes,
				photoEvidence: photoData
			});

			setSuccess({
				txId: tx.txId,
				plate,
				violation
			});

		} catch (err) {
			setError(err.message || "Payment failed.");
		} finally {
			setLoading(false);
		}
	};

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
				zIndex: 320
			}}
		>
			<div
				className="verify-modal"
				style={{
					width: '92%',
					maxWidth: 420,
					maxHeight: '100%',
					background: '#0f172a',
					color: '#fff',
					padding: '60px 22px 26px',
					borderRadius: 20,
					boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
					position: 'relative',
					overflowY: 'auto',
					margin: '0 12px'
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
						cursor: 'pointer'
					}}
				>
					×
				</button>

				<h3 style={{ margin: '0 0 16px', fontSize: 20 }}>Issue Fine</h3>

				{/* SUCCESS MODAL */}
				{success ? (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
						<div style={{
							background: '#1e293b',
							padding: '16px',
							borderRadius: 12
						}}>
							<strong style={{ fontSize: 15 }}>Fine Issued Successfully</strong>
							<div style={{ fontSize: 13, marginTop: 8 }}>
								<div><b>Plate:</b> {success.plate}</div>
								<div><b>Violation:</b> {success.violation}</div>
								<div><b>Tx ID:</b> {success.txId}</div>
							</div>
						</div>
						<button
							onClick={onClose}
							style={{
								background: 'linear-gradient(90deg,#2563eb,#3b82f6)',
								border: 'none',
								color: '#fff',
								padding: '10px 14px',
								borderRadius: 10
							}}
						>
							Done
						</button>
					</div>
				) : (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

						{/* =========================
                            CAMERA & PHOTO SECTION
                        ========================= */}
						{!photoData && !cameraOn && (
							<button
								onClick={() => setCameraOn(true)}
								style={{
									background: '#3b82f6',
									border: 'none',
									color: '#fff',
									padding: '10px 12px',
									borderRadius: 10,
									width: '100%',
									marginBottom: 10
								}}
							>
								Take Photo Evidence
							</button>
						)}

						{cameraOn && (
							<div style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 10
							}}>
								<video
									ref={videoRef}
									style={{
										width: '100%',
										borderRadius: 10,
										background: '#000'
									}}
								/>

								<button
									onClick={capturePhoto}
									style={{
										background: '#22c55e',
										border: 'none',
										color: '#fff',
										padding: '10px 12px',
										borderRadius: 10
									}}
								>
									Capture Photo
								</button>

								<button
									onClick={() => {
										setCameraOn(false);
										setPhotoData(null);
									}}
									style={{
										background: '#ef4444',
										border: 'none',
										color: '#fff',
										padding: '10px 12px',
										borderRadius: 10
									}}
								>
									Cancel Camera
								</button>
							</div>
						)}

						{photoData && !cameraOn && (
							<div style={{ marginBottom: 10 }}>
								<img
									src={photoData}
									alt="Captured Evidence"
									style={{
										width: '100%',
										borderRadius: 10,
										marginBottom: 10
									}}
								/>
								<button
									onClick={() => {
										setCameraOn(true);
										setPhotoData(null);
									}}
									style={{
										background: '#3b82f6',
										border: 'none',
										color: '#fff',
										padding: '10px 12px',
										borderRadius: 10,
										width: '100%'
									}}
								>
									Retake Photo
								</button>
							</div>
						)}

						{/* =========================
                             INPUT FIELDS
                        ========================= */}
						<input
							value={plate}
							onChange={(e) => setPlate(e.target.value)}
							placeholder="Vehicle Plate"
							style={{
								padding: '10px 12px',
								borderRadius: 10,
								border: '1px solid #334155',
								background: '#1e293b',
								color: '#fff'
							}}
						/>

						<select
							value={violation}
							onChange={(e) => setViolation(e.target.value)}
							style={{
								padding: '10px 12px',
								borderRadius: 10,
								border: '1px solid #334155',
								background: '#1e293b',
								color: '#fff'
							}}
						>
							{VIOLATIONS.map(v => (
								<option key={v} value={v}>{v}</option>
							))}
						</select>

						<input
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Amount (ADA)"
							type="number"
							style={{
								padding: '10px 12px',
								borderRadius: 10,
								border: '1px solid #334155',
								background: '#1e293b',
								color: '#fff'
							}}
						/>

						<textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="Notes (optional)"
							rows={3}
							style={{
								padding: '10px 12px',
								borderRadius: 10,
								border: '1px solid #334155',
								background: '#1e293b',
								color: '#fff'
							}}
						/>

						{error && (
							<div style={{ fontSize: 13, color: '#f87171' }}>{error}</div>
						)}

						<button
							onClick={submitFine}
							disabled={loading}
							style={{
								background: '#ef4444',
								border: 'none',
								color: '#fff',
								padding: '10px 14px',
								borderRadius: 10
							}}
						>
							{loading ? "Processing..." : "Issue Fine"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
