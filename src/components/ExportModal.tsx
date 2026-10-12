import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  X, 
  Instagram, 
  Phone, 
  FileCheck2,
  Smartphone,
  Layers,
  ImageDown
} from 'lucide-react';
import { exportElementAsPng } from '../utils/exportImage';
import { ProductItem, BrandDNA, AdPlacement } from '../types/adcraft';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem;
  brand: BrandDNA;
  placement: AdPlacement;
  headline: string;
  subtext: string;
  ctaText: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  product,
  brand,
  placement,
  headline,
  subtext,
  ctaText,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccessType, setDownloadSuccessType] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Prepare full social media caption tailored for Kuwait
  const generateCaption = () => {
    return `⚡ ${headline}

${subtext}

✨ مميزات ${product.name}:
${product.keyFeatures.map((f) => `• ${f}`).join('\n')}

💰 السعر: ${product.priceKWD} د.ك ${product.originalPriceKWD ? `(بدلاً من ${product.originalPriceKWD} د.ك)` : ''}
🛡️ الكفالة: ${product.specs.warranty || 'كفالة الوكيل المعتمد في الكويت'}
🚚 التوصيل متوفر لجميع مناطق الكويت والمخيمات.

${ctaText}
📲 للطلب والاستفسار الفوري عبر الواتساب: ${brand.fixedFrame.whatsApp}
🌐 الرابط: ${brand.fixedFrame.storeUrl}

#الكويت #كشتات #كشتة #مخيمات_الكويت #رحلات_الكويت #طاقة_شمسية #بلويتي #Kuwait #CampingKuwait #OutdoorKuwait`;
  };

  const handleDownloadPng = async (mode: 'master' | 'mockup') => {
    setIsExporting(true);
    setExportError(null);

    try {
      let targetNode: HTMLElement | null = null;
      let suffix = 'Master';

      if (mode === 'master') {
        targetNode = document.getElementById('adcraft-ad-canvas');
        suffix = `Master-${placement.id}`;
      } else {
        targetNode = document.getElementById('campaign-live-preview-screen') || document.getElementById('adcraft-ad-canvas');
        suffix = `Mockup-Social`;
      }

      if (!targetNode) {
        throw new Error('عنصر المعاينة غير متاح في الصفحة.');
      }

      const res = await exportElementAsPng(targetNode, {
        fileName: `AdCraft-${product.id}-${suffix}.png`,
        pixelRatio: 2,
        triggerConfetti: true,
      });

      if (res.success) {
        setDownloadSuccessType(mode);
        setTimeout(() => setDownloadSuccessType(null), 3500);
      } else {
        setExportError(res.error || 'تعذر تصدير ملف الصورة.');
      }
    } catch (err: unknown) {
      console.error('Export error:', err);
      const msg = err instanceof Error ? err.message : 'فشل تصدير الصورة.';
      setExportError(msg);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generateCaption());
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-right shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
          <FileCheck2 className="w-4 h-4" />
          الحملة معتمدة وجاهزة للنشر والتصدير
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">تصدير معاينة الإعلان والكابشن (PNG)</h3>
        <p className="text-xs text-zinc-400 mb-6">
          يمكنك حفظ وتحميل التصميم الماستر بدقة 2X، أو تصدير معاينة شاشة العرض التفاعلية كملف صورة PNG لحفظ عملك.
        </p>

        {exportError && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-600 rounded-xl text-rose-300 text-xs flex items-center justify-between">
            <span>{exportError}</span>
            <button onClick={() => setExportError(null)} className="text-rose-400 hover:text-white">إغلاق</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Export Action Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-200">تصدير الصور (PNG)</span>
                <span className="text-[10px] font-mono bg-zinc-800 text-amber-400 px-2 py-0.5 rounded">
                  {placement.dimensions.width * 2} × {placement.dimensions.height * 2} px (2X HD)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                ملفات PNG فائقة النقاء تحافظ على جودة المنتج والخط والشعار بدون ضغط بصري.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Clean Master PNG */}
              <button
                onClick={() => handleDownloadPng('master')}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-950/30"
              >
                {isExporting && downloadSuccessType === null ? (
                  <span>جاري معالجة الصورة عالية الدقة...</span>
                ) : downloadSuccessType === 'master' ? (
                  <>
                    <Check className="w-4 h-4 text-zinc-950" />
                    <span>تم حفظ التصميم الماستر (PNG)!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>تحميل التصميم الماستر (PNG 2X)</span>
                  </>
                )}
              </button>

              {/* Option 2: Live Mockup Preview PNG */}
              <button
                onClick={() => handleDownloadPng('mockup')}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                {downloadSuccessType === 'mockup' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>تم حفظ صورة المعاينة الحية!</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    <span>تحميل معاينة المنصة (Mockup PNG)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Caption Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-200">كابشن البوست (Kuwait Copy)</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  جاهز مع الهاشتاقات
                </span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3 max-h-36 overflow-y-auto text-xs text-zinc-300 font-sans whitespace-pre-line leading-relaxed">
                {generateCaption()}
              </div>
            </div>

            <button
              onClick={handleCopyCaption}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors border border-zinc-700"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  تم نسخ الكابشن للحافظة!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  نسخ النص والهاشتاقات للنشر
                </>
              )}
            </button>
          </div>
        </div>

        {/* Brand Vault Status */}
        <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">محفوظ في الـ Brand Vault</div>
              <div className="text-[11px] text-zinc-400">يمكنك العودة لهذا المنتج وتوليد زوايا وحملات جديدة في أي وقت.</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

