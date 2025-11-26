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

| Layer | Tools | Highlights |
| --- | --- | --- |
| Frontend 🎨 | ![React](https://img.shields.io/badge/-React-20232a.svg?logo=react&logoColor=61dafb) ![Vite](https://img.shields.io/badge/-Vite-563d7c.svg?logo=vite&logoColor=ffd62e) ![React Router](https://img.shields.io/badge/-React%20Router-000000.svg?logo=reactrouter&logoColor=ca4245) ![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-000000.svg?logo=framer&logoColor=fff) ![Lucide](https://img.shields.io/badge/-Lucide-111.svg?logo=lucide&logoColor=70c1ff) | Responsive marketing + driver/passenger flows, PhoneFrame device previews |
| Backend ⚙️ | ![Node.js](https://img.shields.io/badge/-Node.js-3c873a.svg?logo=node.js&logoColor=fff) ![Express](https://img.shields.io/badge/-Express-000000.svg?logo=express&logoColor=fff) ![MongoDB](https://img.shields.io/badge/-MongoDB-001e2b.svg?logo=mongodb&logoColor=4db33d) ![Lucid](https://img.shields.io/badge/-Lucid%20Cardano-0033ad.svg?logo=cardano&logoColor=fff) ![JWT](https://img.shields.io/badge/-JWT-000000.svg?logo=jsonwebtokens&logoColor=fff) ![Nodemailer](https://img.shields.io/badge/-Nodemailer-23c552.svg?logo=gmail&logoColor=fff) | Auth, compliance workflows, digital receipts, email verification |
| Blockchain ⛓️ | ![Cardano](https://img.shields.io/badge/-Cardano-0033ad.svg?logo=cardano&logoColor=fff) ![Aiken](https://img.shields.io/badge/-Aiken-111.svg?logo=laravelnova&logoColor=fff) ![Lucid](https://img.shields.io/badge/-Lucid%20SDK-0b132b.svg?logo=lua&logoColor=fff) | Mint/verify DVIs, safe-driving rewards, govern on-chain receipts |
| Tooling 🧪 | ![ESLint](https://img.shields.io/badge/-ESLint-4b32c3.svg?logo=eslint&logoColor=fff) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6.svg?logo=typescript&logoColor=fff) ![npm](https://img.shields.io/badge/-npm-cb3837.svg?logo=npm&logoColor=fff) | Consistent linting, type safety, DX optimizations |

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

## 🤝 Contributing & Support

- Open issues for features, design tweaks, or blockchain/UX integration gaps.
- Share screenshots or UX recordings to help validate compliance flows.
- Reach out via repository discussions for partnership inquiries or deployment support.
