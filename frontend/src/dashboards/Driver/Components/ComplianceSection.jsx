// ComplianceSection.jsx
import React from "react";
import QRCode from "qrcode.react";

export default function ComplianceSection({ profile = {}, onChainState = {} }) {
    const { vehiclePlate, vehicleModel } = profile;
    const plateHash = profile.vehiclePlate ? btoa(profile.vehiclePlate).slice(0, 12) : "N/A";

    return (
        <section className="card compliance">
            <h3>Compliance Snapshot</h3>

            <div className="cards">
                <div className="stat">
                    <div className="label">Insurance</div>
                    <div className="value">{onChainState.insuranceDue || "N/A"}</div>
                </div>
                <div className="stat">
                    <div className="label">Road Tax</div>
                    <div className="value">{onChainState.roadTaxDue || "N/A"}</div>
                </div>
                <div className="stat">
                    <div className="label">Roadworthy</div>
                    <div className="value">{onChainState.roadworthy ? "Pass" : "Fail"}</div>
                </div>
                <div className="stat">
                    <div className="label">Safe Score</div>
                    <div className="value">{onChainState.safeDrivingScore ?? 0}/100</div>
                </div>
            </div>

            <div className="vehicle-id">
                <h4>Vehicle Identity</h4>
                <div><strong>Plate:</strong> {vehiclePlate || "N/A"}</div>
                <div><strong>Model:</strong> {vehicleModel || "N/A"}</div>
                <div className="qr">
                    <QRCode value={`VEHICLE:${plateHash}`} size={120} />
                    <div className="qr-label">Scan for on-chain ID</div>
                </div>
            </div>
        </section>
    );
}
