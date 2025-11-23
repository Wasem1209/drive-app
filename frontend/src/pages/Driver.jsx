import "../styles/DriverFrame.css";

const driverStats = [
    { label: "Active Trips", value: "12" },
    { label: "Miles Today", value: "148" },
    { label: "Rating", value: "4.98" },
];

const upcomingStops = [
    { id: 1, address: "227 Market St", eta: "3 min" },
    { id: 2, address: "81 Ferry Plaza", eta: "7 min" },
    { id: 3, address: "SFO Terminal 2", eta: "16 min" },
];

export default function Driver() {
    return (
        <section className="driver-page">
            <div className="device-frame">
                <div className="antenna-lines" aria-hidden="true" />
                <div className="screen-mask">
                    <div className="dynamic-island" aria-hidden="true">
                        <span className="dynamic-speaker" />
                        <span className="dynamic-camera" />
                    </div>
                    <div className="screen-content">
                        <p>Driver Page Under Construction</p>
                    </div>
                </div>
            </div>
        </section>
    );
}