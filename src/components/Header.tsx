import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Lock, 
  ShieldCheck, 
  Palette, 
  Package, 
  MessageSquare,
  CheckCircle2, 
  ChevronDown,
  Film,
  BarChart3,
  Radio,
  Zap,
  RotateCcw,
  LayoutDashboard,
  FileText,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { BrandDNA } from '../types/adcraft';

export type NavigationTab = 
  | 'dashboard'
  | 'studio'
  | 'video'
  | 'voice'
  | 'copy'
  | 'products'
  | 'brand'
  | 'dialect_qa'
  | 'analytics';

interface HeaderProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  brand: BrandDNA;
  onResetToDemo: () => void;
  onOpenImportModal: () => void;
  onOpenPdfModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  brand,
  onResetToDemo,
  onOpenImportModal,
  onOpenPdfModal,
}) => {
  const [activeGroup, setActiveGroup] = useState<'workspace' | 'creative' | 'brand_intel' | 'management'>(() => {
    if (['dashboard'].includes(currentTab)) return 'workspace';
    if (['studio', 'video', 'voice', 'copy'].includes(currentTab)) return 'creative';
    if (['brand', 'products', 'dialect_qa'].includes(currentTab)) return 'brand_intel';
    return 'management';
  });

  return (
    <header className="border-b border-[#1E2B4A] bg-[#080C16]/95 backdrop-blur-md sticky top-0 z-50">
      {/* Top Banner: Real-time Engine Guard status */}
      <div className="bg-[#0B101E] border-b border-[#1A2640] px-4 py-1.5 text-xs text-zinc-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-violet-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              نظام AdCraft AI نشط ومحمٍ
            </span>
            <span className="text-zinc-700 hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              حماية المنتج: 
              <strong className="text-zinc-200 font-semibold mr-1 font-mono">Product Lock 🔒 مفعّل</strong>
            </span>
            <span className="text-zinc-700 hidden md:inline">|</span>
            <span className="flex items-center gap-1 text-zinc-400 hidden md:flex">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              مدقق اللهجة:
              <strong className="text-zinc-200 font-semibold mr-1 font-mono">Kuwaiti QA 🇰🇼 100%</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              النسخة الكاملة مفتوحة ومجانية
            </span>

            <button
              onClick={onResetToDemo}
              title="إعادة تعيين البيانات التجريبية"
              className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-zinc-800/50"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة الضبط</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-violet-950/50 text-white font-black text-lg tracking-tight group-hover:scale-105 transition-transform">
              AC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
                  AdCraft AI
                </span>
                <span className="bg-violet-950/80 text-violet-300 border border-violet-800/50 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  PRO STUDIO
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                قسم إعلانات البراند الذكي • Kuwait & GCC
              </p>
            </div>
          </div>

          {/* Center Navigation: Unified Group Hubs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0D1424] p-1 rounded-xl border border-[#1E2B4A] text-xs">
            {/* Workspace Hub */}
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-950/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#131C31]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>لوحة المؤشرات</span>
            </button>

            {/* Creative Studio Tabs */}
            <div className="h-4 w-px bg-[#1E2B4A] mx-0.5" />

            <button
              onClick={() => onTabChange('studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'studio'
                  ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-950/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#131C31]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>استوديو الصور</span>
            </button>

            <button
              onClick={() => onTabChange('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'video'
                  ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-950/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#131C31]'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-sky-400" />
              <span>مخرج الفيديو 🎬</span>
            </button>

            <button
              onClick={() => onTabChange('voice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'voice'
                  ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-950/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#131C31]'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>استوديو الصوت 🎙️</span>
            </button>

            <button
              onClick={() => onTabChange('copy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'copy' || currentTab === 'dialect_qa'
                  ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-950/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#131C31]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>الصياغات واللهجة 🇰🇼</span>
            </button>

            {/* Brand Intelligence */}
            <div className="h-4 w-px bg-[#1E2B4A] mx-0.5" />

            <button
              onClick={() => onTabChange('products')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'products'
                  ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-950/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#131C31]'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-300" />
              <span>قفل المنتجات 🔒</span>
            </button>

            <button
              onClick={() => onTabChange('brand')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'brand'
                  ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-950/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#131C31]'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              <span>هوية البراند</span>
            </button>

            {/* Management & Analytics */}
            <div className="h-4 w-px bg-[#1E2B4A] mx-0.5" />

            <button
              onClick={() => onTabChange('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'analytics'
                  ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-950/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#131C31]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>التحليلات 📊</span>
            </button>
          </nav>

          {/* Right Header Actions: URL-to-Ad & Active Merchant */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Launch URL-to-Ad Button */}
            <button
              onClick={onOpenImportModal}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-violet-950/40 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">رابط إلى إعلان ⚡</span>
              <span className="sm:hidden">استيراد ⚡</span>
            </button>

            {/* Quick PDF Brief Button */}
            {onOpenPdfModal && (
              <button
                onClick={onOpenPdfModal}
                title="تصدير بريف الحملة PDF"
                className="hidden md:flex items-center gap-1 bg-[#131C31] hover:bg-[#19243E] text-zinc-300 border border-[#1E2B4A] px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>PDF</span>
              </button>
            )}

            {/* Active Merchant Card */}
            <div 
              onClick={() => onTabChange('brand')}
              className="flex items-center gap-2 bg-[#0D1424] hover:bg-[#131C31] border border-[#1E2B4A] px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors"
              title="هوية المتجر المعتمد (اضغط للتعديل)"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-zinc-200 truncate max-w-[110px]">{brand.name}</div>
                <div className="text-[10px] text-zinc-400">متجر معتمد 🇰🇼</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto text-xs border-t border-[#1E2B4A]/60">
          {[
            { id: 'dashboard', label: 'المؤشرات', icon: LayoutDashboard },
            { id: 'studio', label: 'الصور', icon: Sparkles },
            { id: 'video', label: 'فيديو 🎬', icon: Film },
            { id: 'voice', label: 'صوت 🎙️', icon: Radio },
            { id: 'copy', label: 'الصياغات 🇰🇼', icon: MessageSquare },
            { id: 'products', label: 'المنتجات 🔒', icon: Package },
            { id: 'brand', label: 'الهوية', icon: Palette },
            { id: 'analytics', label: 'التحليلات 📊', icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`whitespace-nowrap flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium shrink-0 transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white'
                    : 'text-zinc-400 hover:text-white bg-[#0D1424] border border-[#1E2B4A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
