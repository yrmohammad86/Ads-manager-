import React, { useState, useEffect } from 'react';
import { 
  ProductItem, 
  BrandDNA, 
  CreativeConcept, 
  AdPlacement, 
  BackgroundScene,
  LayoutPreset
} from '../types/adcraft';
import { 
  CREATIVE_CONCEPTS, 
  AD_PLACEMENTS, 
  CURATED_SCENES,
  LAYOUT_PRESETS
} from '../data/mockData';
import { AdCanvasPreview } from './AdCanvasPreview';
import { CampaignLivePreview } from './CampaignLivePreview';
import { QualityControlModal } from './QualityControlModal';
import { ExportModal } from './ExportModal';
import { exportElementAsPng } from '../utils/exportImage';
import { 
  Sparkles, 
  Lock, 
  Unlock, 
  Layers, 
  Image as ImageIcon, 
  Sliders, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  RefreshCw,
  Zap,
  ShoppingBag,
  Type,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ImageDown,
  LayoutTemplate,
  Bot,
  Wand2,
  Plus,
  FileText,
  FileDown,
  Link2
} from 'lucide-react';
import { AIProductAdGeneratorModal } from './AIProductAdGeneratorModal';
import { CampaignPdfModal } from './CampaignPdfModal';

interface CampaignStudioProps {
  products: ProductItem[];
  brand: BrandDNA;
  activeProduct: ProductItem;
  onSelectProduct: (product: ProductItem) => void;
  onAddNewProduct?: (newProduct: ProductItem) => void;
  appliedCopy?: { headline: string; subtext: string; cta: string; badge: string } | null;
  onOpenImportModal?: () => void;
}

