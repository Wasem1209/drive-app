import { useEffect, useRef, useState } from 'react';
import { verifyVehicle } from '../../../api/verifyVehicle';
import { submitFrameForALPR } from '../../../api/alpr';
import '../../../styles/verify-modal.css';

export default function VehicleVerifyModal({ onClose }) {
  const [tab, setTab] = useState('plate');
  const [plateInput, setPlateInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const autoScanRef = useRef(null);
  const [autoDetect, setAutoDetect] = useState(true);
  const [ocrRaw, setOcrRaw] = useState('');

  useEffect(() => {
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
        setError('Camera access denied. Use manual entry.');
      }
    })();
    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current = null;
      }
    };
  }, [tab]);

  useEffect(() => {
    return () => {
      if (autoScanRef.current) {
        clearInterval(autoScanRef.current);
        autoScanRef.current = null;
      }
    };
  }, []);

  const handleQuery = async (plate) => {
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await verifyVehicle(plate);
      setResult(res);
    } catch (e) {
      setError('Lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  const submitManual = (e) => {
    e.preventDefault();
    if (!plateInput.trim()) return;
    const normalized = normalizePlate(plateInput.trim());
    handleQuery(normalized);
  };

  const normalizePlate = (text) => {
    return text.toUpperCase().replace(/[^A-Z0-9]/g, '');
  };

  const captureAndOcr = async () => {
    if (!videoRef.current) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 360;
      const w = Math.min(1280, vw);
      const h = Math.min(720, vh);
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);

      const roiW = Math.floor(w * 0.72);
      const roiH = Math.floor(h * 0.22);
      const roiX = Math.floor((w - roiW) / 2);
      const roiY = Math.floor(h * 0.60);

      const tmp = document.createElement('canvas');
      const scale = Math.max(1, Math.floor(1024 / roiW));
      tmp.width = roiW * scale;
      tmp.height = roiH * scale;
      const tctx = tmp.getContext('2d');
      tctx.drawImage(canvas, roiX, roiY, roiW, roiH, 0, 0, tmp.width, tmp.height);

      const dataUrl = tmp.toDataURL('image/png');
      const alpr = await submitFrameForALPR(dataUrl);
      setOcrRaw(alpr?.rawText || '');
      const normalized = normalizePlate(alpr?.plate || '');
      if (!normalized) {
        setError('Could not read plate. Try again or use manual entry.');
        return;
      }
      await handleQuery(normalized);
    } catch (e) {
      setError('Scan failed. Ensure good lighting and plate visibility.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoDetect || tab !== 'plate' || loading) return;
    if (autoScanRef.current) { clearInterval(autoScanRef.current); autoScanRef.current = null; }
    autoScanRef.current = setInterval(async () => {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 360;
        const w = Math.min(1280, vw);
        const h = Math.min(720, vh);
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);
        const roiW = Math.floor(w * 0.72);
        const roiH = Math.floor(h * 0.22);
        const roiX = Math.floor((w - roiW) / 2);
        const roiY = Math.floor(h * 0.60);
        const tmp = document.createElement('canvas');
        const scale = Math.max(1, Math.floor(1024 / roiW));
        tmp.width = roiW * scale;
        tmp.height = roiH * scale;
        const tctx = tmp.getContext('2d');
        tctx.drawImage(canvas, roiX, roiY, roiW, roiH, 0, 0, tmp.width, tmp.height);
        const dataUrl = tmp.toDataURL('image/png');
        const alpr = await submitFrameForALPR(dataUrl);
        setOcrRaw(alpr?.rawText || '');
        const normalized = normalizePlate(alpr?.plate || '');
        const digits = (normalized.match(/\d/g) || []).length;
        if (normalized && normalized.length >= 5 && normalized.length <= 9 && digits >= 2) {
          clearInterval(autoScanRef.current);
          autoScanRef.current = null;
          await handleQuery(normalized);
        }
      } catch (e) {}
    }, 1200);
    return () => {
      if (autoScanRef.current) { clearInterval(autoScanRef.current); autoScanRef.current = null; }
    };
  }, [autoDetect, tab, loading]);

  const renderStatusBadge = (statusObj) => {
    if (!statusObj) return null;
    const { status, expires, nextDue } = statusObj;
    const s = (status || '').toLowerCase();
    const baseColor = s.includes('valid') || s.includes('paid') ? '#10b981' : s.includes('due') || s.includes('soon') ? '#f59e0b' : '#ef4444';
    return (
      <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4
        }}>
        <span
            style={{
                background: baseColor,
                color: '#fff',
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 12 
            }}
        >
            {status}
        </span>
        {expires && <span
            style={{
                fontSize: 11,
                opacity: 0.75 
            }}
        >
            Expires: {expires}
        </span>}
        {nextDue && <span
            style={{
                fontSize: 11,
                opacity: 0.75
                }}
            >
                Next Due: {nextDue}
            </span>
        }
      </div>
    );
  };

  return (
    <div
        style={{
            position:'absolute',
            inset: 0,
            paddingTop: 20,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100 
        }}>
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
        <h3
            style={{
                margin: '0 0 16px',
                fontSize: 20 
            }}
        >
            Vehicle Verify
        </h3>
        <div
            style={{
                display: 'flex',
                gap: 10,
                marginBottom: 14
            }}
        >
          <button
                onClick={() => setTab('plate')}
                style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    background: tab === 'plate' ? 'linear-gradient(90deg,#2563eb,#3b82f6)' : '#1e293b',
                    color: '#fff',
                    fontWeight: 500 
                }}
            >
                Scan Plate Text
            </button>
          <button
            onClick={() => setTab('manual')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: tab === 'manual' ? 'linear-gradient(90deg,#2563eb,#3b82f6)' : '#1e293b',
              color: '#fff',
              fontWeight: 500
            }}
          >
            Manual Plate
          </button>
        </div>

        {tab === 'plate' && (
          <div
            style={{
              border: '1px solid #1e293b',
              borderRadius: 12,
              padding: 12,
              marginBottom: 18
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden'
              }}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                style={{
                  width: '100%',
                  display: 'block'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '14%',
                  top: '60%',
                  width: '72%',
                  height: '22%',
                  border: '2px dashed rgba(255,255,255,0.6)',
                  borderRadius: 6,
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              />
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 8
              }}
            >
              <div style={{ fontSize: 11, opacity: 0.75 }}>
                Center the plate; ensure good lighting.
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 8
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12
                  }}
                >
                  <input
                    type="checkbox"
                    checked={autoDetect}
                    onChange={(e) => setAutoDetect(e.target.checked)}
                  />
                  Auto detect
                </label>
                <button
                  onClick={captureAndOcr}
                  style={{
                    background: 'linear-gradient(90deg,#2563eb,#3b82f6)',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  Scan Now
                </button>
              </div>
            </div>
            {ocrRaw && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  opacity: 0.8
                }}
              >
                <strong>OCR raw:</strong> {ocrRaw.replace(/\s+/g, ' ')}
              </div>
            )}
          </div>
        )}

        {tab === 'manual' && (
          <form
            onSubmit={submitManual}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginBottom: 20
            }}
          >
            <input
              value={plateInput}
              onChange={(e) => setPlateInput(e.target.value)}
              placeholder="Enter plate e.g. ABC123"
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #334155',
                background: '#1e293b',
                color: '#fff',
                fontSize: 14
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(90deg,#2563eb,#3b82f6)',
                border: 'none',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Verify
            </button>
          </form>
        )}

        {loading && (
          <div
            style={{
              fontSize: 13
            }}
          >
            Processing...
          </div>
        )}
        {error && (
          <div
            style={{
              fontSize: 13,
              color: '#f87171'
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: 6
            }}
          >
            {!result.found && (
              <div
                style={{
                  background: '#1e293b',
                  padding: '12px 14px',
                  borderRadius: 12
                }}
              >
                <strong
                  style={{
                    fontSize: 14
                  }}
                >
                  Not Found
                </strong>
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.7
                  }}
                >
                  No record matched: {result.query}
                </div>
              </div>
            )}
            {result.found && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}
              >
                <div
                  style={{
                    background: '#1e293b',
                    padding: '12px 14px',
                    borderRadius: 12
                  }}
                >
                  <strong
                    style={{
                      fontSize: 14
                    }}
                  >
                    Driver
                  </strong>
                  <div
                    style={{
                      fontSize: 13,
                      marginTop: 4
                    }}
                  >
                    {result.data.driver.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.75
                    }}
                  >
                    Rating: {result.data.driver.rating} ⭐
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.75
                    }}
                  >
                    Weekly Safe Score: {result.data.driver.weeklySafeScore}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.75
                    }}
                  >
                    Violations this year: {result.data.driver.violationsThisYear}
                  </div>
                  {result.data.driver.lastViolation && (
                    <div
                      style={{
                        fontSize: 11,
                        opacity: 0.6
                      }}
                    >
                      Last Violation: {result.data.driver.lastViolation.type} on {result.data.driver.lastViolation.date} {result.data.driver.lastViolation.cleared ? '(Cleared)' : '(Open)'}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gap: 12
                  }}
                >
                  <div
                    style={{
                      background: '#1e293b',
                      padding: '10px 12px',
                      borderRadius: 12
                    }}
                  >
                    <strong
                      style={{
                        fontSize: 13
                      }}
                    >
                      Roadworthiness
                    </strong>
                    {renderStatusBadge(result.data.roadworthiness)}
                  </div>
                  <div
                    style={{
                      background: '#1e293b',
                      padding: '10px 12px',
                      borderRadius: 12
                    }}
                  >
                    <strong
                      style={{
                        fontSize: 13
                      }}
                    >
                      Insurance
                    </strong>
                    {renderStatusBadge(result.data.insurance)}
                  </div>
                  <div
                    style={{
                      background: '#1e293b',
                      padding: '10px 12px',
                      borderRadius: 12
                    }}
                  >
                    <strong
                      style={{
                        fontSize: 13
                      }}
                    >
                      Tax
                    </strong>
                    {renderStatusBadge(result.data.tax)}
                  </div>
                </div>
                <div
                  style={{
                    background: '#1e293b',
                    padding: '12px 14px',
                    borderRadius: 12
                  }}
                >
                  <strong
                    style={{
                      fontSize: 14
                    }}
                  >
                    Reviews
                  </strong>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      marginTop: 6
                    }}
                  >
                    {result.data.driver.reviews.map(r => (
                      <div
                        key={r.id}
                        style={{
                          fontSize: 12,
                          background: '#0f172a',
                          padding: '6px 8px',
                          borderRadius: 8
                        }}
                      >
                        <span
                          style={{
                            opacity: 0.7
                          }}
                        >
                          {r.by}:
                        </span> {r.text}
                      </div>
                    ))}
                    {result.data.driver.reviews.length === 0 && (
                      <div
                        style={{
                          fontSize: 12,
                          opacity: 0.6
                        }}
                      >
                        No reviews yet.
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    background: '#1e293b',
                    padding: '12px 14px',
                    borderRadius: 12
                  }}
                >
                  <strong
                    style={{
                      fontSize: 14
                    }}
                  >
                    Compliance Summary
                  </strong>
                  <div
                    style={{
                      fontSize: 12,
                      marginTop: 4
                    }}
                  >
                    Outstanding Fines: {result.data.compliance.outstandingFines}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      opacity: 0.6
                    }}
                  >
                    Last Scan: {new Date(result.data.compliance.lastScan).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: 18,
            marginBottom: 28,
            fontSize: 11,
            opacity: 0.5,
            lineHeight: '16px'
          }}
        >
          Data is mocked for MVP preview. In production this will fetch on-chain + backend verified records.
        </div>
      </div>
    </div>
  );
}
