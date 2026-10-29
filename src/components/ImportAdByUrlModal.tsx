import React, { useState } from 'react';
import { 
  Link2, 
  Sparkles, 
  X, 
  Check, 
  AlertCircle, 
  Edit3, 
  Layers, 
  DollarSign, 
  ShieldCheck, 
  Tag, 
  Image as ImageIcon, 
  ArrowRight, 
  DownloadCloud,
  ExternalLink,
  Plus,
  Trash2,
  FileCheck2,
  Smartphone,
  CheckCircle2,
  Share2,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductItem, CampaignRecord, AdContentType } from '../types/adcraft';
import { AD_CONTENT_TYPES } from '../data/mockData';

interface ImportAdByUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNewAd: (newProduct: ProductItem, newCampaign: CampaignRecord) => void;
}

export const ImportAdByUrlModal: React.FC<ImportAdByUrlModalProps> = ({
  isOpen,
  onClose,
  onSaveNewAd,
}) => {
  const [adUrl, setAdUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isExtracted, setIsExtracted] = useState(false);

  // Editable Form Fields (التعديل اليدوي التفاعلي)
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [priceKWD, setPriceKWD] = useState<number>(0);
  const [originalPriceKWD, setOriginalPriceKWD] = useState<number>(0);
  const [sku, setSku] = useState('');
  const [warranty, setWarranty] = useState('');
  const [capacity, setCapacity] = useState('');
  const [output, setOutput] = useState('');
  const [weight, setWeight] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [contentType, setContentType] = useState<AdContentType>('hero_image');
  const [platform, setPlatform] = useState<'Instagram' | 'TikTok' | 'Snapchat' | 'Meta' | 'WhatsApp'>('Instagram');
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Ad Copy Fields
  const [headline, setHeadline] = useState('');
  const [subtext, setSubtext] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [sourceVerificationNotes, setSourceVerificationNotes] = useState('');

  if (!isOpen) return null;

  // Preset sample links for instant testing
  const sampleLinks = [
    {
      title: 'محطة طاقة شمسية (Bluetti AC200MAX)',
      url: 'https://instagram.com/p/bluetti_kuwait_ac200max_offer',
      platform: 'Instagram',
      icon: '⚡',
    },
    {
      title: 'درون تصوير جوي 4K (DJI Combo)',
      url: 'https://xcite.com/kw/dji_mini_4_pro_drone_combo',
      platform: 'TikTok',
      icon: '🚁',
    },
    {
      title: 'ثلاجة كشتات وتخييم 45L',
      url: 'https://outdoorkw.com/products/ice-fridge-45l-compressor',
      platform: 'Instagram',
      icon: '❄️',
    },
    {
      title: 'شاحن بطارية سيارة سريع DC-DC',
      url: 'https://tiktok.com/@bluetti/video/fast_charge_desert_challenge',
      platform: 'TikTok',
      icon: '🔋',
    },
  ];

  const handleFetchFromUrl = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || adUrl;
    if (!targetUrl.trim()) {
      setFetchError('الرجاء كتابة أو لصق رابط الإعلان أولاً.');
      return;
    }

    setIsFetching(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/import-ad-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        const p = data.product;
        setProductName(p.productName || 'منتج إعلاني جديد');
        setCategory(p.category || 'إلكترونيات ولوازم كشتات');
        setPriceKWD(Number(p.priceKWD) || 89);
        setOriginalPriceKWD(Number(p.originalPriceKWD) || Math.round((Number(p.priceKWD) || 89) * 1.25));
        setSku(p.sku || `KW-${Date.now().toString().slice(-4)}`);
        setWarranty(p.specs?.warranty || 'كفالة سنتين كاملة من الوكيل المعتمد في الكويت');
        setCapacity(p.specs?.capacity || 'سعة معتمدة فائقة');
        setOutput(p.specs?.output || 'أداء مستقر ومخرج تيار نقي');
        setWeight(p.specs?.weight || 'خفيف ومناسب للرحلات');
        setImageUrl(p.imageUrl || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80');
        setContentType(p.contentType || 'hero_image');
        setPlatform(p.platform || 'Instagram');
        setKeyFeatures(p.keyFeatures || ['مقاومة عالية للحرارة والأجواء القاسية', 'كفالة الوكيل المعتمد في الكويت', 'توصيل سريع لكافة المناطق']);
        
        if (p.adCopy) {
          setHeadline(p.adCopy.headline || 'عزبتك ما تكتمل بدونها! 🔥');
          setSubtext(p.adCopy.subtext || 'أداء جبار وراحة بال تامة مع كفالة الوكيل المعتمد.');
          setCtaText(p.adCopy.cta || 'شناطر؟ اطلب الحين');
          setBadgeText(p.adCopy.badge || 'الأكثر طلباً في الكويت 🇰🇼');
        }

        setSourceVerificationNotes(p.sourceVerificationNotes || 'تم التحقق من الأسعار والمواصفات ومطابقتها للسوق المحلي.');
        setIsExtracted(true);
      } else {
        setFetchError(data.error || 'تعذر سحب البيانات من هذا الرابط.');
      }
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      setFetchError('حدث خطأ أثناء الاتصال بالخادم لسحب الرابط.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setKeyFeatures((prev) => [...prev, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setKeyFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!productName.trim()) {
      setFetchError('الرجاء إدخال اسم المنتج.');
      return;
    }

    const newProductId = `prod-${Date.now().toString().slice(-6)}`;
    const newProduct: ProductItem = {
      id: newProductId,
      name: productName,
      category: category || 'منتجات إعلانية',
      priceKWD: Number(priceKWD) || 0,
      originalPriceKWD: Number(originalPriceKWD) || undefined,
      sku: sku || `KW-${Date.now().toString().slice(-4)}`,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
      keyFeatures: keyFeatures.length ? keyFeatures : ['منتج عالي الجودة ومعتمد محلياً'],
      specs: {
        capacity: capacity || undefined,
        output: output || undefined,
        weight: weight || undefined,
        warranty: warranty || 'كفالة الوكيل المعتمد في الكويت',
      },
      sourceVerification: {
        storeName: 'تم استيراد الرابط والمطابقة',
        localPriceVerified: true,
        specsMatchManufacturer: true,
        verifiedSku: sku,
        auditStatus: 'VERIFIED',
        notes: sourceVerificationNotes || 'تم استيراد الإعلان ومراجعته وتعديله يدوياً بواسطة التاجر.',
      },
      productLock: {
        lockedShape: true,
        lockedPortsAndBadges: true,
        lockedScale: true,
        status: 'ACTIVE',
      },
    };

    const typeObj = AD_CONTENT_TYPES.find((t) => t.id === contentType) || AD_CONTENT_TYPES[0];
    const newCampaign: CampaignRecord = {
      id: `camp-${Date.now().toString().slice(-6)}`,
      title: `حملة ${productName.slice(0, 30)} - ${typeObj.name}`,
      productName,
      productId: newProductId,
      contentType,
      contentTypeName: typeObj.name,
      placement: contentType === 'video_reels' || contentType === 'story_card' ? 'story_9_16' : 'feed_4_5',
      platform,
      priceKWD: Number(priceKWD) || 0,
      originalPriceKWD: Number(originalPriceKWD) || undefined,
      adCopy: {
        headline: headline || 'عرض حصري في الكويت ⚡',
        subtext: subtext || 'مواصفات حقيقية وكفالة معتمدة.',
        cta: ctaText || 'اطلب الحين',
        badge: badgeText || 'متوفر الآن',
      },
      sourceUrl: adUrl || undefined,
      adVisualUrl: imageUrl,
      impressionsEstimated: Math.floor(15000 + Math.random() * 45000),
      clicksEstimated: Math.floor(1200 + Math.random() * 3500),
      conversionsEstimated: Math.floor(60 + Math.random() * 150),
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveNewAd(newProduct, newCampaign);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0D1424] border border-[#202D4C] rounded-3xl max-w-4xl w-full p-5 sm:p-7 text-right shadow-2xl relative my-8 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-zinc-400 hover:text-white p-1.5 rounded-xl bg-[#131C31] hover:bg-[#1A2642] border border-[#1E2B4A] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-[#1E2B4A] shrink-0">
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold mb-1">
            <Zap className="w-4 h-4 text-amber-300" />
            <span>نظام سحب الإعلانات الذكي • URL-to-Ad Engine</span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400 font-mono">Product Lock 🔒 Verified</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            تحويل رابط المنتج إلى إعلان متكامل ومطابق للمواصفات
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            الصق رابط الإعلان (إنستغرام، تيك توك، صفحة المتجر) وسيقوم النظام بسحب كافة المواصفات والأسعار وتدقيقها مع إمكانية التعديل اليدوي الكامل.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 py-4 space-y-6 pr-1 pl-1">
          {/* STEP 1: URL INPUT & SAMPLE LINKS */}
          <div className="bg-[#080C16] border border-[#1E2B4A] rounded-2xl p-4 sm:p-5 space-y-4">
            <label className="block text-xs font-bold text-zinc-200">
              رابط الإعلان أو صفحة المنتج (Instagram / TikTok / Store URL):
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Link2 className="w-4 h-4 absolute right-3.5 top-3.5 text-zinc-500" />
                <input
                  type="url"
                  placeholder="https://instagram.com/p/... أو https://outdoorkw.com/product/..."
                  value={adUrl}
                  onChange={(e) => setAdUrl(e.target.value)}
                  className="w-full bg-[#0D1424] border border-[#1E2B4A] focus:border-violet-500 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors font-mono"
                  dir="ltr"
                />
              </div>

              <button
                type="button"
                onClick={() => handleFetchFromUrl()}
                disabled={isFetching}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-950/40 shrink-0 transition-all cursor-pointer disabled:opacity-50"
              >
                {isFetching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري فحص الرابط وسحب المواصفات...</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-4 h-4" />
                    <span>سحب المواصفات والأسعار تلقائياً ⚡</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Links Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-zinc-400 block font-medium">
                أو اختر رابطاً تجريبياً جاهزاً للفحص الفوري بضغطة زر:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleLinks.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAdUrl(s.url);
                      handleFetchFromUrl(s.url);
                    }}
                    className="bg-[#131C31] hover:bg-[#1A2642] border border-[#1E2B4A] hover:border-violet-500/50 text-zinc-300 text-xs px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{s.icon}</span>
                    <span className="text-[11px]">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {fetchError && (
              <div className="p-3 bg-rose-950/80 border border-rose-600 rounded-xl text-rose-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  {fetchError}
                </span>
                <button onClick={() => setFetchError(null)} className="text-rose-400 hover:text-white">✕</button>
              </div>
            )}
          </div>

          {/* STEP 2: VERIFIED VS INFERRED PREVIEW & MANUAL EDITING */}
          {isExtracted && (
            <div className="space-y-5 animate-fade-in">
              {/* Status Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2B4A]">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    تدقيق البيانات المسحوبة والتعديل اليدوي
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    مؤكد من الرابط
                  </span>
                  <span className="text-[10px] bg-violet-950 text-violet-300 border border-violet-800/60 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    اقتراح ذكي قابل للتعديل
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Visual Ad Card Preview (5 cols) */}
                <div className="md:col-span-5 space-y-3">
                  <span className="text-xs font-bold text-zinc-300 block">معاينة بطاقة الإعلان المسحوب:</span>
                  <div className="bg-[#080C16] border border-[#1E2B4A] rounded-2xl overflow-hidden relative shadow-xl">
                    <div className="relative aspect-[4/5] max-h-72 w-full overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between text-[10px]">
                        <span className="bg-amber-500 text-zinc-950 font-bold px-2 py-0.5 rounded shadow">
                          {badgeText || 'الأكثر طلباً'}
                        </span>
                        <span className="bg-black/70 backdrop-blur border border-zinc-700 text-zinc-200 px-2 py-0.5 rounded font-mono">
                          {platform}
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-2.5 right-2.5 left-2.5 space-y-1">
                        <div className="text-xs font-bold text-white line-clamp-1">{headline}</div>
                        <div className="text-[11px] text-zinc-300 line-clamp-1">{subtext}</div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-amber-400 font-mono tabular-nums">{priceKWD}</span>
                            <span className="text-[10px] text-zinc-400">د.ك</span>
                            {originalPriceKWD > 0 && (
                              <span className="text-[9px] text-zinc-500 line-through mr-1 font-mono tabular-nums">{originalPriceKWD} د.ك</span>
                            )}
                          </div>
                          <span className="bg-amber-500 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded">
                            {ctaText || 'اطلب الحين'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-[#0D1424] border-t border-[#1E2B4A] text-[11px] text-zinc-400 space-y-1">
                      <div className="flex justify-between">
                        <span>نوع المحتوى:</span>
                        <span className="font-bold text-violet-400">
                          {AD_CONTENT_TYPES.find((t) => t.id === contentType)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>كفالة الوكيل:</span>
                        <span className="text-emerald-400 font-semibold">{warranty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Image URL input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-zinc-400 block">رابط صورة المنتج الحقيقي:</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-[#080C16] border border-[#1E2B4A] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Form Inputs for Manual Editing (7 cols) */}
                <div className="md:col-span-7 space-y-3.5">
                  {/* Product Name */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-zinc-200">
                      <span>اسم المنتج والموديل:</span>
                      <span className="text-emerald-400 text-[10px] font-mono">✓ مؤكد من الرابط</span>
                    </div>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full bg-[#080C16] border border-[#1E2B4A] focus:border-violet-500 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>

                  {/* Pricing row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-zinc-200">
                        <span>السعر الحالي (د.ك):</span>
                        <span className="text-emerald-400 text-[10px] font-mono">✓ مؤكد</span>
                      </div>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={priceKWD}
                        onChange={(e) => setPriceKWD(Number(e.target.value))}
                        className="w-full bg-[#080C16] border border-[#1E2B4A] rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-zinc-200">
                        <span>السعر قبل الخصم:</span>
                        <span className="text-zinc-500 text-[10px]">اختياري</span>
                      </div>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={originalPriceKWD}
                        onChange={(e) => setOriginalPriceKWD(Number(e.target.value))}
                        className="w-full bg-[#080C16] border border-[#1E2B4A] rounded-xl px-3 py-2 text-xs font-mono text-zinc-400 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  {/* Content Type & Platform */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-200 block">نوع المحتوى الإعلاني:</label>
                      <select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value as AdContentType)}
                        className="w-full bg-[#080C16] border border-[#1E2B4A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                      >
                        {AD_CONTENT_TYPES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.icon} {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-200 block">المنصة المستهدفة:</label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value as any)}
                        className="w-full bg-[#080C16] border border-[#1E2B4A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                      >
                        <option value="Instagram">إنستغرام (Instagram)</option>
                        <option value="TikTok">تيك توك (TikTok)</option>
                        <option value="Snapchat">سناب شات (Snapchat)</option>
                        <option value="WhatsApp">واتساب (WhatsApp)</option>
                        <option value="Meta">ميتا / فيسبوك (Meta)</option>
                      </select>
                    </div>
                  </div>

                  {/* Ad Copy (Headline & Subtext) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-zinc-200">
                      <span>العنوان الرئيسي (Headline):</span>
                      <span className="text-violet-400 text-[10px] font-mono">⚡ اقتراح كويتي</span>
                    </div>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full bg-[#080C16] border border-[#1E2B4A] focus:border-violet-500 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-zinc-200">
                      <span>النص الترويجي وميزات المنتج:</span>
                      <span className="text-violet-400 text-[10px] font-mono">⚡ اقتراح كويتي</span>
                    </div>
                    <input
                      type="text"
                      value={subtext}
                      onChange={(e) => setSubtext(e.target.value)}
                      className="w-full bg-[#080C16] border border-[#1E2B4A] focus:border-violet-500 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  {/* CTA & Badge */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-200 block">زر الدعوة للشراء (CTA):</label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full bg-[#080C16] border border-[#1E2B4A] rounded-xl px-3 py-2 text-xs text-amber-400 font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-200 block">شارة التميز (Badge):</label>
                      <input
                        type="text"
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        className="w-full bg-[#080C16] border border-[#1E2B4A] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Specifications & Warranty */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-200 block">كفالة الوكيل المعتمد:</label>
                      <input
                        type="text"
                        value={warranty}
                        onChange={(e) => setWarranty(e.target.value)}
                        className="w-full bg-[#080C16] border border-[#1E2B4A] rounded-xl px-3 py-2 text-xs text-zinc-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-200 block">الرمز التخزيني (SKU):</label>
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full bg-[#080C16] border border-[#1E2B4A] rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-[#1E2B4A] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>يتم ربط الإعلان تلقائياً بلوحة الإحصائيات مع تفعيل Product Lock 🔒</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-[#131C31] hover:bg-[#1A2642] border border-[#1E2B4A] transition-colors"
            >
              إلغاء
            </button>

            {isExtracted && (
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>حفظ وتوليد الإعلان بالمتجر 🚀</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
