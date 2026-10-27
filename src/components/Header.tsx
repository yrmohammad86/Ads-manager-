import React from 'react';
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
  BarChart3
} from 'lucide-react';
import { BrandDNA } from '../types/adcraft';

interface HeaderProps {
  currentTab: 'studio' | 'video' | 'products' | 'brand' | 'dialect_qa' | 'analytics';
  onTabChange: (tab: 'studio' | 'video' | 'products' | 'brand' | 'dialect_qa' | 'analytics') => void;
  brand: BrandDNA;
  onResetToDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  brand,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top Banner: Real-time Engine Guard status */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-emerald-950/40 border-b border-zinc-800/80 px-4 py-1.5 text-xs text-zinc-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              نظام AdCraft AI نشط
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              قاعدة حماية المنتج: 
              <strong className="text-zinc-200 font-semibold mr-1">Product Lock 🔒 مفعّل</strong>
            </span>
            <span className="text-zinc-600 hidden md:inline">|</span>
            <span className="flex items-center gap-1 text-zinc-400 hidden md:flex">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              مدقق اللهجة:
              <strong className="text-zinc-200 font-semibold mr-1">Kuwaiti QA 🇰🇼 100%</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              النسخة الكاملة مفتوحة ومجانية (بدون أي دفع أو اشتراك)
            </span>
          </div>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/20 text-zinc-950 font-black text-xl tracking-tight">
              AC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                  AdCraft AI
                </h1>
                <span className="bg-zinc-800 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
                  v1.0 MVP
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                قسم إعلانات البراند الذكي • The AI Creative Department
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-sm">
            <button
              onClick={() => onTabChange('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'studio'
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>استوديو الصور</span>
            </button>

            <button
              onClick={() => onTabChange('video')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all relative ${
                currentTab === 'video'
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>فيديو وريلز 🎬</span>
              <span className="bg-emerald-500 text-zinc-950 text-[9px] px-1 py-0.2 rounded font-bold">جديد</span>
            </button>

            <button
              onClick={() => onTabChange('products')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'products'
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>خزينة المنتجات والقفل 🔒</span>
            </button>

            <button
              onClick={() => onTabChange('brand')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'brand'
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>هوية البراند (Brand DNA)</span>
            </button>

            <button
              onClick={() => onTabChange('dialect_qa')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'dialect_qa'
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>مدقق اللهجة و QC 🇰🇼</span>
            </button>

            <button
              onClick={() => onTabChange('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all relative ${
                currentTab === 'analytics'
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>الإحصائيات والتحليلات 📊</span>
              <span className="bg-emerald-500 text-zinc-950 text-[9px] px-1 py-0.2 rounded font-bold">جديد</span>
            </button>
          </nav>

          {/* Active Merchant Card */}
          <div className="hidden lg:flex items-center gap-2.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="text-right">
              <div className="text-xs font-semibold text-zinc-200">{brand.name}</div>
              <div className="text-[10px] text-zinc-400">متجر نشط معتمد</div>
            </div>
            <span className="text-base mr-1">🇰🇼</span>
          </div>
        </div>
      </div>
    </header>
  );
};
