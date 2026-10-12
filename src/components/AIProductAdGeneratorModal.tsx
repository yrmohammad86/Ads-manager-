import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Wand2, 
  Image as ImageIcon, 
  Bot, 
  Check, 
  ArrowLeft,
  Cpu,
  Layers,
  Zap,
  Tag,
  DollarSign,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductItem } from '../types/adcraft';

interface AIProductAdGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductGenerated: (newProduct: ProductItem, newCopy: {
    headline: string;
    subtext: string;
    cta: string;
    badge: string;
  }) => void;
}

export const AIProductAdGeneratorModal: React.FC<AIProductAdGeneratorModalProps> = ({
  isOpen,
  onClose,
  onProductGenerated,
}) => {
  // Inputs
  const [productOrModel, setProductOrModel] = useState('');
  const [description, setDescription] = useState('');
  const [underDescriptionKeywords, setUnderDescriptionKeywords] = useState('');
  const [category, setCategory] = useState('إلكترونيات ولوازم رحلات');
  const [priceKWD, setPriceKWD] = useState<number | ''>(85);

  // Quick preset templates for rapid testing
  const quickTemplates = [
    {
      title: 'DJI Mini 4 Pro Drone',
      desc: 'طائرة تصوير جوي بدقة 4K مع حساسات تجنب العوائق وبطارية تحليق تصل 34 دقيقة للبر والطلعات.',
      kw: 'تصوير سينمائي ، ثبات عالي',
      cat: 'طائرات درون وتصوير جوي',
      price: 185,
    },
    {
      title: 'سماعة Sony WH-1000XM5 برو',
      desc: 'عزل ضوضاء ثوري ذكي مع بطارية تدوم 30 ساعة وشحن سريع في 3 دقائق وميكروفونات نقية.',
      kw: 'عزل احترافي ، صوت نقي',
      cat: 'صوتيات وسماعات رأس',
      price: 95,
    },
    {
      title: 'محطة طاقة Anker Solix C1000',
      desc: 'طاقة نقية بقوة 1800W وشحن فائق السرعة في 58 دقيقة ومقاومة لأجواء الصيف الخليجي.',
      kw: 'كهرباء كشتات ، شحن سريع',
      cat: 'محطات طاقة وشواحن كشتات',
      price: 265,
    },
    {
      title: 'ماكينة قهوة DeLonghi Magnifica S',
      desc: 'طحن حبوب القهوة طازجة مع تبخير الحليب لصنع ألذ اسبريسو وكابتشينو بلمسة واحدة في البيت.',
      kw: 'طحن فوري ، رغوة مخملية',
      cat: 'مكائن قهوة ومستلزمات منزلية',
      price: 139,
    },
  ];

  // Loading and result states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Validation counts
  const titleWords = productOrModel.trim().split(/\s+/).filter(Boolean);
  const descWords = description.trim().split(/\s+/).filter(Boolean);
  const kwWords = underDescriptionKeywords.trim().split(/\s+/).filter(Boolean);

  // Condition 1: Title must be Product Name or Model
  const isTitleConditionMet = productOrModel.trim().length >= 2;

  // Condition 2: Under description at least 2 words (تحت الوصف عالاقل كلمتين)
  // We check that underDescriptionKeywords has at least 2 words OR total descriptive words is valid
  const isKwConditionMet = kwWords.length >= 2;
  const isDescConditionMet = descWords.length >= 2;

  // Total form valid
  const canGenerate = isTitleConditionMet && (isKwConditionMet || isDescConditionMet);

  const handleApplyTemplate = (tpl: typeof quickTemplates[0]) => {
    setProductOrModel(tpl.title);
    setDescription(tpl.desc);
    setUnderDescriptionKeywords(tpl.kw);
    setCategory(tpl.cat);
    setPriceKWD(tpl.price);
    setError(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canGenerate || isGenerating) return;

    setError(null);
    setIsGenerating(true);
    setGenerationStep('جارٍ الاتصال بمحرك الذكاء الاصطناعي لفحص الموديل...');

    try {
      // Animated steps
      setTimeout(() => {
        setGenerationStep('جارٍ صياغة العناوين والنصوص الإعلانية باللهجة الكويتية...');
      }, 700);

      setTimeout(() => {
        setGenerationStep('جارٍ توليد وتجهيز الصورة الإعلانية الفاخرة للمنتج...');
      }, 1400);

      const response = await fetch('/api/generate-product-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productOrModel: productOrModel.trim(),
          description: description.trim(),
          underDescriptionKeywords: underDescriptionKeywords.trim(),
          category,
          priceKWD: priceKWD ? Number(priceKWD) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'فشل التوليد، يرجى التحقق من المدخلات والمحاولة مجدداً.');
      }

      // Success
      setGenerationStep('اكتمل التوليد بنجاح! يتم الآن تطبيق الإعلان...');
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onProductGenerated(data.product, {
          headline: data.copy.headline,
          subtext: data.copy.subtext,
          cta: data.copy.cta,
          badge: data.copy.badge,
        });
        setIsGenerating(false);
        onClose();
      }, 600);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'حدث خطأ أثناء التوليد. تأكد من استيفاء الشروط.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative"
        dir="rtl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-zinc-950 font-bold shadow-lg shadow-amber-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">توليد منتج وصورة وإعلان بالذكاء الاصطناعي</h3>
                <span className="text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  Gemini AI
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                اكتب اسم الموديل والوصف وسيتولى الذكاء الاصطناعي توليد صورة جديدة وصياغة إعلانية كويتية معتمدة.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-6">
          {/* Quick Presets Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                نماذج سريعة للتجربة بضغطة زر:
              </label>
              <span className="text-[11px] text-zinc-500">اختر للتعبئة الفورية</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickTemplates.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/80 hover:bg-zinc-850 hover:border-amber-500/40 text-right transition-all group"
                >
                  <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 truncate">
                    {tpl.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                    {tpl.cat}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Validation Checklist Banner */}
          <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <ShieldConditionIcon isValid={canGenerate} />
              شروط التوليد المطلوبة:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Condition 1 */}
              <div className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                isTitleConditionMet 
                  ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}>
                {isTitleConditionMet ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>1. العنوان: اسم المنتج أو الموديل</span>
              </div>

              {/* Condition 2 */}
              <div className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                isKwConditionMet || isDescConditionMet
                  ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}>
                {isKwConditionMet || isDescConditionMet ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span>2. تحت الوصف: كلمتان على الأقل</span>
              </div>
            </div>
          </div>

          {/* Field 1: Title (Product Name or Model) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                العنوان: اسم المنتج أو رقم الموديل (شرط إلزامي)
              </label>
              <span className={`text-[11px] font-medium ${isTitleConditionMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isTitleConditionMet ? '✓ تم إدخال اسم الموديل' : '⚠️ مطلوب إدخال اسم الموديل'}
              </span>
            </div>
            <input
              type="text"
              required
              disabled={isGenerating}
              value={productOrModel}
              onChange={(e) => setProductOrModel(e.target.value)}
              placeholder="مثال: DJI Mini 4 Pro Drone أو BLUETTI AC200MAX أو سماعة Sony XM5"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white placeholder-zinc-600 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-zinc-500">
              شرط العنوان: اكتب اسم الجهاز أو رقم الموديل بدقة ليتعرف عليه الذكاء الاصطناعي ويولد الصورة والنصوص بناءً عليه.
            </p>
          </div>

          {/* Field 2: Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                وصف المنتج والإعلان (Description)
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">
                عدد الكلمات: {descWords.length}
              </span>
            </div>
            <textarea
              rows={3}
              required
              disabled={isGenerating}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب مواصفات واستخدامات المنتج الإعلانية، مثلاً: طائرة تصوير سينمائية خفيفة الوزن مع مستشعرات تجنب الاصطدام وبطارية تدوم طويلاً لأجواء الرحلات والكشتات..."
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors leading-relaxed"
            />
          </div>

          {/* Field 3: Under-Description Keywords (شرط: تحت الوصف عالاقل كلمتين) */}
          <div className="space-y-1.5 p-3.5 bg-amber-950/15 border border-amber-900/30 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                تحت الوصف: كلمات وميزات رئيسية (عالاقل كلمتين)
              </label>
              <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-md ${
                kwWords.length >= 2 
                  ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/40' 
                  : 'bg-amber-950/50 text-amber-400 border border-amber-800/40'
              }`}>
                {kwWords.length >= 2 ? `✓ ${kwWords.length} كلمات (مستوفى)` : `${kwWords.length} / 2 كلمات`}
              </span>
            </div>
            <input
              type="text"
              required
              disabled={isGenerating}
              value={underDescriptionKeywords}
              onChange={(e) => setUnderDescriptionKeywords(e.target.value)}
              placeholder="مثلاً: تصوير سينمائي ، ثبات عالي ، شحن سريع ، بطارية تدوم"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-amber-400/80">
              * شرط أساسي: اكتب كلمتين على الأقل تحت الوصف لتحديد نقاط القوة أو الكلمات المفتاحية ليتم تضمينها في الإعلان والصورة.
            </p>
          </div>

          {/* Optional Meta: Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">تصنيف المنتج (Category)</label>
              <select
                disabled={isGenerating}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="إلكترونيات ولوازم رحلات">إلكترونيات ولوازم رحلات</option>
                <option value="طائرات درون وتصوير جوي">طائرات درون وتصوير جوي</option>
                <option value="صوتيات وسماعات رأس">صوتيات وسماعات رأس</option>
                <option value="محطات طاقة وشواحن كشتات">محطات طاقة وشواحن كشتات</option>
                <option value="ساعات ذكية وإكسسوارات">ساعات ذكية وإكسسوارات</option>
                <option value="مكائن قهوة ومستلزمات منزلية">مكائن قهوة ومستلزمات منزلية</option>
                <option value="كاميرات ومعدات تصوير احترافي">كاميرات ومعدات تصوير احترافي</option>
                <option value="عطور ومستحضرات فاخرة">عطور ومستحضرات فاخرة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">السعر المقترح بالدينار (KWD)</label>
              <input
                type="number"
                disabled={isGenerating}
                value={priceKWD}
                onChange={(e) => setPriceKWD(e.target.value ? Number(e.target.value) : '')}
                placeholder="مثلاً: 185"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-950/30 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Generating Progress State */}
          {isGenerating && (
            <div className="p-4 bg-zinc-950 border border-amber-500/40 rounded-2xl flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <div className="text-xs font-bold text-amber-300">
                {generationStep}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={isGenerating}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-xs font-bold text-zinc-400 transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={!canGenerate || isGenerating}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg ${
                canGenerate && !isGenerating
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 hover:brightness-110 shadow-amber-950/50 cursor-pointer active:scale-[0.99]'
                  : 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ التوليد بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد صورة وإعلان جديد بالذكاء الاصطناعي ✨</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function ShieldConditionIcon({ isValid }: { isValid: boolean }) {
  if (isValid) {
    return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  }
  return <AlertCircle className="w-4 h-4 text-amber-400" />;
}
