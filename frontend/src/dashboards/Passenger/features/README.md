# Passenger Features Integration Guide

This folder contains passenger-facing React feature modules. They currently rely on mocked API helpers in `src/api/`. Backend engineers should replace those mocks with real endpoints while preserving returned shapes to avoid UI breakage.

## Component Matrix

| Component          | File                     | Responsibility                                                                    | Mock Dependencies                     |
| ------------------ | ------------------------ | --------------------------------------------------------------------------------- | ------------------------------------- |
| VehicleVerifyModal | `VehicleVerifyModal.jsx` | Camera plate OCR + vehicle compliance snapshot (driver + docs + fines + reviews)  | `verifyVehicle`, `submitFrameForALPR` |
| PayFare            | `PayFare.jsx`            | Collect fare details, confirm, execute payment, show receipt, trigger review flow | `initiateFarePayment`                 |
| DriverReview       | `DriverReview.jsx`       | Submit rating + optional text feedback for driver                                 | `submitDriverReview`                  |
| ReportDriver       | `ReportDriver.jsx`       | File safety / misconduct report w/ optional photo + geolocation                   | `submitDriverReport`                  |

## 1. VehicleVerifyModal

Flow:

1. Camera activates (environment facing if supported).
2. User can keep `Auto detect` on (interval OCR) or press `Scan Now` for manual frame capture.
3. ALPR response normalizes plate and queries vehicle compliance.
4. UI renders: driver profile, compliance docs (roadworthiness / insurance / tax), reviews, fines summary.

Expected Backend Endpoints:

- `POST /alpr/scan` Body: `{ imageBase64: string }` → `{ plate: string, rawText: string, confidence?: number }`
- `GET /vehicles/:plate`

Vehicle Compliance Response (sample):

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
  "roadworthiness": { "status": "Valid", "expires": "2026-02-01" },
  "insurance": { "status": "Valid", "expires": "2026-05-01" },
  "tax": { "status": "Valid", "nextDue": "2026-01-01" },
  "compliance": { "outstandingFines": 0, "lastScan": 1732969200000 }
}
```

Notes:

- All nested objects should be present even if null/empty to avoid conditionals.
- Time values in ms epoch for easy conversion.

## 2. PayFare

States: `details` → `confirm` → `success | error`.

Mock Return:

```json
{
  "receiptId": "rcpt-abc123",
  "txHash": "0xdeadbeefcafefeed",
  "split": { "driver": 94, "gov": 6 },
  "driverId": "drv-001",
  "driverName": "John Doe"
}
```

Endpoint Spec:

- `POST /payments/fare`
  Request:

```json
{
  "driverWallet": "001123983",
  "route": "Ojota-CMS",
  "amountAda": 2.5,
  "walletProvider": "cardano"
}
```

Response (minimum fields): receipt identifiers, tx hash (on-chain), revenue split, driver identity.

On success calls `onPaymentSuccess(driverInfo)` → launches `DriverReview`. Persist last driver wallet locally for `ReportDriver` prefill (`localStorage.setItem('lastDriverWallet', driverWallet)`).

## 3. DriverReview

Endpoint: `POST /reviews`
Request:

```json
{ "driverId": "drv-001", "rating": 5, "text": "Smooth and safe ride." }
```

Response:

```json
{ "reviewId": "rev-xyz", "createdAt": 1732969200000 }
```

Aggregation: Backend should compute average rating + integrate into verification response.

## 4. ReportDriver

User can supply either driver wallet OR plate (one required). Optional evidence:

- Base64 photo (should be offloaded to object storage)
- Geolocation lat/lng if permission granted

Endpoint: `POST /reports`
Request:

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

Response:

```json
{ "referenceId": "rpt-20251130-001", "timestamp": 1732969200000 }
```

Future: hash metadata on-chain, push event to officer dashboard.

## 5. Mock API Replacement Map

| Mock File                  | Replace With           |
| -------------------------- | ---------------------- |
| `src/api/alpr.js`          | `POST /alpr/scan`      |
| `src/api/verifyVehicle.js` | `GET /vehicles/:plate` |
| `src/api/payments.js`      | `POST /payments/fare`  |
| `src/api/reviews.js`       | `POST /reviews`        |
| `src/api/reports.js`       | `POST /reports`        |

Suggested fetch wrapper:

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

## 6. Validation & Security

- Rate-limit ALPR and report submissions.
- Sanitize text inputs (reviews, details) for HTML injection prevention.
- Convert base64 images to object storage (return CDN URL instead of base64 for production).
- Authentication: ensure only logged-in passengers can pay fares, submit reviews/reports.

## 7. Extension Ideas

- WebSocket pushes for new reviews or compliance status changes.
- Pagination for growing review lists.
- Dispute workflow for reports (driver appeal).
- Risk scoring engine combining frequency + diversity of reporters.

## 8. Minimal TypeScript Interfaces (Backend Hint)

```ts
interface VehicleVerificationResponse {
  found: boolean;
  plate: string;
  driver?: {
    id: string;
    name: string;
    rating: number;
    weeklySafeScore: number;
    violationsThisYear: number;
    lastViolation?: { type: string; date: string; cleared: boolean };
    reviews: { id: string; by: string; text: string }[];
  };
  roadworthiness?: { status: string; expires?: string; nextDue?: string };
  insurance?: { status: string; expires?: string };
  tax?: { status: string; nextDue?: string };
  compliance?: { outstandingFines: number; lastScan: number };
}

interface FarePaymentRequest {
  driverWallet: string;
  route: string;
  amountAda: number;
  walletProvider: string;
}

interface FarePaymentResponse {
  receiptId: string;
  txHash: string;
  split: { driver: number; gov: number };
  driverId: string;
  driverName: string;
}

interface DriverReviewRequest {
  driverId: string;
  rating: number;
  text?: string;
}
interface DriverReviewResponse {
  reviewId: string;
  createdAt: number;
}

interface ReportDriverRequest {
  driverWallet?: string;
  vehiclePlate?: string;
  category: string;
  details: string;
  photoBase64?: string;
  location?: { lat: number; lng: number };
}
interface ReportDriverResponse {
  referenceId: string;
  timestamp: number;
}
```

## 9. Implementation Checklist

1. Define endpoints + interfaces (OpenAPI / Zod / TS).
2. Replace mock modules with real fetch wrappers.
3. Integrate Cardano transaction builder for fare payments.
4. Persist reviews and recompute driver rating + safe score on write.
5. Store reports, index by driver/plate, add moderation pipeline.
6. Harden error codes (`VEHICLE_NOT_FOUND`, `ALPR_LOW_CONFIDENCE`, `PAYMENT_REJECTED`).
7. Add audit logging for all fare and report submissions.
8. Backfill existing mock response structure to avoid UI adjustments.

---

This README is intentionally tightly scoped to passenger feature integration. See root `README.md` for broader architecture context.
