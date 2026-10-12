import React, { useState } from 'react';
import { BrandDNA } from '../types/adcraft';
import { 
  Palette, 
  Shield, 
  Phone, 
  Globe, 
  Instagram, 
  Award, 
  Save, 
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react';

interface BrandDNASettingsProps {
  brand: BrandDNA;
  onUpdateBrand: (updated: BrandDNA) => void;
  onResetDefault: () => void;
}

export const BrandDNASettings: React.FC<BrandDNASettingsProps> = ({
  brand,
  onUpdateBrand,
  onResetDefault,
}) => {
  const [formData, setFormData] = useState<BrandDNA>(brand);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBrand(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Palette className="w-4 h-4" />
            Brand DNA • الحمض النووي للعلامة التجارية
          </div>
          <h2 className="text-2xl font-bold text-white">هوية البراند وإطار التاجر الثابت (Fixed Frame)</h2>
          <p className="text-sm text-zinc-400 mt-1">
            يقوم نظام AdCraft بفهم هوية متجرك وألوانه ووسائل التواصل مرة واحدة، لتظهر متناسقة في كل إعلان وحملة تلقائياً.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            استعادة نموذج تجربة Outdoor Kuwait
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Basic Identity */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              البيانات الأساسية ونبرة البراند
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">اسم المتجر / العلامة</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">نص الشعار المختصر (Logo Text)</label>
                <input
                  type="text"
                  value={formData.logoText}
                  onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">مجال النشاط والتصنيف</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">السوق المستهدف والجمهور</label>
                <input
                  type="text"
                  value={formData.market}
                  onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">الشعار اللفظي (Slogan)</label>
                <input
                  type="text"
                  value={formData.slogan}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">نبرة الخطاب (Brand Voice)</label>
                <textarea
                  rows={2}
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="mt-5 pt-5 border-t border-zinc-800/80">
              <label className="block text-xs font-medium text-zinc-300 mb-2">الألوان المعتمدة للبراند</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <div>
                    <span className="block text-xs font-medium text-zinc-200">اللون الأساسي</span>
                    <span className="text-[11px] text-zinc-500 font-mono">{formData.primaryColor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <div>
                    <span className="block text-xs font-medium text-zinc-200">اللون الثانوي</span>
                    <span className="text-[11px] text-zinc-500 font-mono">{formData.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Merchant Identity & Fixed Frame */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                هوية المتجر وقاعدة الفريم الثابت (Fixed Brand Frame)
              </h3>
              <span className="text-xs text-amber-400/90 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded">
                قاعدة: من أين يشتري العميل؟
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              الإعلان لا يكتمل بمعرفة المنتج فقط، بل يحتاج العميل معرفة قناة الطلب المباشرة والضمان. هذا الفريم يُضاف كطبقة ذكية فوق التصاميم.
            </p>

            <div className="space-y-4">
              {/* WhatsApp */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showWhatsApp"
                  checked={formData.fixedFrame.showWhatsApp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fixedFrame: { ...formData.fixedFrame, showWhatsApp: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                />
                <div className="flex-1">
                  <label htmlFor="showWhatsApp" className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    رقم الواتساب للطلب المباشر
                  </label>
                  <input
                    type="text"
                    disabled={!formData.fixedFrame.showWhatsApp}
                    value={formData.fixedFrame.whatsApp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fixedFrame: { ...formData.fixedFrame, whatsApp: e.target.value },
                      })
                    }
                    className="mt-1 w-full bg-zinc-950 border border-zinc-800 disabled:opacity-50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="+965 9988 7766"
                  />
                </div>
              </div>

              {/* Store URL */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showStoreUrl"
                  checked={formData.fixedFrame.showStoreUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fixedFrame: { ...formData.fixedFrame, showStoreUrl: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                />
                <div className="flex-1">
                  <label htmlFor="showStoreUrl" className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    رابط المتجر الإلكتروني
                  </label>
                  <input
                    type="text"
                    disabled={!formData.fixedFrame.showStoreUrl}
                    value={formData.fixedFrame.storeUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fixedFrame: { ...formData.fixedFrame, storeUrl: e.target.value },
                      })
                    }
                    className="mt-1 w-full bg-zinc-950 border border-zinc-800 disabled:opacity-50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="outdoorkw.com"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showInstagram"
                  checked={formData.fixedFrame.showInstagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fixedFrame: { ...formData.fixedFrame, showInstagram: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                />
                <div className="flex-1">
                  <label htmlFor="showInstagram" className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    حساب إنستغرام
                  </label>
                  <input
                    type="text"
                    disabled={!formData.fixedFrame.showInstagram}
                    value={formData.fixedFrame.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fixedFrame: { ...formData.fixedFrame, instagram: e.target.value },
                      })
                    }
                    className="mt-1 w-full bg-zinc-950 border border-zinc-800 disabled:opacity-50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="@outdoorkw"
                  />
                </div>
              </div>

              {/* Guarantee text */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showGuarantee"
                  checked={formData.fixedFrame.showGuaranteeBadge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fixedFrame: { ...formData.fixedFrame, showGuaranteeBadge: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                />
                <div className="flex-1">
                  <label htmlFor="showGuarantee" className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    شارة الضمان والوكالة
                  </label>
                  <input
                    type="text"
                    disabled={!formData.fixedFrame.showGuaranteeBadge}
                    value={formData.fixedFrame.guaranteeText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fixedFrame: { ...formData.fixedFrame, guaranteeText: e.target.value },
                      })
                    }
                    className="mt-1 w-full bg-zinc-950 border border-zinc-800 disabled:opacity-50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="كفالة الوكيل المعتمد في الكويت"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-amber-950/30"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  تم حفظ الهوية وتحديث المحرك!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  حفظ وتطبيق هوية البراند
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Preview Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-zinc-400 font-medium">معاينة بطاقة البراند المعتمدة</span>
              <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
                Brand Vault 🔒
              </span>
            </div>

            {/* Simulated Brand Card */}
            <div 
              className="rounded-2xl p-6 border transition-all text-white relative overflow-hidden"
              style={{
                backgroundColor: '#121215',
                borderColor: formData.primaryColor,
              }}
            >
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: formData.primaryColor }}
              />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div 
                  className="px-3 py-1 rounded-lg text-xs font-black tracking-wider border shadow-sm"
                  style={{
                    backgroundColor: formData.primaryColor,
                    color: '#09090b',
                    borderColor: formData.primaryColor,
                  }}
                >
                  {formData.logoText || 'BRAND'}
                </div>
                <span className="text-xs text-zinc-400 font-medium">{formData.market}</span>
              </div>

              <h4 className="text-xl font-bold mb-1 text-zinc-100">{formData.name}</h4>
              <p className="text-xs text-zinc-400 mb-3">{formData.category}</p>

              <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 mb-4">
                <div className="text-[11px] text-zinc-500 mb-0.5">الشعار والنبرة:</div>
                <div className="text-xs font-medium text-amber-200 mb-1">«{formData.slogan}»</div>
                <div className="text-[11px] text-zinc-400">{formData.tone}</div>
              </div>

              {/* Simulated Fixed Frame */}
              <div className="border-t border-zinc-800 pt-3 space-y-2">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                  عناصر الفريم الثابت (Fixed Frame):
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {formData.fixedFrame.showWhatsApp && (
                    <span className="bg-zinc-800/90 text-emerald-300 border border-zinc-700 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      {formData.fixedFrame.whatsApp}
                    </span>
                  )}
                  {formData.fixedFrame.showStoreUrl && (
                    <span className="bg-zinc-800/90 text-sky-300 border border-zinc-700 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Globe className="w-3 h-3 text-sky-400" />
                      {formData.fixedFrame.storeUrl}
                    </span>
                  )}
                  {formData.fixedFrame.showGuaranteeBadge && (
                    <span className="bg-amber-950/60 text-amber-300 border border-amber-900/60 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      {formData.fixedFrame.guaranteeText}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Note on zero payment */}
            <div className="mt-4 p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                ملف البراند هذا مفتوح بالكامل ودائم في هذا النظام؛ يمكنك توليد وتصدير ما تشاء من الحملات الإعلانية مجاناً وبدون أي قيود دفع.
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
