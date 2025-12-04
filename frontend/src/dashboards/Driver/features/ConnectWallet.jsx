// ConnectWallet.jsx
import React, { useState, useEffect } from "react";

const ConnectWallet = () => {
    const [walletFound, setWalletFound] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [address, setAddress] = useState("");

    useEffect(() => {
        // Check if Nami Wallet is installed
        if (window.cardano && window.cardano.nami) {
            setWalletFound(true);
        }
    }, []);

    const connectWallet = async () => {
        try {
            if (!walletFound) return alert("Nami Wallet not found!");

            // Enable Nami
            const nami = await window.cardano.nami.enable();
            const addr = await nami.getUsedAddresses();
            setAddress(addr[0] || "");
            setWalletConnected(true);
        } catch (err) {
            console.error("Wallet connection failed:", err);
        }
    };

    return (
        <div className="wallet-connector">
            {walletFound ? (
                walletConnected ? (
                    <div>
                        <p>Wallet Connected!</p>
                        <p>Address: {address}</p>
                    </div>
                ) : (
                    <button onClick={connectWallet}>Connect Nami Wallet</button>
                )
            ) : (
                <p>Please install Nami Wallet to continue.</p>
            )}
        </div>
    );
};

export default ConnectWallet;
