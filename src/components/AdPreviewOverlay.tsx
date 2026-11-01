import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Lock, 
  Eye, 
  Download, 
  Check, 
  Sliders, 
  Layers, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Share2, 
  Volume2, 
  VolumeX, 
  Music, 
  CheckCircle2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  ExternalLink, 
  Maximize2, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Tag,
  ShoppingBag,
  HelpCircle,
  FileDown
} from 'lucide-react';
import { ProductItem, BrandDNA, AdPlacement, BackgroundScene, LayoutPreset } from '../types/adcraft';
import { AD_PLACEMENTS, CURATED_SCENES, LAYOUT_PRESETS } from '../data/mockData';
import { AdCanvasPreview } from './AdCanvasPreview';
import { exportElementAsPng } from '../utils/exportImage';

export interface AdPreviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem;
  brand: BrandDNA;
  initialPlacement?: AdPlacement;
  onApplyPlacementToStudio?: (placement: AdPlacement) => void;
  onOpenPdfModal?: () => void;
  // Optional pre-configured copy or studio state
  headline?: string;
  subtext?: string;
  badge?: string;
  ctaText?: string;
  backgroundScene?: BackgroundScene;
  layoutPreset?: LayoutPreset;
}

export type PlatformChromeMode = 'social_sim' | 'clean_art';

