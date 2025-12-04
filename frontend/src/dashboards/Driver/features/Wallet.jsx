// frontend/src/dashboards/Driver/features/ConnectWallet.jsx
import React, { useState } from "react";

export default function ConnectWallet() {
    const [walletName, setWalletName] = useState(null);
    const [address, setAddress] = useState(null);

    const connectWallet = async () => {
        try {
            if (window.cardano?.nami) {
                const api = await window.cardano.nami.enable();
                setWalletName("Nami");

                // get first used address
                const usedAddresses = await api.getUsedAddresses();
                if (usedAddresses.length > 0) {
                    setAddress(usedAddresses[0]);
                }
            } else {
                alert("No Cardano wallet found. Please install Nami, Eternl, Flint, or Lace.");
            }
        } catch (err) {
            console.error("Wallet connection failed:", err);
        }
    };

    return (
        <div className="connect-wallet">
            <button onClick={connectWallet}>
                {walletName ? `Connected: ${walletName}` : "Connect Wallet"}
            </button>

            {address && (
                <p style={{ marginTop: "10px" }}>
                    <strong>Address:</strong> {address}
                </p>
            )}
        </div>
    );
}