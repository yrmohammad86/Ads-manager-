import React, { useState } from 'react';
import { Header } from './components/Header';
import { CampaignStudio } from './components/CampaignStudio';
import { VideoAdsEngine } from './components/VideoAdsEngine';
import { ProductVault } from './components/ProductVault';
import { BrandDNASettings } from './components/BrandDNASettings';
import { CopyAndDialectStudio } from './components/CopyAndDialectStudio';
import { 
  INITIAL_BRAND_DNA, 
  INITIAL_PRODUCTS 
} from './data/mockData';
import { BrandDNA, ProductItem } from './types/adcraft';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'studio' | 'video' | 'products' | 'brand' | 'dialect_qa'>('video');
  const [brand, setBrand] = useState<BrandDNA>(INITIAL_BRAND_DNA);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [activeProduct, setActiveProduct] = useState<ProductItem>(INITIAL_PRODUCTS[0]);

  const handleSelectProductForCampaign = (prod: ProductItem) => {
    setActiveProduct(prod);
    setCurrentTab('studio');
  };

  const handleAddNewProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
    setActiveProduct(newProd);
  };

  const handleApplyCopyFromQA = (headline: string, subtext: string, cta: string, badge: string) => {
    // Switch to studio with pre-selected headline
    setCurrentTab('studio');
  };

  const handleResetToDemo = () => {
    setBrand(INITIAL_BRAND_DNA);
    setProducts(INITIAL_PRODUCTS);
    setActiveProduct(INITIAL_PRODUCTS[0]);
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
      </main>

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
