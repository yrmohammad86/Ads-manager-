import React from 'react';
import { 
  Sparkles, 
  Lock, 
  Film, 
  Radio, 
  BarChart3, 
  ArrowRight, 
  Link2, 
  ShieldCheck, 
  Layers, 
  Package, 
  Palette, 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  Zap, 
  Plus, 
  FileText,
  Smartphone,
  ExternalLink,
  Sliders,
  DollarSign
} from 'lucide-react';
import { CampaignRecord, ProductItem, BrandDNA } from '../types/adcraft';

interface ExecutiveDashboardProps {
  campaigns: CampaignRecord[];
  products: ProductItem[];
  brand: BrandDNA;
  activeProduct: ProductItem;
  onNavigateTab: (tab: any) => void;
  onOpenImportModal: () => void;
  onSelectCampaignForStudio: (campaign: CampaignRecord) => void;
  onSelectCampaignForVideo: (campaign: CampaignRecord) => void;
  onOpenPdfModal?: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  campaigns,
  products,
  brand,
  activeProduct,
  onNavigateTab,
  onOpenImportModal,
  onSelectCampaignForStudio,
  onSelectCampaignForVideo,
  onOpenPdfModal,
}) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#121B33] via-[#0E1528] to-[#181530] border border-[#202D4C] p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>منصة إنتاج الإعلانات الذكية للخليج والكويت</span>
              <span className="text-zinc-600">|</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Product Lock 🔒 Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              أهلاً بك في استوديو <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-amber-300">AdCraft AI</span>
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              إنتاج فوري لإعلانات الصور، الريلز، والبصمات الصوتية مع قفل دقيق لشكل ومواصفات المنتج وتدقيق كامل للهجة الكويتية الأصيلة.
            </p>
          </div>

          {/* Rapid Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenImportModal}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-violet-950/50 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>رابط إلى إعلان ⚡ (URL-to-Ad)</span>
            </button>

            <button
              onClick={() => onNavigateTab('studio')}
              className="bg-[#151E36] hover:bg-[#1C2849] text-zinc-200 border border-[#2B3B63] font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>استوديو الصور 🎨</span>
            </button>

            {onOpenPdfModal && (
              <button
                onClick={onOpenPdfModal}
                className="bg-[#151E36] hover:bg-[#1C2849] text-zinc-200 border border-[#2B3B63] font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span>بريف الحملة (PDF)</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Tiles (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-medium">الحملات النشطة</span>
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums mb-1">
            {campaigns.length} <span className="text-xs font-normal text-zinc-400">حملة معتمدة</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>متوافقة 100% مع منصات التواصل</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-medium">قاعدة قفل المنتج (Product Lock)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono tabular-nums mb-1">
            100% <span className="text-xs font-normal text-zinc-400">حماية الأبعاد والشكل</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            «نغيّر المشهد، ولا نغيّر المنتج» 🔒
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-medium">مؤشر اللهجة الكويتية (Dialect QA)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums mb-1">
            96.4% <span className="text-xs font-normal text-zinc-400">أصالة كويتية 🇰🇼</span>
          </div>
          <div className="text-[11px] text-emerald-400/90">
            معجم تسويقي كويتي معتمد وخالٍ من المحظورات
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-medium">المنتج المختار الحالي</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-white truncate mb-1">
            {activeProduct.name}
          </div>
          <div className="text-[11px] text-sky-400 font-mono tabular-nums flex items-center justify-between">
            <span>{activeProduct.priceKWD} د.ك</span>
            <span className="text-zinc-500">{activeProduct.category}</span>
          </div>
        </div>
      </div>

      {/* Studio Production Hubs (Visual Navigation Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>محركات الإبداع الإعلاني (Creative Engines)</span>
          </h2>
          <span className="text-xs text-zinc-400">انتقال مباشر ومزامنة كاملة للحالة</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Image Studio */}
          <div 
            onClick={() => onNavigateTab('studio')}
            className="group bg-[#0D1424] hover:bg-[#131C31] border border-[#1E2B4A] hover:border-violet-500/70 rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 group-hover:bg-violet-600/30 text-violet-400 flex items-center justify-center mb-4 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors mb-1.5 flex items-center justify-between">
                <span>استوديو الصور الإعلانية</span>
                <span className="text-[10px] bg-violet-950 text-violet-300 px-2 py-0.5 rounded font-mono">Image Studio</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                تركيب المنتج الحقيقي على بيئات كويتية طبيعية (الصبية، الوفرة، الخيران) مع قوالب جاهزة بنقرة واحدة.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
              <span>فتح استوديو الصور</span>
              <ArrowRight className="w-3.5 h-3.5 mr-1" />
            </div>
          </div>

          {/* Card 2: Video Director */}
          <div 
            onClick={() => onNavigateTab('video')}
            className="group bg-[#0D1424] hover:bg-[#131C31] border border-[#1E2B4A] hover:border-sky-500/70 rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-600/20 group-hover:bg-sky-600/30 text-sky-400 flex items-center justify-center mb-4 transition-colors">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors mb-1.5 flex items-center justify-between">
                <span>مخرج الفيديو والريلز</span>
                <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded font-mono">15s Reels</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                ستوريبورد سينمائي من 4 مشاهد متكاملة (هوك، كشف المنتج، استخدام بالكشتة، ودعوة للشراء) مع مؤثرات صوتية Web Audio.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>فتح مخرج الفيديو</span>
              <ArrowRight className="w-3.5 h-3.5 mr-1" />
            </div>
          </div>

          {/* Card 3: Voice Studio */}
          <div 
            onClick={() => onNavigateTab('voice')}
            className="group bg-[#0D1424] hover:bg-[#131C31] border border-[#1E2B4A] hover:border-emerald-500/70 rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 group-hover:bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-4 transition-colors">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mb-1.5 flex items-center justify-between">
                <span>استوديو الصوت والبصمة</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">Voice Studio</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                تسجيل العينة الصوتية، معايرة الأكوستيك، توليد الإعلان الصوتي باللهجة الكويتية، واعتماد البصمة للاستخدام التجاري.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>فتح استوديو الصوت</span>
              <ArrowRight className="w-3.5 h-3.5 mr-1" />
            </div>
          </div>

          {/* Card 4: Copy & Dialect QA */}
          <div 
            onClick={() => onNavigateTab('copy')}
            className="group bg-[#0D1424] hover:bg-[#131C31] border border-[#1E2B4A] hover:border-amber-500/70 rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 group-hover:bg-amber-500/30 text-amber-400 flex items-center justify-center mb-4 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mb-1.5 flex items-center justify-between">
                <span>الصياغات واللهجة الكويتية</span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono">Dialect QA</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                صياغة نصوص إعلانية تلامس الشارع الكويتي مع عداد حروف منصات التواصل وكاشف العبارات الشاذة.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>فتح مدقق الصياغات</span>
              <ArrowRight className="w-3.5 h-3.5 mr-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns Showcase Table */}
      <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#1E2B4A] gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-400" />
              <span>الحملات الإعلانية المعتمدة في المتجر</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              استعراض فوري للحملات النشطة مع إمكانية التعديل السريع في استوديو الصور أو مخرج الفيديو.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('analytics')}
            className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>استعراض الإحصائيات الكاملة والرسوم البيانية</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Campaign Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.slice(0, 6).map((camp) => {
            const product = products.find((p) => p.id === camp.productId) || products[0];

            return (
              <div
                key={camp.id}
                className="bg-[#131C31] border border-[#1E2B4A] hover:border-[#2D3F66] rounded-xl p-4 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] bg-violet-950/80 text-violet-300 border border-violet-800/40 px-2 py-0.5 rounded font-mono font-medium">
                      {camp.platform}
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      معتمد
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">
                    {camp.adCopy.headline}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mb-3 line-clamp-2 leading-relaxed">
                    {camp.adCopy.subtext}
                  </p>

                  <div className="bg-[#0D1424] border border-[#1E2B4A]/60 rounded-lg p-2.5 mb-4 text-[11px] space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span>المنتج:</span>
                      <span className="text-zinc-200 font-semibold truncate max-w-[140px]">{product.name}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>السعر المعتمد:</span>
                      <span className="text-emerald-400 font-mono font-bold">{camp.priceKWD} د.ك</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>النداء الكويتي:</span>
                      <span className="text-amber-400 font-medium">{camp.adCopy.cta}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#1E2B4A]/60">
                  <button
                    onClick={() => onSelectCampaignForStudio(camp)}
                    className="flex-1 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center transition-colors cursor-pointer"
                  >
                    استوديو الصور 🎨
                  </button>

                  <button
                    onClick={() => onSelectCampaignForVideo(camp)}
                    className="flex-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-center transition-colors cursor-pointer"
                  >
                    مخرج الفيديو 🎬
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
