import React, { forwardRef } from 'react';
import { ProductItem, BrandDNA, AdPlacement, BackgroundScene, LayoutPreset } from '../types/adcraft';
import { LAYOUT_PRESETS } from '../data/mockData';
import { 
  Lock, 
  Phone, 
  Globe, 
  Award, 
  CheckCircle, 
  Flame, 
  Sparkles,
  Zap,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface AdCanvasPreviewProps {
  product: ProductItem;
  brand: BrandDNA;
  placement: AdPlacement;
  backgroundScene: BackgroundScene;
  isApprovedLockActive: boolean;
  headline: string;
  subtext: string;
  badge: string;
  ctaText: string;
  layoutPreset?: LayoutPreset;
  headlineColor?: string;
  productScale?: number;
  productPosY?: number;
  showMerchantFrame?: boolean;
  showPrice?: boolean;
}

export const AdCanvasPreview = forwardRef<HTMLDivElement, AdCanvasPreviewProps>(
  (
    {
      product,
      brand,
      placement,
      backgroundScene,
      isApprovedLockActive,
      headline,
      subtext,
      badge,
      ctaText,
      layoutPreset = LAYOUT_PRESETS[0],
      headlineColor = '#ffffff',
      productScale = 1,
      productPosY = 0,
      showMerchantFrame = true,
      showPrice = true,
    },
    ref
  ) => {
    // Determine aspect ratio class & max dimensions
    const getRatioAspect = () => {
      if (placement.id === 'story_9_16') return 'aspect-[9/16] max-h-[640px]';
      if (placement.id === 'feed_4_5') return 'aspect-[4/5] max-h-[600px]';
      return 'aspect-square max-h-[560px]';
    };

    // Calculate product transform based on layout preset
    const getProductTransform = () => {
      let translateY = productPosY;
      let scale = productScale;
      let translateX = 0;

      if (layoutPreset.id === 'bottom_card') {
        // Shift product upwards to leave room for bottom floating card
        translateY -= placement.id === 'story_9_16' ? 55 : 35;
        scale *= 1.05;
      } else if (layoutPreset.id === 'split_editorial') {
        // Shift product towards the left side in RTL
        translateX = placement.id === 'story_9_16' ? -25 : -35;
        translateY += 10;
        scale *= 0.95;
      } else if (layoutPreset.id === 'retail_promo') {
        // Dramatic larger hero product
        scale *= 1.12;
      } else if (layoutPreset.id === 'minimal_luxury') {
        // Generous spacing around luxury product
        scale *= 0.92;
      }

      return {
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        transition: 'transform 0.3s ease-out',
      };
    };

    // Key features pills (for presets that show specs tags)
    const specsPills = product.keyFeatures?.slice(0, 2) || [];

    return (
      <div className="flex flex-col items-center justify-center w-full">
        {/* Canvas Frame Container */}
        <div
          ref={ref}
          id="adcraft-ad-canvas"
          className={`relative w-full ${getRatioAspect()} rounded-2xl overflow-hidden shadow-2xl border ${
            layoutPreset.accentBorder ? 'border-amber-500/40' : 'border-zinc-800'
          } select-none bg-zinc-950 transition-all duration-300`}
        >
          {/* LAYER 0: Background Scene (Immutable when Approved Lock is active) */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={backgroundScene.url}
              alt={backgroundScene.name}
              crossOrigin="anonymous"
              className={`w-full h-full object-cover filter contrast-[1.05] ${
                layoutPreset.id === 'minimal_luxury' ? 'brightness-75' : ''
              }`}
            />
            {/* Cinematic subtle vignette and gradient scrim for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />
          </div>

          {/* APPROVED CREATIVE LOCK INDICATOR (Non-printable UI watermark) */}
          {isApprovedLockActive && (
            <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-amber-500/50 text-amber-300 px-2.5 py-1 rounded-full text-[10px] font-mono shadow-lg">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>APPROVED CREATIVE LOCK 🔒</span>
            </div>
          )}

          {/* Placement & Preset Watermark */}
          <div className="absolute top-3 left-3 z-30 bg-black/55 backdrop-blur-sm border border-zinc-700/60 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5">
            <span>{placement.aspectRatio}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-amber-400 font-semibold">{layoutPreset.name}</span>
          </div>

          {/* LAYER 1: Genuine Product with Product Lock 🔒 */}
          <div
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            style={getProductTransform()}
          >
            <div className="relative max-w-[70%] max-h-[55%] flex items-center justify-center">
              {/* Natural shadow beneath the product */}
              <div
                className={`absolute -bottom-6 w-3/4 h-8 bg-black/80 blur-xl rounded-full scale-110 pointer-events-none ${
                  layoutPreset.id === 'retail_promo' ? 'shadow-[0_0_40px_rgba(245,158,11,0.35)]' : ''
                }`}
              />
              
              {/* The Genuine Unaltered Product */}
              <img
                src={product.imageUrl}
                alt={product.name}
                crossOrigin="anonymous"
                className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
              />

              {/* Product Lock Tiny Shield Tag */}
              <div className="absolute -bottom-2 right-0 bg-zinc-900/90 border border-amber-500/60 text-amber-400 text-[9px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1 backdrop-blur-sm shadow">
                <Lock className="w-2.5 h-2.5" />
                Product Lock Active
              </div>
            </div>
          </div>

          {/* =========================================================================
              LAYOUT VARIANT A: BOTTOM CARD PRESET (Story Bottom Card)
              Grouped frosted card at bottom holding copy, price, and full-width CTA
             ========================================================================= */}
          {layoutPreset.id === 'bottom_card' && (
            <>
              {/* Floating top badge */}
              {badge && (
                <div className="absolute top-11 right-4 z-20">
                  <div className="inline-flex items-center gap-1.5 bg-amber-500 text-zinc-950 font-bold px-3 py-1 rounded-full text-xs shadow-lg shadow-amber-500/20">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>{badge}</span>
                  </div>
                </div>
              )}

              {/* Specs Pills Floating Near Top-Right */}
              {layoutPreset.showSpecsTags && specsPills.length > 0 && (
                <div className="absolute top-20 right-4 z-20 flex flex-col gap-1.5 max-w-[200px]">
                  {specsPills.map((feat, idx) => (
                    <div
                      key={idx}
                      className="text-[10px] bg-black/65 backdrop-blur-md border border-zinc-700/80 text-zinc-200 px-2.5 py-0.5 rounded-lg text-right truncate shadow"
                    >
                      ⚡ {feat}
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Elevated Frosted Glass Card */}
              <div className={`absolute ${showMerchantFrame ? 'bottom-11' : 'bottom-3'} left-3 right-3 z-20 bg-zinc-950/85 backdrop-blur-xl border border-zinc-700/80 rounded-2xl p-3.5 sm:p-4 shadow-2xl`}>
                <div className="text-right">
                  <h2
                    className="font-extrabold text-base sm:text-lg md:text-xl leading-snug tracking-tight drop-shadow transition-colors"
                    style={{ color: headlineColor }}
                  >
                    {headline}
                  </h2>
                  {subtext && (
                    <p className="mt-1 text-[11px] sm:text-xs text-zinc-300 font-medium line-clamp-2">
                      {subtext}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between gap-2.5">
                  {/* Price */}
                  {showPrice && (
                    <div className="text-right shrink-0">
                      <span className="text-[9px] text-zinc-400 block leading-none">السعر الرسمي</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black text-amber-400 font-mono">
                          {product.priceKWD}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">د.ك</span>
                        {product.originalPriceKWD && (
                          <span className="text-[10px] text-zinc-500 line-through font-mono mr-1">
                            {product.originalPriceKWD} د.ك
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA Full Button */}
                  {ctaText && (
                    <div className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-950/40 cursor-pointer border border-amber-400/60 transform hover:scale-[1.01] transition-all">
                      <ShoppingBag className="w-3.5 h-3.5 fill-zinc-950" />
                      <span>{ctaText}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              LAYOUT VARIANT B: SPLIT EDITORIAL PRESET (Side Asymmetric)
              Right-aligned text hierarchy with specs chips, product offset left
             ========================================================================= */}
          {layoutPreset.id === 'split_editorial' && (
            <>
              {/* Right Side Editorial Copy Block */}
              <div className="absolute top-12 right-0 w-[62%] sm:w-[58%] z-20 px-5 text-right flex flex-col items-start gap-1.5">
                {/* Floating pill badge */}
                {badge && (
                  <div className="inline-flex items-center gap-1.5 bg-zinc-900/90 border border-amber-500/60 text-amber-400 font-bold px-2.5 py-0.5 rounded-full text-[11px] shadow">
                    <Zap className="w-3 h-3 fill-current text-amber-400" />
                    <span>{badge}</span>
                  </div>
                )}

                <h2
                  className="font-extrabold text-lg sm:text-xl md:text-2xl leading-tight tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] transition-colors mt-0.5"
                  style={{ color: headlineColor }}
                >
                  {headline}
                </h2>

                {subtext && (
                  <p className="text-[11px] sm:text-xs text-zinc-300 font-medium line-clamp-2 drop-shadow">
                    {subtext}
                  </p>
                )}

                {/* Specs chips */}
                {layoutPreset.showSpecsTags && specsPills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {specsPills.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] bg-zinc-900/80 border border-zinc-700/80 text-zinc-200 px-2 py-0.5 rounded font-medium"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Action Area */}
              <div className={`absolute ${showMerchantFrame ? 'bottom-12' : 'bottom-4'} left-4 right-4 z-20 flex items-center justify-between`}>
                {showPrice && (
                  <div className="bg-zinc-950/90 border border-zinc-700/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg text-right">
                    <span className="text-[9px] text-zinc-400 block leading-none">السعر</span>
                    <span className="text-base font-black text-amber-400 font-mono">
                      {product.priceKWD} <span className="text-xs font-bold">د.ك</span>
                    </span>
                  </div>
                )}

                {ctaText && (
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-xl cursor-pointer hover:from-amber-400 hover:to-amber-500 transition-all">
                    <ShoppingBag className="w-3.5 h-3.5 fill-zinc-950" />
                    <span>{ctaText}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* =========================================================================
              LAYOUT VARIANT C: RETAIL MEGA PROMO PRESET (High Urgency Retail)
              Bold sticker badge, punchy accent bar headline, large price callout
             ========================================================================= */}
          {layoutPreset.id === 'retail_promo' && (
            <>
              {/* High-visibility corner sticker badge */}
              {badge && (
                <div className="absolute top-10 right-4 z-20 -rotate-3 transform hover:rotate-0 transition-transform">
                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-black px-3.5 py-1.5 rounded-xl text-xs shadow-xl border border-white/20">
                    <Flame className="w-3.5 h-3.5 fill-white text-white" />
                    <span>{badge}</span>
                  </div>
                </div>
              )}

              {/* Bold Center Headline with Contrast Scrim Bar */}
              <div className="absolute top-20 left-0 right-0 z-20 px-6 text-center flex flex-col items-center">
                <div className="bg-black/60 backdrop-blur-md border border-amber-500/40 rounded-xl px-4 py-1.5 shadow-xl">
                  <h2
                    className="font-black text-xl sm:text-2xl md:text-3xl leading-tight tracking-tight drop-shadow-lg"
                    style={{ color: headlineColor }}
                  >
                    {headline}
                  </h2>
                </div>
                {subtext && (
                  <p className="mt-1 text-xs text-amber-200 font-bold drop-shadow max-w-sm line-clamp-1">
                    {subtext}
                  </p>
                )}
              </div>

              {/* Bottom Retail Action Strip */}
              <div className={`absolute ${showMerchantFrame ? 'bottom-12' : 'bottom-4'} left-4 right-4 z-20 flex items-center justify-center gap-3`}>
                {showPrice && (
                  <div className="flex items-center gap-2 bg-gradient-to-b from-zinc-900 to-black border-2 border-amber-400 backdrop-blur-md px-3.5 py-1 rounded-xl shadow-2xl">
                    <div className="text-right">
                      <span className="text-[9px] text-amber-300 font-bold block leading-none">عرض خاص 🇰🇼</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-white font-mono">{product.priceKWD}</span>
                        <span className="text-xs font-bold text-amber-400">د.ك</span>
                      </div>
                    </div>
                    {product.originalPriceKWD && (
                      <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                        وفر {Math.round(((product.originalPriceKWD - product.priceKWD) / product.originalPriceKWD) * 100)}%
                      </span>
                    )}
                  </div>
                )}

                {ctaText && (
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-black px-5 py-2.5 rounded-xl text-sm shadow-2xl cursor-pointer border border-amber-200 animate-pulse">
                    <ShoppingBag className="w-4 h-4 fill-zinc-950" />
                    <span>{ctaText}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* =========================================================================
              LAYOUT VARIANT D: MINIMAL LUXURY PRESET (Understated Elegance)
              Delicate typography, sleek border, ample breathing space
             ========================================================================= */}
          {layoutPreset.id === 'minimal_luxury' && (
            <>
              {/* Top Refined Header */}
              <div className="absolute top-11 left-0 right-0 z-20 px-8 text-center flex flex-col items-center">
                {badge && (
                  <div className="mb-2 inline-flex items-center gap-1.5 bg-black/60 border border-amber-500/30 text-amber-300/90 font-medium px-3 py-0.5 rounded-full text-[10px] tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>{badge}</span>
                  </div>
                )}

                <h2
                  className="font-bold text-lg sm:text-xl md:text-2xl leading-snug tracking-wide drop-shadow max-w-md"
                  style={{ color: headlineColor }}
                >
                  {headline}
                </h2>

                {subtext && (
                  <p className="mt-1 text-xs text-zinc-300/80 font-light max-w-xs line-clamp-1">
                    {subtext}
                  </p>
                )}
              </div>

              {/* Bottom Sleek Outline CTA & Price */}
              <div className={`absolute ${showMerchantFrame ? 'bottom-12 sm:bottom-14' : 'bottom-4 sm:bottom-6'} left-0 right-0 z-20 px-6 flex flex-col items-center gap-2`}>
                {showPrice && (
                  <div className="text-center font-mono">
                    <span className="text-base font-semibold text-zinc-100">
                      {product.priceKWD} <span className="text-xs font-normal text-zinc-400">KWD</span>
                    </span>
                  </div>
                )}

                {ctaText && (
                  <div className="flex items-center gap-2 bg-zinc-950/80 hover:bg-zinc-900 border border-amber-400/50 hover:border-amber-400 text-amber-300 font-semibold px-5 py-2 rounded-full text-xs shadow-lg cursor-pointer transition-all">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{ctaText}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* =========================================================================
              LAYOUT VARIANT E: CLASSIC HERO PRESET (Default Balanced Center)
             ========================================================================= */}
          {layoutPreset.id === 'classic_hero' && (
            <>
              {/* TOP GRAPHIC CONTENT (Badge & Headline) */}
              <div className="absolute top-12 left-0 right-0 z-20 px-6 sm:px-8 text-center flex flex-col items-center">
                {badge && (
                  <div className="mb-2.5 inline-flex items-center gap-1.5 bg-amber-500 text-zinc-950 font-bold px-3 py-1 rounded-full text-xs shadow-lg shadow-amber-500/20">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{badge}</span>
                  </div>
                )}

                <h2
                  className="font-extrabold text-xl sm:text-2xl md:text-3xl leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-md transition-colors"
                  style={{ color: headlineColor }}
                >
                  {headline}
                </h2>

                {subtext && (
                  <p className="mt-1.5 text-xs sm:text-sm text-zinc-200 font-medium max-w-sm line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] opacity-95">
                    {subtext}
                  </p>
                )}
              </div>

              {/* BOTTOM ACTIONS (Price Tag & CTA Button) */}
              <div className={`absolute ${showMerchantFrame ? 'bottom-14 sm:bottom-16' : 'bottom-4 sm:bottom-6'} left-0 right-0 z-20 px-6 sm:px-8 flex flex-col items-center gap-2.5`}>
                {showPrice && (
                  <div className="flex items-center gap-2 bg-zinc-950/90 border border-zinc-700/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-xl">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 block leading-none">السعر في الكويت</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-amber-400 font-mono">
                          {product.priceKWD}
                        </span>
                        <span className="text-xs font-bold text-amber-400">د.ك</span>
                        {product.originalPriceKWD && (
                          <span className="text-[11px] text-zinc-500 line-through font-mono">
                            {product.originalPriceKWD} د.ك
                          </span>
                        )}
                      </div>
                    </div>
                    {product.originalPriceKWD && (
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded mr-1">
                        خصم {Math.round(((product.originalPriceKWD - product.priceKWD) / product.originalPriceKWD) * 100)}%
                      </span>
                    )}
                  </div>
                )}

                {ctaText && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-sm shadow-xl shadow-amber-950/50 cursor-pointer border border-amber-400/50 transform hover:scale-[1.02] transition-transform">
                    <ShoppingBag className="w-4 h-4 fill-zinc-950" />
                    <span>{ctaText}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* LAYER 4: MERCHANT IDENTITY FIXED BRAND FRAME */}
          {showMerchantFrame && (
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-zinc-950/95 border-t border-zinc-800/90 backdrop-blur-md px-4 py-2 flex items-center justify-between text-[11px] text-zinc-300">
              {/* Store & Guarantee */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-xs">{brand.name}</span>
                {brand.fixedFrame.showGuaranteeBadge && (
                  <span className="hidden sm:flex items-center gap-1 text-amber-400 text-[10px]">
                    <Award className="w-3 h-3" />
                    {brand.fixedFrame.guaranteeText}
                  </span>
                )}
              </div>

              {/* Channels (WhatsApp / Web) */}
              <div className="flex items-center gap-3">
                {brand.fixedFrame.showStoreUrl && (
                  <span className="flex items-center gap-1 text-sky-400 font-mono text-[10px]">
                    <Globe className="w-3 h-3" />
                    {brand.fixedFrame.storeUrl}
                  </span>
                )}
                {brand.fixedFrame.showWhatsApp && (
                  <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold text-[10px]">
                    <Phone className="w-3 h-3" />
                    {brand.fixedFrame.whatsApp}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Caption beneath preview */}
        <div className="mt-3 text-center text-xs text-zinc-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>
            معاينة واقعية بنسبة {placement.aspectRatio} • قالب: <strong className="text-amber-400">{layoutPreset.name}</strong>
          </span>
        </div>
      </div>
    );
  }
);
AdCanvasPreview.displayName = 'AdCanvasPreview';

