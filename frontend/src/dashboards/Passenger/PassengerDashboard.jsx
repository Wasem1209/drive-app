import '../../styles/driverdashboard.css'

import PhoneFrame from "../../components/PhoneFrame";
import rectangle from "../../assets/Rectangle 2.svg";
import profilePic from '../../assets/image 1@2x.png';
import notificationBell from '../../assets/elements.png';
import eye_icon from '../../assets/Eye.png';
import streakImage from '../../assets/Group 43.png';
import check_icon from '../../assets/Frame 34.png';
import gift_icon from '../../assets/Frame 35.png';
import copy_icon from '../../assets/Copy.png';
import chevron_left_sqr from '../../assets/chevron-left-square.png';
import scanPlateIcon from '../../assets/scan plate img.png'
import payTpFareIcon from '../../assets/payTpIcon.png'
import reportDriverIcon from '../../assets/ReportDriverIcon.png'
import transaction_history from '../../assets/transactionHst.png'
import ConnectWallet from './features/ConnectWallet';
import { shorten } from '../../blockchain/cardanoWallet';
import VehicleVerifyModal from './features/VehicleVerifyModal';
import PayFare from './features/PayFare';
import DriverReview from './features/DriverReview';
import ReportDriver from './features/ReportDriver';
import TransactionHistory from './features/TransactionHistory';

// Add React state/hooks
import { useState, useEffect, useRef } from 'react';

