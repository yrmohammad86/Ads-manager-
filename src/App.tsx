import React, { useState } from 'react';
import { Header } from './components/Header';
import { CampaignStudio } from './components/CampaignStudio';
import { VideoAdsEngine } from './components/VideoAdsEngine';
import { ProductVault } from './components/ProductVault';
import { BrandDNASettings } from './components/BrandDNASettings';
import { CopyAndDialectStudio } from './components/CopyAndDialectStudio';
import { AdContentAnalytics } from './components/AdContentAnalytics';
import { ImportAdByUrlModal } from './components/ImportAdByUrlModal';
import { 
  INITIAL_BRAND_DNA, 
  INITIAL_PRODUCTS,
  INITIAL_CAMPAIGNS
} from './data/mockData';
import { BrandDNA, ProductItem, CampaignRecord } from './types/adcraft';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'studio' | 'video' | 'products' | 'brand' | 'dialect_qa' | 'analytics'>('analytics');
  const [brand, setBrand] = useState<BrandDNA>(INITIAL_BRAND_DNA);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [activeProduct, setActiveProduct] = useState<ProductItem>(INITIAL_PRODUCTS[0]);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(INITIAL_CAMPAIGNS);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        brand={brand}
        onResetToDemo={handleResetToDemo}
      />

      <main className="flex-1 pb-16">
        {currentTab === 'studio' && (
          <CampaignStudio
            products={products}
            brand={brand}
            activeProduct={activeProduct}
            onSelectProduct={setActiveProduct}
            onAddNewProduct={handleAddNewProduct}
            appliedCopy={appliedCopy}
            onOpenImportModal={() => setIsImportModalOpen(true)}
          />
        )}

        {currentTab === 'video' && (
          <VideoAdsEngine
            product={activeProduct}
            brand={brand}
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

        {currentTab === 'dialect_qa' && (
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

      {/* Footer info bar */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 px-4 py-4 text-xs text-zinc-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-zinc-400">AdCraft AI</strong> — قسم إعلانات البراند الذكي • The AI Creative Department for Kuwait & GCC
          </div>
          <div className="flex items-center gap-3 text-zinc-600">
            <span>Product Lock 🔒 v1</span>
            <span>•</span>
            <span>Kuwaiti QA 🇰🇼</span>
            <span>•</span>
            <span>Approved Creative Lock 🔒</span>
            <span>•</span>
            <span className="text-emerald-500">100% Free & Open Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
