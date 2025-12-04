// frontend/src/dashboards/Driver/features/ConnectWallet.jsx
import React from "react";
import { useWallet, ConnectWallet as MeshConnectWallet } from "@meshsdk/react";

export default function ConnectWallet() {
    const { connected, name } = useWallet();

    return (
        <div style={{ cursor: "pointer" }}>
            {/* Render Mesh’s connect button */}
            <MeshConnectWallet />

            {/* Show wallet info if connected */}
            {connected && (
                <p style={{ marginTop: "8px" }}>
                    Connected: <strong>{name}</strong>
                </p>
            )}
        </div>
    );
}