export const AdPreviewOverlay: React.FC<AdPreviewOverlayProps> = ({
  isOpen,
  onClose,
  product,
  brand,
  initialPlacement,
  onApplyPlacementToStudio,
  onOpenPdfModal,
  headline: initialHeadline = 'كهربتك معاك… وين ما تروح ⚡',
  subtext: initialSubtext = 'سعة جبارة وشحن فائق السرعة، صُممت لأجواء البر والبحر القاسية.',
  badge: initialBadge = 'الأكثر مبيعاً في الكويت 🇰🇼',
  ctaText: initialCta = 'شناطر؟ اطلب الحين',
  backgroundScene: initialScene,
  layoutPreset: initialLayout,
}) => {
  // Placement selection
  const [selectedPlacement, setSelectedPlacement] = useState<AdPlacement>(
    initialPlacement || AD_PLACEMENTS[0]
  );

  // Platform simulation chrome
  const [chromeMode, setChromeMode] = useState<PlatformChromeMode>('social_sim');
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [activeSidePanel, setActiveSidePanel] = useState<'none' | 'presets' | 'scenes' | 'copy'>('none');

  // Creative customizers
  const [headline, setHeadline] = useState(initialHeadline);
  const [subtext, setSubtext] = useState(initialSubtext);
  const [badge, setBadge] = useState(initialBadge);
  const [ctaText, setCtaText] = useState(initialCta);
  const [selectedScene, setSelectedScene] = useState<BackgroundScene>(
    initialScene || CURATED_SCENES[0]
  );
  const [selectedLayout, setSelectedLayout] = useState<LayoutPreset>(
    initialLayout || LAYOUT_PRESETS[0]
  );

  // Interaction simulator states
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [applySuccessToast, setApplySuccessToast] = useState<string | null>(null);

  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Reset or sync when modal opens or initialPlacement changes
  useEffect(() => {
    if (isOpen) {
      if (initialPlacement) {
        setSelectedPlacement(initialPlacement);
      }
      setHeadline(initialHeadline);
      setSubtext(initialSubtext);
      setBadge(initialBadge);
      setCtaText(initialCta);
      if (initialScene) setSelectedScene(initialScene);
      if (initialLayout) setSelectedLayout(initialLayout);
      setIsLiked(false);
      setIsSaved(false);
      setExportError(null);
      setApplySuccessToast(null);
    }
  }, [isOpen, initialPlacement, initialHeadline, initialSubtext, initialBadge, initialCta, initialScene, initialLayout]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle Applying selected placement to the studio
  const handleApplyPlacement = () => {
    if (onApplyPlacementToStudio) {
      onApplyPlacementToStudio(selectedPlacement);
      setApplySuccessToast(`تم تطبيق أبعاد «${selectedPlacement.name}» (${selectedPlacement.aspectRatio}) بنجاح في الاستوديو! 🎨`);
      setTimeout(() => {
        setApplySuccessToast(null);
        onClose();
      }, 1500);
    }
  };

  // Export the preview canvas as PNG
  const handleDownloadPng = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const node = document.getElementById('adcraft-ad-canvas') || canvasContainerRef.current;
      if (!node) {
        throw new Error('عنصر المعاينة غير متاح.');
      }

      const res = await exportElementAsPng(node, {
        fileName: `AdCraft-${product.id}-${selectedPlacement.id}.png`,
        pixelRatio: 2,
        triggerConfetti: true,
      });

      if (res.success) {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3500);
      } else {
        setExportError(res.error || 'تعذر تصدير الصورة.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'فشل تصدير الصورة.';
      setExportError(msg);
    } finally {
      setIsExporting(false);
    }
  };

  // Platform metadata specs
  const getPlatformSpecs = (placementId: string) => {
    switch (placementId) {
      case 'story_9_16':
        return {
          title: 'ستوري وريلز 9:16 (Story, Reels & TikTok)',
          resolution: '1080 × 1920 px',
          aspect: '9:16',
          platforms: ['Instagram Reels', 'TikTok Ads', 'Snapchat', 'YouTube Shorts'],
          recommendation: 'الأفضل لملء شاشة الهاتف بالكامل وتحقيق أعلى نسبة انغماس وتفاعل.',
          maxHeight: 'max-h-[640px]',
          frameWidth: 'w-[360px]',
          safeZonePadding: 'pt-14 pb-24 px-4',
        };
      case 'feed_4_5':
        return {
          title: 'منشور إنستغرام عمودي 4:5 (Portrait Feed)',
          resolution: '1080 × 1350 px',
          aspect: '4:5',
          platforms: ['Instagram Feed', 'Facebook Feed', 'Threads'],
          recommendation: 'المقاس الذهبي لإنستغرام، يغطي 80% من مساحة الشاشة أثناء التمرير دون أن يُقطع.',
          maxHeight: 'max-h-[580px]',
          frameWidth: 'w-[420px]',
          safeZonePadding: 'pt-3 pb-3 px-3',
        };
      case 'square_1_1':
        return {
          title: 'مربع قياسي 1:1 (Square Feed & Catalog)',
          resolution: '1080 × 1080 px',
          aspect: '1:1',
          platforms: ['Instagram Grid', 'WhatsApp Catalog', 'Facebook', 'X/Twitter'],
          recommendation: 'مقاس كلاسيكي متوافق مع كافة المنصات وكتالوجات المنتجات ومحادثات الواتساب.',
          maxHeight: 'max-h-[520px]',
          frameWidth: 'w-[440px]',
          safeZonePadding: 'pt-2 pb-2 px-2',
        };
      case 'landscape_16_9':
        return {
          title: 'شاشة عريضة 16:9 (Landscape Display & Video)',
          resolution: '1920 × 1080 px',
          aspect: '16:9',
          platforms: ['YouTube Ads', 'Web Display Banners', 'Desktop Landing'],
          recommendation: 'مثالي لبث الفيديو الأفقي على يوتيوب وبانرات المواقع الإلكترونية الكبرى.',
          maxHeight: 'max-h-[420px]',
          frameWidth: 'w-[640px]',
          safeZonePadding: 'pt-4 pb-4 px-6',
        };
      default:
        return {
          title: 'منشور اجتماعي',
          resolution: '1080 × 1080 px',
          aspect: '1:1',
          platforms: ['Social Media'],
          recommendation: 'مقاس متوافق.',
          maxHeight: 'max-h-[520px]',
          frameWidth: 'w-[420px]',
          safeZonePadding: 'p-3',
        };
    }
  };

  const currentSpecs = getPlatformSpecs(selectedPlacement.id);

  return (
    <div className="fixed inset-0 z-50 bg-[#060911]/92 backdrop-blur-xl flex flex-col justify-between overflow-hidden animate-fade-in text-right">
      {/* TOP HEADER BAR */}
      <div className="bg-[#0D1424] border-b border-[#1E2B4A] px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 z-10 shrink-0">
        {/* Left / Title info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>معاينة الإعلان عبر منصات التواصل (Ad Preview)</span>
              </h2>
              <span className="text-[10px] font-mono bg-violet-950 text-violet-300 border border-violet-700/60 px-2 py-0.5 rounded-full font-bold">
                {selectedPlacement.aspectRatio}
              </span>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded hidden sm:inline-block">
                {currentSpecs.resolution}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <span>المنتج المحدد:</span>
              <strong className="text-white truncate max-w-[220px]">{product.name}</strong>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-400 font-mono font-bold">{product.priceKWD} د.ك</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                Product Lock 🔒
              </span>
            </div>
          </div>
        </div>

        {/* Center / Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom Controls */}
          <div className="hidden lg:flex items-center gap-1 bg-[#131E35] border border-[#1E2B4A] rounded-lg p-1 text-zinc-300">
            <button
              onClick={() => setZoomScale((prev) => Math.max(0.65, prev - 0.1))}
              className="p-1 hover:text-white rounded transition-colors"
              title="تصغير المعاينة"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((prev) => Math.min(1.2, prev + 0.1))}
              className="p-1 hover:text-white rounded transition-colors"
              title="تكبير المعاينة"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomScale(1)}
              className="p-1 hover:text-white rounded text-zinc-400 transition-colors"
              title="إعادة الضبط"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Safe Zones Guide Toggle (Only for 9:16) */}
          {selectedPlacement.id === 'story_9_16' && (
            <button
              type="button"
              onClick={() => setShowSafeZones(!showSafeZones)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showSafeZones
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                  : 'bg-[#131E35] text-zinc-400 border-[#1E2B4A] hover:text-white'
              }`}
              title="عرض حدود الأمان (Safe Zones) لضمان عدم تغطية الأزرار والأيقونات للنص"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>حدود الأمان (Safe Zones)</span>
            </button>
          )}

          {/* Platform Chrome Simulator Toggle */}
          <div className="flex items-center gap-1 bg-[#131E35] p-1 rounded-xl border border-[#1E2B4A] text-xs">
            <button
              type="button"
              onClick={() => setChromeMode('social_sim')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                chromeMode === 'social_sim'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>محاكاة المنصة</span>
            </button>
            <button
              type="button"
              onClick={() => setChromeMode('clean_art')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                chromeMode === 'clean_art'
                  ? 'bg-amber-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>التصميم النقي</span>
            </button>
          </div>

          {/* Apply to Studio Button */}
          {onApplyPlacementToStudio && (
            <button
              type="button"
              onClick={handleApplyPlacement}
              className="flex items-center gap-1.5 bg-[#131E35] hover:bg-[#1E2B4A] border border-amber-500/50 text-amber-300 font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
              title="تطبيق مقاس هذه المنصة فوراً في استوديو الحملات"
            >
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>تطبيق المقاس بالاستوديو</span>
            </button>
          )}

          {/* Direct PNG Download */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-amber-950/30 cursor-pointer disabled:opacity-50"
            title="تحميل الإعلان فوراً كملف صورة PNG عالية الجودة"
          >
            {isExporting ? (
              <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : exportSuccess ? (
              <Check className="w-3.5 h-3.5 text-zinc-950" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{exportSuccess ? 'تم التحميل!' : 'حفظ كـ PNG'}</span>
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-xl bg-[#131E35] hover:bg-[#1E2B4A] transition-colors"
            title="إغلاق المعاينة (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ASPECT RATIO SELECTOR STRIP */}
      <div className="bg-[#080C16] border-b border-[#1E2B4A] px-4 py-2.5 sm:px-6 z-10 shrink-0">
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-thin">
          <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-zinc-300">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>اختر مقاس المنصة الاجتماعية (Aspect Ratio):</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {AD_PLACEMENTS.map((pl) => {
              const isSelected = selectedPlacement.id === pl.id;
              return (
                <button
                  key={pl.id}
                  type="button"
                  onClick={() => setSelectedPlacement(pl)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#131E35] border-violet-500 shadow-md ring-1 ring-violet-500/50 text-white'
                      : 'bg-[#0D1424] border-[#1E2B4A] text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold">{pl.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-black ${
                        isSelected ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {pl.aspectRatio}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono block">
                      {pl.dimensions.width} × {pl.dimensions.height} px
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUCCESS OR ERROR TOAST NOTIFICATIONS */}
      {applySuccessToast && (
        <div className="bg-emerald-950/90 border-b border-emerald-600 px-6 py-2 text-xs text-emerald-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{applySuccessToast}</span>
          </div>
        </div>
      )}

      {exportError && (
        <div className="bg-rose-950/90 border-b border-rose-600 px-6 py-2 text-xs text-rose-200 flex items-center justify-between shrink-0">
          <span>{exportError}</span>
          <button onClick={() => setExportError(null)} className="text-rose-400 hover:text-white">إغلاق</button>
        </div>
      )}

      {/* MAIN VIEWPORT STAGE */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col items-center justify-center bg-[#060911] relative">
        <div
          ref={canvasContainerRef}
          className="transition-transform duration-200 origin-center flex flex-col items-center my-auto"
          style={{ transform: `scale(${zoomScale})` }}
        >
          {/* SIMULATOR CONTAINER: 9:16 REELS / TIKTOK FRAME */}
          {selectedPlacement.id === 'story_9_16' && chromeMode === 'social_sim' ? (
            <div className="relative w-[340px] sm:w-[360px] aspect-[9/16] rounded-[36px] overflow-hidden border-[6px] border-[#1E2B4A] bg-black shadow-2xl ring-1 ring-white/10 flex flex-col justify-between select-none">
              {/* Phone Speaker Notch & Status bar */}
              <div className="absolute top-0 inset-x-0 h-6 z-30 flex items-center justify-between px-6 text-[10px] text-white/80 font-mono bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <span>9:41</span>
                <div className="w-20 h-3.5 bg-black rounded-full" />
                <span>5G 🇰🇼</span>
              </div>

              {/* The Actual Ad Canvas rendered in 9:16 */}
              <div className="absolute inset-0 z-10">
                <AdCanvasPreview
                  product={product}
                  brand={brand}
                  placement={selectedPlacement}
                  backgroundScene={selectedScene}
                  isApprovedLockActive={true}
                  headline={headline}
                  subtext={subtext}
                  badge={badge}
                  ctaText={ctaText}
                  layoutPreset={selectedLayout}
                />
              </div>

              {/* Safe Zones visual outline overlay */}
              {showSafeZones && (
                <div className="absolute inset-0 z-20 pointer-events-none border-2 border-dashed border-amber-400/70 m-4 rounded-2xl flex flex-col justify-between p-2">
                  <div className="bg-amber-500/20 text-amber-300 text-[9px] px-2 py-0.5 rounded self-start font-mono">
                    منطقة أمان الهيدر (Header Safe Zone)
                  </div>
                  <div className="bg-amber-500/20 text-amber-300 text-[9px] px-2 py-0.5 rounded self-start font-mono">
                    منطقة أمان الكابشن والأزرار (Bottom Safe Zone)
                  </div>
                </div>
              )}

              {/* Instagram Reels / TikTok Social Overlays (Right Action Bar & Bottom Info) */}
              <div className="relative z-20 h-full flex flex-col justify-between p-4 pointer-events-none text-white">
                {/* Top header overlay */}
                <div className="pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-wider uppercase drop-shadow">REELS</span>
                  </div>
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-full bg-black/50 backdrop-blur text-white hover:bg-black/70"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Overlay: Author info + Kuwaiti caption + Right Interaction Buttons */}
                <div className="flex items-end justify-between gap-3 pb-2">
                  {/* Left (or Right in RTL): Author & Caption */}
                  <div className="flex-1 space-y-2 pointer-events-auto text-right">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center text-xs shadow-md border border-white">
                        {brand.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white drop-shadow">@{brand.name.replace(/\s+/g, '').toLowerCase()}_kw</span>
                          <span className="text-[10px] bg-blue-500 text-white rounded-full px-1">✓</span>
                        </div>
                        <span className="text-[10px] text-zinc-300 block drop-shadow">إعلان ترويجي ممول • Sponsored</span>
                      </div>
                      <button className="text-[10px] font-bold bg-white/20 hover:bg-white/30 backdrop-blur text-white px-2 py-0.5 rounded-full mr-1">
                        متابعة
                      </button>
                    </div>

                    <p className="text-xs text-white/95 leading-relaxed drop-shadow-md line-clamp-2">
                      {headline} — {subtext}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] text-zinc-300">
                      <Music className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="truncate max-w-[180px]">الصوت الأصلي • إعلانات الكويت الرسمية</span>
                    </div>

                    {/* Interactive CTA pill */}
                    <div className="pt-1">
                      <button
                        onClick={handleApplyPlacement}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black py-2 px-3 rounded-xl text-xs flex items-center justify-between shadow-lg"
                      >
                        <span>{ctaText}</span>
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </div>

                  {/* Right side interaction buttons */}
                  <div className="flex flex-col items-center gap-3.5 pointer-events-auto text-white">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="flex flex-col items-center gap-0.5 group"
                    >
                      <div className={`p-2 rounded-full backdrop-blur transition-all ${
                        isLiked ? 'bg-rose-600 text-white' : 'bg-black/40 hover:bg-black/60 text-white'
                      }`}>
                        <Heart className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-[10px] font-mono font-bold drop-shadow">{isLiked ? '2.5K' : '2.4K'}</span>
                    </button>

                    <div className="flex flex-col items-center gap-0.5">
                      <div className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur text-white">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold drop-shadow">184</span>
                    </div>

                    <div className="flex flex-col items-center gap-0.5">
                      <div className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur text-white">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold drop-shadow">إرسال</span>
                    </div>

                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <div className={`p-2 rounded-full backdrop-blur transition-all ${
                        isSaved ? 'bg-amber-500 text-zinc-950' : 'bg-black/40 hover:bg-black/60 text-white'
                      }`}>
                        <Bookmark className="w-5 h-5 fill-current" />
                      </div>
                      <span className="text-[10px] font-mono font-bold drop-shadow">حفظ</span>
                    </button>

                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden animate-spin mt-1" style={{ animationDuration: '8s' }}>
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedPlacement.id === 'feed_4_5' && chromeMode === 'social_sim' ? (
            /* SIMULATOR CONTAINER: 4:5 INSTAGRAM FEED POST FRAME */
            <div className="w-[360px] sm:w-[420px] rounded-2xl overflow-hidden border border-[#1E2B4A] bg-[#0D1424] shadow-2xl text-white">
              {/* Instagram Feed Header */}
              <div className="p-3 flex items-center justify-between border-b border-[#1E2B4A] bg-[#0A0F1D]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-violet-600 p-0.5">
                    <div className="w-full h-full bg-[#0D1424] rounded-full flex items-center justify-center font-bold text-xs text-amber-400">
                      {brand.name.slice(0, 2)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white">{brand.name}</span>
                      <span className="text-[9px] bg-blue-500 text-white rounded-full px-1">✓</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block font-mono">الكويت • كفالة الوكيل المعتمد</span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 border border-amber-900/60 px-2 py-0.5 rounded">
                  ممول (Sponsored)
                </span>
              </div>

              {/* 4:5 Ad Canvas Area */}
              <div className="relative aspect-[4/5] bg-black overflow-hidden">
                <AdCanvasPreview
                  product={product}
                  brand={brand}
                  placement={selectedPlacement}
                  backgroundScene={selectedScene}
                  isApprovedLockActive={true}
                  headline={headline}
                  subtext={subtext}
                  badge={badge}
                  ctaText={ctaText}
                  layoutPreset={selectedLayout}
                />
              </div>

              {/* Feed Action Bar (Likes, comments, CTA) */}
              <div className="p-3 bg-[#0A0F1D] border-t border-[#1E2B4A] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsLiked(!isLiked)} className={isLiked ? 'text-rose-500' : 'text-zinc-300'}>
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                    <MessageCircle className="w-5 h-5 text-zinc-300" />
                    <Send className="w-5 h-5 text-zinc-300" />
                  </div>
                  <button onClick={() => setIsSaved(!isSaved)} className={isSaved ? 'text-amber-400' : 'text-zinc-300'}>
                    <Bookmark className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="text-xs font-bold text-white font-mono">
                  {isLiked ? '1,421 إعجاب' : '1,420 إعجاب'}
                </div>

                <div className="text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-white ml-1">{brand.name}</strong>
                  {headline} — {subtext}
                </div>

                {/* Direct Action Link */}
                <button
                  onClick={handleApplyPlacement}
                  className="w-full bg-[#131E35] hover:bg-[#1E2B4A] border border-amber-500/50 text-amber-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>{ctaText} • تواصل عبر الواتساب فوراً ({brand.fixedFrame.whatsApp})</span>
                </button>
              </div>
            </div>
          ) : selectedPlacement.id === 'square_1_1' && chromeMode === 'social_sim' ? (
            /* SIMULATOR CONTAINER: 1:1 SQUARE POST & WHATSAPP CATALOG FRAME */
            <div className="w-[360px] sm:w-[440px] rounded-2xl overflow-hidden border border-[#1E2B4A] bg-[#0D1424] shadow-2xl text-white">
              {/* WhatsApp / Catalog Header */}
              <div className="p-3 flex items-center justify-between border-b border-[#1E2B4A] bg-[#0A0F1D]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow">
                    WA
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">متجر {brand.name} • كتالوج العروض</span>
                    <span className="text-[10px] text-emerald-400 font-mono">متصل الآن عبر الواتساب 🇰🇼</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
                  {product.priceKWD} د.ك
                </span>
              </div>

              {/* 1:1 Square Canvas */}
              <div className="relative aspect-square bg-black overflow-hidden">
                <AdCanvasPreview
                  product={product}
                  brand={brand}
                  placement={selectedPlacement}
                  backgroundScene={selectedScene}
                  isApprovedLockActive={true}
                  headline={headline}
                  subtext={subtext}
                  badge={badge}
                  ctaText={ctaText}
                  layoutPreset={selectedLayout}
                />
              </div>

              {/* Bottom Catalog Action */}
              <div className="p-3 bg-[#0A0F1D] border-t border-[#1E2B4A] flex items-center justify-between gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-white block truncate">{product.name}</span>
                  <span className="text-[11px] text-zinc-400 block truncate">{product.specs.warranty || 'كفالة الوكيل سنتين'}</span>
                </div>
                <button
                  onClick={handleApplyPlacement}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>طلب مباشر بالواتساب</span>
                </button>
              </div>
            </div>
          ) : (
            /* CLEAN ART CANVAS MODE (No Social Chrome / Or Landscape 16:9) */
            <div className={`relative rounded-2xl overflow-hidden border-2 border-[#1E2B4A] bg-black shadow-2xl ${
              selectedPlacement.id === 'landscape_16_9' ? 'w-full max-w-[700px]' : currentSpecs.frameWidth
            }`}>
              <AdCanvasPreview
                product={product}
                brand={brand}
                placement={selectedPlacement}
                backgroundScene={selectedScene}
                isApprovedLockActive={true}
                headline={headline}
                subtext={subtext}
                badge={badge}
                ctaText={ctaText}
                layoutPreset={selectedLayout}
              />
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM FOOTER BAR */}
      <div className="bg-[#0D1424] border-t border-[#1E2B4A] px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 z-10 shrink-0">
        {/* Specs information */}
        <div className="flex items-center gap-2 text-xs text-zinc-300 w-full md:w-auto">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-bold text-white">{currentSpecs.title}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">{currentSpecs.recommendation}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {/* Quick Preset Selector Trigger */}
          <div className="flex items-center gap-1 bg-[#131E35] border border-[#1E2B4A] rounded-xl px-2.5 py-1 text-xs text-zinc-300">
            <span className="text-[11px] text-zinc-400">القالب:</span>
            <select
              value={selectedLayout.id}
              onChange={(e) => {
                const found = LAYOUT_PRESETS.find((lp) => lp.id === e.target.value);
                if (found) setSelectedLayout(found);
              }}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
            >
              {LAYOUT_PRESETS.map((lp) => (
                <option key={lp.id} value={lp.id} className="bg-zinc-900 text-white">
                  {lp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Scene Selector Trigger */}
          <div className="flex items-center gap-1 bg-[#131E35] border border-[#1E2B4A] rounded-xl px-2.5 py-1 text-xs text-zinc-300">
            <span className="text-[11px] text-zinc-400">المشهد:</span>
            <select
              value={selectedScene.id}
              onChange={(e) => {
                const found = CURATED_SCENES.find((cs) => cs.id === e.target.value);
                if (found) setSelectedScene(found);
              }}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
            >
              {CURATED_SCENES.map((cs) => (
                <option key={cs.id} value={cs.id} className="bg-zinc-900 text-white">
                  {cs.name}
                </option>
              ))}
            </select>
          </div>

          {/* Open PDF dossier */}
          {onOpenPdfModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPdfModal();
              }}
              className="flex items-center gap-1.5 bg-[#131E35] hover:bg-[#1E2B4A] text-zinc-200 hover:text-white border border-[#1E2B4A] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span>تقرير PDF 📄</span>
            </button>
          )}

          {/* Primary Apply Button */}
          {onApplyPlacementToStudio && (
            <button
              type="button"
              onClick={handleApplyPlacement}
              className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>اعتماد مقاس ({selectedPlacement.aspectRatio}) في الاستوديو ✓</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
