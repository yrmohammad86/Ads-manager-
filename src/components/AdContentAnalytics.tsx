import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Link2, 
  Filter, 
  Eye, 
  Film, 
  Layers, 
  ShoppingBag, 
  Award, 
  ShieldCheck, 
  Smartphone,
  ExternalLink,
  Edit3,
  Calendar,
  DollarSign
} from 'lucide-react';
import { ProductItem, CampaignRecord, AdContentType } from '../types/adcraft';
import { AD_CONTENT_TYPES } from '../data/mockData';
import { ImportAdByUrlModal } from './ImportAdByUrlModal';

interface AdContentAnalyticsProps {
  campaigns: CampaignRecord[];
  products: ProductItem[];
  onSelectCampaignForStudio: (campaign: CampaignRecord) => void;
  onSelectCampaignForVideo: (campaign: CampaignRecord) => void;
  onAddNewAdFromUrl: (newProduct: ProductItem, newCampaign: CampaignRecord) => void;
  onOpenImportModal: () => void;
  isImportModalOpen: boolean;
  onCloseImportModal: () => void;
}

export const AdContentAnalytics: React.FC<AdContentAnalyticsProps> = ({
  campaigns,
  products,
  onSelectCampaignForStudio,
  onSelectCampaignForVideo,
  onAddNewAdFromUrl,
  onOpenImportModal,
  isImportModalOpen,
  onCloseImportModal,
}) => {
  const [selectedContentTypeFilter, setSelectedContentTypeFilter] = useState<string>('all');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');

  // Compute distribution of ad content types for Recharts PieChart
  const contentTypeDistributionData = useMemo(() => {
    const counts: { [key in AdContentType]?: number } = {};
    campaigns.forEach((c) => {
      counts[c.contentType] = (counts[c.contentType] || 0) + 1;
    });

    return AD_CONTENT_TYPES.map((type) => {
      const count = counts[type.id] || 0;
      return {
        id: type.id,
        name: type.name,
        nameEn: type.nameEn,
        icon: type.icon,
        count,
        percentage: campaigns.length > 0 ? Math.round((count / campaigns.length) * 100) : 0,
        color: type.color,
      };
    }).filter((item) => item.count > 0);
  }, [campaigns]);

  // Compute platform distribution for Recharts BarChart
  const platformDistributionData = useMemo(() => {
    const platforms = ['Instagram', 'TikTok', 'Snapchat', 'WhatsApp', 'Meta'];
    return platforms.map((plat) => {
      const matched = campaigns.filter((c) => c.platform === plat);
      const totalClicks = matched.reduce((acc, c) => acc + c.clicksEstimated, 0);
      const totalConversions = matched.reduce((acc, c) => acc + c.conversionsEstimated, 0);
      return {
        platform: plat === 'Instagram' ? 'إنستغرام' : plat === 'TikTok' ? 'تيك توك' : plat === 'Snapchat' ? 'سناب شات' : plat === 'WhatsApp' ? 'واتساب' : 'ميتا/فيسبوك',
        campaignsCount: matched.length,
        clicks: Math.round(totalClicks / 100),
        conversions: totalConversions,
      };
    });
  }, [campaigns]);

  // Performance metrics by ad content type for Recharts AreaChart
  const performanceByTypeData = useMemo(() => {
    return AD_CONTENT_TYPES.map((type) => {
      const matched = campaigns.filter((c) => c.contentType === type.id);
      const avgImpressions = matched.length
        ? Math.round(matched.reduce((acc, c) => acc + c.impressionsEstimated, 0) / matched.length / 1000)
        : 0;
      const avgClicks = matched.length
        ? Math.round(matched.reduce((acc, c) => acc + c.clicksEstimated, 0) / matched.length / 100)
        : 0;
      const avgConversions = matched.length
        ? Math.round(matched.reduce((acc, c) => acc + c.conversionsEstimated, 0) / matched.length)
        : 0;

      return {
        name: type.name.split(' ')[0], // short name
        fullName: type.name,
        impressionsK: avgImpressions,
        clicksHundred: avgClicks,
        conversions: avgConversions,
      };
    }).filter((item) => item.impressionsK > 0);
  }, [campaigns]);

  // Filtered campaigns list
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchType = selectedContentTypeFilter === 'all' || c.contentType === selectedContentTypeFilter;
      const matchPlat = selectedPlatformFilter === 'all' || c.platform === selectedPlatformFilter;
      return matchType && matchPlat;
    });
  }, [campaigns, selectedContentTypeFilter, selectedPlatformFilter]);

  // KPI Metrics
  const totalCampaigns = campaigns.length;
  const avgPriceKWD = Math.round(
    campaigns.reduce((acc, c) => acc + c.priceKWD, 0) / (totalCampaigns || 1)
  );
  const importedCount = campaigns.filter((c) => !!c.sourceUrl).length;

  const topContentType = useMemo(() => {
    if (!contentTypeDistributionData.length) return null;
    return [...contentTypeDistributionData].sort((a, b) => b.count - a.count)[0];
  }, [contentTypeDistributionData]);

  // Custom Recharts Tooltip
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-950 border border-zinc-700 p-3 rounded-xl shadow-xl text-right text-xs">
          <div className="font-bold text-white flex items-center gap-1.5 mb-1">
            <span>{data.icon}</span>
            <span>{data.name}</span>
          </div>
          <div className="text-amber-400 font-mono font-bold">
            {data.count} حملات ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#1E2B4A] gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Ad Content Types & Performance Analytics 📊
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <span>لوحة إحصائيات توزيع أنواع المحتوى الإعلاني</span>
            <span className="text-xs bg-violet-950/80 text-violet-300 border border-violet-800/60 px-2.5 py-0.5 rounded-full font-mono">
              Recharts Analytics Pro
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            تحليل بصري دقيق لتوزيع الحملات الحالية حسب أنواع المحتوى الإعلاني (Hero, Video Reels, Lifestyle, Promo)، مع ميزة إضافة الإعلانات مباشرة عبر الرابط.
          </p>
        </div>

        {/* Action Header Button: Import Ad via Link */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-xl shadow-violet-950/40 transition-all cursor-pointer transform hover:scale-[1.02]"
          >
            <Link2 className="w-4 h-4 text-amber-300" />
            <span>إضافة إعلان عن طريق الرابط 🔗</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs text-zinc-400 block font-medium">إجمالي الحملات الحالية:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono tabular-nums">{totalCampaigns}</span>
            <span className="text-xs text-emerald-400 font-bold">حملة نشطة ⚡</span>
          </div>
          <span className="text-[11px] text-zinc-500 block">موزعة على كافة المقاسات والمنصات</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs text-zinc-400 block font-medium">نوع المحتوى الأكثر استخداماً:</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-violet-400 flex items-center gap-1.5">
              <span>{topContentType?.icon || '🖼️'}</span>
              <span className="truncate max-w-[150px]">{topContentType?.name.split('(')[0] || 'Hero Master'}</span>
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 block font-mono tabular-nums">
            {topContentType?.percentage || 0}% من إجمالي المحتوى الإعلاني
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs text-zinc-400 block font-medium">متوسط أسعار المنتجات:</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white font-mono tabular-nums">{avgPriceKWD}</span>
            <span className="text-sm font-bold text-amber-400">د.ك KWD</span>
          </div>
          <span className="text-[11px] text-zinc-500 block">أسعار معتمدة ومطابقة لكتالوج الوكيل</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-5 shadow-sm space-y-2">
          <span className="text-xs text-zinc-400 block font-medium">إعلانات مستوردة بالرابط:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-400 font-mono tabular-nums">{importedCount}</span>
            <span className="text-xs text-zinc-400">إعلان مستورد</span>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Product Lock 🔒 مفعل
          </span>
        </div>
      </div>

      {/* RECHARTS VISUALIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: PIE CHART - DISTRIBUTION OF AD CONTENT TYPES (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white">
                  توزيع أنواع المحتوى الإعلاني المستخدمة في الحملات
                </h3>
                <span className="text-xs text-zinc-400">
                  Ad Content Types Distribution (Hero, Reels, Lifestyle, Promo, Specs)
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-zinc-800 text-amber-400 px-2 py-0.5 rounded">
              PieChart • Recharts
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentTypeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={5}
                  label={(entry: any) =>
                    `${(entry?.name || '').split('(')[0]}: ${Math.round((entry?.percent || 0) * 100)}%`
                  }
                >
                  {contentTypeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#18181b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Type distribution legend cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-800">
            {contentTypeDistributionData.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedContentTypeFilter(t.id)}
                className={`p-2 rounded-xl border text-right cursor-pointer transition-all ${
                  selectedContentTypeFilter === t.id
                    ? 'bg-zinc-800 border-amber-500 shadow-sm'
                    : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-0.5">
                  <span className="flex items-center gap-1" style={{ color: t.color }}>
                    <span>{t.icon}</span>
                    <span className="truncate max-w-[90px]">{t.name.split('(')[0]}</span>
                  </span>
                  <span className="font-mono text-white">{t.count}</span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  {t.percentage}% من الحملات
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: BAR CHART - PLATFORM REACH & PERFORMANCE (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-white">
                  توزيع الحملات حسب منصات النشر
                </h3>
                <span className="text-xs text-zinc-400">
                  Campaigns & Conversion per Platform
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded">
              BarChart
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="platform" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', textAlign: 'right', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="campaignsCount" name="عدد الحملات" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="conversions" name="طلبات متوقعة" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>تيك توك وإنستغرام ريلز يحققان أعلى وتيرة تحويل للمنتجات التخييمية.</span>
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & CAMPAIGNS LIST SECTION */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>سجل الحملات الإعلانية الحالية ({filteredCampaigns.length})</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              يمكنك استعراض ومراجعة كافة الإعلانات المسحوبة، فتحها في استوديو التصميم، أو إضافة إعلان جديد برابط.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Content Type */}
            <select
              value={selectedContentTypeFilter}
              onChange={(e) => setSelectedContentTypeFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">جميع أنواع المحتوى</option>
              {AD_CONTENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.icon} {t.name}
                </option>
              ))}
            </select>

            {/* Filter by Platform */}
            <select
              value={selectedPlatformFilter}
              onChange={(e) => setSelectedPlatformFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">جميع المنصات</option>
              <option value="Instagram">إنستغرام</option>
              <option value="TikTok">تيك توك</option>
              <option value="Snapchat">سناب شات</option>
              <option value="WhatsApp">واتساب</option>
            </select>

            <button
              onClick={onOpenImportModal}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة إعلان من رابط 🔗</span>
            </button>
          </div>
        </div>

        {/* CAMPAIGN CARDS GRID */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampaigns.map((camp) => {
              const typeSpec = AD_CONTENT_TYPES.find((t) => t.id === camp.contentType) || AD_CONTENT_TYPES[0];
              return (
                <div
                  key={camp.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    {/* Visual Card Banner */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={camp.adVisualUrl}
                        alt={camp.productName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

                      {/* Content Type Pill */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold border border-zinc-700 text-white">
                        <span>{typeSpec.icon}</span>
                        <span>{typeSpec.name.split('(')[0]}</span>
                      </div>

                      {/* Platform & Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                        <span className="bg-amber-500 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded">
                          {camp.platform}
                        </span>
                      </div>

                      {/* Pricing Tag */}
                      <div className="absolute bottom-2.5 right-2.5 flex items-baseline gap-1 text-white">
                        <span className="text-base font-black text-amber-400 font-mono">{camp.priceKWD}</span>
                        <span className="text-xs font-bold text-zinc-300">د.ك</span>
                        {camp.originalPriceKWD && (
                          <span className="text-[10px] text-zinc-400 line-through mr-1 font-mono">{camp.originalPriceKWD} د.ك</span>
                        )}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 block mb-0.5">{camp.productName}</span>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{camp.adCopy.headline}</h4>
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                          {camp.adCopy.subtext}
                        </p>
                      </div>

                      {/* Source Link tag if imported from URL */}
                      {camp.sourceUrl && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1 text-[11px] flex items-center justify-between text-zinc-400">
                          <span className="flex items-center gap-1 text-sky-400">
                            <Link2 className="w-3 h-3" />
                            مستورد من رابط إعلان
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500 truncate max-w-[120px]">
                            {camp.sourceUrl.replace('https://', '')}
                          </span>
                        </div>
                      )}

                      {/* Estimated Reach KPI */}
                      <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px] text-zinc-400 bg-zinc-900/60 p-2 rounded-xl">
                        <div>
                          <span className="block text-zinc-500">مشاهدات:</span>
                          <strong className="text-zinc-200 font-mono font-bold">{(camp.impressionsEstimated / 1000).toFixed(1)}k</strong>
                        </div>
                        <div>
                          <span className="block text-zinc-500">نقرات:</span>
                          <strong className="text-amber-400 font-mono font-bold">{camp.clicksEstimated}</strong>
                        </div>
                        <div>
                          <span className="block text-zinc-500">طلبات:</span>
                          <strong className="text-emerald-400 font-mono font-bold">{camp.conversionsEstimated}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => onSelectCampaignForStudio(camp)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>استوديو الصور</span>
                    </button>

                    <button
                      onClick={() => onSelectCampaignForVideo(camp)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5 text-emerald-400" />
                      <span>استوديو الفيديو</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3 bg-zinc-950 rounded-2xl border border-zinc-800/80">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-500">
              <Filter className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">لا توجد حملات تطابق هذا التصنيف</h4>
            <p className="text-xs text-zinc-400">يمكنك تعديل الفلتر أو إضافة إعلان جديد برابط.</p>
            <button
              onClick={onOpenImportModal}
              className="bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs"
            >
              إضافة إعلان من رابط الآن 🔗
            </button>
          </div>
        )}
      </div>

      {/* Import Ad by URL Modal */}
      <ImportAdByUrlModal
        isOpen={isImportModalOpen}
        onClose={onCloseImportModal}
        onSaveNewAd={onAddNewAdFromUrl}
      />
    </div>
  );
};
