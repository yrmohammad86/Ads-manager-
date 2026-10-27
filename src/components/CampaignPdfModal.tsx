import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import { ProductItem, BrandDNA, AdPlacement, LayoutPreset, BackgroundScene } from '../types/adcraft';
import { CampaignPdfDocument } from './CampaignPdfDocument';
import { exportElementAsA4Pdf } from '../utils/exportPdf';
import { toPng } from 'html-to-image';

interface CampaignPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem;
  brand: BrandDNA;
  placement: AdPlacement;
  layoutPreset: LayoutPreset;
  backgroundScene: BackgroundScene;
  headline: string;
  subtext: string;
  badge: string;
  ctaText: string;
}

export const CampaignPdfModal: React.FC<CampaignPdfModalProps> = ({
  isOpen,
  onClose,
  product,
  brand,
  placement,
  layoutPreset,
  backgroundScene,
  headline,
  subtext,
  badge,
  ctaText,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [adPreviewDataUrl, setAdPreviewDataUrl] = useState<string | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [checklistState, setChecklistState] = useState<{ [key: string]: boolean }>({
    lock_geometry: true,
    kuwaiti_dialect: true,
    price_warranty: true,
    merchant_channels: true,
    placement_visual: true,
  });

  const documentRef = useRef<HTMLDivElement>(null);

  // When modal opens, capture the current canvas visual as a crisp dataUrl
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const captureAdCanvas = async () => {
      try {
        const canvasNode = document.getElementById('adcraft-ad-canvas');
        if (canvasNode) {
          const dataUrl = await toPng(canvasNode, {
            pixelRatio: 1.5,
            quality: 0.92,
            cacheBust: true,
            filter: (node) => {
              if (node instanceof HTMLElement && node.classList?.contains('no-export')) {
                return false;
              }
              return true;
            },
          });
          if (isMounted) {
            setAdPreviewDataUrl(dataUrl);
          }
        }
      } catch (err) {
        console.warn('Could not capture ad canvas preview directly, using styled brief fallback:', err);
      }
    };

    captureAdCanvas();

    return () => {
      isMounted = false;
    };
  }, [isOpen, product.id, placement.id, layoutPreset.id]);

  if (!isOpen) return null;

  const handleToggleChecklist = (id: string) => {
    setChecklistState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    setIsExporting(true);
    setExportError(null);

    try {
      const sanitizedName = product.name.replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_');
      const fileName = `AdCraft-CampaignBrief-${sanitizedName}-${placement.id}.pdf`;

      const result = await exportElementAsA4Pdf(documentRef.current, {
        fileName,
        pixelRatio: 2,
        triggerConfetti: true,
      });

      if (result.success) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } else {
        setExportError(result.error || 'تعذر حفظ ملف الـ PDF.');
      }
    } catch (err: unknown) {
      console.error('PDF Export Error:', err);
      const msg = err instanceof Error ? err.message : 'فشل تصدير وثيقة الحملة.';
      setExportError(msg);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between overflow-hidden">
      {/* Top Action Header Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 sm:px-6 flex items-center justify-between gap-4 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                تصدير مسودة الحملة للمراجعة الأوفلاين (PDF Dossier)
              </h3>
              <span className="text-[10px] font-mono bg-zinc-800 text-amber-400 px-2 py-0.5 rounded border border-zinc-700 hidden sm:inline-block">
                A4 PORTRAIT SPEC
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              وثيقة متكاملة تتضمن التصميم الإعلاني، النصوص والكابشن، المواصفات الفنية، وقائمة توقيع الاعتماد الأوفلاين.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-lg p-1 text-zinc-300">
            <button
              onClick={() => setZoomScale((prev) => Math.max(0.55, prev - 0.1))}
              className="p-1 hover:text-white rounded"
              title="تصغير المعاينة"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((prev) => Math.min(1.2, prev + 0.1))}
              className="p-1 hover:text-white rounded"
              title="تكبير المعاينة"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomScale(0.85)}
              className="p-1 hover:text-white rounded text-zinc-400"
              title="إعادة الضبط"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-200 font-semibold px-3 py-2 rounded-xl text-xs transition-colors"
            title="طباعة الوثيقة مباشرة على الطابعة أو كملف A4"
          >
            <Printer className="w-4 h-4 text-zinc-300" />
            <span className="hidden sm:inline">طباعة (Print)</span>
          </button>

          {/* Primary PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>جاري معالجة وتوليد PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-zinc-950" />
                <span>تم تحميل ملف PDF بنجاح!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>تحميل وثيقة الـ PDF</span>
              </>
            )}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error banner if any */}
      {exportError && (
        <div className="bg-rose-950/90 border-b border-rose-600 px-6 py-2.5 text-xs text-rose-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{exportError}</span>
          </div>
          <button onClick={() => setExportError(null)} className="text-rose-400 hover:text-white">
            إغلاق
          </button>
        </div>
      )}

      {/* Main Preview Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-zinc-950/80">
        <div 
          className="transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoomScale})` }}
        >
          <CampaignPdfDocument
            ref={documentRef}
            product={product}
            brand={brand}
            placement={placement}
            layoutPreset={layoutPreset}
            backgroundScene={backgroundScene}
            headline={headline}
            subtext={subtext}
            badge={badge}
            ctaText={ctaText}
            adPreviewDataUrl={adPreviewDataUrl}
            checklistState={checklistState}
            onToggleChecklist={handleToggleChecklist}
            reviewerNotes={reviewerNotes}
            isInteractivePreview={true}
          />
        </div>
      </div>

      {/* Bottom Sub-bar with quick notes editor & helper */}
      <div className="bg-zinc-900/90 border-t border-zinc-800 px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-xs text-zinc-400 w-full sm:w-auto">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            يمكنك النقر على بنود الفحص بالأعلى للتأشير عليها، أو كتابة ملاحظات مخصصة تظهر في الوثيقة قبل التصدير.
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={reviewerNotes}
            onChange={(e) => setReviewerNotes(e.target.value)}
            placeholder="أضف ملاحظة توجيهية للمراجعة الميدانية (اختياري)..."
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 w-full sm:w-80 text-right"
          />
          <button
            onClick={handleDownloadPdf}
            className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 transition-colors"
          >
            حفظ PDF 📄
          </button>
        </div>
      </div>
    </div>
  );
};
