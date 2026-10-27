# Campaign Draft PDF Export for Offline Review

Export complete campaign drafts as a clean, publication-grade A4 portrait PDF document containing the high-resolution ad visual, bilingual marketing copy, product specs, commercial pricing, and an executive sign-off checklist for offline stakeholder review.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following requirements were confirmed during the clarification interview and govern the implementation:

- **Confirmed Content Scope**: Full campaign brief containing the high-resolution ad visual render, creative copy & dialect notes, technical & commercial product specifications, and an offline review sign-off checklist.
- **Confirmed Layout & Orientation**: Clean A4 portrait document layout optimized for both digital viewing and standard office/boardroom printing.
- **Confirmed UI Placement**: Available in both locations—directly from the Campaign Studio top action bar as a fast 1-click action, and inside the full Export Modal alongside existing PNG and social caption tools.
- **Technical Strategy**: Hybrid client-side PDF engine utilizing `html2canvas` / `html-to-image` for pixel-perfect ad creative snapshotting and `jspdf` for vector-crisp A4 page composition, complemented by an offline review modal with print and direct download options.

---

## 1. Overview & Core Concept

- **What It Does**: Enables marketing managers, brand owners, and creative directors to generate a standardized A4 PDF campaign dossier with a single click. The document packages the visual ad mockup with all critical campaign metadata (headline, body copy, Kuwait dialect adaptations, placement target, pricing, warranty, and formal approval signature blocks) without requiring third-party design tools.
- **Target Audience / Persona**: E-commerce merchants, agency account executives, and client decision-makers in Kuwait and the GCC who require formal offline reviews, stakeholder sign-offs, or archivable campaign documentation before going live.
- **Key Value**: Bridges the gap between live interactive digital ad prototyping and formal executive review workflows, eliminating manual screenshotting and fragmented email threads.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Triggering from Studio Header**:
   - The user clicks the new **"تصدير كـ PDF للمراجعة 📄"** button in the Campaign Studio header toolbar.
   - A dedicated **Campaign Review PDF Preview Modal** opens, rendering a live A4 portrait preview of the formatted brief with options to **Download PDF** or **Print Document**.
2. **Triggering from Export Modal**:
   - Inside the Export Modal (`ExportModal.tsx`), a new dedicated card **"تصدير ملف مراجعة شامل (PDF)"** sits alongside the standard PNG export and caption copy buttons.
   - Clicking it triggers immediate generation of the PDF dossier with progress feedback and automatic file download.
3. **Offline Document Structure (A4 Portrait)**:
   - **Header & Brand Identity Block**: Campaign title, brand name (`BrandDNA`), date, campaign status (`Draft` vs `Approved`), and target ad format/placement.
   - **Visual Creative Showcase**: High-resolution centered capture of the ad canvas with current layout preset and styling.
   - **Marketing Copy & Dialect Section**: Master headline, explanatory copy, promotional badge, CTA button text, and Kuwait market localization tags.
   - **Product & Commercial Specs Grid**: Product name, price in KWD (and previous price if discounted), warranty, delivery terms, and core specifications.
   - **Stakeholder Review & Sign-Off Checklist**: Printable/checked verification items (Brand DNA alignment, pricing accuracy, legal compliance, dialect authenticity, final executive sign-off box with reviewer name, signature, and date).

### Visual Identity & Theme
- **Document Styling**: Minimalist editorial executive brief using neutral slate backgrounds, crisp dark typography, hairline grid dividers, and gold/amber accent highlights consistent with AdCraft AI branding.
- **Typography**: Clean sans-serif hierarchy with balanced display titles, high-density metadata tables, and `font-variant-numeric: tabular-nums` for prices and dates.
- **Interactive Feedback**: Loading spinner during canvas capture, progress indicators, and celebratory toast upon successful PDF generation.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: PDF Generation Mechanism (`jspdf` + Canvas Capture vs. Browser Print Only)
- *Chosen Approach*: Direct client-side PDF compilation using `jspdf` combined with `html-to-image` for high-resolution visual rendering, alongside a printable preview layout.
- *Why*: Direct PDF downloads work seamlessly offline without relying on OS-level print dialog configs or popups, ensuring consistent margins, pagination, and file naming (`AdCraft-Campaign-Brief-[Product]-[Date].pdf`).
- *Alternatives Considered*: Native `window.print()` only was rejected because it depends heavily on individual browser print settings, lacks automatic file saving, and risks clipped background graphics.

### Decision 2: Access Points (Dual Entry Strategy)
- *Chosen Approach*: Surface the PDF feature in both the Campaign Studio header (quick export) and inside the Export Modal (centralized hub).
- *Why*: Accommodates both fast-paced studio workflows where an executive wants an instant PDF brief, and comprehensive export flows where social captions and assets are gathered together.
- *Alternatives Considered*: Placing it only in the Export Modal was rejected because it hid the feature behind an extra click.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CampaignStudio.tsx                            │
│                                                                        │
│  ┌───────────────────────────────┐  ┌────────────────────────────────┐ │
│  │ Studio Header Action Toolbar  │  │ Ad Canvas & Live Preview       │ │
│  │ [Export PDF 📄] [Export PNG]  │  │ id="adcraft-ad-canvas"         │ │
│  └──────────────┬────────────────┘  └───────────────┬────────────────┘ │
└─────────────────┼───────────────────────────────────┼──────────────────┘
                  │                                   │
                  ▼                                   ▼
┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│      ExportModal.tsx             │  │   CampaignPdfPreviewModal.tsx    │
│  ┌────────────────────────────┐  │  │  - Live A4 Portrait Preview      │
│  │ [PDF Campaign Dossier Card]│  │  │  - Checklist toggles & notes     │
│  └──────────────┬─────────────┘  │  │  - Direct Download & Print       │
└─────────────────┼────────────────┘  └───────────────┬──────────────────┘
                  │                                   │
                  └─────────────────┬─────────────────┘
                                    ▼
                    ┌───────────────────────────────┐
                    │     exportPdf.ts (Utility)    │
                    │  - Capture canvas via PNG     │
                    │  - Format A4 portrait specs   │
                    │  - Build multi-section brief  │
                    │  - Save with jsPDF            │
                    └───────────────────────────────┘
```

### Data Model & Export Payload

```typescript
export interface CampaignPdfData {
  product: ProductItem;
  brand: BrandDNA;
  placement: AdPlacement;
  layoutPreset: LayoutPreset;
  headline: string;
  subtext: string;
  badge: string;
  ctaText: string;
  isCampaignApproved: boolean;
  canvasElementId?: string;
}
```

### Interactive Component & State Mapping

- `CampaignStudio.tsx`:
  - Adds `isPdfPreviewOpen` state.
  - Adds direct **"تصدير كـ PDF للمراجعة 📄"** header button.
  - Passes full campaign state to `ExportModal` and `CampaignPdfPreviewModal`.
- `ExportModal.tsx`:
  - Adds third export action card for **"تصدير تقرير الحملة (PDF Dossier)"**.
  - Triggers PDF generation with instant feedback and toast.
- `CampaignPdfPreviewModal.tsx`:
  - Displays interactive preview of the document with editable review checklist items.
  - One-click PDF download using `exportCampaignDraftPdf`.
- `src/utils/exportPdf.ts`:
  - Handles high-DPI image capture of the ad canvas and builds an A4 PDF document with `jspdf`.
