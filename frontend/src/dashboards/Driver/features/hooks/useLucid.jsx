import { useState } from "react";
import {
    Lucid,
    Blockfrost
} from "lucid-cardano";

export function useLucid() {
    const [lucid, setLucid] = useState(null);

    const initLucid = async () => {
        if (!window.cardano?.nami)
            throw new Error("Nami Wallet not detected");

        // Enable wallet
        const api = await window.cardano.nami.enable();

        // Create Lucid instance that works in the browser
        const lucidInstance = await Lucid.new(
            undefined,
            "Mainnet"
        );

        // Select browser wallet
        lucidInstance.selectWallet(api);

        setLucid(lucidInstance);
        return lucidInstance;
    };

    // Mock TX for development
    const mockTx = async () => {
        return "mock_tx_hash_123456789";
    };

    return { lucid, initLucid, mockTx };
}
