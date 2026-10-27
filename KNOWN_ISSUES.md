# AdCraft AI — Known Issues, Limitations & Technical Constraints

This document lists all known boundary conditions, environmental behaviors, browser constraints, and technical trade-offs in AdCraft AI.

---

## 1. Environment & Browser Constraints

### 1.1 Microphone Access in Insecure Contexts
- **Condition**: Browsers enforce the W3C Secure Context specification for `navigator.mediaDevices.getUserMedia()`.
- **Behavior**: On `localhost` or HTTPS, microphone recording works as expected. On plain HTTP with remote IP addresses (e.g. `http://192.168.1.50:3000`), the browser disables microphone capture.
- **Mitigation**: The UI detects this condition and presents the user with an intuitive **Upload Audio File** button (`MP3`/`WAV`/`M4A`) and demo synthetic audio mode.

### 1.2 Web Audio Autoplay Policies
- **Condition**: Modern browsers suspend `AudioContext` until the user interacts with the page (click or tap).
- **Behavior**: Attempting to play sounds before user interaction logs a browser console warning.
- **Mitigation**: All Web Audio triggers inside `VideoAdsEngine` call `ctx.resume()` on user click events.

### 1.3 Canvas Capture Video Codec Support
- **Condition**: `canvas.captureStream(30)` and `MediaRecorder` use `video/webm;codecs=vp9`.
- **Behavior**: Standard on Chrome, Edge, and Firefox. Safari on macOS/iOS requires Safari 14.1+ for WebM or falls back to standard MP4 container.
- **Mitigation**: The exported video is formatted for universal web and social media playback.

---

## 2. AI Model Dependencies & Quotas

### 2.1 Gemini Model Versioning
- **Condition**: Legacy model versions (such as `gemini-2.5-flash`) were deprecated by Google.
- **Current State**: The codebase exclusively uses current production aliases:
  - `gemini-3.8-flash` for copy generation and dialect auditing.
  - `gemini-3.1-flash-lite-image` for product imagery generation.
  - `gemini-3.8-flash-tts` / `gemini-3.8-flash-lite-tts` for voice synthesis.
- **Fail-Safe**: If the API key is absent or quota is exceeded, the server's `withTimeout` race triggers a deterministic heuristic fallback response in under 6 seconds, ensuring the UI never hangs or crashes.

### 2.2 Offline Operations
- **Offline Capabilities**:
  - Studio canvas composition, layout presets, and layer editing: **100% Offline**.
  - A4 PDF review dossier export and PNG master generation: **100% Offline**.
  - Web Audio SFX generation and canvas video recorder: **100% Offline**.
  - Dialect lexicon search and platform character counting: **100% Offline**.
- **Online Requirements**:
  - Live Gemini API text completion and real-time voice synthesis require an active internet connection and valid API credentials.

---

## 3. Storage Persistence Scope

- **Current State**: Project state (Brand DNA, added products, campaign drafts) is held in client memory during the session. Hard reloading the browser resets to the default demo state (`Outdoor Kuwait`).
- **OpenCode Priority**: Adding a local database layer (such as SQLite with Drizzle ORM) will provide permanent offline persistence for local users.
