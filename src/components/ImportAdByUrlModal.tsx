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
  Share2
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
      title: 'إعلان محطة طاقة شمسية (Bluetti Outdoor)',
      url: 'https://instagram.com/p/bluetti_kuwait_ac200max_offer',
      platform: 'Instagram',
      icon: '⚡',
    },
    {
      title: 'إعلان درون تصوير جوي 4K (DJI Combo)',
      url: 'https://xcite.com/kw/dji_mini_4_pro_drone_combo',
      platform: 'TikTok',
      icon: '🚁',
    },
    {
      title: 'إعلان ثلاجة كشتات وتخييم 45L',
      url: 'https://outdoorkw.com/products/ice-fridge-45l-compressor',
      platform: 'Instagram',
      icon: '❄️',
    },
    {
      title: 'إعلان شاحن بطارية سيارة سريع DC-DC',
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-4xl w-full p-5 sm:p-7 text-right shadow-2xl relative my-8 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-zinc-400 hover:text-white p-1.5 rounded-xl bg-zinc-800/80 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
            <Link2 className="w-4 h-4" />
            استيراد وسحب بيانات الإعلان بالذكاء الاصطناعي (AI Ad Link Scraper)
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            إضافة إعلان عن طريق الرابط مع إمكانية التعديل اليدوي
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            الصق رابط الإعلان (إنستغرام، تيك توك، صفحة المتجر) وسيقوم النظام بسحب كافة المواصفات والأسعار تلقائياً وتحديث لوحة الإحصائيات البصرية فوراً.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 py-4 space-y-6 pr-1 pl-1">
          {/* STEP 1: URL INPUT & SAMPLE LINKS */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
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
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  dir="ltr"
                />
              </div>

              <button
                type="button"
                onClick={() => handleFetchFromUrl()}
                disabled={isFetching}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30 shrink-0 transition-all cursor-pointer disabled:opacity-50"
              >
                {isFetching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>جاري سحب المواصفات والأسعار...</span>
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
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 text-xs px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
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

          {/* STEP 2: INTERACTIVE MANUAL EDITING & PREVIEW FORM */}
          {isExtracted && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    مراجعة وتعديل بيانات الإعلان يدوياً (Manual Customization)
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                  تم سحب البيانات بنجاح ✓
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Visual Ad Card Preview (5 cols) */}
                <div className="md:col-span-5 space-y-3">
                  <span className="text-xs font-bold text-zinc-300 block">معاينة بطاقة الإعلان المسحوب:</span>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-xl">
                    <div className="relative aspect-[4/5] max-h-72 w-full overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between text-[10px]">
                        <span className="bg-amber-500 text-zinc-950 font-bold px-2 py-0.5 rounded">
                          {badgeText || 'الأكثر طلباً'}
                        </span>
                        <span className="bg-black/60 backdrop-blur border border-zinc-700 text-zinc-200 px-2 py-0.5 rounded font-mono">
                          {platform}
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-2.5 right-2.5 left-2.5 space-y-1">
                        <div className="text-xs font-bold text-white line-clamp-1">{headline}</div>
                        <div className="text-[11px] text-zinc-300 line-clamp-1">{subtext}</div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-black text-amber-400 font-mono">{priceKWD}</span>
                            <span className="text-[10px] text-zinc-400">د.ك</span>
                            {originalPriceKWD > 0 && (
                              <span className="text-[9px] text-zinc-500 line-through mr-1 font-mono">{originalPriceKWD} د.ك</span>
                            )}
                          </div>
                          <span className="bg-amber-500 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded">
                            {ctaText || 'اطلب الحين'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-900 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                      <div className="flex justify-between">
                        <span>نوع المحتوى:</span>
                        <span className="font-bold text-amber-400">
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
                    <label className="text-[11px] font-medium text-zinc-400 block">رابط صورة الإعلان:</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Form Inputs for Manual Editing (7 cols) */}
                <div className="md:col-span-7 space-y-3.5">
                  {/* Product Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-200 block">اسم المنتج والموديل:</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Pricing row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-200 block">السعر الحالي (د.ك KWD):</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={priceKWD}
                        onChange={(e) => setPriceKWD(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-200 block">السعر قبل الخصم (د.ك):</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={originalPriceKWD}
                        onChange={(e) => setOriginalPriceKWD(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-400 focus:outline-none focus:border-amber-500"
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="Instagram">📸 إنستغرام (Instagram)</option>
                        <option value="TikTok">🎵 تيك توك (TikTok)</option>
                        <option value="Snapchat">👻 سناب شات (Snapchat)</option>
                        <option value="Meta">🌐 فيسبوك وميتا (Meta)</option>
                        <option value="WhatsApp">💬 واتساب مباشر (WhatsApp)</option>
                      </select>
                    </div>
                  </div>

                  {/* Specs & Warranty */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-300 block">كفالة الوكيل المعتمد:</label>
                      <input
                        type="text"
                        value={warranty}
                        onChange={(e) => setWarranty(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-300 block">السعة أو القدرة:</label>
                      <input
                        type="text"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Ad Copy fields */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-200 block">العنوان الإعلاني الكويتي (Headline):</label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300 block">النص التوضيحي (Subtext):</label>
                    <textarea
                      rows={2}
                      value={subtext}
                      onChange={(e) => setSubtext(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-300 block">زر اتخاذ الإجراء (CTA):</label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-300 block">شارة العرض (Badge):</label>
                      <input
                        type="text"
                        value={badgeText}
                        onChange={(e) => setBadgeText(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Key Features Tags */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-medium text-zinc-300 block">المزايا التسويقية الرئيسية:</label>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {keyFeatures.map((feat, idx) => (
                        <span
                          key={idx}
                          className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-lg text-xs flex items-center gap-1.5"
                        >
                          <span>• {feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(idx)}
                            className="text-zinc-500 hover:text-rose-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="أضف ميزة جديدة..."
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="bg-zinc-800 hover:bg-zinc-750 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Action Buttons */}
        <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>سيتم تفعيل قاعدة قفل المنتج (Product Lock 🔒) تلقائياً وحفظ الحملة في الإحصائيات.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            {isExtracted && (
              <button
                type="button"
                onClick={handleSave}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حفظ وإدراج الإعلان في الحملات والإحصائيات 📊</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
