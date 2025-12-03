import React from "react";
import { useWallet } from "./hooks/usePhilip";

export default function ConnectWallet() {
    const { connect } = useWallet();

    const handleConnect = async () => {
        try {
            await connect();
            alert("Wallet Connected Successfully!");
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <button
            style={{
                padding: "8px 14px",
                background: "#003566",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
            }}
            onClick={handleConnect}
        >
            Connect Wallet
        </button>
    );
}
