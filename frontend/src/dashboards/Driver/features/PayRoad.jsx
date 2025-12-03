import React, { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useLucid } from "./hooks/useLucid";
import "./PayRoad.css";

export default function PayRoad() {
  const { connect } = useWallet();
  const { lucid, initLucid, mockTx } = useLucid();

  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [amount, setAmount] = useState(2); // ADA
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  const GOVT_ADDRESS = import.meta.env.VITE_GOVT_TAX_WALLET;

  const handleConnect = async () => {
    try {
      const api = await connect();
      const addr = await api.getUsedAddresses();
      setWalletAddress(addr[0]);
      setConnected(true);
      await initLucid();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePay = async () => {
    try {
      setLoading(true);
      setError(null);
      setTxHash(null);

      if (!connected) throw new Error("Connect wallet first");

      // Hackathon placeholder: CBOR fetch (mock validator)
      await fetch("/aiken/receipt_policy.cbor");

      const tx = lucid
        ? await lucid.newTx()
          .payToAddress(GOVT_ADDRESS, { lovelace: amount * 1_000_000 })
          .complete()
        : await mockTx();

      const hash = tx.txHash || tx;
      setTxHash(hash);

      // Notify backend
      await fetch("/api/receipts/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash: hash, wallet: walletAddress }),
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tax-container">
      <h1>Pay Road Tax</h1>
      <p className="desc">Submit payment on-chain and mint your official receipt NFT.</p>

      {!connected && (
        <button className="pay-btn" onClick={handleConnect}>
          Connect Wallet
        </button>
      )}

      {connected && (
        <>
          <p><strong>Wallet:</strong> {walletAddress}</p>
          <div className="input-group">
            <label>Amount (ADA)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
          <button className="pay-btn" onClick={handlePay} disabled={loading}>
            {loading ? "Processing..." : "Pay & Mint Receipt"}
          </button>
        </>
      )}

      {txHash && <p className="success">Transaction Submitted: {txHash}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

