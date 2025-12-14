import { useState } from "react";
import cardanoMock from "../../cardanoMock"; // <-- adjust path if needed
import "../../../styles/verify-modal.css";

export default function PayRoadTax({ onClose, mode }) {
    const title = mode === "insurance" ? "Pay Insurance" : "Pay Road Tax";

    const [plate, setPlate] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [txId, setTxId] = useState("");

    const handlePay = async () => {
        if (!plate.trim() || !amount.trim()) return;

        setLoading(true);

        const taxDetails = {
            vehicle: plate,
            amount: parseFloat(amount),
            timestamp: Date.now(),
        };

        const res = await cardanoMock.payTax(taxDetails);

        setLoading(false);

        if (res.success) {
            setTxId(res.txId);
            setSuccess(true);
        }
    };

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                paddingTop: 20,
                background: "rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 320,
            }}
        >
            {/* MAIN MODAL */}
            <div
                className="verify-modal"
                style={{
                    width: "92%",
                    maxWidth: 420,
                    background: "#0f172a",
                    color: "#fff",
                    padding: "60px 22px 26px",
                    borderRadius: 20,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                    position: "relative",
                    overflowY: "auto",
                    margin: "0 12px",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 60,
                        right: 12,
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        fontSize: 18,
                        cursor: "pointer",
                    }}
                >
                    ×
                </button>

                <h3 style={{ margin: "0 0 16px", fontSize: 20 }}>{title}</h3>

                {/* Inputs */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <label style={{ fontSize: 13, opacity: 0.85 }}>Vehicle Plate</label>
                    <input
                        placeholder="Enter plate number"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                        style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #334155",
                            background: "#0b1220",
                            color: "#fff",
                        }}
                    />

                    <label style={{ fontSize: 13, opacity: 0.85 }}>Amount (ADA)</label>
                    <input
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #334155",
                            background: "#0b1220",
                            color: "#fff",
                        }}
                    />

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1,
                                background: "transparent",
                                border: "1px solid #334155",
                                color: "#fff",
                                padding: "10px 12px",
                                borderRadius: 10,
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handlePay}
                            disabled={loading}
                            style={{
                                flex: 1,
                                background: "linear-gradient(90deg,#2563eb,#3b82f6)",
                                border: "none",
                                color: "#fff",
                                padding: "10px 12px",
                                borderRadius: 10,
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            {loading ? "Processing..." : "Pay"}
                        </button>
                    </div>
                </div>
            </div>

            {/* SUCCESS MODAL */}
            {success && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 350,
                    }}
                >
                    <div
                        style={{
                            width: "85%",
                            maxWidth: 380,
                            background: "#0f172a",
                            color: "#fff",
                            padding: "40px 22px",
                            borderRadius: 20,
                            textAlign: "center",
                        }}
                    >
                        <h3>Payment Successful 🎉</h3>
                        <p style={{ marginTop: 10, fontSize: 14, opacity: 0.85 }}>
                            Transaction ID:
                        </p>
                        <p
                            style={{
                                fontFamily: "monospace",
                                fontSize: 13,
                                opacity: 0.9,
                                marginBottom: 20,
                            }}
                        >
                            {txId}
                        </p>

                        <button
                            onClick={() => {
                                setSuccess(false);
                                onClose();
                            }}
                            style={{
                                background: "linear-gradient(90deg,#2563eb,#3b82f6)",
                                border: "none",
                                color: "#fff",
                                padding: "10px 18px",
                                borderRadius: 10,
                                cursor: "pointer",
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
