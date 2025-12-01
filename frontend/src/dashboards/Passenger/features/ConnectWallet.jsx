export default function ConnectWallet({ onConnected }) {
	const fakeWallet = {
		label: "Demo Wallet",
		address: "addr1qxxxxxx",
	};

	const connect = () => {
		if (onConnected) onConnected(fakeWallet);
		alert("Connected to Demo Wallet!");
	};

	return (
		<button onClick={connect} style={{ padding: "8px 12px", borderRadius: 8 }}>
			Connect Wallet (Demo)
		</button>
	);
}