export default function DriverDashboard() {
    const [showBalance, setShowBalance] = useState(true);
    const [walletId, setWalletId] = useState('');
    const [walletAmount, setWalletAmount] = useState('₳0.00');

    // small popup state + timer
    const [copied, setCopied] = useState(false);
    const [copyTimer, setCopyTimer] = useState(null);

    const toggleBalance = () => setShowBalance((v) => !v);

    const copyWalletId = async () => {
        if (!walletId) return;
        try {
            await navigator.clipboard.writeText(walletId);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = walletId;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
        }
        // show popup and auto-hide
        setCopied(true);
        if (copyTimer) clearTimeout(copyTimer);
        const t = setTimeout(() => setCopied(false), 1500);
        setCopyTimer(t);
    };

    // Weekly daily reward progression
    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // progressIndex: 0..6 => current claim day (Mon..Sun). Days < progressIndex are completed.
    // unlockAt: timestamp (ms) when current day's gift becomes "active" (starts shaking/claimable).
    const [progressIndex, setProgressIndex] = useState(0);
    const [unlockAt, setUnlockAt] = useState(Date.now());
    const [isActive, setIsActive] = useState(true);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [earlyHint, setEarlyHint] = useState("");
    const earlyHintTimerRef = useRef(null);
    const [showVerify, setShowVerify] = useState(false);
    const [showPayFare, setShowPayFare] = useState(false);
    const [postPaymentDriver, setPostPaymentDriver] = useState(null);
    const [showReport, setShowReport] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Inject shake animation keyframes only once
    useEffect(() => {
        const id = 'weekly-reward-shake-keyframes';
        if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.innerHTML = `@keyframes giftShake { 0%,100% { transform: rotate(0deg) translateY(0); } 20% { transform: rotate(7deg) translateY(-2px); } 40% { transform: rotate(-6deg) translateY(1px); } 60% { transform: rotate(5deg) translateY(-1px); } 80% { transform: rotate(-4deg) translateY(0); } }`;
            document.head.appendChild(style);
        }
    }, []);

    // Utilities
    const getNextLocalMidnight = () => {
        const d = new Date();
        // Sets to next local midnight
        d.setHours(24, 0, 0, 0);
        return d.getTime();
    };

    // Load persisted progression on mount
    useEffect(() => {
        try {
            const savedIdx = localStorage.getItem('weekly.progressIndex');
            const savedUnlock = localStorage.getItem('weekly.unlockAt');
            if (savedIdx !== null) setProgressIndex(parseInt(savedIdx, 10));
            if (savedUnlock !== null) setUnlockAt(parseInt(savedUnlock, 10));
        } catch { /* empty */ }
    }, []);

    // Keep isActive in sync with unlockAt and set a timer to flip when time elapses
    useEffect(() => {
        const now = Date.now();
        if (now >= unlockAt) {
            setIsActive(true);
            return;
        }
        setIsActive(false);
        const t = setTimeout(() => setIsActive(true), Math.max(0, unlockAt - now) + 50);
        return () => clearTimeout(t);
    }, [unlockAt]);

    // Persist changes
    useEffect(() => {
        try { localStorage.setItem('weekly.progressIndex', String(progressIndex)); } catch { /* empty */ }
    }, [progressIndex]);
    useEffect(() => {
        try { localStorage.setItem('weekly.unlockAt', String(unlockAt)); } catch { /* empty */ }
    }, [unlockAt]);

    const handleGiftClick = () => {
        // Allow claim only when active
        if (!isActive) {
            // Brief hint showing when it unlocks
            const nextDayName = allDays[progressIndex];
            setEarlyHint(`Available on ${nextDayName}`);
            if (earlyHintTimerRef.current) clearTimeout(earlyHintTimerRef.current);
            earlyHintTimerRef.current = setTimeout(() => setEarlyHint(""), 1500);
            return;
        }
        setShowClaimModal(true);
    };

    const confirmClaim = () => {
        // Mark current day complete and advance pointer
        const nextIdx = (progressIndex + 1) % allDays.length;
        setProgressIndex(nextIdx);
        // Next gift unlocks at next local midnight
        setUnlockAt(getNextLocalMidnight());
        setIsActive(false);
        setShowClaimModal(false);
        // Optional event hook
        window.dispatchEvent(new CustomEvent('weeklyReward:claimed', { detail: { dayIndex: (progressIndex), day: allDays[progressIndex] } }));
    };

    const closeModal = () => setShowClaimModal(false);

    return (
        <PhoneFrame>
            <div style={{ position: 'relative' }}>
                <div className='header-bar'>
                    {/* this div contains the component at the left(greeting, user image, user name) */}
                    <div className='header-left'>
                        {/* this div contains the avatar */}
                        <div>
                            <img
                                src={profilePic}
                                width={40}
                                height={40}
                                alt="Profile"
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                        {/* this div contains the greeting and user name */}
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '0px', }}>
                            <p className='welcom-greeting'>Welcom</p>
                            <p className='user-name'>Emeka D.</p>
                        </div>
                    </div>

                    {/* this component at the right is the notification icon button(notification bell) */}
                    <button
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}>
                        <img src={notificationBell} />
                    </button>

                </div>
                <img
                    src={rectangle}
                    alt="Rectangle"
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />

                {/* wallet */}
                <div
                    className="wallet"
                >
                    <div>
                        <div className='small-txt'>
                            <p style={{ margin: "0px" }}>Available Balance</p>
                            <img
                                src={eye_icon}
                                alt={showBalance ? "Hide balance" : "Show balance"}
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    paddingTop: '15px',
                                    paddingLeft: '8px',
                                    paddingBottom: '12px',
                                    cursor: 'pointer',
                                }}
                                onClick={toggleBalance}
                            />
                        </div>

                        <h2 className='wallet-amount'>
                            {showBalance ? walletAmount : '••••••••'}
                        </h2>

                        {walletId ? (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: 'pointer',
                                    position: 'relative' /* anchor popup */,
                                }}
                                onClick={copyWalletId}
                            >
                                <img
                                    src={copy_icon}
                                    alt="Copy Wallet ID"
                                    onClick={copyWalletId}
                                    style={{ cursor: 'pointer' }}
                                />
                                <h3 className="wallet-id small-txt" title="Click to copy">
                                    Wallet Id: {shorten(walletId)}
                                </h3>

                                {/* small popup below when copied */}
                                {copied && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: '100%',
                                            marginTop: '6px',
                                            background: '#111827',
                                            color: '#ffffff',
                                            borderRadius: '8px',
                                            padding: '6px 10px',
                                            fontSize: '12px',
                                            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        Copied to clipboard
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>


<<<<<<< HEAD
                    <ConnectWallet />
=======
                    <ConnectWallet onConnected={(w) => {
                        try {
                            if (w && w.address) {
                                setWalletId(w.address);
                            } else {
                                setWalletId('');
                            }
                            if (w && w.balance) setWalletAmount(`₳${w.balance}`);
                            else setWalletAmount('₳0.00');
                        } catch (e) { /* ignore */ }
                    }} />
>>>>>>> 993b6db23f45bad76087871123ed694352753687
                </div>

                {/* Weekly goal(streak) section */}
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
                            <p
                                className="streak-weeks-num"
                                style={{ paddingTop: "20px" }}
                            >{progressIndex}</p>
                            <p className="streak-label">Days <br></br>Streak</p>
                        </div>

                        <img
                            src={streakImage}
                            style={{
                                width: "50px",
                                height: "70px",
                                marginTop: "auto",
                                marginLeft: "1px"
                            }}
                        />
                    </div>

                    <div
                        className='weekly-streak-card'
                    >
                        <p className="weekly-title" style={{ textAlign: 'left' }}>Daily Reward</p>

                        <div className="week-dots">
                            {allDays.map((day, idx) => {
                                const isCompleted = idx < progressIndex;
                                const isCurrent = idx === progressIndex;
                                let iconNode;
                                if (isCurrent) {
                                    iconNode = (
                                        <img
                                            src={gift_icon}
                                            onClick={handleGiftClick}
                                            style={{ cursor: 'pointer', animation: isActive ? 'giftShake 1.2s ease-in-out infinite' : 'none', opacity: isActive ? 1 : 0.85 }}
                                            alt={isActive ? 'Daily Reward (Active)' : 'Daily Reward (Available soon)'}
                                        />
                                    );
                                } else if (isCompleted) {
                                    iconNode = <img src={check_icon} alt="Completed" />;
                                } else {
                                    iconNode = <img src={check_icon} alt="Pending" style={{ opacity: 0.2 }} />;
                                }
                                return (
                                    <div className="day-item" key={day} style={{ position: 'relative' }}>
                                        {iconNode}
                                        <span>{day}</span>
                                        {isCurrent && earlyHint && (
                                            <div style={{ position: 'absolute', top: '-26px', left: '50%', transform: 'translateX(-50%)', background: '#111827', color: '#fff', padding: '4px 8px', borderRadius: 8, fontSize: 11, whiteSpace: 'nowrap', boxShadow: '0 6px 12px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                {earlyHint}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {showClaimModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
                        <div style={{ width: '85%', maxWidth: 320, background: '#0f172a', color: '#fff', padding: '20px 18px 24px', borderRadius: 20, boxShadow: '0 12px 28px rgba(0,0,0,0.45)', textAlign: 'center', position: 'relative' }}>
                            <button onClick={closeModal} style={{ position: 'absolute', top: 10, right: 12, background: 'transparent', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer' }}>×</button>
                            <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>Weekly Reward</h3>
                            <p style={{ margin: '0 0 14px', fontSize: 13, lineHeight: '18px' }}>
                                Congrats! You've completed up to Thursday. Claim your weekly reward to finalize the streak and unlock bonus points.
                            </p>
                            <button
                                onClick={confirmClaim}
                                style={{ background: 'linear-gradient(90deg,#2563eb,#3b82f6)', border: 'none', color: '#fff', padding: '10px 18px', fontSize: 14, borderRadius: 999, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
                            >
                                Claim Reward
                            </button>
                            <div style={{ marginTop: 14, fontSize: 11, opacity: 0.7 }}>Reward will mark all days as completed.</div>
                        </div>
                    </div>
                )}

                {/* CTA Buttons(pay road taxs, scan plate no, Pay insurance etc) */}
                <div className='cta-btn-container'>
                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "rgba(52, 199, 89, 0.5)",
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                        onClick={() => setShowVerify(true)}
                        title="Scan or manually verify a vehicle"
                    >
                        <p>Scan <br />& Verify</p>
                        <img
                            src={chevron_left_sqr}
                            className='cta-chv-btn'
                        />
                        <div
                            className='cta-img-container'
                            style={{ left: '90px', top: '50px' }}
                        >
                            <img src={scanPlateIcon} />
                        </div>
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "rgba(0, 200, 179, 0.5)",
                            position: 'relative',
                        }}
                        onClick={() => setShowPayFare(true)}
                    >
                        <p>Pay  <br />TP Fare</p>
                        <img
                            src={chevron_left_sqr}
                            className='cta-chv-btn'
                        />
                        <div
                            className='cta-img-container'
                            style={{ left: '78px', top: '80px' }}
                        >
                            <img src={payTpFareIcon} />
                        </div>
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "rgba(234, 106, 106, 0.5)",
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                        onClick={() => setShowReport(true)}
                        title="Report unsafe or illegal activity"
                    >
                        <p>Report <br />Driver</p>
                        <img
                            src={chevron_left_sqr}
                            className='cta-chv-btn'
                        />
                        <div
                            className='cta-img-container'
                            style={{ left: '90px', top: '70px' }}
                        >
                            <img src={reportDriverIcon} />
                        </div>
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "rgba(0, 136, 255, 0.5)",
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                        onClick={() => setShowHistory(true)}
                        title="View past fare payments"
                    >
                        <p>Payment <br />History</p>
                        <img
                            src={chevron_left_sqr}
                            className='cta-chv-btn'
                        />
                        <div
                            className='cta-img-container'
                            style={{ left: '100px', top: '70px' }}
                        >
                            <img src={transaction_history} />
                        </div>
                    </div>

                </div>
            </div>
            {showVerify && <VehicleVerifyModal onClose={() => setShowVerify(false)} />}
            {showPayFare && (
                <PayFare
                    onClose={() => setShowPayFare(false)}
                    onPaymentSuccess={(driverInfo) => {
                        setShowPayFare(false);
                        setPostPaymentDriver(driverInfo);
                    }}
                />
            )}
            {postPaymentDriver && (
                <DriverReview
                    driver={postPaymentDriver}
                    onClose={() => setPostPaymentDriver(null)}
                />
            )}
            {showReport && (
                <ReportDriver
                    onClose={() => setShowReport(false)}
                    prefillWallet={postPaymentDriver?.walletId}
                />
            )}
            {showHistory && (
                <TransactionHistory onClose={() => setShowHistory(false)} />
            )}
        </PhoneFrame>
    )
}