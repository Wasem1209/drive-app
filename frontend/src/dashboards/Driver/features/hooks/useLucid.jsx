import { useState } from "react";
import { Lucid } from "lucid-cardano";

// Hook for Lucid integration
export function useLucid() {
    const [lucid, setLucid] = useState(null);

    // Initialize Lucid with the browser wallet
    const initLucid = async () => {
        if (!window.cardano) throw new Error("No Cardano wallet detected");

        const lucid = await Lucid.new(
            window.cardano.nami, // browser wallet
            "Mainnet" // or "Preview", "Testnet"
        );

        setLucid(lucid);
        return lucid;
    };

    // Mock TX for testing without blockchain
    const mockTx = async () => {
        return "mock_tx_hash_123456789";
    };

    return { lucid, initLucid, mockTx };
}
