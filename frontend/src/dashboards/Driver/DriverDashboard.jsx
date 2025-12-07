import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import "../../styles/driverdashboard.css";

import PhoneFrame from "../../components/PhoneFrame";
import rectangle from "../../assets/Rectangle 2.svg";
import DueNotification from "../../components/DueNotification";
import profilePic from "../../assets/image 1@2x.png";
import notificationBell from "../../assets/elements.png";
import eye_icon from "../../assets/Eye.png";
import streakImage from "../../assets/Group 43.png";
import check_icon from "../../assets/Frame 34.png";
import goodIcon from "../../assets/check.png";
import gift_icon from "../../assets/Frame 35.png";
import calender from "../../assets/calender.png";
import closeIcon from "../../assets/clsoeIcon.png";
import carSideView from "../../assets/car side view.png";
import carFrontView from "../../assets/car front view.png";
import copy_icon from "../../assets/Copy.png";
import chevron_left_sqr from "../../assets/chevron-left-square.png";
import pay_tax_img from "../../assets/pay-tax-img.png";
import scan_plate_img from "../../assets/scan plate img.png";
import pay_insurance_history from "../../assets/pay_insurance_history_img.png";
import transaction_history from "../../assets/transactionHst.png";

import PayRoadTax from "./features/PayRoadTax.jsx";
import ScanPlateNo from "./features/ScanPlateNo.jsx";
import TransactionHistory from "../Passenger/features/TransactionHistory";
import { hexToBech32, parseBalance } from "../../utils/cardano";