export const CampaignStudio: React.FC<CampaignStudioProps> = ({
  products,
  brand,
  activeProduct,
  onSelectProduct,
  onAddNewProduct,
  appliedCopy,
  onOpenImportModal,
}) => {
  // Studio selections
  const [selectedLayoutPreset, setSelectedLayoutPreset] = useState<LayoutPreset>(LAYOUT_PRESETS[0]);
  const [selectedConcept, setSelectedConcept] = useState<CreativeConcept>(CREATIVE_CONCEPTS[0]);
  const [selectedPlacement, setSelectedPlacement] = useState<AdPlacement>(AD_PLACEMENTS[0]);
  const [selectedScene, setSelectedScene] = useState<BackgroundScene>(CURATED_SCENES[0]);

  // Approved Creative Lock status
  const [isApprovedLockActive, setIsApprovedLockActive] = useState(true);

  // Text layers & Graphic elements
  const [headline, setHeadline] = useState('كهربتك معاك… وين ما تروح ⚡');
  const [subtext, setSubtext] = useState('سعة جبارة وشحن فائق السرعة، صُممت لأجواء البر والبحر القاسية.');
  const [badge, setBadge] = useState('الأكثر مبيعاً في الكويت 🇰🇼');
  const [ctaText, setCtaText] = useState('شناطر؟ اطلب الحين');
  const [headlineColor, setHeadlineColor] = useState('#ffffff');

  // Layer transformation adjustments
  const [productScale, setProductScale] = useState(1);
  const [productPosY, setProductPosY] = useState(0);
  const [showPrice, setShowPrice] = useState(true);
  const [showMerchantFrame, setShowMerchantFrame] = useState(true);

  // Active step / sub-tab in studio
  const [activeStudioTab, setActiveStudioTab] = useState<'presets' | 'concept' | 'scene' | 'layers' | 'placement'>('presets');

  // Modals & Live Preview States
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [isCampaignApproved, setIsCampaignApproved] = useState(false);
  const [approvalToast, setApprovalToast] = useState<string | null>(null);
  const [generationToast, setGenerationToast] = useState<string | null>(null);
  const [studioViewMode, setStudioViewMode] = useState<'split' | 'live_preview'>('split');
  const [isQuickExportingPng, setIsQuickExportingPng] = useState(false);

  // Sync copy applied from Copy & Dialect Studio
  useEffect(() => {
    if (appliedCopy) {
      if (appliedCopy.headline) setHeadline(appliedCopy.headline);
      if (appliedCopy.subtext) setSubtext(appliedCopy.subtext);
      if (appliedCopy.cta) setCtaText(appliedCopy.cta);
      if (appliedCopy.badge) setBadge(appliedCopy.badge);
      setApprovalToast('✨ تم استيراد وتطبيق النصوص المعتمدة بنجاح من مدقق اللهجة الكويتية!');
      setTimeout(() => setApprovalToast(null), 6000);
    }
  }, [appliedCopy]);

  // AI Product & Ad Generation Callback
  const handleProductGenerated = (
    newProd: ProductItem,
    newCopy: {
      headline: string;
      subtext: string;
      cta: string;
      badge: string;
    }
  ) => {
    if (onAddNewProduct) {
      onAddNewProduct(newProd);
    }
    onSelectProduct(newProd);
    setHeadline(newCopy.headline);
    setSubtext(newCopy.subtext);
    setCtaText(newCopy.cta);
    setBadge(newCopy.badge);
    setGenerationToast(
      `✨ تم بنجاح توليد صورة جديدة وإعلان كامل بالذكاء الاصطناعي للموديل «${newProd.name}» وتطبيقه على المعاينة الحية!`
    );
    setTimeout(() => {
      setGenerationToast(null);
    }, 7000);
  };

  // 1-Click layout preset switcher handler
  const handleSelectPreset = (preset: LayoutPreset) => {
    setSelectedLayoutPreset(preset);
    setApprovalToast(`تم تبديل توزيع وتنسيق عناصر الإعلان إلى قالب «${preset.name}» بضغطة زر واحدة بنجاح! 🎨`);
  };

  // Quick 1-click PNG export from header
  const handleQuickExportPng = async () => {
    setIsQuickExportingPng(true);
    try {
      const node = document.getElementById('adcraft-ad-canvas') || document.getElementById('campaign-live-preview-screen');
      if (!node) {
        setIsExportModalOpen(true);
        return;
      }
      const res = await exportElementAsPng(node, {
        fileName: `AdCraft-${activeProduct.id}-${selectedPlacement.id}.png`,
        pixelRatio: 2,
        triggerConfetti: true,
      });
      if (res.success) {
        setApprovalToast('تم تصدير وحفظ معاينة الإعلان كملف صورة (PNG) عالي الجودة بنجاح! 📥');
      } else {
        setIsExportModalOpen(true);
      }
    } catch {
      setIsExportModalOpen(true);
    } finally {
      setIsQuickExportingPng(false);
    }
  };

  const handleApproveCampaign = () => {
    setIsCampaignApproved(true);
    setIsApprovedLockActive(true);
    setApprovalToast('تم اعتماد الحملة الإعلانية وقفل التصميم بنجاح! التصميم جاهز للنشر والتصدير 🔒');
  };

  // Quick Kuwaiti Headlines suggestions
  const kuwaitiSuggestions = [
    {
      h: 'كهربتك معاك… وين ما تروح ⚡',
      s: 'سعة جبارة 2048Wh وشحن فائق السرعة لأقسى درجات الحرارة.',
      c: 'شناطر؟ اطلب الحين',
      b: 'الأكثر مبيعاً في الكويت 🇰🇼',
    },
    {
      h: 'عزبتك ما تكتمل بدونها! 🔥',
      s: 'شغل أجهزتك وإضاءتك كلها براحة بال وبكفالة الوكيل المعتمد.',
      c: 'اطلب عبر الواتساب فوراً',
      b: 'وفر 15% اليوم',
    },
    {
      h: 'طاقة دايمة لطلعات البحر والبر ⚓',
      s: 'تحمل استثنائي للحرارة ومنافذ طاقة نقية تحمي أجهزتك الحساسة.',
      c: 'توصيل مجاني لجميع المناطق',
      b: 'كفالة الوكيل المعتمد',
    },
  ];

  const handleApplySuggestion = (sug: typeof kuwaitiSuggestions[0]) => {
    setHeadline(sug.h);
    setSubtext(sug.s);
    setCtaText(sug.c);
    setBadge(sug.b);
  };

  const handleConceptChange = (concept: CreativeConcept) => {
    setSelectedConcept(concept);
    const matchingScene = CURATED_SCENES.find((s) => s.id === concept.defaultSceneId);
    if (matchingScene) {
      setSelectedScene(matchingScene);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Banner: Pipeline status & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-6 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            AdCraft Campaign Engine • استوديو الحملات المتكامل
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span>توليد وإخراج الحملات الإعلانية للبراند</span>
            <span className="text-xs font-mono font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-lg">
              {brand.name}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            نظام توليد حملة متكاملة بمشهد ثابت (Approved Lock) ومعاينة حية واقعية تحاكي إنستغرام وواتساب وتيك توك قبل الاعتماد.
          </p>
        </div>

        {/* View Mode & Primary Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Studio View Mode Toggle */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setStudioViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                studioViewMode === 'split'
                  ? 'bg-zinc-800 text-amber-400 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>المحرر والمعاينة</span>
            </button>
            <button
              type="button"
              onClick={() => setStudioViewMode('live_preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                studioViewMode === 'live_preview'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>المعاينة الحية (Live Preview)</span>
            </button>
          </div>

          <button
            onClick={() => setIsQCModalOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>فحص الجودة (QC)</span>
          </button>

          {/* Direct PNG Image Export Button */}
          <button
            onClick={handleQuickExportPng}
            disabled={isQuickExportingPng}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-750 border border-amber-500/50 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm"
            title="تصدير معاينة الإعلان فوراً كملف صورة PNG لحفظ عملك"
          >
            {isQuickExportingPng ? (
              <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isQuickExportingPng ? 'جاري التحميل...' : 'حفظ كصورة (PNG)'}</span>
          </button>

          {/* Direct Campaign PDF Dossier Export Button */}
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-750 border border-amber-500/50 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm hover:bg-amber-500/10"
            title="تصدير مسودة الحملة كوثيقة A4 PDF للمراجعة الأوفلاين والاعتماد"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>تقرير الحملة (PDF Dossier)</span>
          </button>

          {/* Import Ad from URL Button */}
          {onOpenImportModal && (
            <button
              onClick={onOpenImportModal}
              className="flex items-center gap-1.5 bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500/50 text-zinc-200 hover:text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-sm"
              title="إضافة إعلان عن طريق رابط مع سحب المواصفات والأسعار تلقائياً"
            >
              <Link2 className="w-3.5 h-3.5 text-amber-400" />
              <span>استيراد برابط 🔗</span>
            </button>
          )}

          {/* AI Creative & Product Generator Button */}
          <button
            onClick={() => setIsAiGeneratorOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/10 hover:from-amber-500/30 hover:to-amber-400/30 border border-amber-500/60 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md shadow-amber-950/20"
            title="توليد منتج وصور ونصوص جديدة بالذكاء الاصطناعي (Gemini AI)"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>توليد إعلان وموديل بالذكاء الاصطناعي ✨</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-950/40"
          >
            <ImageDown className="w-4 h-4" />
            <span>خيارات التصدير والكابشن</span>
          </button>
        </div>
      </div>

      {/* AI Product & Ad Generation Toast */}
      {generationToast && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-950/90 to-zinc-900 border border-amber-500 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{generationToast}</span>
                <span className="text-[10px] font-mono bg-amber-500 text-zinc-950 font-bold px-2 py-0.5 rounded">
                  AI GENERATED
                </span>
              </div>
              <p className="text-xs text-amber-300/80 mt-0.5">
                تم تحديث صورة المنتج، العنوان الكويتي، النص التوضيحي، وشارة العرض في المعاينة الحية فوراً!
              </p>
            </div>
          </div>
          <button
            onClick={() => setStudioViewMode('live_preview')}
            className="flex items-center gap-1.5 bg-amber-500 text-zinc-950 font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-amber-400 transition-all shrink-0 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة فورية ملء الشاشة</span>
          </button>
        </div>
      )}

      {/* Campaign Approval Alert Banner */}
      {approvalToast && (
        <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-600 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900/60 rounded-xl text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{approvalToast}</span>
                <span className="text-[10px] font-mono bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded">
                  LOCKED & READY
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                تم اعتماد نبرة الصوت والمشهد البصري ونصوص الحملة كنسخة ماستر رسمية.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold rounded-lg transition-colors shadow"
            >
              بدء التحميل والتصدير
            </button>
            <button
              onClick={() => setApprovalToast(null)}
              className="text-xs text-emerald-400 hover:text-emerald-200 px-2 py-1"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* FULL LIVE PREVIEW MODE SHOWCASE */}
      {studioViewMode === 'live_preview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-sm text-zinc-200">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="font-bold">المعاينة الحية التفاعلية الكاملة للإعلان (Interactive Live Preview)</span>
              <span className="text-xs text-zinc-400">• تحاكي تجربة المستخدم الفعلية في الكويت قبل الإطلاق</span>
            </div>
            <button
              onClick={() => setStudioViewMode('split')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <span>العودة لمحرر الطبقات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <CampaignLivePreview
              product={activeProduct}
              brand={brand}
              placement={selectedPlacement}
              backgroundScene={selectedScene}
              isApprovedLockActive={isApprovedLockActive}
              headline={headline}
              subtext={subtext}
              badge={badge}
              ctaText={ctaText}
              layoutPreset={selectedLayoutPreset}
              onSelectLayoutPreset={handleSelectPreset}
              headlineColor={headlineColor}
              productScale={productScale}
              productPosY={productPosY}
              showPrice={showPrice}
              showMerchantFrame={showMerchantFrame}
              onOpenQCModal={() => setIsQCModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onToggleApprovedLock={(locked) => setIsApprovedLockActive(locked)}
              onApproveCampaign={handleApproveCampaign}
              isCampaignApproved={isCampaignApproved}
            />
          </div>
        </div>
      )}

      {/* SPLIT STUDIO VIEW (Left: Controls, Right: Live Preview Component) */}
      {studioViewMode === 'split' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Step 1: Select Active Product with Product Lock Badge & AI Generator */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                1. اختيار المنتج (أو توليد منتج وصور بالذكاء الاصطناعي ✨)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiGeneratorOpen(true)}
                  className="text-[11px] font-bold text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title="توليد منتج وصور جديدة بالذكاء الاصطناعي مع شرط اسم الموديل والوصف"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>توليد موديل جديد بالـ AI</span>
                </button>
                <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 border border-amber-900/60 px-2 py-0.5 rounded hidden sm:inline-block">
                  Product Lock Active
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {products.map((p) => {
                const isSelected = activeProduct.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectProduct(p)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-right transition-all ${
                      isSelected
                        ? 'bg-zinc-850 border-amber-500 shadow-sm ring-1 ring-amber-500/50'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 p-1 shrink-0 flex items-center justify-center">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{p.name}</div>
                      <div className="text-[11px] font-mono text-amber-400">{p.priceKWD} د.ك</div>
                    </div>
                  </button>
                );
              })}

              {/* Dedicated AI Generation Card in the Grid */}
              <button
                type="button"
                onClick={() => setIsAiGeneratorOpen(true)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-950/40 text-right transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 p-1 shrink-0 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200 truncate">
                    + توليد بالذكاء الاصطناعي
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    اسم الموديل + كلمتان
                  </div>
                </div>
              </button>
            </div>

            {/* Helper Bar */}
            <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>مرتبط بمحرك الذكاء الاصطناعي Gemini لتوليد صور حصرية ونصوص إعلانية فورية.</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAiGeneratorOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-bold shrink-0 mr-2"
              >
                توليد الآن ↗
              </button>
            </div>
          </div>

          {/* Sub Navigation for Fine-Tuning */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveStudioTab('concept')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-center ${
                activeStudioTab === 'concept'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              2. المفهوم والهدف (Concept)
            </button>
            <button
              onClick={() => setActiveStudioTab('scene')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-center ${
                activeStudioTab === 'scene'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              3. المشهد والقفل (Approved Lock)
            </button>
            <button
              onClick={() => setActiveStudioTab('layers')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-center ${
                activeStudioTab === 'layers'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              4. النصوص والطبقات (Layers)
            </button>
            <button
              onClick={() => setActiveStudioTab('placement')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-center ${
                activeStudioTab === 'placement'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              5. المقاس والمنصة
            </button>
          </div>

          {/* TAB 1: CONCEPTS */}
          {activeStudioTab === 'concept' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">اختر التوجه الإعلاني للحملة (Creative Concept)</h3>
                <span className="text-[11px] text-zinc-400">4 استراتيجيات جاهزة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CREATIVE_CONCEPTS.map((concept) => {
                  const isSelected = selectedConcept.id === concept.id;
                  return (
                    <div
                      key={concept.id}
                      onClick={() => handleConceptChange(concept)}
                      className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-850 border-amber-500 shadow-sm ring-1 ring-amber-500/50'
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-sm font-bold text-white mb-1">{concept.title}</div>
                      <p className="text-xs text-zinc-400 mb-2 leading-relaxed">{concept.subtitle}</p>
                      <div className="text-[11px] text-amber-400/90 font-medium pt-2 border-t border-zinc-800/70">
                        الهدف: {concept.objective}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SCENE & APPROVED LOCK */}
          {activeStudioTab === 'scene' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-white">المشهد البصري وقاعدة القفل المعتمد</h3>
                  <span className="text-xs text-zinc-400">قاعدة #14: Approved Creative Lock 🔒</span>
                </div>

                {/* Approved Creative Lock Toggle */}
                <button
                  type="button"
                  onClick={() => setIsApprovedLockActive(!isApprovedLockActive)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isApprovedLockActive
                      ? 'bg-amber-500 text-zinc-950 shadow'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {isApprovedLockActive ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      المشهد مقفول (Master Locked)
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      فك قفل المشهد
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 leading-relaxed">
                <strong className="text-amber-400">قاعدة استقرار التصميم:</strong> بمجرد اعتمادك للمشهد، يصبح الخلفية الماستر الثابتة. التعديل يتم فقط على نصوص العرض والأسعار والشعار كطبقات مستقلة لمنع أي عشوائية.
              </div>

              {/* Scene Picker */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">اختر بيئة المشهد الواقعية:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CURATED_SCENES.map((scene) => {
                    const isSelected = selectedScene.id === scene.id;
                    return (
                      <div
                        key={scene.id}
                        onClick={() => setSelectedScene(scene)}
                        className={`relative rounded-xl overflow-hidden border aspect-[4/3] cursor-pointer group transition-all ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-500/50 scale-[1.02]'
                            : 'border-zinc-800 opacity-75 hover:opacity-100 hover:border-zinc-600'
                        }`}
                      >
                        <img src={scene.url} alt={scene.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-1.5 right-1.5 left-1.5 text-right">
                          <span className="text-[11px] font-bold text-white leading-tight block truncate">
                            {scene.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEXT LAYERS & CUSTOMIZATION */}
          {activeStudioTab === 'layers' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white">طبقات النصوص والصياغة الكويتية</h3>
                  <span className="text-[11px] text-amber-400">Canva / Typography Layers</span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  اختر من الصياغات الكويتية المعتمدة فوراً أو اكتب نصك الخاص:
                </p>

                {/* Quick AI Generator Banner inside Layers */}
                <div className="mb-4 p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-amber-300">
                    <Wand2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>تريد كتابة وصف وتوليد صورة إعلانية جديدة لأي موديل؟</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAiGeneratorOpen(true)}
                    className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    توليد بالذكاء الاصطناعي ✨
                  </button>
                </div>

                {/* Quick Kuwaiti Suggestions Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {kuwaitiSuggestions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplySuggestion(sug)}
                      className="text-xs bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg text-right transition-colors"
                    >
                      {sug.h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">الشارة الترويجية (Badge)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">العنوان الرئيسي (Headline)</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">النص التوضيحي (Subtext)</label>
                  <textarea
                    rows={2}
                    value={subtext}
                    onChange={(e) => setSubtext(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">زر الإجراء (CTA)</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Visibility Toggles & Position */}
                <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPrice}
                      onChange={(e) => setShowPrice(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                    />
                    <span>إظهار شارة السعر والخصم</span>
                  </label>

                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showMerchantFrame}
                      onChange={(e) => setShowMerchantFrame(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                    />
                    <span>إظهار فريم المتجر والواتساب</span>
                  </label>
                </div>

                {/* Product scale control */}
                <div className="pt-3 border-t border-zinc-800">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                    <span>حجم ظهور المنتج على المشهد</span>
                    <span className="font-mono">{Math.round(productScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.05"
                    value={productScale}
                    onChange={(e) => setProductScale(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 bg-zinc-800 rounded-lg h-1.5 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PLACEMENT & SIZES */}
          {activeStudioTab === 'placement' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">قاعدة المقاسات (Placement & Size Engine)</h3>
                <p className="text-xs text-zinc-400">
                  قاعدة #13: ممنوع أخذ صورة واحدة وشدها لكل مكان؛ يتم ضبط التكوين لكل مقاس بدقة.
                </p>
              </div>

              <div className="space-y-3">
                {AD_PLACEMENTS.map((pl) => {
                  const isSelected = selectedPlacement.id === pl.id;
                  return (
                    <div
                      key={pl.id}
                      onClick={() => setSelectedPlacement(pl)}
                      className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-zinc-850 border-amber-500 shadow-sm ring-1 ring-amber-500/50'
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold text-white">{pl.name}</div>
                        <div className="text-xs text-zinc-400">{pl.platform}</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
                        {pl.aspectRatio}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Preview Component */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col items-center">
            {/* Top Toolbar above Canvas */}
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-300">المعاينة الحية والتفاعلية (Live Preview)</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-900/60 px-2 py-0.5 rounded">
                  {selectedPlacement.aspectRatio}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStudioViewMode('live_preview')}
                  className="flex items-center gap-1 text-[11px] font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>تكبير المعاينة</span>
                </button>
              </div>
            </div>

            {/* The Live Interactive Preview Component */}
            <CampaignLivePreview
              product={activeProduct}
              brand={brand}
              placement={selectedPlacement}
              backgroundScene={selectedScene}
              isApprovedLockActive={isApprovedLockActive}
              headline={headline}
              subtext={subtext}
              badge={badge}
              ctaText={ctaText}
              headlineColor={headlineColor}
              productScale={productScale}
              productPosY={productPosY}
              showPrice={showPrice}
              showMerchantFrame={showMerchantFrame}
              onOpenQCModal={() => setIsQCModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onToggleApprovedLock={(locked) => setIsApprovedLockActive(locked)}
              onApproveCampaign={handleApproveCampaign}
              isCampaignApproved={isCampaignApproved}
            />
          </div>
        </div>
      </div>
      )}

      {/* QC Modal */}
      <QualityControlModal
        isOpen={isQCModalOpen}
        onClose={() => setIsQCModalOpen(false)}
        onProceedToExport={() => {
          setIsQCModalOpen(false);
          setIsExportModalOpen(true);
        }}
        product={activeProduct}
        brand={brand}
        placement={selectedPlacement}
        headline={headline}
        subtext={subtext}
        ctaText={ctaText}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        product={activeProduct}
        brand={brand}
        placement={selectedPlacement}
        headline={headline}
        subtext={subtext}
        ctaText={ctaText}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
      />

      {/* Campaign Brief A4 PDF Modal for Offline Review */}
      <CampaignPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        product={activeProduct}
        brand={brand}
        placement={selectedPlacement}
        layoutPreset={selectedLayoutPreset}
        backgroundScene={selectedScene}
        headline={headline}
        subtext={subtext}
        badge={badge}
        ctaText={ctaText}
      />

      {/* AI Product & Ad Generator Modal */}
      <AIProductAdGeneratorModal
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onProductGenerated={handleProductGenerated}
      />
    </div>
  );
};
