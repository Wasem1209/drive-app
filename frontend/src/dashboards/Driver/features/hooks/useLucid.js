export function useLucid() {
// eslint-disable-next-line no-undef
const [lucid, setLucid] = useState(null);
const initLucid = async () => {
const api = await window.cardano.nami.enable();
const lucidInstance = await lucid.Lucid.new(
new lucid.Blockfrost("https://cardano-mainnet.blockfrost.io/api/v0", import.meta.env.VITE_BLOCKFROST_KEY),
"Mainnet"
);
lucidInstance.selectWallet(api);
setLucid(lucidInstance);
return lucidInstance;
};
const mockTx = async () => ({ txHash: "MOCK_TX_" + Math.random().toString(36).substring(2), timestamp: Date.now() });
return { lucid, initLucid, mockTx };
}