import { useEffect, useState } from 'react';
import { listPassengerTransactions } from '../../../api/transactions';
import '../../../styles/verify-modal.css';

export default function TransactionHistory({ onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all'); // all | 24h | highValue
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null); // receiptId expanded

  useEffect(() => {
    setTransactions(listPassengerTransactions());
  }, []);

  const filtered = transactions.filter(tx => {
    if (filter === '24h') {
      if (Date.now() - tx.timestamp > 24 * 60 * 60 * 1000) return false;
    } else if (filter === 'highValue') {
      if (tx.amountAda < 2) return false; // arbitrary threshold
    }
    if (search) {
      const s = search.toLowerCase();
      if (!tx.driverWallet.toLowerCase().includes(s) && !tx.route.toLowerCase().includes(s) && !tx.txHash.toLowerCase().includes(s)) {
        return false;
      }
    }
    return true;
  });

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
        <h3
          style={{
            margin: '0 0 16px',
            fontSize: 20
          }}
        >
          Payment History
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 16
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8
            }}
          >
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                width: "120px",
                borderRadius: 10,
                border: '1px solid #334155',
                background: '#1e293b',
                color: '#fff',
                cursor: "pointer",
                fontSize: 14
              }}
            >
              <option value="all">All</option>
              <option value="24h">Last 24h</option>
              <option value="highValue">High Value (≥2 ADA)</option>
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search route / wallet / hash"
              style={{
                flex: 2,
                padding: '10px 12px',
                width: "auto",
                maxWidth: "140px",
                borderRadius: 10,
                border: '1px solid #334155',
                background: '#1e293b',
                color: '#fff',
                fontSize: 14
              }}
            />
          </div>
          <div
            style={{
              fontSize: 11,
              opacity: 0.65
            }}
          >
            Transactions are locally mocked. Backend will stream real receipts.
          </div>
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              background: '#1e293b',
              padding: '12px 14px',
              borderRadius: 12,
              fontSize: 13,
              opacity: 0.8,
              textAlign: 'center'
            }}
          >
            No transactions yet.
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          {filtered.map(tx => {
            const isExpanded = expanded === tx.id;
            return (
              <div
                key={tx.id}
                style={{
                  background: '#1e293b',
                  padding: '10px 12px',
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <strong
                      style={{
                        fontSize: 13
                      }}
                    >
                      {tx.route}
                    </strong>
                    <span
                      style={{
                        fontSize: 11,
                        opacity: 0.7
                      }}
                    >
                      {new Date(tx.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : tx.id)}
                    style={{
                      background: isExpanded ? '#334155' : 'linear-gradient(90deg,#2563eb,#3b82f6)',
                      border: 'none',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    {isExpanded ? 'Hide' : 'Details'}
                  </button>
                </div>
                {isExpanded && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      fontSize: 12,
                      background: '#0f172a',
                      padding: '8px 10px',
                      borderRadius: 10
                    }}
                  >
                    <div>Driver Wallet: {tx.driverWallet}</div>
                    <div>Amount: {tx.amountAda} ADA</div>
                    <div>Split: Driver {tx.split.driver}% • Govt {tx.split.gov}%</div>
                    <div>Tx Hash: {tx.txHash.slice(0, 14)}…</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 11,
            opacity: 0.5,
            lineHeight: '16px'
          }}
        >
          Future backend: pagination, export, on-chain verify link (explorer), real-time push updates.
        </div>
      </div>
    </div>
  );
}
