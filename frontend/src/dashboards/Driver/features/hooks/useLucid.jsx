import { useState } from "react";
import { Lucid, Blockfrost } from "lucid-cardano";

export function useLucid() {
    const [lucid, setLucid] = useState(null);

    const initLucid = async () => {
        const api = await window.cardano.nami.enable();

        const lucidInstance = await Lucid.new(
            new Blockfrost(
                "https://cardano-mainnet.blockfrost.io/api/v0",
                import.meta.env.VITE_BLOCKFROST_KEY
            ),
            "Mainnet"
        );
        lucidInstance.selectWallet(api);
        setLucid(lucidInstance);
    };

    const mockTx = async () => {
        return "MOCK_TX_" + crypto.randomUUID();
    };

    return { lucid, initLucid, mockTx };
}
