import React, { useState, useRef, useEffect } from 'react';
import { 
  ProductItem, 
  BrandDNA, 
  AdPlacement, 
  BackgroundScene,
  LayoutPreset
} from '../types/adcraft';
import { LAYOUT_PRESETS } from '../data/mockData';
import { AdCanvasPreview } from './AdCanvasPreview';
import { 
  Eye, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Share2, 
  Sparkles, 
  ShoppingBag, 
  Phone, 
  Check, 
  AlertCircle, 
  RotateCcw,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Download,
  ImageDown,
  FileImage
} from 'lucide-react';
import { exportElementAsPng } from '../utils/exportImage';

export type PreviewPlatform = 'story_reels' | 'feed_post' | 'whatsapp_ad' | 'canvas_clean';

interface CampaignLivePreviewProps {
  product: ProductItem;
  brand: BrandDNA;
  placement: AdPlacement;
  backgroundScene: BackgroundScene;
  isApprovedLockActive: boolean;
  headline: string;
  subtext: string;
  badge: string;
  ctaText: string;
  layoutPreset?: LayoutPreset;
  onSelectLayoutPreset?: (preset: LayoutPreset) => void;
  headlineColor?: string;
  productScale?: number;
  productPosY?: number;
  showMerchantFrame?: boolean;
  showPrice?: boolean;
  onOpenQCModal?: () => void;
  onOpenExportModal?: () => void;
  onToggleApprovedLock?: (locked: boolean) => void;
  onApproveCampaign?: () => void;
  isCampaignApproved?: boolean;
}

