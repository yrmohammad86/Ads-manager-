# AdCraft AI — System Architecture & Technical Specifications

## 1. Overview & Core Philosophy

**AdCraft AI** is an intelligent e-commerce creative studio and advertising department built specifically for Gulf and Kuwaiti merchants. Its guiding engineering principle is:
> **"نغيّر المشهد، ولا نغيّر المنتج" — We transform the scene, never distort the product.**

Traditional generative AI models frequently hallucinate ports, dials, proportions, brand logos, or physical dimensions when rendering commercial products. AdCraft AI solves this through a deterministic **Product Lock 🔒** architecture, pairing verified catalog specifications with dynamic visual scenes, dialect-accurate Kuwaiti Arabic marketing copy, synthetic voice synthesis, and real-time social media export tools.

---

## 2. Technology Stack & Versions

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.0.1` | Modern component tree with concurrent rendering |
| **DOM Renderer** | React-DOM | `^19.0.1` | Client-side DOM mounting and reconciliation |
| **Build Tool & Bundler** | Vite | `^8.3.0` | Ultra-fast HMR and ESM build pipeline |
| **Styling Engine** | Tailwind CSS | `^4.3.3` | Zero-runtime CSS with modern `@tailwindcss/vite` |
| **Language & Typings** | TypeScript | `^7.0.2` | End-to-end type safety and contract enforcement |
| **Backend Runtime** | Node.js | `>=22.0.0` | Full-stack server execution with ESM (`"type": "module"`) |
| **HTTP Server** | Express | `^4.21.2` | Single-port API routing, JSON validation & proxying |
| **AI SDK** | `@google/genai` | `^2.4.0` | Official Google GenAI TypeScript SDK |
| **Analytics & Charts** | Recharts | `^3.10.1` | Visual distributions and campaign analytics |
| **Document Export** | jsPDF + html-to-image | `^4.2.1` / `^1.11.13` | High-DPI A4 PDF dossiers & PNG master exports |
| **Audio Processing** | Web Audio API + Web Speech | Native W3C | Real-time commercial beats, SFX, and voice playback |
| **Microphone Capture** | MediaStream / MediaRecorder | Native W3C | High-fidelity voice sampling with ethical safeguards |

---

## 3. High-Level Architecture Diagram

```
+-------------------------------------------------------------------------+
|                              Client Browser                             |
|  +-------------------------------------------------------------------+  |
|  |                         React 19 SPA                              |  |
|  |  +-------------------+  +-------------------+  +---------------+  |  |
|  |  |  Campaign Studio  |  | Video Reels Studio|  | Analytics /   |  |  |
|  |  |  - Canvas Engine  |  | - 15s Storyboard  |  |   Recharts    |  |  |
|  |  |  - Presets (1-clk)|  | - Canvas Animator |  | - Format Mix  |  |  |
|  |  |  - Product Lock 🔒|  | - Web Audio SFX   |  | - URL Import  |  |  |
|  |  +-------------------+  +-------------------+  +---------------+  |  |
|  |  +-------------------+  +-------------------+  +---------------+  |  |
|  |  | Dialect QA Studio |  | Product Vault     |  | Brand DNA     |  |  |
|  |  | - Char Counter    |  | - Verified SKUs   |  | - WhatsApp KW |  |  |
|  |  | - Tone Analysis   |  | - Local Specs     |  | - Colors/Frame|  |  |
|  |  +-------------------+  +-------------------+  +---------------+  |  |
|  +----------------------------------+--------------------------------+  |
|                                     | HTTP REST & Static Bundles        |
+-------------------------------------v-----------------------------------+
|                        Node.js / Express Server                         |
|                             (Port 3000)                                 |
|                                                                         |
|  [Vite Dev Middleware]  <--- In Dev Mode                                |
|  [Static dist/ Handler] <--- In Production                              |
|                                                                         |
|  API Endpoints:                                                         |
|  • POST /api/generate-product-ad  (Validates title & 2-word rules)      |
|  • POST /api/generate-copy        (Generates 3 Kuwaiti angles)          |
|  • POST /api/verify-dialect       (Kuwaiti QA dialect score)            |
|  • POST /api/evaluate-voice-tone  (Voice timbre & naturalness audit)    |
|  • POST /api/clone-and-synthesize (Voice persona speech synthesis)      |
|  • POST /api/import-ad-url        (Ad specs & pricing extractor)        |
+-------------------------------------+-----------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------+
|                            Google GenAI API                             |
|  • gemini-3.8-flash        (High-speed dialect NLP & URL reasoning)    |
|  • gemini-3.1-flash-lite   (Studio product imagery generation)         |
|  • gemini-3.8-flash-tts    (High-fidelity commercial speech synthesis) |
+-------------------------------------------------------------------------+
```

---

## 4. Subsystems & Data Flow

### 4.1 Product Lock 🔒 Subsystem
To ensure ad integrity:
1. Every product in `ProductVault` contains a `productLock` object:
   ```ts
   productLock: {
     lockedShape: boolean;
     lockedPortsAndBadges: boolean;
     lockedScale: boolean;
     status: 'ACTIVE';
   }
   ```
2. When rendering the product onto different scenes (Desert, Kashta, Camp, Luxury Studio), the product image is rendered on its own layer with an independent transformation matrix, preserving original dimensions, ports, and brand emblems.
3. Shadows and ambient reflections are calculated dynamically beneath the product layer without altering the product's pixels.

### 4.2 Kuwaiti Dialect QA Subsystem
Commercial success in Kuwait requires genuine conversational phrasing:
- Monitored keywords: `شناطر؟`, `عزبتك`, `الكشتة`, `كهربتك`, `ما تقصر`, `مو صج`, `الزين`, `حياكم`.
- Automated score (`0 - 100`) calculated with structural feedback, dialect authenticity evaluation, and platform-specific character limit monitoring (Instagram 2,200 chars, TikTok 150 chars, Snapchat 100 chars, WhatsApp 160 chars).

### 4.3 Video & Motion Ads Engine (9:16 Vertical Reels)
- 15-second standard vertical story divided into 4 key scenes:
  1. **Scene 1 (0.0s - 3.5s)**: Hook & problem statement.
  2. **Scene 2 (3.5s - 7.5s)**: Product reveal under Product Lock 🔒.
  3. **Scene 3 (7.5s - 11.5s)**: Kashta & lifestyle context.
  4. **Scene 4 (11.5s - 15.0s)**: Pricing, warranty, and WhatsApp CTA.
- **Audio Layers**:
  - Web Audio API synthesizer for transitions (`whoosh`, `beat_kick`, `power_up`, `cash_chime`).
  - Native microphone recording with 15-second auto-stop.
  - Safe file upload with 25MB validation and MIME checking.
  - Ethical voice cloning with explicit legal authorization and anti-impersonation safeguards.
  - Canvas 2D capture with 30fps MediaRecorder producing downloadable `.webm` video.

### 4.4 Dossier & PDF Generation
- Uses `jsPDF` configured for A4 Portrait (`210mm x 297mm`).
- High-DPI canvas capture via `html-to-image` at `pixelRatio: 2` with auto-pagination for multi-page campaign documentation.
- Eliminates non-printable UI buttons using CSS exclusions (`.no-pdf`).

---

## 5. Security & Isolation Model

1. **Zero Secret Exposure**:
   - `GEMINI_API_KEY` is never transmitted to or accessible by client browser code.
   - All external model invocations occur server-side inside `server.ts`.
2. **Timeout Boundaries**:
   - Every external AI request is wrapped in `withTimeout(..., ms)` (6,000ms - 8,000ms).
   - If Google GenAI is unreachable or throttled, deterministic local fallbacks return valid, formatted data immediately, preventing UI hang or 504 gateway timeouts.
3. **Audio & File Upload Safeguards**:
   - Client limits file size to 25MB before memory allocation.
   - Explicit confirmation modal prevents unauthenticated voice cloning of public figures.
