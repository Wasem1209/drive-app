import { useState } from "react";

// A simple browser-compatible wallet hook for Nami, Eternl, etc.
export function useWallet() {
  const [walletApi, setWalletApi] = useState(null);

  // Connect wallet (Nami/Eternl)
  const connect = async () => {
    if (!window.cardano) throw new Error("No Cardano wallet found in browser");

    // Example: check for Nami
    const nami = window.cardano.nami;
    if (!nami) throw new Error("Nami wallet not installed");

    await nami.enable();
    setWalletApi(nami);
    return nami;
  };

  const getBalance = async () => {
    if (!walletApi) throw new Error("Wallet not connected");
    const balance = await walletApi.getBalance(); // lovelace
    return Number(balance);
  };

  return { connect, walletApi, getBalance };
}
