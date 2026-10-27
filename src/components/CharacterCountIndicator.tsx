import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

export interface SocialPlatformSpec {
  id: 'instagram' | 'tiktok' | 'snapchat' | 'twitter' | 'whatsapp' | 'universal';
  name: string;
  nameEn: string;
  optimalHeadlineMax: number;
  optimalTextMax: number;
  hardLimit: number;
  icon: string;
  tip: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformSpec[] = [
  {
    id: 'instagram',
    name: 'إنستغرام',
    nameEn: 'Instagram',
    optimalHeadlineMax: 40,
    optimalTextMax: 125,
    hardLimit: 2200,
    icon: '📸',
    tip: 'النصوص حتى 125 حرفاً تظهر كاملة في الـ Feed والـ Reels دون ظهور زر «المزيد».',
  },
  {
    id: 'tiktok',
    name: 'تيك توك',
    nameEn: 'TikTok Ads',
    optimalHeadlineMax: 35,
    optimalTextMax: 100,
    hardLimit: 150,
    icon: '🎵',
    tip: 'الحد الأقصى الموصى به 100 حرف لضمان عدم حجب النص بأزرار المنصة التفاعلية (Safe Zone).',
  },
  {
    id: 'snapchat',
    name: 'سناب شات',
    nameEn: 'Snapchat',
    optimalHeadlineMax: 34,
    optimalTextMax: 45,
    hardLimit: 60,
    icon: '👻',
    tip: 'سناب شات يعتمد على نصوص خاطفة وسريعة (Headline حتى 34 حرفاً لتحقيق أعلى نقر).',
  },
  {
    id: 'twitter',
    name: 'منصة إكس',
    nameEn: 'X / Twitter',
    optimalHeadlineMax: 50,
    optimalTextMax: 280,
    hardLimit: 280,
    icon: '𝕏',
    tip: 'المنشورات بين 100 إلى 140 حرفاً تحقق أعلى معدل تفاعل وإعادة تغريد في الخليج.',
  },
  {
    id: 'whatsapp',
    name: 'رسائل واتساب',
    nameEn: 'WhatsApp',
    optimalHeadlineMax: 40,
    optimalTextMax: 160,
    hardLimit: 1000,
    icon: '💬',
    tip: 'السطور الأولى حتى 160 حرفاً تظهر كاملة في إشعارات شاشة القفل للعميل.',
  },
  {
    id: 'universal',
    name: 'شامل للمنصات',
    nameEn: 'Universal',
    optimalHeadlineMax: 40,
    optimalTextMax: 130,
    hardLimit: 250,
    icon: '⚡',
    tip: 'نطاق متوازن ومناسب لجميع المنصات الإعلانية ومقاسات الشاشات المختلفة.',
  },
];

interface CharacterCountIndicatorProps {
  currentLength: number;
  maxLength: number;
  label?: string;
  wordCount?: number;
  platformSpec?: SocialPlatformSpec;
  compact?: boolean;
  showProgressBar?: boolean;
  className?: string;
}

export const CharacterCountIndicator: React.FC<CharacterCountIndicatorProps> = ({
  currentLength,
  maxLength,
  label,
  wordCount,
  platformSpec,
  compact = false,
  showProgressBar = true,
  className = '',
}) => {
  const percentage = Math.min(Math.round((currentLength / maxLength) * 100), 100);
  const remaining = maxLength - currentLength;
  const isOverLimit = currentLength > maxLength;
  const isNearLimit = !isOverLimit && currentLength >= maxLength * 0.85;
  const isOptimal = !isOverLimit && !isNearLimit && currentLength > 0;

  // Determine status color and text
  let statusColorClass = 'text-emerald-400';
  let badgeBgClass = 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300';
  let progressBarClass = 'bg-emerald-500';
  let statusText = 'ضمن الحد المثالي للمنصة ✓';

  if (isOverLimit) {
    statusColorClass = 'text-rose-400 font-bold';
    badgeBgClass = 'bg-rose-950/80 border-rose-700 text-rose-300';
    progressBarClass = 'bg-rose-500';
    statusText = `تجاوز الحد الموصى به بـ ${Math.abs(remaining)} حرف !`;
  } else if (isNearLimit) {
    statusColorClass = 'text-amber-400';
    badgeBgClass = 'bg-amber-950/70 border-amber-800/80 text-amber-300';
    progressBarClass = 'bg-amber-500';
    statusText = `يقترب من الحد الموصى به (${remaining} حرف متبقٍ)`;
  } else if (currentLength === 0) {
    statusColorClass = 'text-zinc-500';
    badgeBgClass = 'bg-zinc-900 border-zinc-800 text-zinc-400';
    progressBarClass = 'bg-zinc-700';
    statusText = 'بانتظار كتابة النص';
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-xs font-mono ${className}`}>
        <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold flex items-center gap-1 ${badgeBgClass}`}>
          {isOverLimit ? (
            <AlertCircle className="w-3 h-3 text-rose-400" />
          ) : isNearLimit ? (
            <AlertTriangle className="w-3 h-3 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          )}
          <span>{currentLength} / {maxLength} حرف</span>
        </span>
        {wordCount !== undefined && (
          <span className="text-zinc-500 text-[11px]">
            ({wordCount} كلمة)
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Top Bar with character numbers & status badge */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {label && <span className="text-zinc-400 font-medium">{label}:</span>}
          <span className={`font-mono font-bold text-xs ${statusColorClass}`}>
            {currentLength} <span className="text-zinc-500 font-normal">/</span> {maxLength} حرف
          </span>
          {wordCount !== undefined && (
            <span className="text-[11px] text-zinc-400 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
              {wordCount} كلمة
            </span>
          )}
        </div>

        {/* Status Pill */}
        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold flex items-center gap-1 ${badgeBgClass}`}>
          {isOverLimit ? (
            <AlertCircle className="w-3 h-3 text-rose-400" />
          ) : isNearLimit ? (
            <AlertTriangle className="w-3 h-3 text-amber-400" />
          ) : isOptimal ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          ) : null}
          <span>{statusText}</span>
        </span>
      </div>

      {/* Progress Bar */}
      {showProgressBar && (
        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800/80">
          <div
            className={`h-full rounded-full transition-all duration-300 ${progressBarClass}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}

      {/* Platform contextual advice if over or near limit */}
      {isOverLimit && platformSpec && (
        <div className="text-[11px] text-rose-300/90 bg-rose-950/40 border border-rose-900/50 rounded-xl p-2 flex items-start gap-1.5 mt-1">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <span>
            تنبيه منصة {platformSpec.name}: تجاوز {maxLength} حرفاً قد يسبب اقتطاع العبارة أو إخفاء زر الدعوة لاتخاذ إجراء. يُفضل اختصار النص للحفاظ على تفاعل أعلى.
          </span>
        </div>
      )}
    </div>
  );
};
