# 🚦 Autofy Frontend · Cardano-Powered Urban Mobility

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![Cardano](https://img.shields.io/badge/Cardano-Layer1-0033ad?logo=cardano&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-black)

> Autofy secures and digitizes urban mobility by minting a Digital Vehicle Identity (DVI) NFT on Cardano. The DVI anchors compliance metadata, ownership proofs, and verified status on-chain so that drivers, passengers, and enforcement teams share a single tamper-proof source of truth.

<p align="center">
	<img src="public/images/OIP.webp" alt="Autofy mobile UI preview" width="520" />
</p>

## 🔎 Product Snapshot

- **Digital Vehicle Identity (DVI) NFT**: Stores compliance metadata (roadworthiness, insurance, tax), ownership lineage, and verification state directly on Cardano.
- **Safe Driving Token Rewards**: Good behavior and real-time compliance snapshots translate into token incentives and instant on-chain receipts for renewals, fines, and insurance.
- **QR-first Passenger Safety**: Riders can scan once to view live vehicle status, trigger on-chain fare payments, and automatically split revenue with operators.
- **Officer Command Console**: Enforcement agents issue digital violations, validate compliance instantly, and feed a national mobility analytics dashboard.

## 🌍 Core Value Propositions

### 🚘 Drivers

- Real-time compliance snapshot for inspections and peace of mind.
- Streamlined renewals, taxes, insurance, and fines with on-chain proofs.
- Tokenized incentives for safe driving and timely documentation.

### 🧍 Passengers

- One-tap QR verification ensures the vehicle meets safety and insurance thresholds.
- Digital fare payments with automatic revenue splits and immutable receipts.

### 🛂 Government & Enforcement

- Instant compliance enforcement backed by tamper-proof DVIs.
- Digital violation issuance plus national transport analytics for proactive policy.

## 🧭 Solution Pillars

- **On-chain Identity Layer**: Aiken smart contracts mint DVIs as NFTs, guaranteeing authenticity and traceability.
- **Compliance Orchestration API**: Node.js/Express + MongoDB backend syncs regulatory workflows, integrates Lucid for Cardano transactions, and sends email/notification events.
- **User Experience Layer**: This React + Vite frontend delivers driver dashboards, passenger verifications, officer tools, and a phone-frame marketing site.
- **Analytics & Automation**: Event streams feed dashboards for mobility KPIs, violations, and compliance trends.

## 🧰 Tech Stack

| Layer         | Tools                                                                    | Highlights                                                                |
| ------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Frontend 🎨   | React 19, Vite 7, React Router, Framer Motion, Lucide Icons              | Responsive marketing + driver/passenger flows, PhoneFrame device previews |
| Backend ⚙️    | Node.js, Express 5, MongoDB/Mongoose, Lucid Cardano SDK, JWT, Nodemailer | Auth, compliance workflows, digital receipts, email verification          |
| Blockchain ⛓️ | Cardano, Aiken, Lucid                                                    | Mint/verify DVIs, safe-driving rewards, govern on-chain receipts          |
| Tooling 🧪    | ESLint 9, TypeScript (backend), npm scripts                              | Consistent linting, type safety, DX optimizations                         |

## 📦 Repository Layout

```
drive-app/
├─ frontend/        # This Vite React experience (current folder)
├─ backend/         # Node/Express API + MongoDB models + Lucid integration
└─ blockchain/      # Cardano contracts (Aiken) & validator artifacts
```

## ⚙️ Quick Start

### Frontend (this package)

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Navigate to the printed URL (default `http://localhost:5173`) to explore the marketing site, auth flows, and dashboard mockups.

### Backend API

1. `cd backend`
2. `npm install`
3. Add environment variables (Mongo URI, JWT secret, Cardano keys, Email provider).
4. `npm run dev` to boot the Express server with hot reload via `ts-node`.

### Cardano / Smart Contracts

1. `cd blockchain/autofy`
2. `aiken build` to compile validators.
3. `aiken check` to run contract tests or `aiken docs` for HTML docs.

## 🧪 Quality & Scripts

- `npm run lint` — ESLint with React Hooks + Refresh rules.
- `npm run build` — Production build via Vite.
- `npm run preview` — Serve the built assets locally.

## 💡 UI Highlights

- `src/pages/Home.jsx` pairs storytelling copy with the `PhoneFrame` component for a live device mockup.
- `src/auth` hosts Login/Register/Verify screens that tie into the compliance onboarding journey.
- Token, typography, and layout primitives live under `src/styles` and `src/assets` to keep branding cohesive.

## 🗺️ Roadmap

1. Connect the React forms to live backend endpoints for authentication and profile management.
2. Stream QR verification results from the DVI NFT directly into the PhoneFrame preview.
3. Embed driver compliance timelines and safe-driving reward balances via Cardano data pulls.
4. Expand officer dashboard widgets for violation heatmaps and analytics.

## 🔌 Cardano Wallet Bootstrap (Stub Implemented)

The dashboards now include a reusable `ConnectWallet` component (per role) that performs minimal CIP-30 wallet detection and enabling. It lives in each role's `features/ConnectWallet` file and relies on the shared utility `src/blockchain/cardanoWallet.js`.

What exists now:

- Detects installed wallets: Nami, Eternl, Lace, Gero (extend list in `KNOWN_WALLETS`).
- Simple chooser popover and connect flow; dispatches `cardano:walletConnected` & `cardano:walletEnabled` window events.
- Exposes the first used address (raw hex/bech32) and shortens it for UI.
- Placeholders for: `buildUnsignedTx`, richer address decoding, balance parsing.

Blockchain engineer next steps:

1. Replace `getUsedAddresses` post-processing with bech32 decoding or a Lucid-based address normalization.
2. Implement `buildUnsignedTx` (pull in Lucid or your chosen SDK) and feed into `signTx` + `submitTx` already stubbed.
3. Add network discrimination (mainnet/testnet) via `api.getNetworkId()` and surface in UI.
4. Expand emitted events (e.g. `cardano:balanceUpdated`, `cardano:txSubmitted`) for reactive components.
5. Harden error states (e.g. differentiate user rejection vs internal errors).

Quick usage pattern inside any React component:

```jsx
import ConnectWallet from "../dashboards/Driver/features/ConnectWallet";

function Example() {
  const handleConnected = ({ api, key, address }) => {
    // store in context, fetch balance, etc.
  };
  return <ConnectWallet onConnected={handleConnected} />;
}
```

Global event hook example:

```js
window.addEventListener("cardano:walletConnected", (e) => {
  console.log("Wallet connected:", e.detail);
});
```

Extend `cardanoWallet.js` to parse balances (CBOR → lovelace → ADA) and surface token / NFT assets once required.

## 🧩 Passenger Feature Modules (Frontend ↔ Backend Integration)

This section documents the passenger-focused React feature components and their current mock API contracts so backend engineers can implement real endpoints without breaking the UI.

### Overview

| Component          | Path                                                       | Purpose                                                                                                               | Backend Endpoints Needed                                       |
| ------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| VehicleVerifyModal | `src/dashboards/Passenger/features/VehicleVerifyModal.jsx` | Live camera plate OCR + vehicle compliance snapshot (roadworthiness, insurance, tax, driver profile, reviews, fines). | `GET /vehicles/:plate` (verification), `POST /alpr/scan` (OCR) |
| PayFare            | `src/dashboards/Passenger/features/PayFare.jsx`            | Multi-step fare payment (details → confirm → receipt) + post-payment review trigger.                                  | `POST /payments/fare`                                          |
| DriverReview       | `src/dashboards/Passenger/features/DriverReview.jsx`       | Submit qualitative + rating review tied to driver identity.                                                           | `POST /reviews`                                                |
| ReportDriver       | `src/dashboards/Passenger/features/ReportDriver.jsx`       | Safety / misconduct report with optional photo + geolocation.                                                         | `POST /reports`                                                |

Mock helpers live under `src/api/` and must be replaced by real `fetch`/SDK wrappers.

### 1. Vehicle Verification Flow

UI States: camera active, auto-detect loop, manual entry, loading, error, result (found/not found).

Key Functions:

- `submitFrameForALPR(dataUrl)` (mock) → returns `{ plate, rawText }`.
- `verifyVehicle(plate)` (mock) → returns `{ found, query, data }`.

Expected Backend Contracts:

- `POST /alpr/scan` Body: `{ imageBase64: string }` → `{ plate: string, rawText: string, confidence?: number }`
- `GET /vehicles/:plate` Response example:
  ```json
  {
    "found": true,
    "plate": "ABC123JK",
    "driver": {
      "id": "drv-001",
      "name": "John Doe",
      "rating": 4.7,
      "weeklySafeScore": 92,
      "violationsThisYear": 1,
      "lastViolation": {
        "type": "Speeding",
        "date": "2025-11-01",
        "cleared": true
      },
      "reviews": [
        { "id": "rev-1", "by": "Passenger#22", "text": "Calm driving." }
      ]
    },
    "roadworthiness": {
      "status": "Valid",
      "expires": "2026-02-01",
      "nextDue": null
    },
    "insurance": { "status": "Valid", "expires": "2026-05-01" },
    "tax": { "status": "Valid", "nextDue": "2026-01-01" },
    "compliance": { "outstandingFines": 0, "lastScan": 1732969200000 }
  }
  ```

Frontend expects: missing or malformed fields gracefully degrade (e.g. empty reviews array). Keep naming consistent to avoid adapter code.

### 2. Fare Payment Flow (`PayFare`)

Steps: `details` → `confirm` → `success|error`.

Mock call: `initiateFarePayment({ walletId, route, amount, wallet })` returns:

```json
{
  "receiptId": "rcpt-abc123",
  "txHash": "0xdeadbeef...",
  "split": { "driver": 94, "gov": 6 },
  "driverId": "drv-mock-001",
  "driverName": "Mock Driver"
}
```

Proposed Endpoint: `POST /payments/fare`
Request Body:

```json
{
  "driverWallet": "001123983",
  "route": "Ojota-CMS",
  "amountAda": 2.5,
  "walletProvider": "cardano"
}
```

Response Body (minimum): receipt identifiers, normalized driver identity, revenue split percentages, optional regulatory tax breakdown.

After success, the component triggers `onPaymentSuccess(driverInfo)` to open `DriverReview`. Persist driver wallet for later report prefill (suggested implementation in backend-integrated version: store last driver `localStorage.setItem('lastDriverWallet', driverWallet)` after success).

### 3. Driver Review (`DriverReview`)

Fields: `driverId`, `rating` (int 1–5), `text` (optional).

Proposed Endpoint: `POST /reviews`
Request Body:

```json
{ "driverId": "drv-001", "rating": 5, "text": "Smooth and safe ride." }
```

Response Body:

```json
{ "reviewId": "rev-xyz", "createdAt": 1732969200000 }
```

Backend should aggregate reviews for `GET /vehicles/:plate` driver section, plus compute average rating and safe-score metrics.

### 4. Safety Report (`ReportDriver`)

Fields captured:

- `driverWallet` OR `vehiclePlate` (one required)
- `category` (enum)
- `details` (free text)
- `photoData` (base64 JPEG, optional)
- `location` `{ lat, lng }` optional if geolocation succeeds

Proposed Endpoint: `POST /reports`
Request Body:

```json
{
  "driverWallet": "001123983",
  "vehiclePlate": "ABC123JK",
  "category": "Dangerous Driving",
  "details": "Repeated sharp lane cuts at speed.",
  "photoBase64": "data:image/jpeg;base64,/9j/...",
  "location": { "lat": 6.5244, "lng": 3.3792 }
}
```

Response Body:

```json
{ "referenceId": "rpt-20251130-001", "timestamp": 1732969200000 }
```

Future Enhancements: push to officer console, hash report metadata on-chain for integrity later.

### 5. Mock API Layer Replacement

Files to swap:

- `src/api/verifyVehicle.js` → replace with `fetch('/vehicles/' + plate)`.
- `src/api/alpr.js` → `fetch('/alpr/scan', { method: 'POST', body: { imageBase64 } })`.
- `src/api/payments.js` → `POST /payments/fare`.
- `src/api/reviews.js` → `POST /reviews`.
- `src/api/reports.js` → `POST /reports`.

Pattern Recommendation:

```js
export async function apiFetch(path, opts = {}) {
  const res = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

Then wrap each endpoint call maintaining the same resolved shape expected by components.

### Data Validation & Security Notes

- Enforce rate limiting on ALPR scans and reports (IP + auth token).
- Sanitize `details` and `text` to prevent HTML injection for later rich displays.
- Store images in object storage (convert base64 → file) and return durable URL in response; frontend can adapt easily.
- Include server time in responses for consistency (avoid client clock skew affecting compliance timelines).

### Backend Implementation Checklist

1. Define endpoint schemas (OpenAPI/TypeScript interfaces) matching proposed contracts.
2. Implement ALPR processor (service or third-party) with fallback confidence thresholds.
3. Connect Cardano transaction builder for fare payments; persist receipt + split logic.
4. Link reviews to driver ID; update aggregate rating + safe score derivation logic.
5. Persist reports, index by driver/plate, and emit moderation events for officer dashboard.
6. Add authentication & authorization (ensure passenger identity for reports/reviews, driver identity for compliance queries if restricted).
7. Replace mock functions with real fetch wrappers; keep return shape stable.
8. Add error codes (e.g., `VEHICLE_NOT_FOUND`, `PAYMENT_INSUFFICIENT_FUNDS`) for granular UI messages.

### Extension Points

- Emit WebSocket events for real-time review additions or compliance changes.
- Introduce pagination for reviews when volume grows.
- Add dispute flow for inaccurate reports (driver appeal) linked to report `referenceId`.
- Integrate risk scoring on report aggregation (e.g., multiple unique passenger reports within time window).

## 🤝 Contributing & Support

- Open issues for features, design tweaks, or blockchain/UX integration gaps.
- Share screenshots or UX recordings to help validate compliance flows.
- Reach out via repository discussions for partnership inquiries or deployment support.
