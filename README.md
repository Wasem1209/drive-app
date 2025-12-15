# 🚦 Autofy Frontend · Cardano-Powered Urban Mobility

![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff.svg?logo=vite&logoColor=white)
![Cardano](https://img.shields.io/badge/Cardano-Layer1-0033ad.svg?logo=cardano&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-black.svg)

> Autofy secures and digitizes urban mobility by minting a Digital Vehicle Identity (DVI) NFT on Cardano. The DVI anchors compliance metadata, ownership proofs, and verified status on-chain so that drivers, passengers, and enforcement teams share a single tamper-proof source of truth.

<p align="center">
    <img src="frontend/public/images/autofy-hero.svg" alt="Autofy hero" width="620" />
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

| Layer         | Tools                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Highlights                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Frontend 🎨   | ![React](https://img.shields.io/badge/-React-20232a.svg?logo=react&logoColor=61dafb) ![Vite](https://img.shields.io/badge/-Vite-563d7c.svg?logo=vite&logoColor=ffd62e) ![React Router](https://img.shields.io/badge/-React%20Router-000000.svg?logo=reactrouter&logoColor=ca4245) ![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-000000.svg?logo=framer&logoColor=fff) ![Lucide](https://img.shields.io/badge/-Lucide-111.svg?logo=lucide&logoColor=70c1ff)                                                                                | Responsive marketing + driver/passenger flows, PhoneFrame device previews |
| Backend ⚙️    | ![Node.js](https://img.shields.io/badge/-Node.js-3c873a.svg?logo=node.js&logoColor=fff) ![Express](https://img.shields.io/badge/-Express-000000.svg?logo=express&logoColor=fff) ![MongoDB](https://img.shields.io/badge/-MongoDB-001e2b.svg?logo=mongodb&logoColor=4db33d) ![Lucid](https://img.shields.io/badge/-Lucid%20Cardano-0033ad.svg?logo=cardano&logoColor=fff) ![JWT](https://img.shields.io/badge/-JWT-000000.svg?logo=jsonwebtokens&logoColor=fff) ![Nodemailer](https://img.shields.io/badge/-Nodemailer-23c552.svg?logo=gmail&logoColor=fff) | Auth, compliance workflows, digital receipts, email verification          |
| Blockchain ⛓️ | ![Cardano](https://img.shields.io/badge/-Cardano-0033ad.svg?logo=cardano&logoColor=fff) ![Aiken](https://img.shields.io/badge/-Aiken-111.svg?logo=laravelnova&logoColor=fff) ![Lucid](https://img.shields.io/badge/-Lucid%20SDK-0b132b.svg?logo=lua&logoColor=fff)                                                                                                                                                                                                                                                                                         | Mint/verify DVIs, safe-driving rewards, govern on-chain receipts          |
| Tooling 🧪    | ![ESLint](https://img.shields.io/badge/-ESLint-4b32c3.svg?logo=eslint&logoColor=fff) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6.svg?logo=typescript&logoColor=fff) ![npm](https://img.shields.io/badge/-npm-cb3837.svg?logo=npm&logoColor=fff)                                                                                                                                                                                                                                                                                          | Consistent linting, type safety, DX optimizations                         |

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

## 💳 Mock Data Strategy vs. Live ADA Testing

### Overview

To minimize development costs and enable rapid iteration without depleting testnet ADA, Autofy uses **mock data layers** throughout the stack that mirror real Cardano interactions without requiring actual ADA transactions.

### Why Mock Over Live ADA?

- **Cost Efficiency**: Live testnet ADA requires continuous faucet requests; mock data enables unlimited testing cycles.
- **Speed**: No blockchain confirmations needed; tests complete in milliseconds.
- **Isolation**: Mock data doesn't pollute the blockchain or create orphaned UTXOs.
- **Reproducibility**: Deterministic mock responses ensure consistent, predictable test outcomes.

### Mock Architecture

#### Frontend Mock Layer

**Location**: [frontend/src/api/](frontend/src/api/) and [frontend/src/mock/](frontend/src/mock/)

The frontend uses mock API responses for:

- **Wallet Operations**: [cardanoMock.jsx](frontend/src/mock/cardanoMock.jsx) simulates wallet connections and transaction signing without requiring browser extensions.
- **Vehicle & Driver Data**: [adminMock.js](frontend/src/api/adminMock.js) returns fake compliance records, DVI statuses, and transaction histories.
- **Transaction Simulation**: [payments.js](frontend/src/api/payments.js) and [transactions.js](frontend/src/api/transactions.js) mock fare payments, fine settlements, and reward distributions.

**Key Files**:

- [frontend/src/api/alpr.js](frontend/src/api/alpr.js) — Mocked license plate recognition results.
- [frontend/src/api/offences.js](frontend/src/api/offences.js) — Mock violation issuance without on-chain execution.
- [frontend/src/api/verifyVehicle.js](frontend/src/api/verifyVehicle.js) — Mock DVI lookup and compliance snapshots.

#### Backend Mock Layer

**Location**: [backend/src/](backend/src/)

The Node.js backend intercepts Lucid calls with conditional mocking:

- **Lucid Integration**: [backend/src/config/lucid.ts](backend/src/config/lucid.ts) and [backend/src/utils/lucid.ts](backend/src/utils/lucid.ts) can be toggled between live and mock modes via environment variable `USE_MOCK_BLOCKCHAIN=true`.
- **Mock Responses**: When enabled, these utilities return simulated UTXOs, transaction IDs, and confirmation hashes instead of broadcasting to Cardano.
- **Database Records**: All user, vehicle, and compliance metadata is stored in MongoDB; the mock blockchain layer only intercepts Lucid calls.

#### Testing with Jest

**Location**: [backend/**tests**/](backend/__tests__/)

The backend test suite ([servicedriver.test.ts](backend/__tests__/servicedriver.test.ts)) uses Jest with mocked Lucid instances:

```typescript
// Example: Mock Lucid transactions without spending ADA
jest.mock("lucid-cardano", () => ({
  Lucid: {
    new: jest.fn().mockResolvedValue({
      selectWalletFromSeed: jest.fn(),
      utxos: jest.fn().mockResolvedValue([
        /* mock UTXOs */
      ]),
      submitTx: jest.fn().mockResolvedValue("mock-tx-hash"),
    }),
  },
}));
```

### Switching Between Mock & Live Modes

#### Development (Mock)

```bash
# Frontend: Auto-uses mock data from src/api/ and src/mock/ directories
cd frontend && npm run dev

# Backend: Enable mock blockchain mode
cd backend
USE_MOCK_BLOCKCHAIN=true npm run dev
```

#### Pre-Production / Staging (Live ADA)

```bash
# Remove USE_MOCK_BLOCKCHAIN or set to false
cd backend
USE_MOCK_BLOCKCHAIN=false LUCID_NETWORK=testnet npm run dev

# Frontend environment variable (if using Vite env):
# VITE_USE_MOCK_API=false in .env.staging
```

### Mock Data Examples

#### Mock Vehicle Verification

```javascript
// frontend/src/api/verifyVehicle.js
export const mockVerifyVehicle = {
  vehicleId: "mock-dvi-123",
  status: "verified",
  compliance: {
    roadworthiness: true,
    insurance: true,
    tax: true,
  },
  lastMintTx: "mock-tx-hash-abc123",
  mintedOnChain: true,
};
```

#### Mock Transaction Response

```javascript
// frontend/src/api/transactions.js
export const mockTransaction = {
  txHash: "mock-tx-hash-xyz789",
  amount: "50000000", // lovelace (50 ADA equivalent in mock)
  status: "confirmed",
  timestamp: Date.now(),
  confirmations: 15, // pretend confirmed blocks
};
```

#### Mock Backend Lucid Call

```typescript
// backend/src/utils/lucid.ts (with mock mode)
if (process.env.USE_MOCK_BLOCKCHAIN === "true") {
  return {
    submitTx: async (tx) => "mock-" + Date.now(),
    utxos: async () => mockUTXOList,
    getBalance: async () => "1000000", // 1 ADA
  };
}
```

### Migration Path: Mock → Live ADA

When ready to deploy with live ADA:

1. **Ensure Budget**: Acquire sufficient testnet ADA from the [Cardano Faucet](https://docs.cardano.org/cardano-testnet/overview).
2. **Update Environment**: Set `USE_MOCK_BLOCKCHAIN=false` and provide live Cardano network credentials.
3. **Run Integration Tests**: Execute the Jest suite against a testnet instance to validate real Lucid calls.
4. **Monitor Costs**: Track transaction fees using [CARP](https://carp.dcspark.io) or similar tools.
5. **Scale Gradually**: Start with a low transaction volume on testnet before moving to mainnet.

### Best Practices

- **Always mock in CI/CD**: Prevent accidental ADA spend in automated pipelines.
- **Document Mock Behavior**: Comment mock stubs with expected live-blockchain equivalents so developers know what changes when going live.
- **Separate Test & Dev Wallets**: If using live ADA, keep development wallets distinct from production keys.
- **Version Mock Schemas**: Update mock responses when DVI structures or transaction formats evolve.

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

## 🤝 Contributing & Support

- Open issues for features, design tweaks, or blockchain/UX integration gaps.
- Share screenshots or UX recordings to help validate compliance flows.
- Reach out via repository discussions for partnership inquiries or deployment support.
