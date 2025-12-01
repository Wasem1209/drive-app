import { useState } from 'react';

export default function ConnectWallet({ onConnected }) {
    const [connected, setConnected] = useState(false);

    const handleConnect = () => {
        const mockWallet = {
            key: 'mock-wallet',
            label: 'Mock Wallet',
            api: null,
            address: 'addr_test1qmockaddress'
        };
        setConnected(true);
        if (onConnected) onConnected(mockWallet);
        window.dispatchEvent(new CustomEvent('cardano:walletConnected', { detail: mockWallet }));
    };

    return (
        <div style={{ marginTop: 10 }}>
            {!connected ? (
                <button onClick={handleConnect} style={{ padding: '8px 12px', borderRadius: 8 }}>
                    Connect Wallet
                </button>
            ) : (
                <div>
                    <span style={{ fontSize: 12, color: '#555' }}>Wallet Connected</span>
                    <div style={{ fontWeight: 600 }}>{'Mock Wallet'}</div>
                    <div style={{ fontSize: 12, background: '#eee', padding: '4px 8px', borderRadius: 8 }}>
                        addr_test1qmockaddress
                    </div>
                </div>
            )}
        </div>
    );
}
