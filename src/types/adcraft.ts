export interface BrandDNA {
  name: string;
  category: string;
  market: string;
  logoText: string;
  primaryColor: string;
  accentColor: string;
  slogan: string;
  tone: string;
  fixedFrame: {
    showWhatsApp: boolean;
    whatsApp: string;
    showStoreUrl: boolean;
    storeUrl: string;
    showInstagram: boolean;
    instagram: string;
    showGuaranteeBadge: boolean;
    guaranteeText: string;
    framePosition: 'bottom' | 'top';
  };
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  priceKWD: number;
  originalPriceKWD?: number;
  sku: string;
  imageUrl: string;
  keyFeatures: string[];
  specs: {
    capacity?: string;
    output?: string;
    input?: string;
    weight?: string;
    warranty?: string;
  };
  sourceVerification: {
    storeName: string;
    localPriceVerified: boolean;
    specsMatchManufacturer: boolean;
    verifiedSku: string;
    auditStatus: 'VERIFIED' | 'FLAGGED';
    notes: string;
  };
  productLock: {
    lockedShape: boolean;
    lockedPortsAndBadges: boolean;
    lockedScale: boolean;
    status: 'ACTIVE' | 'DISABLED';
  };
}

export interface CreativeConcept {
  id: 'hero' | 'kashta_lifestyle' | 'feature_fast_charge' | 'promo_offer';
  title: string;
  subtitle: string;
  objective: string;
  vibe: string;
  defaultSceneId: string;
}

export interface AdPlacement {
  id: 'feed_4_5' | 'square_1_1' | 'story_9_16';
  name: string;
  aspectRatio: string;
  platform: string;
  dimensions: { width: number; height: number };
}

export interface BackgroundScene {
  id: string;
  name: string;
  category: 'desert' | 'kashta' | 'studio' | 'night' | 'sea';
  description: string;
  url: string;
}

export type LayoutPresetId = 
  | 'classic_hero'      // البطل الكلاسيكي: عنوان وشارة بالأعلى، المنتج في المنتصف، السعر وزر الطلب بالأسفل
  | 'bottom_card'       // بطاقة العرض السفلية (Story Bottom Card): منتج علوي بارز وبطاقة عائمة مجمعة بالأسفل
  | 'split_editorial'   // التوزيع الجانبي العصري (Split Editorial): عنوان وشارة على جانب والمنتج متوازن على الجانب الآخر
  | 'retail_promo'      // عرض التخفيضات الكبرى (Retail Mega Promo): ملصق خصم بارز، وسوم مواصفات، وسعر ساطع
  | 'minimal_luxury';   // المينيمال الفاخر (Minimal Luxury): مساحات هادئة فسيحة، خط راقي متباعد، وزر طلب أنيق بسيط

export interface LayoutPreset {
  id: LayoutPresetId;
  name: string;
  englishTitle: string;
  description: string;
  badgeStyle: 'pill_top' | 'floating_corner' | 'inline_card' | 'sticker_bold' | 'minimal_dot';
  headlineAlign: 'center' | 'right' | 'left';
  headlinePosition: 'top' | 'bottom_card' | 'middle_right' | 'minimal_top';
  productPlacement: 'center' | 'hero_large' | 'top_center' | 'side_split';
  priceStyle: 'pill_glow' | 'integrated_card' | 'sticker_tag' | 'minimal_clean' | 'badge_split';
  ctaStyle: 'gradient_glow' | 'full_width_card' | 'floating_pill' | 'sleek_outline' | 'compact_badge';
  containerCard: boolean;
  showSpecsTags: boolean;
  accentBorder: boolean;
  recommendedFor: string;
}

export interface AdCopyOption {
  headline: string;
  subtext: string;
  cta: string;
  angle: string;
  badge: string;
}

export interface QCCheckItem {
  id: string;
  title: string;
  status: 'passed' | 'warning' | 'failed';
  details: string;
  category: 'product_lock' | 'kuwaiti_dialect' | 'source_verification' | 'placement' | 'merchant_identity';
}

export interface VideoScene {
  id: string;
  durationSeconds: number;
  stageName: string; // 'Hook' | 'Product Reveal' | 'Lifestyle Action' | 'Offer & CTA'
  headline: string;
  subtext: string;
  badge?: string;
  backgroundUrl: string;
  animationType: 'zoom_in' | 'pan_left' | 'pulse' | 'slide_up';
  voiceoverScript: string;
}

export interface VideoCampaign {
  id: string;
  title: string;
  totalDuration: number;
  aspectRatio: '9:16' | '4:5';
  scenes: VideoScene[];
}

export interface KuwaitiLexiconEntry {
  id: string;
  word: string;
  phoneticGuide: string; // التشكيل الصوتي التوجيهي
  meaning: string;
  category: 'cta_purchase' | 'kashta_outdoor' | 'quality_praise' | 'urgency_offer' | 'common_phrases';
  adUsageExample: string;
  recommendedPosition: 'headline' | 'hook' | 'cta' | 'body';
}

export interface VoiceToneEvaluation {
  overallScore: number;
  status: 'APPROVED' | 'NEEDS_ADJUSTMENT' | 'FLAGGED';
  warmthScore: number;
  energyScore: number;
  clarityScore: number;
  kuwaitiNaturalness: string;
  strengths: string[];
  recommendations: string[];
  verdict: string;
}

export interface VoiceCloneProfile {
  id: string;
  name: string;
  pitch: number; // 0.8 - 1.2
  speed: number; // 0.9 - 1.3
  rhythmBpm: number; // 110 - 130 for commercial energy
  timbreWarmth: number; // 1 - 10
  sampleAudioUrl?: string;
  isCalibrated: boolean;
  accentDialect: 'Kuwaiti Commercial' | 'Kuwaiti Youth Casual' | 'Gulf Authoritative';
}

export interface HumanReviewAudit {
  isPronunciationApproved: boolean;
  isDialectAuthentic: boolean;
  clientConfirmedAt?: string;
  phoneticNotes: string;
}

export type AdContentType =
  | 'hero_image'        // إعلان صورة بطل رئيسي (Hero Master)
  | 'video_reels'       // فيديو وريلز عمودي 9:16 (Video & Reels)
  | 'kashta_lifestyle'  // نمط حياة وكشتات خارجية (Lifestyle & Kashta)
  | 'promo_offer'       // عروض وخصومات تجارية كبرى (Retail Mega Promo)
  | 'feature_focus'     // تركيز على المواصفات والسرعة (Feature & Tech Focus)
  | 'story_card';       // بطاقات تفاعلية للستوري (Story Interactive Card)

export interface CampaignRecord {
  id: string;
  title: string;
  productName: string;
  productId: string;
  contentType: AdContentType;
  contentTypeName: string;
  placement: 'story_9_16' | 'feed_4_5' | 'square_1_1';
  platform: 'Instagram' | 'TikTok' | 'Snapchat' | 'Meta' | 'WhatsApp';
  priceKWD: number;
  originalPriceKWD?: number;
  adCopy: {
    headline: string;
    subtext: string;
    cta: string;
    badge: string;
  };
  sourceUrl?: string;
  adVisualUrl: string;
  impressionsEstimated: number;
  clicksEstimated: number;
  conversionsEstimated: number;
  status: 'ACTIVE' | 'SCHEDULED' | 'DRAFT';
  createdAt: string;
}


