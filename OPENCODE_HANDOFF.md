# AdCraft AI — OpenCode Handoff & Migration Specification

Welcome to the **AdCraft AI** local handoff package. This guide is crafted for the OpenCode development team to seamlessly continue development, feature additions, and offline deployment.

---

## 1. What Currently Works (Verified & Ready)

1. **Brand Identity & Fixed Frame**:
   - Centralized Kuwait WhatsApp integration, website link, and verified merchant frame across all ads.
2. **Product Lock 🔒 Engine**:
   - Ensures product proportions, ports, labels, and geometry are untouched while dynamically switching between outdoor, kashta, camp, and luxury studio environments.
3. **1-Click Layout Presets**:
   - Instant switching between 4 responsive advertising layouts with proportional scaling and typography alignment.
4. **Kuwaiti Dialect & Copy QA Studio**:
   - Integrated Kuwaiti marketing lexicon (`شناطر؟`, `عزبتك`, `الكشتة`, etc.).
   - Character count indicators for Instagram, TikTok, Snapchat, and WhatsApp.
   - Dialect score (0-100) with recommendations and 1-click copy transfer to the studio.
5. **Video & Motion Ads Engine (9:16 Vertical Reels)**:
   - 15-second 4-scene animated storyboard with floating shadows and 30fps canvas rendering.
   - Built-in Web Audio API synthesizer for commercial transitions and rhythm kicks.
   - Native microphone recording with 15s auto-stop.
   - Safe audio upload (with 25MB validation).
   - Voice cloning with explicit legal authorization and ethical anti-impersonation safeguards.
   - Direct `.webm` video recording and download.
6. **Ad Content Analytics (Recharts)**:
   - Interactive visual charts depicting distribution of creative formats.
   - URL ad scraper extracting technical specifications, local pricing (KWD), and marketing copy.
7. **Offline Export Subsystem**:
   - Clean A4 portrait PDF campaign brief (`jspdf` + `html-to-image`) for merchant review.
   - 2x High-DPI master PNG capture for immediate posting.
   - 1-click formatted social media captions with emojis and Kuwait tags.
8. **Automated Regression Test Suite**:
   - 10 automated unit and integration tests passing with 100% success (`npm test`).

---

## 2. What Was Fixed During This Audit

1. **Missing Node Modules & Dev Server Crash**: Resolved missing `tsx` binary; re-initialized dependencies cleanly.
2. **502 / SPA HTML JSON Parsing Bug**: Fixed `SyntaxError: Unexpected token '<', "<!doctype "` by adding `contentType.includes('application/json')` guards and guaranteed server-side timeout fallbacks (`withTimeout`).
3. **Voice Cloning Consent & Ethical Safeguard**: Implemented an explicit user authorization modal to guarantee voice rights ownership and prevent unauthorized voice imitation.
4. **Audio File Upload Defense**: Enforced strict 25MB file size limits and MIME validation to prevent browser crashes.
5. **Node.js Automated Test Harness**: Added `tests/api_routes.test.ts` and `tests/dialect_lexicon.test.ts`, integrated into `"test": "tsx --test tests/**/*.test.ts"`.

---

## 3. Which Existing Components MUST NOT Be Rewritten

Do not discard or rewrite the following core implementations, as they encapsulate critical business logic and domain-specific rules:

- `src/components/CampaignStudio.tsx`: Core advertising canvas engine and preset system.
- `src/components/VideoAdsEngine.tsx`: Complex 30fps canvas animation, Web Audio synthesis, and MediaRecorder stream capture.
- `src/components/CopyAndDialectStudio.tsx`: Kuwaiti dialect auditing logic and character limit thresholds.
- `src/utils/exportPdf.ts`: Calibration for exact A4 portrait dimensions and multi-page pagination.
- `src/data/kuwaitiLexicon.ts`: Carefully curated Kuwaiti marketing vocabulary.

---

## 4. Files & Folders to Transfer to OpenCode

Transfer the complete repository tree to your local OpenCode environment:
```
adcraft-ai/
├── src/                      # Complete React 19 source tree
│   ├── components/           # All 16 verified studio components
│   ├── data/                 # Kuwaiti lexicon and product catalog
│   ├── types/                # TypeScript interfaces and contracts
│   ├── utils/                # PDF and PNG high-res export engines
│   ├── App.tsx               # Root application router and state
│   ├── index.css             # Tailwind CSS v4 styling
│   └── main.tsx              # DOM entry point
├── tests/                    # Automated regression tests
│   ├── api_routes.test.ts
│   └── dialect_lexicon.test.ts
├── server.ts                 # Full-stack Node/Express server + GenAI routes
├── package.json              # Verified dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite 8 configuration
├── index.html                # Entry HTML with Alexandria & Cairo Arabic fonts
├── metadata.json             # App capabilities and permissions
├── .env.example              # Environment variables template
├── ARCHITECTURE.md           # Architecture specifications
├── AUDIT_REPORT.md           # Audit matrices and test proofs
├── FEATURE_INVENTORY.md      # Feature breakdown
├── KNOWN_ISSUES.md           # Constraints and browser behaviors
├── LOCAL_SETUP.md            # Windows 11 setup guide
└── OPENCODE_HANDOFF.md       # This handoff specification
```

---

## 5. How to Run Locally in 3 Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Setup environment**:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY if desired (or leave blank for offline heuristic mode)
   ```
3. **Start local development**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

To run the test suite:
```bash
npm test
```

---

## 6. What OpenCode Should Work on First (Prioritized Roadmap)

1. **Local Persistent Storage (High Priority)**:
   - Integrate SQLite (`better-sqlite3` + `drizzle-orm`) into `server.ts` to persist user campaigns, custom products, and Brand DNA across restarts.
2. **Batch Campaign Export (Medium Priority)**:
   - Allow exporting all creative variations (Reel video + Instagram square + A4 PDF brief) as a single `.zip` file using `jszip`.
3. **Custom Font Uploading (Low Priority)**:
   - Allow merchants to upload custom `.woff2` brand fonts for the canvas ad engine.
