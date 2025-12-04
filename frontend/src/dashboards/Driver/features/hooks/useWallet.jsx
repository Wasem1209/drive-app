import { useState } from "react";

// Browser-safe wallet hook for Nami, Eternl, Lace, etc.
export function useWallet() {
  const [walletApi, setWalletApi] = useState(null);
  const [walletName, setWalletName] = useState(null);

  // Connect wallet
  const connect = async () => {
    if (!window.cardano) throw new Error("No Cardano wallets found");

    // Prefer Nami → Eternl → Lace
    const wallet =
      window.cardano.nami ||
      window.cardano.eternl ||
      window.cardano.lace;

    if (!wallet) throw new Error("No supported Cardano wallet installed");

    const api = await wallet.enable(); // Lucid-compatible API

    setWalletApi(api);
    setWalletName(wallet.name || "Cardano Wallet");

    return api; // IMPORTANT: return real API, not provider
  };

  const getBalance = async () => {
    if (!walletApi) throw new Error("Wallet not connected");
    const balanceHex = await walletApi.getBalance();
    return BigInt(balanceHex); // wallet returns hex → convert to bigint
  };

  return { connect, walletApi, walletName, getBalance };
}
