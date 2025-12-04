import { useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";
import "../../styles/driverdashboard.css";

import PhoneFrame from "../../components/PhoneFrame";
import rectangle from "../../assets/Rectangle 2.svg";
import DueNotification from '../../components/DueNotification';
import profilePic from '../../assets/image 1@2x.png';
import notificationBell from '../../assets/elements.png';
import eye_icon from '../../assets/Eye.png';
import streakImage from '../../assets/Group 43.png';
import check_icon from '../../assets/Frame 34.png';
import goodIcon from '../../assets/check.png';
import gift_icon from '../../assets/Frame 35.png';
import calender from '../../assets/calender.png';
import closeIcon from '../../assets/clsoeIcon.png';
import carSideView from '../../assets/car side view.png';
import carFrontView from '../../assets/car front view.png';
import copy_icon from '../../assets/Copy.png';
import chevron_left_sqr from '../../assets/chevron-left-square.png';
import pay_tax_img from '../../assets/pay-tax-img.png';
import scan_plate_img from '../../assets/scan plate img.png';
import pay_insurance_history from '../../assets/pay_insurance_history_img.png';
import transaction_history from '../../assets/transactionHst.png';

import { Lucid } from "lucid-cardano";

export default function DriverDashboard() {
    const navigate = useNavigate();

    const [walletModalOpen, setWalletModalOpen] = useState(false);
    const [walletData, setWalletData] = useState({
        balance: "0.00",
        usdBalance: "0.00",
        address: "",
        connected: false
    });

    const copyWalletId = () => {
        if (walletData.address) {
            navigator.clipboard.writeText(walletData.address);
            alert("Wallet address copied!");
        }
    };

    const saveWalletToBackend = async (address) => {
        try {
            await fetch("/api/user/wallet", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ walletAddress: address }),
            });
        } catch (error) {
            console.log("Failed saving wallet:", error);
        }
    };

    const disconnectWallet = () => {
        setWalletData({
            balance: "0.00",
            usdBalance: "0.00",
            address: "",
            connected: false,
        });
    };

    const fetchADAPrice = async () => {
        try {
            const res = await fetch(
                "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd"
            );
            const data = await res.json();
            return data.cardano.usd || 0;
        } catch (err) {
            console.log("Failed to fetch ADA price:", err);
            return 0;
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.cardano?.nami) {
                alert("Nami Wallet not installed.");
                return;
            }

            const api = await window.cardano.nami.enable();

            const lucid = await Lucid.new(
                new Lucid.providers.Blockfrost(
                    "https://cardano-mainnet.blockfrost.io/api/v0",
                    "YOUR_BLOCKFROST_API_KEY"
                ),
                "Mainnet"
            );

            lucid.selectWallet(api);

            const address = await lucid.wallet.address();
            const utxos = await lucid.wallet.getUtxos();

            const totalLovelace = utxos.reduce(
                (acc, utxo) => acc + Number(utxo.assets.lovelace || 0),
                0
            );

            const adaBalance = (totalLovelace / 1_000_000).toFixed(2);
            const adaPrice = await fetchADAPrice();
            const usdBalance = (adaBalance * adaPrice).toFixed(2);

            await saveWalletToBackend(address);

            setWalletData({
                balance: adaBalance,
                usdBalance,
                address,
                connected: true,
            });

            setWalletModalOpen(false);
        } catch (err) {
            console.log("Connection error:", err);
            alert("Failed to connect wallet.");
        }
    };

    return (
        <PhoneFrame>
            <div style={{ position: 'relative', width: "100%", overflowX: "hidden" }}>

                {/* MODAL */}
                {walletModalOpen && (
                    <div style={modalStyles.overlay}>
                        <div style={modalStyles.modal}>
                            <h3>Connect Wallet</h3>
                            <button style={modalStyles.primaryBtn} onClick={connectWallet}>
                                Connect Nami Wallet
                            </button>
                            <button style={modalStyles.cancelBtn} onClick={() => setWalletModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* HEADER */}
                <div className='header-bar'>
                    <div className='header-left'>
                        <img
                            src={profilePic}
                            width={40}
                            height={40}
                            alt="Profile"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/dashboard/driver/profile")}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '0px' }}>
                            <p className='welcom-greeting'>Welcome</p>
                            <p className='user-name'>Emeka Dave.</p>
                        </div>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <img src={notificationBell} alt="Notifications" />
                    </button>
                </div>

                <img src={rectangle} alt="Rectangle" style={{ width: '100%', height: 'auto' }} />

                {/* WALLET */}
                <div className="wallet">
                    <div>
                        <div className="small-txt">
                            <p style={{ margin: 0 }}>Available Balance</p>
                            <img src={eye_icon} alt="Eye Icon" style={{ width: 12, height: 12, paddingTop: 15, paddingLeft: 8, cursor: "pointer" }} />
                        </div>
                        <h2 className="wallet-amount">{walletData.balance} ADA</h2>
                        {walletData.connected && <p style={{ fontSize: "12px", margin: 0 }}>~${walletData.usdBalance}</p>}

                        {walletData.connected && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={copyWalletId}>
                                <img src={copy_icon} alt="Copy Icon" />
                                <h3 className="wallet-id small-txt">
                                    {walletData.address.substring(0, 12)}...{walletData.address.slice(-8)}
                                </h3>
                            </div>
                        )}
                    </div>

                    {!walletData.connected ? (
                        <button className="connect-btn" onClick={() => setWalletModalOpen(true)}>Connect Wallet</button>
                    ) : (
                        <button className="connect-btn" style={{ background: "red" }} onClick={disconnectWallet}>Disconnect</button>
                    )}
                </div>

                {/* WEEKLY GOAL */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 62, paddingInline: 20 }}>
                    <div className='streak-card'>
                        <div>
                            <div style={{ display: "flex", alignItems: "end", paddingTop: 20 }}>
                                <p className="streak-weeks-num">3</p>
                                <p className="streak-weeks">Weeks</p>
                            </div>
                            <p className="streak-label">Safe <br />Driving</p>
                        </div>
                        <img src={streakImage} style={{ width: 50, height: 70, marginTop: "auto" }} />
                    </div>

                    <div className='weekly-streak-card'>
                        <p className="weekly-title" style={{ textAlign: 'left' }}>Weekly Reward</p>
                        <div className="week-dots">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                                <div className="day-item" key={day}>
                                    <img src={index === 6 ? gift_icon : check_icon} />
                                    <span>{day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* DUE NOTIFICATIONS */}
                <div className="due-notification-container">
                    <DueNotification />
                </div>

                {/* VEHICLE DETAILS */}
                <div className='vehicle-details-section'>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div className='safe-driving-card vehicle-detail-card' onClick={() => navigate("/driver/safe-driving")} style={{ cursor: "pointer" }}>
                            <p className="sd-title">Safe Driving</p>
                            <p className="sd-subtitle">Your Weekly safe <br />driving score</p>
                            <div style={{ display: "flex", alignItems: "end", justifyContent: "center", width: "100%" }}>
                                <p className='driving-score score-percent typ-page-title'>75</p>
                                <p className='driving-score score-total'>/100</p>
                            </div>
                        </div>

                        <div className='insurance-card vehicle-detail-card' onClick={() => navigate("/driver/insurance")} style={{ cursor: "pointer" }}>
                            <p className="sd-title">Insurance</p>
                            <p className="sd-subtitle">Your Vehicle’s insurance <br />is Due</p>
                            <div style={{ display: "flex", alignItems: "end", marginTop: 'auto', paddingBottom: 15, justifyContent: "space-between", width: "100%", zIndex: 2 }}>
                                <p className='due-days-left'><img src={calender} /> Due: 10 Jan 2025</p>
                                <img src={closeIcon} style={{ paddingRight: 18 }} />
                            </div>
                            <img src={carSideView} className='car-side-view' />
                        </div>
                    </div>

                    <div className='roadworthiness-card vehicle-detail-card' onClick={() => navigate("/driver/roadworthiness")} style={{ cursor: "pointer" }}>
                        <p className="road-worthy-stat">Roadworthy</p>
                        <p className="road-worthy-user-stat">Your Vehicle is roadworthy</p>
                        <img src={carFrontView} style={{ marginLeft: 55 }} />
                        <div style={{ display: "flex", alignItems: "end", marginTop: 'auto', paddingBottom: 15, justifyContent: "space-between", width: "100%", zIndex: 2 }}>
                            <p className='due-days-left'><img src={calender} /> Due: 13 Dec 2026</p>
                            <img src={goodIcon} style={{ paddingRight: 12 }} />
                        </div>
                    </div>
                </div>

                {/* CTA BUTTONS */}
                <div className='cta-btn-container'>
                    <div className="cta-btn cta-pay" onClick={() => navigate("/dashboard/driver/PayRoadTax")} style={{ backgroundColor: "#023e8a80", cursor: "pointer" }}>
                        <p>Pay Road <br />Tax</p>
                        <img src={chevron_left_sqr} className='cta-chv-btn' />
                        <div className='cta-img-container' style={{ left: 70, top: 80 }}><img src={pay_tax_img} /></div>
                    </div>
                    <div className="cta-btn cta-pay" onClick={() => navigate("/driver/scan-plate")} style={{ backgroundColor: "#00c8b380", cursor: "pointer" }}>
                        <p>Scan<br />Plate No.</p>
                        <img src={chevron_left_sqr} className='cta-chv-btn' />
                        <div className='cta-img-container' style={{ left: 90, top: 60 }}><img src={scan_plate_img} /></div>
                    </div>
                    <div className="cta-btn cta-pay" onClick={() => navigate("/driver/pay-insurance")} style={{ backgroundColor: "#cb30e080", cursor: "pointer" }}>
                        <p>Pay<br />Insurance</p>
                        <img src={chevron_left_sqr} className='cta-chv-btn' />
                        <div className='cta-img-container' style={{ left: 70, top: 70 }}><img src={pay_insurance_history} /></div>
                    </div>
                    <div className="cta-btn cta-pay" onClick={() => navigate("/driver/payment-history")} style={{ backgroundColor: "rgba(0, 136, 255, 0.5)", cursor: "pointer" }}>
                        <p>Payment<br />History</p>
                        <img src={chevron_left_sqr} className='cta-chv-btn' />
                        <div className='cta-img-container' style={{ left: 100, top: 70 }}><img src={transaction_history} /></div>
                    </div>
                </div>

                <Outlet />
            </div>
        </PhoneFrame>
    );
}

const modalStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    },
    modal: {
        width: 260,
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        textAlign: "center",
    },
    primaryBtn: {
        width: "100%",
        padding: 10,
        background: "#0058fb",
        color: "#fff",
        borderRadius: 8,
        border: "none",
        marginBottom: 10,
        cursor: "pointer"
    },
    cancelBtn: {
        width: "100%",
        padding: 8,
        background: "#ddd",
        borderRadius: 8,
        border: "none",
        cursor: "pointer"
    }
};
