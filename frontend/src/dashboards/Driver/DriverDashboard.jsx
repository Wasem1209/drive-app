import { useNavigate, Outlet } from "react-router-dom";
import '../../styles/driverdashboard.css';

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
import pay_tax_img from '../../assets/pay-tax-img.png'
import scan_plate_img from '../../assets/scan plate img.png'
import pay_insurance_history from '../../assets/pay_insurance_history_img.png'
import transaction_history from '../../assets/transactionHst.png'
import ConnectWallet from './features/ConnectWallet';

export default function DriverDashboard() {
    const navigate = useNavigate();

    return (
        <PhoneFrame>
            <div style={{ position: 'relative', width: "100%", overflowX: "hidden" }}>

                {/* HEADER */}
                <div className='header-bar'>

                    <div className='header-left'>
                        {/* PROFILE IMAGE (CLICKABLE) */}
                        <div>
                            <img
                                src={profilePic}
                                width={40}
                                height={40}
                                alt="Profile"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate("/dashboard/driver/profile")}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '0px' }}>
                            <p className='welcom-greeting'>Welcome</p>
                            <p className='user-name'>Emeka David.</p>
                        </div>
                    </div>

                    <button
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <img src={notificationBell} alt="Notifications" />
                    </button>

                </div>

                <img src={rectangle} alt="Rectangle" style={{ width: '100%', height: 'auto' }} />

                {/* WALLET */}
                <div className="wallet">
                    <div>
                        <div className='small-txt'>
                            <p style={{ margin: "0px" }}>Available Balance</p>
                            <img
                                src={eye_icon}
                                alt="Eye Icon"
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    paddingTop: '15px',
                                    paddingLeft: '8px',
                                    paddingBottom: '12px',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>

                        <h2 className='wallet-amount'>₦10,000.00</h2>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                cursor: 'pointer',
                            }}
                        >
                            <img src={copy_icon} alt="Copy Icon" />
                            <h3 className="wallet-id small-txt">Wallet Id: 001123983</h3>
                        </div>
                    </div>

                    <ConnectWallet />
                </div>

                {/* WEEKLY GOAL */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '62px',
                        paddingInline: '20px',
                    }}
                >
                    <div className='streak-card'>
                        <div>
                            <div style={{ display: "flex", alignItems: "end", paddingTop: "20px" }}>
                                <p className="streak-weeks-num">3</p>
                                <p className="streak-weeks">Weeks</p>
                            </div>
                            <p className="streak-label">Safe <br />Driving</p>
                        </div>

                        <img src={streakImage} style={{ width: "50px", height: "70px", marginTop: "auto" }} />
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

                {/* DUE WARNINGS */}
                <div className="due-notification-container">
                    <DueNotification />
                </div>

                {/* VEHICLE DETAILS (CLICKABLE CARDS) */}
                <div className='vehicle-details-section'>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                        {/* Safe Driving Card */}
                        <div
                            className='safe-driving-card vehicle-detail-card'
                            onClick={() => navigate("/driver/safe-driving")}
                            style={{ cursor: "pointer" }}
                        >
                            <p className="sd-title">Safe Driving</p>
                            <p className="sd-subtitle">Your Weekly safe <br />driving score</p>
                            <div style={{ display: "flex", alignItems: "end", justifyContent: "center", width: "100%" }}>
                                <p className='driving-score score-percent typ-page-title'>75</p>
                                <p className='driving-score score-total'>/100</p>
                            </div>
                        </div>

                        {/* Insurance Card */}
                        <div
                            className='insurance-card vehicle-detail-card'
                            onClick={() => navigate("/driver/insurance")}
                            style={{ cursor: "pointer" }}
                        >
                            <p className="sd-title">Insurance</p>
                            <p className="sd-subtitle">Your Vehicle’s insurance <br />is Due</p>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "end",
                                    marginTop: 'auto',
                                    paddingBottom: "15px",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    zIndex: "2"
                                }}
                            >
                                <p className='due-days-left'>
                                    <img src={calender} /> Due: 10 Jan 2025
                                </p>
                                <img src={closeIcon} style={{ paddingRight: "18px" }} />
                            </div>

                            <img src={carSideView} className='car-side-view' />
                        </div>
                    </div>

                    {/* Roadworthiness Card */}
                    <div
                        className='roadworthiness-card vehicle-detail-card'
                        onClick={() => navigate("/driver/roadworthiness")}
                        style={{ cursor: "pointer" }}
                    >
                        <p className="road-worthy-stat">Roadworthy</p>
                        <p className="road-worthy-user-stat">Your Vehicle is roadworthy</p>

                        <img src={carFrontView} style={{ marginLeft: "55px" }} />

                        <div
                            style={{
                                display: "flex",
                                alignItems: "end",
                                marginTop: 'auto',
                                paddingBottom: "15px",
                                justifyContent: "space-between",
                                width: "100%",
                                zIndex: "2"
                            }}
                        >
                            <p className='due-days-left'>
                                <img src={calender} /> Due: 13 Dec 2026
                            </p>
                            <img src={goodIcon} style={{ paddingRight: "12px" }} />
                        </div>
                    </div>
                </div>

                {/* CTA BUTTONS — Clickable */}
                <div className='cta-btn-container'>

                    <div
                        className="cta-btn cta-pay"
                        onClick={() => navigate("/driver/pay-road-tax")}
                        style={{ backgroundColor: "#023e8a80", cursor: "pointer" }}
                    >
                        <p>Pay Road <br />Tax</p>
                        <img src={chevron_left_sqr} className='cta-chv-btn' />
                        <div className='cta-img-container' style={{ left: '70px', top: '80px' }}>
                            <img src={pay_tax_img} />
                        </div>
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        onClick={() => navigate("/driver/scan-plate")}
                        style={{ backgroundColor: "#00c8b380", cursor: "pointer" }}
                    >
                        <p>Scan<br />Plate No.</p>
                        <img src={chevron_left_sqr} className='cta-chv-btn' />
                        <div className='cta-img-container' style={{ left: '90px', top: '60px' }}>
                            <img src={scan_plate_img} />
                        </div>
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        onClick={() => navigate("/driver/pay-insurance")}
                        style={{ backgroundColor: "#cb30e080", cursor: "pointer" }}
                    >
                        <p>Pay<br />Insurance</p>
                        <img src={chevron_left_sqr} className='cta-chv-btn' />
                        <div className='cta-img-container' style={{ left: '70px', top: '70px' }}>
                            <img src={pay_insurance_history} />
                        </div>
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        onClick={() => navigate("/driver/payment-history")}
                        style={{ backgroundColor: "rgba(0, 136, 255, 0.5)", cursor: "pointer" }}
                    >
                        <p>Payment<br />History</p>
                        <img src={chevron_left_sqr} className='cta-chv-btn' />
                        <div className='cta-img-container' style={{ left: '100px', top: '70px' }}>
                            <img src={transaction_history} />
                        </div>
                    </div>

                </div>

                {/* 🔥 This is where Profile.jsx will appear */}
                <Outlet />

            </div>
        </PhoneFrame>
    );
}
