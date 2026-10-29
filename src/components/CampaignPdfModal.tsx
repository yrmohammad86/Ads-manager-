import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  FileDown,
  Layers,
  CheckSquare,
  Square,
  ChevronRight,
  ChevronLeft,
  Filter,
  Eye,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';
import { ProductItem, BrandDNA, AdPlacement, LayoutPreset, BackgroundScene, CampaignRecord } from '../types/adcraft';
import { CampaignPdfDocument } from './CampaignPdfDocument';
import { exportElementAsA4Pdf, exportMultipleElementsAsA4Pdf } from '../utils/exportPdf';
import { AD_PLACEMENTS, CURATED_SCENES, LAYOUT_PRESETS } from '../data/mockData';
import { toPng } from 'html-to-image';

export interface CampaignPdfModalProps {
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
  // Multi-campaign props
  campaigns?: CampaignRecord[];
  selectedCampaigns?: CampaignRecord[];
  allProducts?: ProductItem[];
  initialMode?: 'single' | 'multi';
  initialSelectedCampaignIds?: string[];
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
  campaigns = [],
  selectedCampaigns: initialSelectedCampaigns,
  allProducts = [],
  initialMode = 'single',
  initialSelectedCampaignIds,
}) => {
  // Mode: single active draft or multi-campaign portfolio
  const [exportMode, setExportMode] = useState<'single' | 'multi'>(initialMode);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [viewStyle, setViewStyle] = useState<'paginated' | 'stacked'>('paginated');

  // Effective campaign pool: either campaigns or initialSelectedCampaigns
  const availableCampaigns = useMemo(() => {
    if (campaigns.length > 0) return campaigns;
    if (initialSelectedCampaigns && initialSelectedCampaigns.length > 0) return initialSelectedCampaigns;
    return [];
  }, [campaigns, initialSelectedCampaigns]);

  // Export & preview states
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);
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

  // Single document ref and array of refs for multi-campaign pages
  const singleDocumentRef = useRef<HTMLDivElement>(null);
  const multiPageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Sync initial mode and selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setExportMode(initialMode);
      if (initialSelectedCampaigns && initialSelectedCampaigns.length > 0) {
        setSelectedCampaignIds(initialSelectedCampaigns.map((c) => c.id));
      } else if (initialSelectedCampaignIds && initialSelectedCampaignIds.length > 0) {
        setSelectedCampaignIds(initialSelectedCampaignIds);
      } else if (availableCampaigns.length > 0) {
        setSelectedCampaignIds(availableCampaigns.map((c) => c.id));
      }
      setActivePageIndex(0);
    }
  }, [isOpen, initialMode, initialSelectedCampaignIds, initialSelectedCampaigns, availableCampaigns]);

  // Capture canvas visual as crisp dataUrl for active single preview
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

  // Resolve selected campaigns list
  const selectedCampaigns = useMemo(() => {
    return availableCampaigns.filter((c) => selectedCampaignIds.includes(c.id));
  }, [availableCampaigns, selectedCampaignIds]);

  // Filtered campaigns for selection toolbar
  const filteredCampaigns = useMemo(() => {
    if (platformFilter === 'all') return availableCampaigns;
    return availableCampaigns.filter((c) => c.platform.toLowerCase() === platformFilter.toLowerCase());
  }, [availableCampaigns, platformFilter]);

  if (!isOpen) return null;

  const handleToggleCampaignSelection = (id: string) => {
    setSelectedCampaignIds((prev) => {
      if (prev.includes(id)) {
        // Prevent deselecting last one completely
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllCampaigns = () => {
    setSelectedCampaignIds(availableCampaigns.map((c) => c.id));
  };

  const handleDeselectAllCampaigns = () => {
    if (availableCampaigns.length > 0) {
      setSelectedCampaignIds([availableCampaigns[0].id]);
    }
  };

  const handleToggleChecklist = (id: string) => {
    setChecklistState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Helper to map a CampaignRecord to a full ProductItem
  const getProductForCampaign = (campaign: CampaignRecord): ProductItem => {
    const existing = allProducts.find((p) => p.id === campaign.productId);
    if (existing) return existing;

    return {
      id: campaign.productId || campaign.id,
      name: campaign.productName,
      category: 'إلكترونيات ورحلات',
      priceKWD: campaign.priceKWD,
      originalPriceKWD: campaign.originalPriceKWD,
      sku: `KW-${campaign.id.toUpperCase()}`,
      imageUrl: campaign.adVisualUrl,
      keyFeatures: [
        'معتمد ومطابق للمواصفات الخليجية',
        'مقاوم للحرارة العالية وأجواء البر والبحر',
        'كفالة الوكيل المعتمد سنتين في الكويت',
      ],
      specs: {
        capacity: 'أداء قياسي معتمد',
        output: 'طاقة نقية مستقرة',
        warranty: 'سنتين وكيل الكويت',
      },
      sourceVerification: {
        storeName: brand.name,
        localPriceVerified: true,
        specsMatchManufacturer: true,
        verifiedSku: campaign.productId,
        auditStatus: 'VERIFIED',
        notes: 'تم التدقيق والتحقق من الأسعار والمواصفات',
      },
      productLock: {
        lockedShape: true,
        lockedPortsAndBadges: true,
        lockedScale: true,
        status: 'ACTIVE',
      },
    };
  };

  const getPlacementForCampaign = (campaign: CampaignRecord): AdPlacement => {
    const found = AD_PLACEMENTS.find((pl) => pl.id === campaign.placement);
    return found || placement;
  };

  // Main PDF Download Handler
  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportError(null);
    setExportProgress(null);

    try {
      if (exportMode === 'single') {
        if (!singleDocumentRef.current) {
          throw new Error('عنصر الوثيقة غير متوفر.');
        }

        const sanitizedName = product.name.replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_');
        const fileName = `AdCraft-CampaignBrief-${sanitizedName}-${placement.id}.pdf`;

        const result = await exportElementAsA4Pdf(singleDocumentRef.current, {
          fileName,
          pixelRatio: 2,
          triggerConfetti: true,
        });

        if (result.success) {
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 4500);
        } else {
          setExportError(result.error || 'تعذر حفظ ملف الـ PDF.');
        }
      } else {
        // Multi-campaign export
        if (selectedCampaigns.length === 0) {
          throw new Error('يرجى تحديد حملة واحدة على الأقل للتصدير.');
        }

        // Collect page elements from refs
        const pageElements = selectedCampaigns.map((c) => multiPageRefs.current[c.id]).filter(Boolean);

        if (pageElements.length === 0) {
          throw new Error('تعذر العثور على صفحات الحملات المحددة.');
        }

        const fileName = `AdCraft-MultiCampaigns-Dossier-${selectedCampaigns.length}-Pages.pdf`;

        const result = await exportMultipleElementsAsA4Pdf(pageElements, {
          fileName,
          pixelRatio: 2,
          triggerConfetti: true,
          onProgress: (current, total) => {
            setExportProgress({ current, total });
          },
        });

        if (result.success) {
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 4500);
        } else {
          setExportError(result.error || 'تعذر توليد ملف الـ PDF متعدد الصفحات.');
        }
      }
    } catch (err: unknown) {
      console.error('PDF Export Error:', err);
      const msg = err instanceof Error ? err.message : 'فشل تصدير وثيقة الحملة.';
      setExportError(msg);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060911]/90 backdrop-blur-md flex flex-col justify-between overflow-hidden">
      {/* Top Action Header Bar */}
      <div className="bg-[#0D1424] border-b border-[#1E2B4A] px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            {exportMode === 'multi' ? <Layers className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white">
                {exportMode === 'multi'
                  ? 'تصدير حملات متعددة كملف PDF مجمع (Multi-Page Campaign Dossier)'
                  : 'تصدير مسودة الحملة للمراجعة الأوفلاين (PDF Dossier)'}
              </h3>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                A4 PORTRAIT SPEC
              </span>
              {exportMode === 'multi' && (
                <span className="text-[10px] font-mono bg-violet-950/80 text-violet-300 border border-violet-500/40 px-2 py-0.5 rounded">
                  {selectedCampaigns.length} صفحة مختارة
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              {exportMode === 'multi'
                ? 'ملف PDF موحد عالي الدقة يضم كافة الحملات المختارة؛ كل حملة على صفحة A4 مستقلة مع تدقيق اللهجة وقفل المنتج.'
                : 'وثيقة رسمية متكاملة تتضمن التصميم الإعلاني المعتمد، النصوص والكابشن، المواصفات وقائمة التوقيع الميداني.'}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs (Single vs Multi) */}
        {availableCampaigns.length > 0 && (
          <div className="flex items-center gap-1 bg-[#131E35] p-1 rounded-xl border border-[#1E2B4A] text-xs self-start md:self-auto">
            <button
              onClick={() => setExportMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                exportMode === 'single'
                  ? 'bg-amber-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>المسودة الحالية</span>
            </button>
            <button
              onClick={() => setExportMode('multi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                exportMode === 'multi'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>تصدير عدة حملات ({selectedCampaigns.length})</span>
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-[#131E35] border border-[#1E2B4A] rounded-lg p-1 text-zinc-300">
            <button
              onClick={() => setZoomScale((prev) => Math.max(0.5, prev - 0.1))}
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
            className="flex items-center gap-1.5 bg-[#131E35] hover:bg-[#1E2B4A] border border-[#1E2B4A] text-zinc-200 font-semibold px-3 py-2 rounded-xl text-xs transition-colors"
            title="طباعة الوثيقة مباشرة على الطابعة أو كملف A4"
          >
            <Printer className="w-4 h-4 text-zinc-300" />
            <span className="hidden sm:inline">طباعة</span>
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
                <span>
                  {exportProgress
                    ? `جاري معالجة صفحة ${exportProgress.current} من ${exportProgress.total}...`
                    : 'جاري توليد ملف الـ PDF...'}
                </span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-zinc-950" />
                <span>
                  {exportMode === 'multi'
                    ? `تم تحميل ملف PDF (${selectedCampaigns.length} صفحات) بنجاح!`
                    : 'تم تحميل ملف PDF بنجاح!'}
                </span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>
                  {exportMode === 'multi'
                    ? `تحميل ملف PDF المجمع (${selectedCampaigns.length} صفحة) 📄`
                    : 'تحميل وثيقة الـ PDF'}
                </span>
              </>
            )}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-xl bg-[#131E35] hover:bg-[#1E2B4A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MULTI-CAMPAIGN SELECTION DRAWER */}
      {exportMode === 'multi' && availableCampaigns.length > 0 && (
        <div className="bg-[#0B101D] border-b border-[#1E2B4A] px-4 py-3 sm:px-6 z-10 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                <span>اختر الحملات المراد دمجها في ملف الـ PDF المجمع:</span>
              </span>
              <span className="text-[11px] text-amber-400 font-mono bg-amber-950/50 border border-amber-900/60 px-2 py-0.5 rounded">
                تم اختيار {selectedCampaignIds.length} من أصل {availableCampaigns.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllCampaigns}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-[#131E35] hover:bg-[#1E2B4A] border border-[#1E2B4A] px-2.5 py-1 rounded-lg transition-colors"
              >
                تحديد الكل ✓
              </button>
              <button
                type="button"
                onClick={handleDeselectAllCampaigns}
                className="text-[11px] font-bold text-zinc-400 hover:text-white bg-[#131E35] hover:bg-[#1E2B4A] border border-[#1E2B4A] px-2.5 py-1 rounded-lg transition-colors"
              >
                تحديد واحدة فقط
              </button>

              <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block" />

              {/* View style toggle (Paginated vs Stacked) */}
              <div className="flex items-center gap-1 bg-[#131E35] p-0.5 rounded-lg border border-[#1E2B4A] text-[11px]">
                <button
                  type="button"
                  onClick={() => setViewStyle('paginated')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    viewStyle === 'paginated' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  صفحة بصفحة
                </button>
                <button
                  type="button"
                  onClick={() => setViewStyle('stacked')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    viewStyle === 'stacked' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  عرض متتابع
                </button>
              </div>
            </div>
          </div>

          {/* Campaign Selector Chips / Cards */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {availableCampaigns.map((camp, idx) => {
              const isSelected = selectedCampaignIds.includes(camp.id);
              return (
                <div
                  key={camp.id}
                  onClick={() => handleToggleCampaignSelection(camp.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-right transition-all cursor-pointer shrink-0 select-none ${
                    isSelected
                      ? 'bg-[#131E35] border-violet-500 shadow-sm ring-1 ring-violet-500/50'
                      : 'bg-[#0D1424] border-[#1E2B4A] opacity-60 hover:opacity-100 hover:border-zinc-700'
                  }`}
                  style={{ minWidth: '220px', maxWidth: '280px' }}
                >
                  <div className="text-violet-400 shrink-0">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-violet-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-zinc-800 overflow-hidden shrink-0">
                    <img src={camp.adVisualUrl} alt={camp.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold text-white truncate">{camp.productName}</span>
                      <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1 py-0.2 rounded shrink-0">
                        {camp.platform}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">{camp.adCopy.headline}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {/* MAIN PREVIEW AREA */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex flex-col items-center bg-[#060911]">
        {/* SINGLE CAMPAIGN MODE PREVIEW */}
        {exportMode === 'single' && (
          <div
            className="transition-transform duration-200 origin-top my-auto"
            style={{ transform: `scale(${zoomScale})` }}
          >
            <CampaignPdfDocument
              ref={singleDocumentRef}
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
              pageNumber={1}
              totalPages={1}
            />
          </div>
        )}

        {/* MULTI CAMPAIGN MODE PREVIEW */}
        {exportMode === 'multi' && (
          <div className="w-full flex flex-col items-center space-y-8">
            {/* Page navigation controls when in paginated view */}
            {viewStyle === 'paginated' && selectedCampaigns.length > 0 && (
              <div className="sticky top-2 z-20 flex items-center gap-3 bg-[#0D1424]/95 border border-[#1E2B4A] backdrop-blur px-4 py-2 rounded-2xl shadow-xl text-xs">
                <button
                  type="button"
                  onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activePageIndex === 0}
                  className="p-1.5 rounded-lg bg-[#131E35] text-zinc-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                  title="الصفحة السابقة"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">
                    صفحة {activePageIndex + 1} من {selectedCampaigns.length}
                  </span>
                  <span className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                    ({selectedCampaigns[activePageIndex]?.productName})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePageIndex((prev) => Math.min(selectedCampaigns.length - 1, prev + 1))}
                  disabled={activePageIndex >= selectedCampaigns.length - 1}
                  className="p-1.5 rounded-lg bg-[#131E35] text-zinc-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                  title="الصفحة التالية"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Jump Dots */}
                <div className="hidden sm:flex items-center gap-1.5 mr-2">
                  {selectedCampaigns.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePageIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        activePageIndex === i
                          ? 'bg-amber-400 ring-2 ring-amber-400/50 scale-125'
                          : 'bg-zinc-700 hover:bg-zinc-500'
                      }`}
                      title={`انتقال لصفحة ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Render Selected Campaign Pages */}
            {selectedCampaigns.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-sm">
                يرجى اختيار حملة واحدة على الأقل من القائمة بالأعلى لعرضها وتصديرها.
              </div>
            ) : viewStyle === 'paginated' ? (
              /* Paginated single-active page view */
              <div
                className="transition-transform duration-200 origin-top"
                style={{ transform: `scale(${zoomScale})` }}
              >
                {selectedCampaigns.map((camp, idx) => {
                  if (idx !== activePageIndex) return null;
                  const campProduct = getProductForCampaign(camp);
                  const campPlacement = getPlacementForCampaign(camp);

                  return (
                    <div key={camp.id} className="relative">
                      <CampaignPdfDocument
                        ref={(el) => {
                          multiPageRefs.current[camp.id] = el;
                        }}
                        product={campProduct}
                        brand={brand}
                        placement={campPlacement}
                        layoutPreset={LAYOUT_PRESETS[0]}
                        backgroundScene={CURATED_SCENES[0]}
                        headline={camp.adCopy.headline}
                        subtext={camp.adCopy.subtext}
                        badge={camp.adCopy.badge}
                        ctaText={camp.adCopy.cta}
                        adPreviewDataUrl={camp.adVisualUrl}
                        checklistState={checklistState}
                        onToggleChecklist={handleToggleChecklist}
                        reviewerNotes={reviewerNotes}
                        isInteractivePreview={true}
                        pageNumber={idx + 1}
                        totalPages={selectedCampaigns.length}
                        campaignTitle={camp.title}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Stacked continuous view: all pages rendered in sequence */
              <div
                className="space-y-12 transition-transform duration-200 origin-top"
                style={{ transform: `scale(${zoomScale})` }}
              >
                {selectedCampaigns.map((camp, idx) => {
                  const campProduct = getProductForCampaign(camp);
                  const campPlacement = getPlacementForCampaign(camp);

                  return (
                    <div key={camp.id} className="relative group">
                      <div className="absolute -top-7 right-0 text-xs font-mono font-bold text-zinc-400 flex items-center gap-2">
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                          صفحة {idx + 1} من {selectedCampaigns.length}
                        </span>
                        <span>{camp.productName} ({camp.platform})</span>
                      </div>
                      <CampaignPdfDocument
                        ref={(el) => {
                          multiPageRefs.current[camp.id] = el;
                        }}
                        product={campProduct}
                        brand={brand}
                        placement={campPlacement}
                        layoutPreset={LAYOUT_PRESETS[0]}
                        backgroundScene={CURATED_SCENES[0]}
                        headline={camp.adCopy.headline}
                        subtext={camp.adCopy.subtext}
                        badge={camp.adCopy.badge}
                        ctaText={camp.adCopy.cta}
                        adPreviewDataUrl={camp.adVisualUrl}
                        checklistState={checklistState}
                        onToggleChecklist={handleToggleChecklist}
                        reviewerNotes={reviewerNotes}
                        isInteractivePreview={true}
                        pageNumber={idx + 1}
                        totalPages={selectedCampaigns.length}
                        campaignTitle={camp.title}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Hidden DOM rendering container to ensure all pages are available for PDF compilation even in paginated view */}
            {viewStyle === 'paginated' && (
              <div className="hidden" aria-hidden="true">
                {selectedCampaigns.map((camp, idx) => {
                  if (idx === activePageIndex) return null; // already mounted above
                  const campProduct = getProductForCampaign(camp);
                  const campPlacement = getPlacementForCampaign(camp);

                  return (
                    <div key={`hidden-${camp.id}`}>
                      <CampaignPdfDocument
                        ref={(el) => {
                          multiPageRefs.current[camp.id] = el;
                        }}
                        product={campProduct}
                        brand={brand}
                        placement={campPlacement}
                        layoutPreset={LAYOUT_PRESETS[0]}
                        backgroundScene={CURATED_SCENES[0]}
                        headline={camp.adCopy.headline}
                        subtext={camp.adCopy.subtext}
                        badge={camp.adCopy.badge}
                        ctaText={camp.adCopy.cta}
                        adPreviewDataUrl={camp.adVisualUrl}
                        checklistState={checklistState}
                        reviewerNotes={reviewerNotes}
                        isInteractivePreview={false}
                        pageNumber={idx + 1}
                        totalPages={selectedCampaigns.length}
                        campaignTitle={camp.title}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sub-bar with quick notes editor & helper */}
      <div className="bg-[#0D1424] border-t border-[#1E2B4A] px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-xs text-zinc-400 w-full sm:w-auto">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {exportMode === 'multi'
              ? `يتم تصدير ${selectedCampaigns.length} صفحة في ملف PDF واحد متكامل جاهز للمراجعة والتوقيع الأوفلاين.`
              : 'يمكنك النقر على بنود الفحص بالأعلى للتأشير عليها، أو كتابة ملاحظات مخصصة تظهر في الوثيقة قبل التصدير.'}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={reviewerNotes}
            onChange={(e) => setReviewerNotes(e.target.value)}
            placeholder="أضف ملاحظة توجيهية للمراجعة الميدانية (اختياري)..."
            className="bg-[#131E35] border border-[#1E2B4A] rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 w-full sm:w-80 text-right"
          />
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="bg-[#131E35] hover:bg-[#1E2B4A] text-amber-400 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            {exportMode === 'multi' ? `حفظ ${selectedCampaigns.length} صفحات PDF 📄` : 'حفظ PDF 📄'}
          </button>
        </div>
      </div>
    </div>
  );
};
