# AdCraft AI — Local Development & Windows 11 Setup Guide

This guide provides step-by-step instructions to run, build, test, and develop **AdCraft AI** locally on Windows 11, macOS, or Linux outside of Google AI Studio.

---

## 1. Prerequisites & Runtime Versions

Ensure your development machine has the following installed:

- **Operating System**: Windows 11 (64-bit), macOS 13+, or Ubuntu 22.04+ LTS
- **Node.js**: `v22.x` LTS or `v20.x` LTS (Node.js 22.23+ recommended; includes native ESM and test runner support)
- **Package Manager**: `npm` (v10+ included with Node) or `bun`
- **Git**: Latest version for version control
- **Terminal**: PowerShell 7, Windows Terminal, or Bash (WSL2 also fully supported)

To verify your environment:
```powershell
node -v
npm -v
git --version
```

---

## 2. Environment Variables Setup

AdCraft AI uses a single `.env` file in the project root.

1. Duplicate `.env.example` to create `.env`:
   ```powershell
   # In Windows PowerShell:
   Copy-Item .env.example .env
   ```
2. Open `.env` and fill in your configuration:
   ```env
   # GEMINI_API_KEY: (Optional for basic UI; Required for live AI copy/voice generation)
   # Get an API key from Google AI Studio: https://aistudio.google.com/app/apikey
   GEMINI_API_KEY="AIzaSyYourActualKeyHere..."

   # PORT: Local server port (Default is 3000)
   PORT=3000

   # APP_URL: Local origin URL for CORS and self-referencing
   APP_URL="http://localhost:3000"
   ```

> **Offline Note**: If `GEMINI_API_KEY` is omitted, AdCraft AI automatically runs in **Offline Heuristic Mode**. All endpoints will respond immediately with pre-configured high-quality Kuwaiti dialect copy, tone evaluations, and product catalog imagery.

---

## 3. Dependency Installation

In your terminal at the project root directory, run:
```powershell
npm install
```

This installs:
- Core UI: `react@19.0.1`, `react-dom@19.0.1`, `motion@12.23.24`, `lucide-react@0.546.0`
- Styling: `tailwindcss@4.3.3`, `@tailwindcss/vite@4.3.3`
- Backend: `express@4.21.2`, `dotenv@17.2.3`, `tsx@4.21.0`
- AI SDK: `@google/genai@2.4.0`
- Export & Audio: `jspdf@4.2.1`, `html-to-image@1.11.13`, `canvas-confetti@1.9.4`, `recharts@3.10.1`

---

## 4. Running the Development Server

Start the full-stack server (Node Express + Vite middleware):
```powershell
npm run dev
```

You will see:
```
AdCraft AI server running on port 3000
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 5. Running Automated Tests

AdCraft AI includes an automated regression test suite testing API endpoints, validation logic, Kuwaiti dialect rules, and upload safeguards:
```powershell
npm test
```

To run individual test suites:
```powershell
# Run API endpoint integration tests:
npx tsx --test tests/api_routes.test.ts

# Run Kuwaiti lexicon unit tests:
npx tsx --test tests/dialect_lexicon.test.ts
```

---

## 6. Type Checking & Production Build

To verify TypeScript types:
```powershell
npm run lint
```

To create an optimized production build:
```powershell
npm run build
```

To run the production server:
```powershell
npm start
```

---

## 7. Windows 11 Audio & Microphone Permissions

When testing microphone recording in **Video & Motion Ads Engine** on Windows 11:
1. Ensure your browser (Chrome/Edge/Brave) has microphone access enabled in:
   `Settings > Privacy & security > Microphone`.
2. Accessing `http://localhost:3000` is recognized as a secure context by Chromium browsers, permitting `navigator.mediaDevices.getUserMedia()`.
3. If using an IP address (e.g., `http://192.168.1.X:3000`), Chromium may block microphone access. Use `localhost` or configure a secure HTTPS certificate.
4. If a microphone is not connected, use the **Upload Audio File** button or **Synth Demo Beat** feature.

---

## 8. Database & Persistence Migration (for OpenCode)

Currently, AdCraft AI operates in client-side state memory. If you wish to add permanent multi-user persistence in OpenCode:
1. **SQLite (Recommended for Local-First)**:
   - Add `better-sqlite3` and `drizzle-orm`.
   - Store campaign drafts, products, and brand settings in a single local file (`adcraft.db`).
2. **PostgreSQL / Cloud SQL**:
   - For team deployment, connect to PostgreSQL using standard connection strings in `server.ts`.
