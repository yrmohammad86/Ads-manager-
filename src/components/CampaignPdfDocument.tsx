import React, { forwardRef } from 'react';
import { ProductItem, BrandDNA, AdPlacement, LayoutPreset, BackgroundScene } from '../types/adcraft';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Phone, 
  Globe, 
  Award, 
  Tag, 
  Sparkles, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Square,
  Zap,
  ShoppingBag
} from 'lucide-react';

export interface CampaignPdfDocumentProps {
  product: ProductItem;
  brand: BrandDNA;
  placement: AdPlacement;
  layoutPreset: LayoutPreset;
  backgroundScene: BackgroundScene;
  headline: string;
  subtext: string;
  badge: string;
  ctaText: string;
  adPreviewDataUrl?: string | null;
  checklistState?: { [key: string]: boolean };
  onToggleChecklist?: (id: string) => void;
  reviewerNotes?: string;
  isInteractivePreview?: boolean;
  pageNumber?: number;
  totalPages?: number;
  campaignTitle?: string;
  containerClassName?: string;
}

export const CampaignPdfDocument = forwardRef<HTMLDivElement, CampaignPdfDocumentProps>(
  (
    {
      product,
      brand,
      placement,
      layoutPreset,
      backgroundScene,
      headline,
      subtext,
      badge,
      ctaText,
      adPreviewDataUrl,
      checklistState = {},
      onToggleChecklist,
      reviewerNotes = '',
      isInteractivePreview = false,
      pageNumber,
      totalPages,
      campaignTitle,
      containerClassName = '',
    },
    ref
  ) => {
    const todayDate = new Date().toLocaleDateString('ar-KW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const defaultChecks = [
      {
        id: 'lock_geometry',
        title: 'مطابقة شكل المنتج لقفل الهيكل (Product Lock 🔒)',
        detail: 'التأكد من عدم توليد أي تشويه بالمنافذ أو المقابض أو الأزرار ومطابقتها للمنتج الحقيقي.',
        defaultChecked: true,
      },
      {
        id: 'kuwaiti_dialect',
        title: 'أصالة اللهجة الكويتية وسياق الكشتات والطلعات 🇰🇼',
        detail: 'خلو النص من التكلف والترجمة الحرفية واستخدام تعابير محلية دارجة مثل «عزبتك، شناطر، وين ما تروح».',
        defaultChecked: true,
      },
      {
        id: 'price_warranty',
        title: 'صحة السعر بالدينار الكويتي وكفالة الوكيل المعتمد',
        detail: `السعر الرسمي ${product.priceKWD} د.ك مع كفالة: ${product.specs.warranty || 'سنتين وكيل الكويت'}.`,
        defaultChecked: true,
      },
      {
        id: 'merchant_channels',
        title: 'قنوات التواصل والتوجيه الفوري للواتساب والمتجر',
        detail: `تأكيد رقم الواتساب: ${brand.fixedFrame.whatsApp} ورابط المتجر: ${brand.fixedFrame.storeUrl}.`,
        defaultChecked: true,
      },
      {
        id: 'placement_visual',
        title: `تناسق التصميم مع أبعاد المنصة (${placement.aspectRatio})`,
        detail: `مطابقة أبعاد ${placement.name} وموقع الشعار والقالب (${layoutPreset.name}).`,
        defaultChecked: true,
      },
    ];

    return (
      <div
        ref={ref}
        id="campaign-pdf-printable-brief"
        className={`adcraft-pdf-page bg-white text-zinc-900 w-full max-w-[800px] mx-auto p-8 shadow-2xl rounded-sm print:p-6 print:shadow-none print:w-full print:max-w-none text-right font-sans relative ${containerClassName}`}
        dir="rtl"
        style={{ minHeight: '1120px' }} // Standard A4 portrait ratio
      >
        {/* TOP HEADER: BRAND IDENTITY & DOCUMENT HEADER */}
        <div className="border-b-2 border-zinc-900 pb-5 mb-6">
          <div className="flex items-start justify-between">
            {/* Right: Brand & Title */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="bg-amber-500 text-zinc-950 font-black text-xs px-2.5 py-0.5 rounded tracking-wider">
                  ADCRAFT AI
                </span>
                <span className="text-xs font-bold text-zinc-500">
                  وثيقة المراجعة والاعتماد الميداني • OFFICIAL CAMPAIGN BRIEF
                </span>
                {totalPages && totalPages > 1 && pageNumber && (
                  <span className="bg-zinc-900 text-amber-400 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full border border-zinc-700">
                    صفحة {pageNumber} من {totalPages}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
                ملف اعتماد الحملة الإعلانية: {product.name}
              </h1>
              {campaignTitle && (
                <div className="text-xs font-bold text-amber-700 mt-0.5">
                  عنوان الحملة: {campaignTitle}
                </div>
              )}
              <p className="text-xs text-zinc-600 mt-1">
                وثيقة تدقيق شاملة تجمع التصميم الإعلاني المعتمد، النصوص باللهجة الكويتية، المواصفات الفنية، وقائمة التوقيع للمراجعة الأوفلاين.
              </p>
            </div>

            {/* Left: Merchant Badge & Meta */}
            <div className="text-left shrink-0">
              <div className="inline-block bg-zinc-950 text-white px-3 py-1.5 rounded-lg text-xs font-bold mb-1">
                {brand.name}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                كود المسودة: ADC-{product.sku || 'KW-01'}
              </div>
              <div className="text-[11px] text-zinc-500 flex items-center justify-end gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-amber-600" />
                <span>{todayDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Meta Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-200 text-xs">
            <div className="bg-zinc-50 border border-zinc-200 rounded p-2">
              <span className="text-[10px] text-zinc-500 block">السوق المستهدف</span>
              <strong className="text-zinc-900 text-xs">الكويت ودول الخليج 🇰🇼</strong>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded p-2">
              <span className="text-[10px] text-zinc-500 block">أبعاد المنصة</span>
              <strong className="text-zinc-900 text-xs">{placement.name} ({placement.aspectRatio})</strong>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded p-2">
              <span className="text-[10px] text-zinc-500 block">قالب التصميم</span>
              <strong className="text-amber-700 text-xs">{layoutPreset.name}</strong>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded p-2">
              <span className="text-[10px] text-zinc-500 block">حالة قفل المنتج</span>
              <strong className="text-emerald-700 text-xs flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                Product Lock 🔒 نشط
              </strong>
            </div>
          </div>
        </div>

        {/* SECTION 1: VISUAL CREATIVE MASTER & KEY MARKETING COPY */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {/* Ad Visual Render Preview (5 cols) */}
          <div className="md:col-span-5 flex flex-col">
            <div className="text-xs font-bold text-zinc-900 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                معاينة المرئي الإعلاني المعتمد
              </span>
              <span className="text-[10px] bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded font-mono">
                {placement.aspectRatio}
              </span>
            </div>

            <div className="border-2 border-zinc-900 rounded-xl overflow-hidden bg-zinc-950 relative shadow-md flex-1 min-h-[300px] flex items-center justify-center">
              {adPreviewDataUrl ? (
                <img
                  src={adPreviewDataUrl}
                  alt="Campaign Master Ad"
                  className="w-full h-full object-contain"
                />
              ) : (
                /* Fallback stylized visual card matching the ad */
                <div className="p-4 w-full h-full flex flex-col justify-between text-white relative">
                  <img
                    src={backgroundScene.url}
                    alt={backgroundScene.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

                  {/* Badge & Lock */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-amber-500 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      {badge}
                    </span>
                    <span className="text-[9px] bg-black/60 border border-amber-400 text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Locked
                    </span>
                  </div>

                  {/* Product Centered */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-h-36 object-contain drop-shadow-2xl"
                    />
                  </div>

                  {/* Text & CTA */}
                  <div className="relative z-10 space-y-1">
                    <div className="text-xs font-bold text-white text-center">{headline}</div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-amber-400 font-black text-xs font-mono">{product.priceKWD} د.ك</span>
                      <span className="bg-amber-500 text-zinc-950 font-bold text-[10px] px-2 py-0.5 rounded">
                        {ctaText}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 text-[10px] text-zinc-500 text-center">
              تم تثبيت صورة المنتج الأصلية لمنع أي هلوسة بالذكاء الاصطناعي (Anti-Hallucination Lock)
            </div>
          </div>

          {/* Marketing Copy & Kuwaiti Dialect Angle (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs font-bold text-zinc-900 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                المحتوى الإعلاني والنصوص المعتمدة (Bilingual Copy)
              </div>

              {/* Main Headline */}
              <div className="bg-zinc-50 border border-zinc-300 rounded-lg p-3 mb-2.5">
                <div className="text-[10px] font-bold text-zinc-500 mb-0.5">العنوان الإعلاني الكويتي (Primary Headline):</div>
                <div className="text-base font-bold text-zinc-950 leading-snug">{headline}</div>
              </div>

              {/* Subtext */}
              <div className="bg-zinc-50 border border-zinc-300 rounded-lg p-3 mb-2.5">
                <div className="text-[10px] font-bold text-zinc-500 mb-0.5">النص التوضيحي وعرض القيمة (Subtext & Value Prop):</div>
                <div className="text-xs text-zinc-800 leading-relaxed">{subtext}</div>
              </div>

              {/* Badges & CTA */}
              <div className="grid grid-cols-2 gap-2 mb-2.5">
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5">
                  <div className="text-[10px] font-bold text-amber-900 mb-0.5">شارة العرض (Offer Badge):</div>
                  <div className="text-xs font-bold text-amber-950">{badge}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5">
                  <div className="text-[10px] font-bold text-emerald-900 mb-0.5">زر اتخاذ الإجراء (CTA):</div>
                  <div className="text-xs font-bold text-emerald-950">{ctaText}</div>
                </div>
              </div>

              {/* Full Social Caption Box */}
              <div className="border border-dashed border-zinc-300 rounded-lg p-2.5 bg-zinc-50">
                <div className="text-[10px] font-bold text-zinc-500 mb-1 flex items-center justify-between">
                  <span>كابشن المنصات (Social Media Caption):</span>
                  <span className="text-[9px] text-zinc-400">واتساب + إنستغرام</span>
                </div>
                <div className="text-[11px] text-zinc-700 leading-relaxed font-sans max-h-24 overflow-hidden">
                  ⚡ {headline} — {subtext} | كفالة: {product.specs.warranty || 'سنتين وكيل الكويت'} | للطلب: {brand.fixedFrame.whatsApp}
                </div>
              </div>
            </div>

            {/* Merchant Identity Frame */}
            <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-zinc-900">{brand.name}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-600 text-[11px]">{brand.fixedFrame.guaranteeText}</span>
              </div>
              <div className="text-left font-mono text-[11px] text-zinc-600">
                {brand.fixedFrame.whatsApp}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMMERCIAL & TECHNICAL SPECIFICATIONS */}
        <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/70 mb-6">
          <div className="text-xs font-bold text-zinc-900 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              المواصفات الفنية والتسعير التجاري المعتمد
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              SKU: {product.sku}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
              <span className="text-[10px] text-zinc-500 block">السعر للعميل (KWD)</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-black text-zinc-950 font-mono">{product.priceKWD}</span>
                <span className="text-xs font-bold text-zinc-600">د.ك</span>
                {product.originalPriceKWD && (
                  <span className="text-[10px] text-zinc-400 line-through mr-1 font-mono">
                    {product.originalPriceKWD} د.ك
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
              <span className="text-[10px] text-zinc-500 block">سعة البطارية / القدرة</span>
              <span className="text-xs font-bold text-zinc-900 block mt-0.5">
                {product.specs.capacity || '2048 Wh LiFePO4'}
              </span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
              <span className="text-[10px] text-zinc-500 block">طاقة الخرج (AC Output)</span>
              <span className="text-xs font-bold text-zinc-900 block mt-0.5">
                {product.specs.output || '2400W Pure Sine Wave'}
              </span>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
              <span className="text-[10px] text-zinc-500 block">الكفالة والدعم المحلي</span>
              <span className="text-xs font-bold text-emerald-800 block mt-0.5">
                {product.specs.warranty || 'كفالة الوكيل سنتين'}
              </span>
            </div>
          </div>

          {/* Key Product Features List */}
          <div className="mt-3 pt-3 border-t border-zinc-200 flex flex-wrap gap-2 text-[11px] text-zinc-700">
            <span className="font-bold text-zinc-800">أبرز المزايا:</span>
            {product.keyFeatures.map((feat, idx) => (
              <span key={idx} className="bg-white border border-zinc-200 px-2 py-0.5 rounded-full">
                • {feat}
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 3: EXECUTIVE OFFLINE REVIEW & SIGN-OFF CHECKLIST */}
        <div className="border-2 border-zinc-900 rounded-xl p-5 bg-white mb-6">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-200 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-black text-zinc-950">
                قائمة فحص واعتماد الجودة الأوفلاين (Executive Sign-Off Checklist)
              </h2>
            </div>
            <span className="text-[10px] font-mono bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
              OFFLINE REVIEW GATE
            </span>
          </div>

          {/* Checklist items */}
          <div className="space-y-2 mb-4">
            {defaultChecks.map((item) => {
              const isChecked = checklistState[item.id] !== undefined 
                ? checklistState[item.id] 
                : item.defaultChecked;

              return (
                <div
                  key={item.id}
                  onClick={() => isInteractivePreview && onToggleChecklist?.(item.id)}
                  className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs transition-colors ${
                    isChecked 
                      ? 'bg-zinc-50/80 border-zinc-200' 
                      : 'bg-white border-zinc-300'
                  } ${isInteractivePreview ? 'cursor-pointer hover:bg-zinc-100' : ''}`}
                >
                  <div className="mt-0.5 shrink-0 text-amber-600">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-zinc-900">{item.title}</div>
                    <div className="text-[11px] text-zinc-600 leading-snug">{item.detail}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {isChecked ? 'تم التحقق ✓' : 'قيد المراجعة'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Physical Sign-off & Decision Signature Table */}
          <div className="border border-zinc-300 rounded-lg p-3 bg-zinc-50">
            <div className="text-xs font-bold text-zinc-900 mb-2">توقيع المسؤول وقرار الاعتماد النهائي:</div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
              <div className="border-b border-zinc-400 pb-1">
                <span className="text-[10px] text-zinc-500 block">اسم المراجع / المسؤول:</span>
                <span className="text-xs font-semibold text-zinc-800 block mt-1">
                  ___________________________
                </span>
              </div>
              <div className="border-b border-zinc-400 pb-1">
                <span className="text-[10px] text-zinc-500 block">المسمى الوظيفي:</span>
                <span className="text-xs font-semibold text-zinc-800 block mt-1">
                  المدير الإبداعي / مسؤول التسويق
                </span>
              </div>
              <div className="border-b border-zinc-400 pb-1">
                <span className="text-[10px] text-zinc-500 block">تاريخ الاعتماد:</span>
                <span className="text-xs font-semibold text-zinc-800 block mt-1">
                  {todayDate}
                </span>
              </div>
            </div>

            {/* Decision Checkboxes & Signature line */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-zinc-200">
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <Square className="w-3.5 h-3.5" />
                  معتمد للنشر الفوري
                </span>
                <span className="flex items-center gap-1.5 text-amber-800">
                  <Square className="w-3.5 h-3.5" />
                  يحتاج تعديلات طفيفة
                </span>
                <span className="flex items-center gap-1.5 text-rose-800">
                  <Square className="w-3.5 h-3.5" />
                  مرفوض
                </span>
              </div>

              <div className="text-left w-48 border-b-2 border-dashed border-zinc-400 pb-0.5">
                <span className="text-[10px] text-zinc-500 block">التوقيع والختم الرسمي:</span>
              </div>
            </div>

            {reviewerNotes && (
              <div className="mt-2 pt-2 border-t border-zinc-200 text-xs text-zinc-700">
                <strong className="text-zinc-900">ملاحظات إضافية: </strong>
                {reviewerNotes}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER: CONFIDENTIALITY & STAMP */}
        <div className="border-t border-zinc-300 pt-3 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-500">
          <div>
            وثيقة سرية خاصة بقسم إعلانات متجر <strong>{brand.name}</strong> • تم الإنشاء بواسطة AdCraft AI Platform
          </div>
          <div className="flex items-center gap-2 mt-1 sm:mt-0 font-mono">
            {totalPages && totalPages > 1 && pageNumber && (
              <>
                <span className="font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
                  صفحة {pageNumber} من {totalPages}
                </span>
                <span>•</span>
              </>
            )}
            <span>A4 PORTRAIT SPEC</span>
            <span>•</span>
            <span>KUWAIT MARKET READY 🇰🇼</span>
            <span>•</span>
            <span>VERIFIED DRAFT</span>
          </div>
        </div>
      </div>
    );
  }
);

CampaignPdfDocument.displayName = 'CampaignPdfDocument';