export default function DriverDashboard() {
  const navigate = useNavigate();

  // UI state
  const [showPayTax, setShowPayTax] = useState(false);
  const [showScanPlate, setShowScanPlate] = useState(false);
  const [showPayInsurance, setShowPayInsurance] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Wallet state (kept local; guarded for SSR)
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0.00");
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [connectionNotice, setConnectionNotice] = useState("");
  const [connectingProvider, setConnectingProvider] = useState("");

  // Discover wallet providers (runs on demand, safe for SSR because it runs on click)
  const discoverProviders = () => {
    try {
      if (typeof window === "undefined") {
        setAvailableProviders([]);
        setConnectionNotice(
          "Wallet detection is only available in the browser."
        );
        return;
      }

      const keys = window.cardano ? Object.keys(window.cardano) : [];
      const found = keys.filter(Boolean);
      setAvailableProviders(found);
      if (!found.length) {
        setConnectionNotice(
          "No wallet extensions detected. Please install or enable a Cardano wallet extension (Nami, Lace, Eternl, Flint) and refresh the page."
        );
      } else {
        setConnectionNotice("");
      }
    } catch (e) {
      setAvailableProviders([]);
      setConnectionNotice(
        "Unable to detect wallet extensions. Check browser extensions or try a different browser."
      );
    }
  };

  const connectToProvider = async (provider) => {
    try {
      setConnectingProvider(provider);
      setConnectionNotice("");
      await enableProvider(provider);
    } catch (e) {
      console.error("connectToProvider error", e);
      setConnectionNotice(e && e.message ? e.message : "Failed to connect to provider.");
    } finally {
      setConnectingProvider("");
    }
  };

  const enableWithTimeout = async (wallet, timeoutMs = 8000) => {
    return new Promise(async (resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          reject(new Error("timeout"));
        }
      }, timeoutMs);

      try {
        const api = await wallet.enable();
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(api);
        }
      } catch (e) {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(e);
        }
      }
    });
  };

  const enableProvider = async (provider) => {
    try {
      setConnectionNotice("");
      if (typeof window === "undefined" || !window.cardano || !window.cardano[provider])
        throw new Error("provider not available");

      const wallet = window.cardano[provider];

      // Try detect previous enable state
      let wasEnabled = false;
      try {
        if (typeof wallet.isEnabled === "function") {
          wasEnabled = await wallet.isEnabled();
        } else if (typeof wallet.isEnabled !== "undefined") {
          wasEnabled = Boolean(wallet.isEnabled);
        }
      } catch (e) {
        /* ignore */
      }

      if (wasEnabled) {
        let disabled = false;
        try {
          if (typeof wallet.disable === "function") {
            await wallet.disable();
            disabled = true;
          } else if (typeof wallet.disconnect === "function") {
            await wallet.disconnect();
            disabled = true;
          } else if (wallet.experimental && typeof wallet.experimental.disconnect === "function") {
            await wallet.experimental.disconnect();
            disabled = true;
          }
        } catch (e) {
          // ignore any errors while trying to disable
        }

        if (!disabled) {
          setConnectionNotice(
            "It appears you previously granted this site access. To force the wallet to prompt again, open the wallet extension and revoke site permission for this site, then try connecting."
          );
        }
      }

      let api;
      try {
        api = await enableWithTimeout(wallet, 8000);
      } catch (e) {
        if (e && e.message === "timeout") {
          setConnectionNotice(
            "The wallet extension did not respond. Make sure the extension is enabled, site permissions are granted, or try reinstalling the extension."
          );
          return;
        }
        throw e;
      }

      // extract a bech32 address (try used -> change -> reward)
      let addr = "";
      try {
        const used = api.getUsedAddresses ? await api.getUsedAddresses() : [];
        if (used && used.length)
          addr = used[0].startsWith("addr") ? used[0] : hexToBech32(used[0]);
      } catch (e) {}
      try {
        if (!addr && api.getChangeAddress) {
          const change = await api.getChangeAddress();
          if (change) addr = change.startsWith("addr") ? change : hexToBech32(change);
        }
      } catch (e) {}
      try {
        if (!addr && api.getRewardAddresses) {
          const r = await api.getRewardAddresses();
          if (r && r.length) addr = r[0].startsWith("addr") ? r[0] : hexToBech32(r[0]);
        }
      } catch (e) {}
      if (!addr) addr = "addr_test1qpxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

      setWalletAddress(addr);
      setWalletConnected(true);

      try {
        if (api.getBalance) {
          const b = await api.getBalance();
          const parsed = parseBalance(b);
          // parsed is lovelace as string; convert to ADA-ish display (divide by 1e6)
          try {
            const lov = BigInt(parsed);
            const whole = lov / BigInt(1000000);
            const frac = lov % BigInt(1000000);
            // show up to 6 decimals but trim trailing zeros, show at least 2 decimals
            let fracStr = frac.toString().padStart(6, "0");
            // trim trailing zeros but keep at least 2 decimals
            fracStr = fracStr.replace(/0+$/, "");
            if (fracStr.length < 2) fracStr = frac.toString().padStart(2, "0");
            const adaStr =
              fracStr === "" ? whole.toString() : `${whole.toString()}.${fracStr}`;
            setBalance(adaStr);
          } catch (e) {
            // fallback: show raw parsed
            setBalance(parsed);
          }
        } else setBalance("10000.00");
      } catch (e) {
        setBalance("10000.00");
      }

      setWalletModalOpen(false);
    } catch (e) {
      console.error("enableProvider error", e);
      // don't block UI; show notice
      setConnectionNotice(
        (e && e.message) || "Failed to enable provider. Check extension settings or try another provider."
      );
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setBalance("0.00");
    setWalletModalOpen(false);
  };

  // simple inline modal style objects (kept local)
  const modalOverlay = {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 400,
  };
  const modalBox = {
    width: "92%",
    maxWidth: 420,
    background: "#0f172a",
    color: "#fff",
    padding: "22px",
    borderRadius: 12,
  };
  const modalBtn = {
    background: "linear-gradient(90deg,#2563eb,#3b82f6)",
    border: "none",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    width: "100%",
    marginBottom: 8,
  };
  const modalBtnRed = {
    background: "linear-gradient(90deg,#ef4444,#dc2626)",
    border: "none",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    width: "100%",
    marginBottom: 8,
  };
  const modalCancel = {
    background: "transparent",
    border: "1px solid #334155",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    width: "100%",
  };

  return (
    <PhoneFrame>
      <div style={{ position: "relative", width: "100%", overflowX: "hidden" }}>
        {/* HEADER */}
        <div className="header-bar">
          <div className="header-left">
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

            <div style={{ display: "flex", flexDirection: "column", lineHeight: "0px" }}>
              <p className="welcom-greeting">Welcome</p>
              <p className="user-name">Emeka Dave.</p>
            </div>
          </div>

          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <img src={notificationBell} alt="Notifications" />
          </button>
        </div>

        <img src={rectangle} alt="Rectangle" style={{ width: "100%", height: "auto" }} />

        {/* WALLET SECTION */}
        <div className="wallet">
          <div>
            <div className="small-txt">
              <p style={{ margin: "0px" }}>Available Balance</p>
              <img
                src={eye_icon}
                alt="Eye Icon"
                style={{
                  width: "12px",
                  height: "12px",
                  paddingTop: "15px",
                  paddingLeft: "8px",
                  paddingBottom: "12px",
                  cursor: "pointer",
                }}
              />
            </div>

            <h2 className="wallet-amount">{walletConnected ? `₳${balance}` : "₳0.00"}</h2>

            {walletConnected && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <img src={copy_icon} alt="Copy Icon" />
                <h3 className="wallet-id small-txt">{walletAddress.slice(0, 12)}...{walletAddress.slice(-6)}</h3>
              </div>
            )}
          </div>

          {/* OPEN WALLET MODAL BUTTON */}
          <button onClick={() => { discoverProviders(); setWalletModalOpen(true); }} className="connect-wallet-btn">
            {walletConnected ? "Wallet Connected ✔" : "Connect Wallet"}
          </button>

          {/* wallet debug info removed */}
        </div>

        {/* WALLET MODAL */}
        {walletModalOpen && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <h2 style={{ marginBottom: "10px" }}>{walletConnected ? "Wallet Connected" : "Connect Wallet"}</h2>

              {!walletConnected ? (
                <>
                  <p style={{ marginBottom: "8px" }}>
                    Choose a wallet to connect (click will trigger the extension prompt)
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {availableProviders.length === 0 ? (
                      <div style={{ fontSize: 13, opacity: 0.8 }}>No wallet extensions detected. Install Nami, Lace, Eternl, or Flint.</div>
                    ) : (
                      availableProviders.map((p) => (
                        <button
                          key={p}
                          style={modalBtn}
                          onClick={() => connectToProvider(p)}
                          disabled={Boolean(connectingProvider) && connectingProvider !== p}
                        >
                          {connectingProvider === p ? 'Connecting...' : `Connect ${p[0].toUpperCase() + p.slice(1)}`}
                        </button>
                      ))
                    )}
                  </div>

                  <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
                    <div>If an extension does not prompt, open its settings and revoke site permission to force confirmation next time.</div>
                    {connectionNotice && (
                      <div style={{ marginTop: 8, color: '#f59e0b', fontSize: 13 }}>{connectionNotice}</div>
                    )}
                    {connectionNotice && availableProviders.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <button
                          style={modalBtn}
                          onClick={() => {
                            const p = availableProviders[0];
                            if (p) connectToProvider(p);
                          }}
                        >
                          Retry Connect
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <button style={modalCancel} onClick={() => setWalletModalOpen(false)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: "20px" }}>
                    Connected as <br />
                    <b>{walletAddress.slice(0, 12)}...{walletAddress.slice(-6)}</b>
                  </p>

                  <button style={modalBtnRed} onClick={disconnectWallet}>Disconnect Wallet</button>

                  <button style={modalCancel} onClick={() => setWalletModalOpen(false)}>Close</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* WEEKLY GOAL */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '62px', paddingInline: '20px' }}>
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

        {/* VEHICLE DETAILS */}
        <div className='vehicle-details-section'>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Safe Driving */}
            <div className='safe-driving-card vehicle-detail-card' onClick={() => navigate("/driver/safe-driving")} style={{ cursor: "pointer" }}>
              <p className="sd-title">Safe Driving</p>
              <p className="sd-subtitle">Your Weekly safe <br />driving score</p>
              <div style={{ display: "flex", alignItems: "end", justifyContent: "center", width: "100%" }}>
                <p className='driving-score score-percent typ-page-title'>75</p>
                <p className='driving-score score-total'>/100</p>
              </div>
            </div>

            {/* Insurance */}
            <div className='insurance-card vehicle-detail-card' onClick={() => navigate("/driver/insurance")} style={{ cursor: "pointer" }}>
              <p className="sd-title">Insurance</p>
              <p className="sd-subtitle">Your Vehicle’s insurance <br />is Due</p>

              <div style={{ display: "flex", alignItems: "end", marginTop: 'auto', paddingBottom: "15px", justifyContent: "space-between", width: "100%", zIndex: "2" }}>
                <p className='due-days-left'>
                  <img src={calender} /> Due: 10 Jan 2025
                </p>
                <img src={closeIcon} style={{ paddingRight: "18px" }} />
              </div>

              <img src={carSideView} className='car-side-view' />
            </div>
          </div>

          {/* Roadworthiness */}
          <div className='roadworthiness-card vehicle-detail-card' onClick={() => navigate("/driver/roadworthiness")} style={{ cursor: "pointer" }}>
            <p className="road-worthy-stat">Roadworthy</p>
            <p className="road-worthy-user-stat">Your Vehicle is roadworthy</p>

            <img src={carFrontView} style={{ marginLeft: "55px" }} />

            <div style={{ display: "flex", alignItems: "end", marginTop: 'auto', paddingBottom: "15px", justifyContent: "space-between", width: "100%", zIndex: "2" }}>
              <p className='due-days-left'>
                <img src={calender} /> Due: 13 Dec 2026
              </p>
              <img src={goodIcon} style={{ paddingRight: "12px" }} />
            </div>
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div className='cta-btn-container'>
          <div className="cta-btn cta-pay" onClick={() => setShowPayTax(true)} style={{ backgroundColor: "#023e8a80", cursor: "pointer" }}>
            <p>Pay Road <br />Tax</p>
            <img src={chevron_left_sqr} className='cta-chv-btn' />
            <div className='cta-img-container' style={{ left: '70px', top: '80px' }}>
              <img src={pay_tax_img} />
            </div>
          </div>

          <div className="cta-btn cta-pay" onClick={() => setShowScanPlate(true)} style={{ backgroundColor: "#00c8b380", cursor: "pointer" }}>
            <p>Scan<br />Plate No.</p>
            <img src={chevron_left_sqr} className='cta-chv-btn' />
            <div className='cta-img-container' style={{ left: '310px', top: '60px' }}>
              <img src={scan_plate_img} />
            </div>
          </div>

          <div className="cta-btn cta-pay" onClick={() => setShowPayInsurance(true)} style={{ backgroundColor: "#cb30e080", cursor: "pointer" }}>
            <p>Pay<br />Insurance</p>
            <img src={chevron_left_sqr} className='cta-chv-btn' />
            <div className='cta-img-container' style={{ left: '80px', top: '250px' }}>
              <img src={pay_insurance_history} />
            </div>
          </div>

          <div className="cta-btn cta-pay" onClick={() => setShowHistory(true)} style={{ backgroundColor: "rgba(0, 136, 255, 0.5)", cursor: "pointer" }}>
            <p>Payment<br />History</p>
            <img src={chevron_left_sqr} className='cta-chv-btn' />
            <div className='cta-img-container' style={{ left: '300px', top: '250px' }}>
              <img src={transaction_history} />
            </div>
          </div>
        </div>

        {/* Profile Pages Render Here */}
        <Outlet />

        {/* Modals / inline feature components (open instead of navigating) */}
        {showPayTax && <PayRoadTax onClose={() => setShowPayTax(false)} />}
        {showScanPlate && <ScanPlateNo onClose={() => setShowScanPlate(false)} />}
        {showPayInsurance && <PayRoadTax onClose={() => setShowPayInsurance(false)} mode="insurance" />}
        {showHistory && <TransactionHistory onClose={() => setShowHistory(false)} />}

      </div>
    </PhoneFrame>
  );
}


// ===== MODAL INLINE STYLES =====
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalBox = {
  width: "85%",
  maxWidth: "400px",
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  textAlign: "center",
  animation: "fadeIn 0.2s ease-in-out",
};

const modalBtn = {
  width: "100%",
  padding: "12px",
  background: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  marginBottom: "10px",
  cursor: "pointer",
};

const modalBtnRed = {
  width: "100%",
  padding: "12px",
  background: "#d32f2f",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "1rem",
  marginBottom: "10px",
  cursor: "pointer",
};

const modalCancel = {
  width: "100%",
  padding: "10px",
  background: "#e0e0e0",
  color: "#333",
  border: "none",
  borderRadius: "8px",
  fontSize: "0.9rem",
  cursor: "pointer",
};
