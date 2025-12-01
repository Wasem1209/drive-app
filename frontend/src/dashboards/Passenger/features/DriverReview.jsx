import { useState } from 'react';
import { submitDriverReview } from '../../../api/reviews';
import '../../../styles/verify-modal.css';

export default function DriverReview({ driver, onClose }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      await submitDriverReview({ driverId: driver?.id, rating, text });
      setDone(true);
    } catch (e) {
      setError(e?.message || 'Failed to submit review.');
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 300
        }}
    >
      <div className="verify-modal"
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
        }}>
        <button onClick={onClose}
          style={{
            position: 'absolute',
            top: 60,
            right: 12,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 18,
            cursor: 'pointer'
          }}>×</button>
        <h3
          style={{
            margin: '0 0 16px',
            fontSize: 20
          }}>Review Driver</h3>
        <div
          style={{
            fontSize: 12,
            opacity: 0.8,
            marginBottom: 10
          }}>Driver: {driver?.name} • Wallet: {driver?.walletId}</div>

        {!done ? (
          <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10
            }}>
            <label
              style={{
                fontSize: 13
              }}>Rating</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #334155',
                background: '#1e293b',
                color: '#fff',
                fontSize: 14
              }}>
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Fair</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Bad</option>
            </select>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience (optional)"
              rows={4}
              style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #334155',
                    background: '#1e293b',
                    color: '#fff',
                    fontSize: 14
                }}
            />
            {error && <div
                style={{
                  fontSize: 13,
                  color: '#f87171'
                }}>{error}</div>}
            <button onClick={handleSubmit} disabled={loading}
              style={{
                background: 'linear-gradient(90deg,#2563eb,#3b82f6)',
                border: 'none',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14
              }}>{loading ? 'Submitting…' : 'Submit Review'}</button>
          </div>
        ) : (
          <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10
            }}>
            <div
              style={{
                background: '#1e293b',
                padding: '12px 14px',
                borderRadius: 12
              }}>
              <strong
                style={{
                    fontSize: 14
                }}>Thanks for your feedback!</strong>
              <div
                style={{
                    fontSize: 12,
                    marginTop: 6
                }}>Your review helps improve transport safety and accountability.</div>
            </div>
            <button onClick={onClose}
              style={{
                background: '#334155',
                border: 'none',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14
              }}>Close</button>
          </div>
        )}
        <div
          style={{
            marginTop: 18,
            fontSize: 11,
            opacity: 0.5,
            lineHeight: '16px'
          }}>
          Reviews are mocked. Backend will persist & aggregate into driver rating.
        </div>
      </div>
    </div>
  );
}
