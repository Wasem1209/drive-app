export function useWallet() {
const connect = async () => {
if (!window.cardano || !window.cardano.nami) throw new Error("Nami not found");
return await window.cardano.nami.enable();
};
const isInstalled = () => !!window.cardano?.nami;
return { connect, isInstalled };
}