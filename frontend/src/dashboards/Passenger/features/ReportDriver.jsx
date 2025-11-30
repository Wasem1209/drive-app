import { useState, useEffect, useRef } from 'react';
import '../../../styles/verify-modal.css';
import { submitDriverReport } from '../../../api/reports';

const CATEGORIES = [
  'Dangerous Driving',
  'Illegal Vehicle Operation',
  'Unsafe Vehicle Condition',
  'Harassment / Abuse',
  'Other'
];

export default function ReportDriver({ onClose, prefillWallet }) {
  const [driverWallet, setDriverWallet] = useState(prefillWallet || '');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [category, setCategory] = useState('Dangerous Driving');
  const [details, setDetails] = useState('');
  const [photoData, setPhotoData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

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

  useEffect(() => {
    // Attempt geolocation capture
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => { /* ignore errors */ },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [location]);

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const w = videoRef.current.videoWidth || 640;
    const h = videoRef.current.videoHeight || 360;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setPhotoData(dataUrl);
    setCameraOn(false);
  };

  const handleSubmit = async () => {
    if (!driverWallet.trim() && !vehiclePlate.trim()) {
      setError('Provide driver wallet or vehicle plate.');
      return;
    }
    setLoading(true); setError('');
    try {
      const payload = {
        driverWallet: driverWallet.trim() || null,
        vehiclePlate: vehiclePlate.trim() || null,
        category,
        details: details.trim(),
        photo: photoData,
        location,
        timestamp: Date.now()
      };
      const res = await submitDriverReport(payload);
      setSubmitted(res);
    } catch (e) {
      setError(e?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 350 }}>
      <div className="verify-modal" style={{ width: '92%', maxWidth: 420, maxHeight: '100%', background: '#0f172a', color: '#fff', padding: '60px 22px 72px', borderRadius: 20, boxShadow: '0 12px 32px rgba(0,0,0,0.55)', position: 'relative', overflowY: 'auto', margin: '0 12px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 60, right: 12, background: 'transparent', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
        <h3 style={{ margin: '0 0 16px', fontSize: 20 }}>Report Driver</h3>

        {!submitted && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              value={driverWallet}
              onChange={(e) => setDriverWallet(e.target.value)}
              placeholder="Driver Wallet ID (optional if plate given)"
              style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}
            />
            <input
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              placeholder="Vehicle Plate (optional if wallet given)"
              style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what happened (context, time, behavior)"
              rows={4}
              style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: 14 }}
            />

            {/* Evidence section */}
            <div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
              <strong style={{ fontSize: 13 }}>Evidence (Optional)</strong>
              {!photoData && !cameraOn && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={() => setCameraOn(true)}
                    style={{ width: '100%', background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}
                  >
                    Capture Photo
                  </button>
                  <label style={{ width: '100%' }}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = () => setPhotoData(reader.result);
                        reader.readAsDataURL(f);
                      }}
                    />
                    <span style={{ display: 'block', textAlign: 'center', background: '#334155', padding: '10px 14px', borderRadius: 10, fontSize: 13, cursor: 'pointer', width: '300px' }}>Upload Image</span>
                  </label>
                </div>
              )}
              {cameraOn && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <video ref={videoRef} playsInline muted style={{ width: '100%', borderRadius: 10, background: '#0f172a', aspectRatio: '16/9', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={capturePhoto} style={{ flex: 1, background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>Snap</button>
                    <button onClick={() => setCameraOn(false)} style={{ flex: 1, background: '#334155', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                  </div>
                </div>
              )}
              {photoData && (
                <div style={{ position: 'relative' }}>
                  <img src={photoData} alt="Evidence" style={{ width: '100%', borderRadius: 10, display: 'block' }} />
                  <button
                    onClick={() => setPhotoData(null)}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', lineHeight: '30px', textAlign: 'center', fontSize: 16 }}
                  >×</button>
                </div>
              )}
            </div>

            {/* Location preview */}
            <div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: 12 }}>
              <strong style={{ fontSize: 13 }}>Location</strong>
              <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>
                {location ? `Lat ${location.lat.toFixed(5)}, Lng ${location.lng.toFixed(5)}` : 'Capturing… (optional)'}
              </div>
            </div>

            {error && <div style={{ fontSize: 13, color: '#f87171' }}>{error}</div>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}
            >
              {loading ? 'Submitting…' : 'Submit Report'}
            </button>
            <div style={{ fontSize: 11, opacity: 0.55, lineHeight: '16px', paddingBottom: 8 }}>
              Reports are routed to enforcement officers instantly for review. Data will be hashed on-chain for integrity in a later phase.
            </div>
          </div>
        )}

        {submitted && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#1e293b', padding: '12px 14px', borderRadius: 12 }}>
              <strong style={{ fontSize: 15 }}>Report Submitted</strong>
              <div style={{ fontSize: 12, marginTop: 6 }}>Reference ID: {submitted.referenceId}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Timestamp: {new Date(submitted.timestamp).toLocaleString()}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Category: {submitted.category}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Driver Wallet: {submitted.driverWallet || '—'}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Vehicle Plate: {submitted.vehiclePlate || '—'}</div>
              {submitted.location && (
                <div style={{ fontSize: 11, opacity: 0.7 }}>Location: {submitted.location.lat.toFixed(4)}, {submitted.location.lng.toFixed(4)}</div>
              )}
            </div>
            <button
              onClick={onClose}
              style={{ background: '#334155', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}
            >
              Close
            </button>
            <div style={{ fontSize: 11, opacity: 0.55, paddingBottom: 8 }}>Enforcement officers can act based on validated patterns of reports.</div>
          </div>
        )}
      </div>
    </div>
  );
}
