import React, { useState } from 'react';
import { ProductItem } from '../types/adcraft';
import { 
  Lock, 
  ShieldCheck, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Info,
  Tag,
  Cpu,
  Wand2
} from 'lucide-react';
import { AIProductAdGeneratorModal } from './AIProductAdGeneratorModal';

interface ProductVaultProps {
  products: ProductItem[];
  onSelectProductForCampaign: (product: ProductItem) => void;
  onAddNewProduct: (newProduct: ProductItem) => void;
}

export const ProductVault: React.FC<ProductVaultProps> = ({
  products,
  onSelectProductForCampaign,
  onAddNewProduct,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<ProductItem | null>(products[0] || null);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('إلكترونيات ولوازم رحلات');
  const [newPrice, setNewPrice] = useState(199);
  const [newOriginalPrice, setNewOriginalPrice] = useState(240);
  const [newSku, setNewSku] = useState('KW-PROD-01');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
  );
  const [newFeature, setNewFeature] = useState('شحن فائق السرعة متوافق مع البيئة الخليجية');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newTitle,
      category: newCategory,
      priceKWD: Number(newPrice),
      originalPriceKWD: Number(newOriginalPrice),
      sku: newSku,
      imageUrl: newImageUrl,
      keyFeatures: [newFeature, 'تحمل درجات الحرارة العالية', 'كفالة معتمدة محلياً'],
      specs: {
        capacity: 'أداء فائق معتمد',
        output: 'تيار مستقر وآمن',
        warranty: 'سنة كفالة محلية',
      },
      sourceVerification: {
        storeName: 'متجر محلي معتمد',
        localPriceVerified: true,
        specsMatchManufacturer: true,
        verifiedSku: newSku,
        auditStatus: 'VERIFIED',
        notes: 'تم فحص السعر المحلي ومطابقة المواصفات مع المصنع.',
      },
      productLock: {
        lockedShape: true,
        lockedPortsAndBadges: true,
        lockedScale: true,
        status: 'ACTIVE',
      },
    };

    onAddNewProduct(newProd);
    setSelectedProductDetails(newProd);
    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#1E2B4A] gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4 text-amber-400" />
            Product Lock 🔒 Vault & Source Verification
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">خزينة المنتجات وقاعدة قفل المنتج</h2>
          <p className="text-sm text-zinc-400 mt-1">
            القاعدة الذهبية في AdCraft AI: <strong className="text-amber-300">«نغيّر المشهد، ولا نغيّر المنتج»</strong>. يتم تثبيت شكل الجهاز الحقيقي ومطابقة مواصفات المصنع لمنع أي تضارب.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 bg-[#131C31] hover:bg-[#1A2642] border border-violet-500/50 text-violet-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-violet-950/20 cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-violet-400" />
            توليد بالذكاء الاصطناعي ✨
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-violet-950/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            إضافة يدوية للكاتالوج
          </button>
        </div>
      </div>

      {/* Main Grid: Products List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Products Cards List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium px-1">
            <span>المنتجات المفحوصة والمقيدة ({products.length})</span>
            <span className="text-emerald-400 font-mono">جميع المنتجات محمية بـ Product Lock 🔒</span>
          </div>

          <div className="space-y-4">
            {products.map((product) => {
              const isSelected = selectedProductDetails?.id === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductDetails(product)}
                  className={`bg-[#0D1424] border rounded-2xl p-4 transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-violet-500 shadow-md shadow-violet-950/40 ring-1 ring-violet-500/40'
                      : 'border-[#1E2B4A] hover:border-[#2D3F66] hover:bg-[#131C31]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Product Thumbnail with Lock Badge */}
                    <div className="relative w-24 h-24 rounded-xl bg-[#080C16] border border-[#1E2B4A] p-2 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-1 right-1 bg-amber-500 text-zinc-950 p-1 rounded-md text-[10px] font-bold shadow">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] text-zinc-400 font-mono">{product.sku}</span>
                        <span className="text-[11px] bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Source Verified
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white truncate mb-1">{product.name}</h4>
                      <p className="text-xs text-zinc-400 mb-2">{product.category}</p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/80">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-amber-400 font-mono">
                            {product.priceKWD} د.ك
                          </span>
                          {product.originalPriceKWD && (
                            <span className="text-xs text-zinc-500 line-through font-mono">
                              {product.originalPriceKWD} د.ك
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProductForCampaign(product);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold text-zinc-950 bg-amber-500 hover:bg-amber-400 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          بدء حملة الآن
                          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Product Lock Inspector */}
        <div className="lg:col-span-5">
          {selectedProductDetails ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-28 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">فحص قفل المنتج (Product Lock)</h3>
                    <span className="text-[11px] text-zinc-400">حماية شكل وتفاصيل الجهاز الحقيقي</span>
                  </div>
                </div>

                <span className="text-xs font-mono bg-amber-500 text-zinc-950 px-2 py-0.5 rounded font-bold">
                  ACTIVE 🔒
                </span>
              </div>

              {/* Product Big Preview */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <img
                  src={selectedProductDetails.imageUrl}
                  alt={selectedProductDetails.name}
                  className="w-48 h-48 object-contain drop-shadow-xl"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-zinc-900/90 backdrop-blur border border-zinc-800 p-2 rounded-lg text-[11px] text-zinc-300 text-center">
                  🔒 مقفول: الشكل، الشعار، المنافذ، الأبعاد النسبية
                </div>
              </div>

              {/* Rules Checklist */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-zinc-200">القواعد الإلزامية للمولد:</div>
                <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      هيكل وشكل الجهاز الحقيقي
                    </span>
                    <span className="font-mono text-[10px]">LOCKED</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      شعار العلامة والمنافذ والشاشات
                    </span>
                    <span className="font-mono text-[10px]">LOCKED</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      الإضاءة، الزاوية، والخلفية المحيطة
                    </span>
                    <span className="font-mono text-[10px]">DYNAMIC</span>
                  </div>
                </div>
              </div>

              {/* Source Verification Lesson (BLUETTI PoC) */}
              <div className="bg-zinc-950 border border-amber-900/40 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Source Verification (التحقق من المصدر):
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed mb-2">
                  {selectedProductDetails.sourceVerification.notes}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                  <div>المتجر: {selectedProductDetails.sourceVerification.storeName}</div>
                  <div>حالة الفحص: <strong className="text-emerald-400 font-medium">معتمد بدون تعارض</strong></div>
                </div>
              </div>

              {/* Start Campaign Button */}
              <button
                onClick={() => onSelectProductForCampaign(selectedProductDetails)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-950/20"
              >
                توليد حملة لهذا المنتج الآن
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
              اختر منتجاً للاطلاع على تفاصيل القفل والتحقق.
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 text-right shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              إضافة منتج جديد مع تفعيل Product Lock 🔒
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              أدخل بيانات المنتج بدقة، وسيتم قفل صورته ومواصفاته لحمايتها في جميع التصاميم.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: BLUETTI AC180 Portable Power"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">السعر (د.ك)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">السعر قبل الخصم (د.ك)</label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">رمز المنتج (SKU)</label>
                <input
                  type="text"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">رابط صورة المنتج (مفرغة بخلفية شفافة)</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">الميزة الرئيسية</label>
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-2.5 rounded-xl text-sm transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  حفظ وتفعيل القفل 🔒
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Product & Ad Generator Modal */}
      <AIProductAdGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onProductGenerated={(newProduct) => {
          onAddNewProduct(newProduct);
          setSelectedProductDetails(newProduct);
        }}
      />
    </div>
  );
};
