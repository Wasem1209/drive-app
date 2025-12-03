import { useState } from "react";

export function useWallet() {
  const [api, setApi] = useState(null);

  const connect = async () => {
    if (!window.cardano || !window.cardano.nami)
      throw new Error("Nami Wallet not installed");

    const wallet = await window.cardano.nami.enable();
    setApi(wallet);
    return wallet;
  };

  return { api, connect };
}
