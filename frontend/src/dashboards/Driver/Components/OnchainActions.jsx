// OnchainActions.jsx
// Lucid + Nami integration with Aiken placeholders (browser build)
import React, { useCallback, useState, useEffect } from "react";
import { Lucid, Blockfrost } from "lucid-cardano/browser";

/*
  IMPORTANT CONFIG:
  - Set REACT_APP_BLOCKFROST_PROJECT_ID in your frontend environment (Vercel Environment variable)
  - Ensure Nami is installed in the browser for end-users
  - Replace AIKEN_SCRIPT_ADDRESS and AIKEN_SCRIPT_UTXO with values from your compiled Aiken validator
*/

// eslint-disable-next-line no-undef
const BLOCKFROST_PROJECT_ID = process.env.REACT_APP_BLOCKFROST_PROJECT_ID || "";
// eslint-disable-next-line no-undef
const NETWORK = process.env.REACT_APP_NETWORK === "Mainnet" ? "Mainnet" : "Testnet";
// eslint-disable-next-line no-undef
const AIKEN_SCRIPT_ADDRESS = process.env.REACT_APP_AIKEN_SCRIPT_ADDRESS || "addr_test1..."; // replace
const MIN_LOVELACE = 2_000_000n;

export default function OnchainActions({
    walletAddress, profile, setOnChainState, setError, setLoading }) {
    const [lucid, setLucid] = useState(null);
    const [connected, setConnected] = useState(false);

    // init Lucid with Nami
    const initLucid = useCallback(async () => {
        if (!window.cardano?.nami) {
            setError("Nami wallet not available");
            return;
        }
        try {
            await window.cardano.nami.enable();

            const provider = new Blockfrost(BLOCKFROST_PROJECT_ID,
                NETWORK === "Mainnet"
                    ? "https://cardano-mainnet.blockfrost.io/api/v0"
                    : "https://cardano-testnet.blockfrost.io/api/v0"
            );

            const luc = await Lucid.new(provider, NETWORK === "Mainnet" ? "Mainnet" : "Testnet");
            luc.selectWallet(window.cardano.nami);
            setLucid(luc);
            setConnected(true);
        } catch (e) {
            console.error("initLucid", e);
            setError(e.message || "Failed to init Lucid");
        }
    }, [setError]);

    useEffect(() => {
        // auto-init when wallet is present
        if (window.cardano?.nami) initLucid();
    }, [initLucid]);

    // read UTXOs at script (example to read driver state)
    const readDriverState = useCallback(async () => {
        if (!lucid) return;
        try {
            const utxos = await lucid.utxosAt(AIKEN_SCRIPT_ADDRESS);
            // adapt according to your datum shape
            for (const u of utxos) {
                if (!u.datum) continue;
                const d = u.datum;
                if (d.owner && d.owner.toLowerCase() === walletAddress?.toLowerCase()) {
                    setOnChainState({
                        insuranceDue: d.insuranceDue || null,
                        roadTaxDue: d.roadTaxDue || null,
                        roadworthy: !!d.roadworthy,
                        safeDrivingScore: d.safeDrivingScore || 0,
                        verifiedOnChain: !!d.verified,
                    });
                    return;
                }
            }
        } catch (e) {
            console.warn("readDriverState:", e);
        }
    }, [lucid, walletAddress, setOnChainState]);

    useEffect(() => { if (lucid && walletAddress) readDriverState(); }, [lucid, walletAddress, readDriverState]);

    // Example: save profile to contract by paying a datum to the script address
    async function saveProfileOnChain() {
        if (!lucid) throw new Error("Wallet not connected");
        // construct datum according to your Aiken validator schema
        const datum = {
            owner: walletAddress,
            fullName: profile.fullName || "",
            licenseNumber: profile.licenseNumber || "",
            vehiclePlate: profile.vehiclePlate || "",
            updatedAt: new Date().toISOString(),
        };

        // NOTE: payToContract stores an inline datum (backend Aiken validator must accept)
        const tx = await lucid.newTx()
            .payToContract(AIKEN_SCRIPT_ADDRESS, { inline: datum }, { lovelace: MIN_LOVELACE })
            .complete();

        const signed = await tx.sign().complete();
        const txHash = await signed.submit();
        return txHash;
    }

    // Example: pay insurance (calls contract with action)
    async function payInsurance(amountLovelace = 5_000_000n) {
        if (!lucid) throw new Error("Wallet not connected");
        const datum = { owner: walletAddress, action: "payInsurance", amount: amountLovelace.toString(), timestamp: new Date().toISOString() };

        const tx = await lucid.newTx()
            .payToContract(AIKEN_SCRIPT_ADDRESS, { inline: datum }, { lovelace: amountLovelace })
            .complete();

        const signed = await tx.sign().complete();
        const txHash = await signed.submit();
        return txHash;
    }

    // Example: collect UTxO (consuming script) — generic pattern
    // You must fetch the appropriate UTxO(s) from the script, then collect using a redeemer

    // UI helpers
    async function handleSaveOnChain() {
        setLoading(true); setError("");
        try {
            const tx = await saveProfileOnChain();
            // Persist tx hash to backend (receipt)
            await fetch("/api/driver/profile/receipt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ wallet: walletAddress, tx }) });
            await readDriverState();
            alert("Saved on-chain: " + tx);
        } catch (e) {
            console.error(e);
            setError(e.message || "On-chain save failed");
        } finally { setLoading(false); }
    }

    async function handlePayInsurance() {
        setLoading(true); setError("");
        try {
            const tx = await payInsurance(5_000_000n);
            await fetch("/api/driver/profile/receipt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ wallet: walletAddress, tx }) });
            await readDriverState();
            alert("Insurance paid, tx: " + tx);
        } catch (e) {
            console.error(e);
            setError(e.message || "Payment failed");
        } finally { setLoading(false); }
    }

    return (
        <section className="card actions">
            <h3>On-Chain Actions</h3>
            <div className="action-grid">
                <button onClick={initLucid} disabled={connected}>Connect Nami</button>
                <button onClick={handleSaveOnChain} disabled={!connected}>Save Profile On-Chain</button>
                <button onClick={handlePayInsurance} disabled={!connected}>Pay Insurance</button>
                <div className="small-note">Script: {AIKEN_SCRIPT_ADDRESS}</div>
            </div>
        </section>
    );
}
