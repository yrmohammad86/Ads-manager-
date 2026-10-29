import React, { useState } from 'react';
import { Header, NavigationTab } from './components/Header';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CampaignStudio } from './components/CampaignStudio';
import { VideoAdsEngine } from './components/VideoAdsEngine';
import { VoiceStudioView } from './components/VoiceStudioView';
import { ProductVault } from './components/ProductVault';
import { BrandDNASettings } from './components/BrandDNASettings';
import { CopyAndDialectStudio } from './components/CopyAndDialectStudio';
import { AdContentAnalytics } from './components/AdContentAnalytics';
import { ImportAdByUrlModal } from './components/ImportAdByUrlModal';
import { CampaignPdfModal } from './components/CampaignPdfModal';
import { 
  INITIAL_BRAND_DNA, 
  INITIAL_PRODUCTS,
  INITIAL_CAMPAIGNS,
  AD_PLACEMENTS,
  LAYOUT_PRESETS,
  CURATED_SCENES
} from './data/mockData';
import { BrandDNA, ProductItem, CampaignRecord } from './types/adcraft';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [brand, setBrand] = useState<BrandDNA>(INITIAL_BRAND_DNA);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [activeProduct, setActiveProduct] = useState<ProductItem>(INITIAL_PRODUCTS[0]);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(INITIAL_CAMPAIGNS);
  
  // Global Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const [appliedCopy, setAppliedCopy] = useState<{ headline: string; subtext: string; cta: string; badge: string } | null>(null);

  const handleSelectProductForCampaign = (prod: ProductItem) => {
    setActiveProduct(prod);
    setCurrentTab('studio');
  };

  const handleAddNewProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
    setActiveProduct(newProd);
  };

  const handleAddNewAdFromUrl = (newProd: ProductItem, newCampaign: CampaignRecord) => {
    setProducts((prev) => [newProd, ...prev]);
    setActiveProduct(newProd);
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const handleSelectCampaignForStudio = (campaign: CampaignRecord) => {
    const matchedProduct = products.find((p) => p.id === campaign.productId);
    if (matchedProduct) {
      setActiveProduct(matchedProduct);
    }
    setAppliedCopy({
      headline: campaign.adCopy.headline,
      subtext: campaign.adCopy.subtext,
      cta: campaign.adCopy.cta,
      badge: campaign.adCopy.badge,
    });
    setCurrentTab('studio');
  };

  const handleSelectCampaignForVideo = (campaign: CampaignRecord) => {
    const matchedProduct = products.find((p) => p.id === campaign.productId);
    if (matchedProduct) {
      setActiveProduct(matchedProduct);
    }
    setCurrentTab('video');
  };

  const handleApplyCopyFromQA = (headline: string, subtext: string, cta: string, badge: string) => {
    setAppliedCopy({ headline, subtext, cta, badge });
    setCurrentTab('studio');
  };

  const handleResetToDemo = () => {
    setBrand(INITIAL_BRAND_DNA);
    setProducts(INITIAL_PRODUCTS);
    setActiveProduct(INITIAL_PRODUCTS[0]);
    setCampaigns(INITIAL_CAMPAIGNS);
    setAppliedCopy(null);
  };

  return (
    <div className="min-h-screen bg-[#080C16] text-zinc-100 flex flex-col selection:bg-violet-500/20 selection:text-violet-200">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        brand={brand}
        onResetToDemo={handleResetToDemo}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
      />

      <main className="flex-1 pb-16">
        {currentTab === 'dashboard' && (
          <ExecutiveDashboard
            campaigns={campaigns}
            products={products}
            brand={brand}
            activeProduct={activeProduct}
            onNavigateTab={setCurrentTab}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onSelectCampaignForStudio={handleSelectCampaignForStudio}
            onSelectCampaignForVideo={handleSelectCampaignForVideo}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
          />
        )}

        {currentTab === 'studio' && (
          <CampaignStudio
            products={products}
            brand={brand}
            activeProduct={activeProduct}
            onSelectProduct={setActiveProduct}
            onAddNewProduct={handleAddNewProduct}
            appliedCopy={appliedCopy}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            campaigns={campaigns}
          />
        )}

        {currentTab === 'video' && (
          <VideoAdsEngine
            product={activeProduct}
            brand={brand}
          />
        )}

        {currentTab === 'voice' && (
          <VoiceStudioView
            product={activeProduct}
            brand={brand}
            onSendToVideoDirector={() => setCurrentTab('video')}
          />
        )}

        {currentTab === 'products' && (
          <ProductVault
            products={products}
            onSelectProductForCampaign={handleSelectProductForCampaign}
            onAddNewProduct={handleAddNewProduct}
          />
        )}

        {currentTab === 'brand' && (
          <BrandDNASettings
            brand={brand}
            onUpdateBrand={setBrand}
            onResetDefault={handleResetToDemo}
          />
        )}

        {(currentTab === 'copy' || currentTab === 'dialect_qa') && (
          <CopyAndDialectStudio
            activeProduct={activeProduct}
            onApplyCopy={handleApplyCopyFromQA}
          />
        )}

        {currentTab === 'analytics' && (
          <AdContentAnalytics
            campaigns={campaigns}
            products={products}
            onSelectCampaignForStudio={handleSelectCampaignForStudio}
            onSelectCampaignForVideo={handleSelectCampaignForVideo}
            onAddNewAdFromUrl={handleAddNewAdFromUrl}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            isImportModalOpen={isImportModalOpen}
            onCloseImportModal={() => setIsImportModalOpen(false)}
          />
        )}
      </main>

      {/* Global Import Ad By URL Modal */}
      <ImportAdByUrlModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSaveNewAd={handleAddNewAdFromUrl}
      />

      {/* Global Campaign PDF Modal */}
      <CampaignPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        product={activeProduct}
        brand={brand}
        placement={AD_PLACEMENTS[0]}
        layoutPreset={LAYOUT_PRESETS[0]}
        backgroundScene={CURATED_SCENES[0]}
        headline={appliedCopy?.headline || 'كهربتك معاك… وين ما تروح ⚡'}
        subtext={appliedCopy?.subtext || 'سعة جبارة وشحن فائق السرعة، صُممت لأجواء البر والبحر القاسية.'}
        badge={appliedCopy?.badge || 'الأكثر مبيعاً في الكويت 🇰🇼'}
        ctaText={appliedCopy?.cta || 'شناطر؟ اطلب الحين'}
        campaigns={campaigns}
        allProducts={products}
      />

      {/* Footer Info Bar */}
      <footer className="border-t border-[#1E2B4A] bg-[#060911]/90 px-4 py-4 text-xs text-zinc-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-zinc-300">AdCraft AI</strong> — قسم إعلانات البراند الذكي • The AI Creative Department for Kuwait & GCC
          </div>
          <div className="flex items-center gap-3 text-zinc-500 font-mono">
            <span className="text-amber-400/90">Product Lock 🔒 v2.0</span>
            <span>•</span>
            <span className="text-emerald-400/90">Kuwaiti QA 🇰🇼 100%</span>
            <span>•</span>
            <span className="text-violet-400/90">Pro Audio Voiceprint</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