export const CampaignLivePreview: React.FC<CampaignLivePreviewProps> = ({
  product,
  brand,
  placement,
  backgroundScene,
  isApprovedLockActive,
  headline,
  subtext,
  badge,
  ctaText,
  layoutPreset = LAYOUT_PRESETS[0],
  onSelectLayoutPreset,
  headlineColor = '#ffffff',
  productScale = 1,
  productPosY = 0,
  showMerchantFrame = true,
  showPrice = true,
  onOpenQCModal,
  onOpenExportModal,
  onToggleApprovedLock,
  onApproveCampaign,
  isCampaignApproved = false,
}) => {
  // Platform mode
  const [platform, setPlatform] = useState<PreviewPlatform>(
    placement.id === 'story_9_16' ? 'story_reels' : 'feed_post'
  );

  // Sync platform when placement changes
  useEffect(() => {
    if (placement.id === 'story_9_16' && platform === 'feed_post') {
      setPlatform('story_reels');
    } else if (placement.id !== 'story_9_16' && platform === 'story_reels') {
      setPlatform('feed_post');
    }
  }, [placement.id]);

  // View settings
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [localApproved, setLocalApproved] = useState(isCampaignApproved);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [simulatedCtaClicked, setSimulatedCtaClicked] = useState(false);

  // PNG Export states
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const livePreviewScreenRef = useRef<HTMLDivElement>(null);

  // Export Ad Preview to PNG
  const handleExportPng = async (mode: 'master' | 'mockup' = 'master') => {
    setIsExportingPng(true);
    setExportError(null);
    setExportMenuOpen(false);

    try {
      let targetNode: HTMLElement | null = null;
      let fileSuffix = 'master';

      if (mode === 'master') {
        targetNode = document.getElementById('adcraft-ad-canvas');
        fileSuffix = `Master-${placement.id}`;
      } else {
        targetNode = livePreviewScreenRef.current || document.getElementById('campaign-live-preview-screen');
        fileSuffix = `Mockup-${platform}`;
      }

      if (!targetNode) {
        throw new Error('تعذر العثور على عنصر المعاينة لتصديره كصورة.');
      }

      const result = await exportElementAsPng(targetNode, {
        fileName: `AdCraft-${product.id}-${fileSuffix}.png`,
        pixelRatio: 2,
        triggerConfetti: true,
      });

      if (result.success) {
        const modeTitle = mode === 'master' ? 'التصميم الماستر (Clean Creative)' : 'معاينة المنصة الحية (Social Mockup)';
        setExportSuccessMessage(`تم تصدير وحفظ ${modeTitle} كملف صورة (PNG) عالي الدقة بنجاح! 📥`);
        setTimeout(() => setExportSuccessMessage(null), 4500);
      } else {
        setExportError(result.error || 'تعذر تصدير الصورة.');
        setTimeout(() => setExportError(null), 4500);
      }
    } catch (err: unknown) {
      console.error('Export PNG failed:', err);
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء تصدير الصورة.';
      setExportError(msg);
      setTimeout(() => setExportError(null), 4500);
    } finally {
      setIsExportingPng(false);
    }
  };

  // Track approval sync
  useEffect(() => {
    setLocalApproved(isCampaignApproved);
  }, [isCampaignApproved]);

  // Simulated Voiceover playback using Web Speech API (ar-KW fallback)
  const handleToggleAudio = () => {
    setAudioError(null);
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioError('متصفحك لا يدعم قراءة الصوت المباشرة.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const textToRead = `${badge ? badge + '. ' : ''}${headline}. ${subtext}. ${ctaText}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'ar-KW';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setAudioError('تعذر تشغيل الصوت، تأكد من إعدادات الصوت.');
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlayingAudio(false);
      setAudioError('خطأ أثناء تشغيل الصوت.');
    }
  };

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleApprove = () => {
    setLocalApproved(true);
    if (onApproveCampaign) {
      onApproveCampaign();
    }
  };

  const handleSimulateCta = () => {
    setSimulatedCtaClicked(true);
    setTimeout(() => {
      setSimulatedCtaClicked(false);
    }, 2400);
  };

  // Safe zones description based on selected platform
  const getSafeZoneNote = () => {
    if (platform === 'story_reels') {
      return 'المناطق الآمنة لإنستغرام وتيك توك: تجنب وضع النصوص الحيوية في أعلى 15% (شريط الحالة واسم الحساب) أو أسفل 20% (زر التفاعل وشريط الرد).';
    }
    return 'المناطق الآمنة للفيد: جميع النصوص والشعار داخل منطقة الرؤية بدون أي اقتطاع مع إبراز زر الإجراء.';
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Controller Bar */}
      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-3 mb-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setPlatform('story_reels')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                platform === 'story_reels'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>ستوري وريلز (9:16)</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('feed_post')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                platform === 'feed_post'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>بوست إنستغرام</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('whatsapp_ad')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                platform === 'whatsapp_ad'
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>واتساب وكاتالوج</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('canvas_clean')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                platform === 'canvas_clean'
                  ? 'bg-zinc-800 text-white font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>التصميم الماستر</span>
            </button>
          </div>

          {/* Quick Preview Utility Toggles & Layout Preset Selector */}
          <div className="flex items-center justify-end flex-wrap gap-1.5 text-xs">
            {/* Quick Layout Presets Dropdown */}
            {onSelectLayoutPreset && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
                  title="تبديل قالب وتوزيع عناصر الإعلان بضغطة واحدة"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 font-bold transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px]">القالب:</span>
                  <span className="text-[11px] truncate max-w-[110px]">{layoutPreset.name}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${presetDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {presetDropdownOpen && (
                  <div className="absolute left-0 sm:right-auto sm:left-0 top-full mt-2 w-72 bg-zinc-900/98 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl z-50 p-2 space-y-1 text-right animate-fadeIn">
                    <div className="px-2.5 py-1.5 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="font-bold text-white flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        قوالب التصميم (Layout Presets)
                      </span>
                      <span className="text-[10px] font-mono text-amber-400">1-Click Swap</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1 p-0.5">
                      {LAYOUT_PRESETS.map((p) => {
                        const isCurrent = layoutPreset.id === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              onSelectLayoutPreset(p);
                              setPresetDropdownOpen(false);
                            }}
                            className={`w-full text-right p-2 rounded-xl transition-all flex items-start gap-2.5 ${
                              isCurrent
                                ? 'bg-amber-500/15 border border-amber-500/60 text-white'
                                : 'hover:bg-zinc-800/80 text-zinc-300 border border-transparent'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isCurrent ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {isCurrent ? <Check className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold flex items-center justify-between">
                                <span className={isCurrent ? 'text-amber-300' : 'text-white'}>{p.name}</span>
                                <span className="text-[9px] text-zinc-400 font-mono">{p.englishTitle}</span>
                              </div>
                              <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                                {p.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Toggle Device Frame */}
            <button
              type="button"
              onClick={() => setShowDeviceFrame(!showDeviceFrame)}
              title={showDeviceFrame ? 'إخفاء إطار الهاتف' : 'إظهار إطار الهاتف'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
                showDeviceFrame 
                  ? 'bg-zinc-800 border-zinc-700 text-amber-300' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">الهاتف</span>
            </button>

            {/* Toggle Safe Zones */}
            <button
              type="button"
              onClick={() => setShowSafeZones(!showSafeZones)}
              title="إظهار مناطق الأمان للشبكات الاجتماعية"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
                showSafeZones 
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300 ring-1 ring-amber-500/50' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">مناطق الأمان</span>
            </button>

            {/* Audio Voiceover Demo */}
            <button
              type="button"
              onClick={handleToggleAudio}
              title="قراءة الإعلان بالصوت الكويتي"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
                isPlayingAudio 
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 animate-pulse' 
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlayingAudio ? 'صوت شغال' : 'سماع'}</span>
            </button>

            {/* PNG Export Button with options */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                disabled={isExportingPng}
                title="تصدير معاينة الإعلان كملف صورة PNG"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs transition-all shadow-sm ${
                  isExportingPng
                    ? 'bg-amber-600/50 border-amber-500 text-amber-200 cursor-wait'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 border-amber-400 shadow-amber-950/40'
                }`}
              >
                {isExportingPng ? (
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{isExportingPng ? 'جاري الحفظ...' : 'حفظ كـ PNG'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${exportMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* PNG Export Options Menu */}
              {exportMenuOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-2 z-50 text-right backdrop-blur-xl">
                  <div className="px-2.5 py-1.5 border-b border-zinc-800 text-[11px] font-bold text-zinc-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ImageDown className="w-3.5 h-3.5 text-amber-400" />
                      خيارات تصدير الصورة (PNG)
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">HD 2X</span>
                  </div>

                  <div className="p-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => handleExportPng('master')}
                      className="w-full text-right p-2 rounded-xl hover:bg-zinc-800 transition-colors flex items-start gap-2.5 group"
                    >
                      <div className="p-1.5 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-amber-300">
                          التصميم الماستر النقي
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          صورة الإعلان الأساسية بجودة 2X بدون إطار الهاتف
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportPng('mockup')}
                      className="w-full text-right p-2 rounded-xl hover:bg-zinc-800 transition-colors flex items-start gap-2.5 group"
                    >
                      <div className="p-1.5 bg-sky-500/10 rounded-lg group-hover:bg-sky-500/20 text-sky-400 shrink-0 mt-0.5">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-sky-300">
                          معاينة المنصة الحالية
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          لقطة شاشة واقعية ({platform === 'story_reels' ? 'ستوري 9:16' : platform === 'feed_post' ? 'بوست إنستغرام' : 'واتساب'}) مع عناصر التفاعل
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="pt-1.5 px-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>دقة عالية جاهزة للطباعة والنشر</span>
                    <button
                      type="button"
                      onClick={() => setExportMenuOpen(false)}
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Expand */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="تكبير المعاينة"
              className="p-1.5 rounded-lg border bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* PNG Export Success Banner */}
        {exportSuccessMessage && (
          <div className="mt-2 text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-600 px-3.5 py-2 rounded-xl flex items-center justify-between shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{exportSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setExportSuccessMessage(null)}
              className="text-emerald-400 hover:text-white text-xs px-2"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* PNG Export Error Banner */}
        {exportError && (
          <div className="mt-2 text-xs text-rose-300 bg-rose-950/80 border border-rose-600 px-3.5 py-2 rounded-xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{exportError}</span>
            </div>
            <button
              type="button"
              onClick={() => setExportError(null)}
              className="text-rose-400 hover:text-white text-xs px-2"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Audio Error Banner */}
        {audioError && (
          <div className="mt-2 text-[11px] text-rose-300 bg-rose-950/40 border border-rose-800/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{audioError}</span>
          </div>
        )}

        {/* Safe Zone Alert / Info */}
        {showSafeZones && (
          <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{getSafeZoneNote()}</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-900/60 px-2 py-0.5 rounded">
              Safe Zones ON
            </span>
          </div>
        )}
      </div>

      {/* SIMULATED CTA CLICK NOTIFICATION */}
      {simulatedCtaClicked && (
        <div className="w-full mb-3 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between shadow-xl animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>محاكاة ناجحة: تم الضغط على زر «{ctaText}» وفتح نافذة الطلب المباشر ({product.priceKWD} د.ك)!</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400">100% Ready</span>
        </div>
      )}

      {/* Main Preview Container with optional Phone Frame */}
      <div className={`w-full flex justify-center py-2 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-4 sm:p-8 overflow-y-auto flex items-center' : ''
      }`}>
        {isFullscreen && (
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 left-6 z-50 bg-zinc-900 border border-zinc-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-zinc-800 shadow-xl"
          >
            <Minimize2 className="w-4 h-4" />
            <span>إغلاق ملء الشاشة</span>
          </button>
        )}

        <div className={`relative transition-all duration-300 ${
          showDeviceFrame 
            ? 'w-full max-w-[360px] sm:max-w-[390px] rounded-[48px] p-3 sm:p-3.5 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 border-[4px] border-zinc-700 shadow-2xl ring-1 ring-zinc-600/50' 
            : 'w-full max-w-md'
        }`}>
          {/* Simulated Mobile Outer Frame Elements (when device frame is active) */}
          {showDeviceFrame && (
            <>
              {/* Dynamic Island / Camera Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-28 h-5 bg-black rounded-full flex items-center justify-between px-2.5 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700" />
                <div className="w-2 h-2 rounded-full bg-amber-500/40 animate-pulse" />
              </div>

              {/* Status Bar */}
              <div className="w-full flex items-center justify-between px-6 pt-1 pb-2 text-[10px] text-zinc-400 font-mono select-none">
                <span className="font-bold text-white">11:45</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px]">5G</span>
                  <span>🇰🇼</span>
                  <div className="w-4 h-2 border border-zinc-400 rounded-sm p-0.5 flex items-center">
                    <div className="w-full h-full bg-emerald-400 rounded-xs" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* INNER SCREEN CONTAINER */}
          <div 
            ref={livePreviewScreenRef}
            id="campaign-live-preview-screen"
            className={`relative bg-zinc-950 overflow-hidden select-none ${
              showDeviceFrame ? 'rounded-[36px] border border-zinc-800/80' : 'rounded-2xl border border-zinc-800'
            }`}
          >
            {/* PLATFORM MODE 1: INSTAGRAM STORY / REELS (9:16) */}
            {platform === 'story_reels' && (
              <div className="relative w-full aspect-[9/16] bg-black overflow-hidden flex flex-col justify-between">
                {/* Story Top Header Bar */}
                <div className="absolute top-0 left-0 right-0 z-30 p-3 pt-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
                  {/* Progress Bars */}
                  <div className="flex items-center gap-1 mb-2.5">
                    <div className="h-0.5 flex-1 bg-white/40 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-2/3" />
                    </div>
                    <div className="h-0.5 flex-1 bg-white/20 rounded-full" />
                    <div className="h-0.5 flex-1 bg-white/20 rounded-full" />
                  </div>

                  {/* Brand Profile Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/60 p-0.5 flex items-center justify-center overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={brand.name} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs font-bold text-white">
                          <span>{brand.name}</span>
                          <CheckCircle2 className="w-3 h-3 text-sky-400 fill-sky-400 text-zinc-950" />
                          <span className="text-[10px] text-zinc-400 font-normal mr-1">مُموَّل</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 block font-mono">
                          Sponsored Ad • الكويت 🇰🇼
                        </span>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setPlatform('canvas_clean')}
                      className="text-white/80 hover:text-white p-1 rounded-full bg-black/30 backdrop-blur-sm"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Creative Canvas Embedded inside 9:16 frame */}
                <div className="w-full h-full">
                  <AdCanvasPreview
                    product={product}
                    brand={brand}
                    placement={{
                      id: 'story_9_16',
                      name: 'قصص وريلز إنستغرام',
                      aspectRatio: '9:16',
                      platform: 'Instagram / TikTok',
                      dimensions: { width: 1080, height: 1920 }
                    }}
                    backgroundScene={backgroundScene}
                    isApprovedLockActive={isApprovedLockActive}
                    headline={headline}
                    subtext={subtext}
                    badge={badge}
                    ctaText={ctaText}
                    layoutPreset={layoutPreset}
                    headlineColor={headlineColor}
                    productScale={productScale}
                    productPosY={productPosY}
                    showPrice={showPrice}
                    showMerchantFrame={showMerchantFrame}
                  />
                </div>

                {/* Safe Zones Visual Overlays (if enabled) */}
                {showSafeZones && (
                  <div className="absolute inset-0 pointer-events-none z-35 flex flex-col justify-between">
                    {/* Top Restricted Safe Area */}
                    <div className="w-full h-24 border-b-2 border-dashed border-rose-500/70 bg-rose-500/10 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded">
                        ⚠️ منطقة الرأس المحجوبة (Header Safe-Zone)
                      </span>
                    </div>

                    {/* Middle Safe Working Canvas */}
                    <div className="flex-1 border-x-2 border-dashed border-emerald-500/50 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded">
                        ✅ المساحة الآمنة للنصوص والمنتج (Safe Action Area)
                      </span>
                    </div>

                    {/* Bottom Restricted Safe Area */}
                    <div className="w-full h-28 border-t-2 border-dashed border-rose-500/70 bg-rose-500/10 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded">
                        ⚠️ منطقة أزرار التفاعل والسحب (Footer Safe-Zone)
                      </span>
                    </div>
                  </div>
                )}

                {/* Right Action Rail (Story / Reels side buttons) */}
                <div className="absolute bottom-24 left-3 z-30 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex flex-col items-center gap-0.5 group"
                  >
                    <div className={`p-2 rounded-full backdrop-blur-md transition-all ${
                      isLiked ? 'bg-rose-600 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                    }`}>
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                    </div>
                    <span className="text-[10px] text-white font-mono drop-shadow">
                      {isLiked ? '1.5k' : '1.4k'}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white"
                  >
                    <div className="p-2 rounded-full bg-black/50 backdrop-blur-md">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono drop-shadow">89</span>
                  </button>

                  <button
                    type="button"
                    className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white"
                  >
                    <div className="p-2 rounded-full bg-black/50 backdrop-blur-md">
                      <Send className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono drop-shadow">مشاركة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSaved(!isSaved)}
                    className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white"
                  >
                    <div className={`p-2 rounded-full backdrop-blur-md ${
                      isSaved ? 'bg-amber-500 text-zinc-950' : 'bg-black/50 text-white'
                    }`}>
                      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    </div>
                  </button>
                </div>

                {/* Bottom Interactive Swipe / CTA Banner */}
                <div className="absolute bottom-3 left-3 right-3 z-30">
                  <button
                    type="button"
                    onClick={handleSimulateCta}
                    className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black py-2.5 px-4 rounded-2xl flex items-center justify-between shadow-2xl shadow-amber-950/80 border border-amber-300 transform active:scale-95 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 fill-zinc-950" />
                      <span className="text-xs sm:text-sm font-bold">{ctaText || 'اطلب الآن'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-zinc-950/15 px-2 py-0.5 rounded-lg">
                      <span>{product.priceKWD} د.ك</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* PLATFORM MODE 2: INSTAGRAM FEED POST (4:5 / 1:1) */}
            {platform === 'feed_post' && (
              <div className="w-full bg-zinc-950 text-white flex flex-col">
                {/* Feed Post Top Header */}
                <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 p-0.5 flex items-center justify-center overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={brand.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs font-bold">
                        <span>{brand.name}</span>
                        <CheckCircle2 className="w-3 h-3 text-sky-400 fill-sky-400 text-zinc-950" />
                      </div>
                      <span className="text-[10px] text-zinc-400 block">
                        إعلان مموَّل • الكويت، العاصمة 🇰🇼
                      </span>
                    </div>
                  </div>

                  <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                </div>

                {/* Feed Post Image Canvas */}
                <div className="w-full relative">
                  <AdCanvasPreview
                    product={product}
                    brand={brand}
                    placement={placement}
                    backgroundScene={backgroundScene}
                    isApprovedLockActive={isApprovedLockActive}
                    headline={headline}
                    subtext={subtext}
                    badge={badge}
                    ctaText={ctaText}
                    layoutPreset={layoutPreset}
                    headlineColor={headlineColor}
                    productScale={productScale}
                    productPosY={productPosY}
                    showPrice={showPrice}
                    showMerchantFrame={showMerchantFrame}
                  />

                  {/* Safe Zones Indicator */}
                  {showSafeZones && (
                    <div className="absolute inset-2 border-2 border-dashed border-amber-400/60 pointer-events-none rounded-xl flex items-center justify-center">
                      <span className="text-[10px] font-mono text-amber-200 bg-black/80 px-2 py-0.5 rounded">
                        Feed Safe Area 100%
                      </span>
                    </div>
                  )}
                </div>

                {/* Feed CTA Action Strip */}
                <div 
                  onClick={handleSimulateCta}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 py-2 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 fill-current" />
                    <span>{ctaText || 'تسوق الآن'}</span>
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold font-mono">
                    <span>{product.priceKWD} د.ك</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </div>

                {/* Feed Interaction Buttons */}
                <div className="p-3 space-y-2 border-t border-zinc-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => setIsLiked(!isLiked)}
                        className={`transition-colors ${isLiked ? 'text-rose-500' : 'text-zinc-300 hover:text-white'}`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                      <MessageCircle className="w-5 h-5 text-zinc-300 hover:text-white cursor-pointer" />
                      <Send className="w-5 h-5 text-zinc-300 hover:text-white cursor-pointer" />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setIsSaved(!isSaved)}
                      className={`transition-colors ${isSaved ? 'text-amber-400' : 'text-zinc-300 hover:text-white'}`}
                    >
                      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Likes Count */}
                  <div className="text-xs font-bold text-white text-right">
                    {isLiked ? '1,490 إعجاباً' : '1,489 إعجاباً'}
                  </div>

                  {/* Caption & Kuwaiti Copy */}
                  <div className="text-xs text-zinc-300 text-right leading-relaxed">
                    <strong className="text-white ml-1">{brand.name}</strong>
                    <span>{headline}</span>
                    <p className="text-zinc-400 text-[11px] mt-0.5 line-clamp-2">
                      {subtext}
                    </p>
                    <span className="text-zinc-500 text-[10px] mt-1 block">
                      التوصيل متوفر لجميع مناطق الكويت • كفالة الوكيل المعتمد
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* PLATFORM MODE 3: WHATSAPP AD & STATUS */}
            {platform === 'whatsapp_ad' && (
              <div className="w-full bg-zinc-900 text-white flex flex-col">
                {/* WhatsApp Chat Top Header */}
                <div className="bg-[#128C7E] px-3 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 p-0.5 flex items-center justify-center overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={brand.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs font-bold text-white">
                        <span>{brand.name}</span>
                        <CheckCircle2 className="w-3 h-3 text-white fill-white text-[#128C7E]" />
                      </div>
                      <span className="text-[10px] text-emerald-100 block">
                        حساب أعمال موثق • متصل الآن
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white">
                    <Phone className="w-4 h-4" />
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                </div>

                {/* Chat Background & Message Card */}
                <div className="p-3 bg-zinc-950 space-y-3">
                  <div className="text-center">
                    <span className="bg-zinc-850 text-zinc-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      اليوم، 11:45 ص
                    </span>
                  </div>

                  {/* Ad Preview Card inside WhatsApp Bubble */}
                  <div className="bg-[#075E54]/30 border border-emerald-600/50 rounded-2xl p-2.5 space-y-2 text-right">
                    <div className="flex items-center justify-between text-[11px] text-emerald-300 pb-1 border-b border-emerald-800/60">
                      <span className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        بطاقة عرض الحملة المباشرة
                      </span>
                      <span className="font-mono text-amber-300 font-bold">{product.priceKWD} د.ك</span>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-zinc-800">
                      <AdCanvasPreview
                        product={product}
                        brand={brand}
                        placement={placement}
                        backgroundScene={backgroundScene}
                        isApprovedLockActive={isApprovedLockActive}
                        headline={headline}
                        subtext={subtext}
                        badge={badge}
                        ctaText={ctaText}
                        layoutPreset={layoutPreset}
                        headlineColor={headlineColor}
                        productScale={productScale}
                        productPosY={productPosY}
                        showPrice={showPrice}
                        showMerchantFrame={showMerchantFrame}
                      />
                    </div>

                    {/* Pre-filled Message Simulation */}
                    <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                      <span className="text-emerald-400 font-bold block mb-1">
                        رسالة العميل التلقائية عند الضغط:
                      </span>
                      «مرحباً {brand.name}، حابب أطلب جهاز ({product.name}) بسعر {product.priceKWD} د.ك، كيف طريقة التوصيل والدفع؟»
                    </div>

                    {/* Direct WhatsApp Action Button */}
                    <button
                      type="button"
                      onClick={handleSimulateCta}
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-zinc-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                    >
                      <Phone className="w-4 h-4 fill-zinc-950" />
                      <span>تأكيد الطلب المباشر عبر الواتساب</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PLATFORM MODE 4: CLEAN MASTER AD CANVAS */}
            {platform === 'canvas_clean' && (
              <div className="w-full p-2 bg-zinc-950">
                <AdCanvasPreview
                  product={product}
                  brand={brand}
                  placement={placement}
                  backgroundScene={backgroundScene}
                  isApprovedLockActive={isApprovedLockActive}
                  headline={headline}
                  subtext={subtext}
                  badge={badge}
                  ctaText={ctaText}
                  layoutPreset={layoutPreset}
                  headlineColor={headlineColor}
                  productScale={productScale}
                  productPosY={productPosY}
                  showPrice={showPrice}
                  showMerchantFrame={showMerchantFrame}
                />
              </div>
            )}
          </div>

          {/* Home indicator bar (iPhone gesture line) */}
          {showDeviceFrame && (
            <div className="w-28 h-1 bg-zinc-600 rounded-full mx-auto mt-2.5 mb-1" />
          )}
        </div>
      </div>

      {/* BOTTOM PRE-APPROVAL SUMMARY & FINAL ACTION GATE */}
      <div className="w-full mt-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${localApproved ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <h4 className="text-sm font-bold text-white">
                {localApproved ? 'الحملة معتمدة وجاهزة للإطلاق 🔒' : 'حالة مراجعة الإعلان قبل الاعتماد النهائي'}
              </h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                localApproved 
                  ? 'bg-emerald-950 border border-emerald-700 text-emerald-300' 
                  : 'bg-amber-950 border border-amber-700 text-amber-300'
              }`}>
                {localApproved ? 'APPROVED & LOCKED' : 'PENDING APPROVAL'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              تم فحص توافق أبعاد {placement.aspectRatio} وتناسق اللهجة الكويتية وقفل هيكل المنتج.
            </p>
          </div>

          {/* Final Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Quick PNG Export Button */}
            <button
              type="button"
              onClick={() => handleExportPng('master')}
              disabled={isExportingPng}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors shadow-sm"
              title="تصدير التصميم الإعلاني كصورة PNG فوراً"
            >
              {isExportingPng ? (
                <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{isExportingPng ? 'جاري الحفظ...' : 'حفظ كصورة (PNG)'}</span>
            </button>

            {onOpenQCModal && (
              <button
                type="button"
                onClick={onOpenQCModal}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>فحص QC</span>
              </button>
            )}

            {!localApproved ? (
              <button
                type="button"
                onClick={handleApprove}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-950/40 transition-all transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعتماد الحملة رسمياً (Approve & Lock)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-950/80 border border-emerald-700 px-3 py-2 rounded-xl">
                  <Lock className="w-3.5 h-3.5" />
                  <span>معتمد ومحمي بالكامل</span>
                </span>

                {onOpenExportModal && (
                  <button
                    type="button"
                    onClick={onOpenExportModal}
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg transition-all"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>تصدير الحملة</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4-Point Quick Verification Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>قفل المنتج (Product Lock 🔒)</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>صياغة كويتية موثوقة 🇰🇼</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>السعر بالدينار ({product.priceKWD} د.ك)</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>وضوح هوية المتجر والطلب</span>
          </div>
        </div>
      </div>
    </div>
  );
};
