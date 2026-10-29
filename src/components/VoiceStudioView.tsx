import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  Radio, 
  Check, 
  ArrowRight, 
  Layers, 
  Wand2, 
  Music, 
  ShieldAlert, 
  FileAudio,
  Download,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductItem, BrandDNA } from '../types/adcraft';

interface VoiceStudioViewProps {
  product: ProductItem;
  brand: BrandDNA;
  onSendToVideoDirector?: () => void;
}

export const VoiceStudioView: React.FC<VoiceStudioViewProps> = ({
  product,
  brand,
  onSendToVideoDirector,
}) => {
  // Current active step in the 6-stage workflow
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Audio Recording & Upload states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  // Audio Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [volume, setVolume] = useState(1);

  // Voice Profile Settings (Stage 2)
  const [speakerPersona, setSpeakerPersona] = useState<'merchant_kuwait' | 'youth_energetic' | 'calm_luxury' | 'kashta_adventurer'>('merchant_kuwait');
  const [speechPace, setSpeechPace] = useState<'normal' | 'dynamic' | 'urgent'>('dynamic');
  const [voicePitch, setVoicePitch] = useState<number>(0); // -10 to +10

  // Calibration Settings (Stage 3)
  const [noiseReduction, setNoiseReduction] = useState(true);
  const [vocalClarityBoost, setVocalClarityBoost] = useState(true);
  const [bassWarmth, setBassWarmth] = useState(65); // 0 to 100
  const [trebleAir, setTrebleAir] = useState(75);
  const [toneEvaluationScore, setToneEvaluationScore] = useState<number | null>(null);
  const [toneVerdict, setToneVerdict] = useState<string | null>(null);
  const [isEvaluatingTone, setIsEvaluatingTone] = useState(false);

  // Test Advertising Script (Stage 4)
  const [activeScriptType, setActiveScriptType] = useState<'hook_kashta' | 'direct_offer' | 'specs_lock'>('hook_kashta');
  const [scriptHeadline, setScriptHeadline] = useState('طلعت كشتة وانقطعت الكهربا؟ لا تخرب طلعة ربعك! ⚡');
  const [scriptBody, setScriptBody] = useState(`الحل الأكيد مع ${product.name}، قوة ${product.specs.output || '2200W تيار نقي'} وبطارية LiFePO4 تدوم لسنوات.`);
  const [scriptCta, setScriptCta] = useState(`السعر ${product.priceKWD} د.ك فقط، كفالة الوكيل المعتمد في الكويت، شناطر؟ اطلب الحين!`);

  // Generation & Cloning (Stage 5)
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isApproved, setIsApproved] = useState(false);

  // Voice Cloning Consent & Safeguards
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasVoiceConsent, setHasVoiceConsent] = useState(false);
  const [consentCheck, setConsentCheck] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<any>(null);

  // Audio preview listener setup
  useEffect(() => {
    if (recordedAudioUrl) {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
      }
      const audio = new Audio(recordedAudioUrl);
      audio.volume = volume;
      audio.onloadedmetadata = () => {
        if (audio.duration && isFinite(audio.duration)) {
          setDuration(Math.round(audio.duration));
        }
      };
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      audioInstanceRef.current = audio;
    }
  }, [recordedAudioUrl]);

  // Handle Recording Mic
  const handleStartRecording = async () => {
    if (!hasVoiceConsent) {
      setShowConsentModal(true);
      return;
    }

    setMicError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError('المتصفح لا يدعم الوصول المباشر للمايكروفون. يمكنك رفع ملف صوتي جاهز بالأسفل.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioBlob(blob);
        setRecordedAudioUrl(url);
        setAudioFileName('تسجيل-صوتي-مباشر.webm');
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
        setActiveStep(2);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 15) {
            clearInterval(timerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      setIsRecording(false);
      setMicError('تم رفض الإذن بالمايكروفون. يمكنك رفع ملف صوتي مسجل من جهازك.');
    }
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Handle Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setMicError('حجم الملف الصوتي يتجاوز الحد المسموح (25 ميغابايت).');
      return;
    }

    const isValidType = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|webm)$/i.test(file.name);
    if (!isValidType) {
      setMicError('صيغة الملف غير مدعومة. يرجى اختيار ملف MP3 أو WAV أو M4A.');
      return;
    }

    const url = URL.createObjectURL(file);
    setRecordedAudioBlob(file);
    setRecordedAudioUrl(url);
    setAudioFileName(file.name);
    setMicError(null);
    setActiveStep(2);
  };

  // Play / Pause Toggle
  const togglePlayAudio = () => {
    if (!audioInstanceRef.current) return;
    if (isPlaying) {
      audioInstanceRef.current.pause();
    } else {
      audioInstanceRef.current.volume = volume;
      audioInstanceRef.current.play().catch(() => {});
    }
  };

  // Trigger Tone Evaluation
  const handleEvaluateTone = async () => {
    setIsEvaluatingTone(true);
    try {
      const res = await fetch('/api/evaluate-voice-tone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleText: `${scriptHeadline} ${scriptBody} ${scriptCta}`,
          durationSec: duration,
          detectedPitch: speakerPersona === 'merchant_kuwait' ? 'لهجة كويتية تجارية أصيلة' : 'نبرة شبابية حماسية',
        }),
      });
      const data = await res.json();
      if (data && typeof data.overallScore === 'number') {
        setToneEvaluationScore(data.overallScore);
        setToneVerdict(data.verdict || 'نبرة تجارية مقنعة ومتوافقة مع المعايير الكويتية');
      }
    } catch (err) {
      console.warn('Tone evaluation error:', err);
    } finally {
      setIsEvaluatingTone(false);
    }
  };

  // Generate Synthesized Ad Voiceover
  const handleGenerateVoiceover = async () => {
    if (!hasVoiceConsent) {
      setShowConsentModal(true);
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(20);

    const fullAdScript = `${scriptHeadline} ... ${scriptBody} ... ${scriptCta}`;

    try {
      setGenerationProgress(50);
      const res = await fetch('/api/clone-and-synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adScript: fullAdScript,
          speakerTone: `Kuwaiti dialect merchant (${speakerPersona}), pace: ${speechPace}, tone: high conversion`,
          voiceType: 'high_energy',
        }),
      });

      setGenerationProgress(80);
      const data = await res.json();
      if (data.success && data.audioUrl) {
        setRecordedAudioUrl(data.audioUrl);
        setAudioFileName(`صوت-إعلاني-معتمد-${Date.now().toString().slice(-4)}.wav`);
        setActiveStep(5);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      } else {
        setActiveStep(5);
      }
    } catch (err) {
      console.warn('Synthesize error:', err);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(100);
    }
  };

  // Approve Voice Configuration
  const handleApproveVoice = () => {
    setIsApproved(true);
    setActiveStep(6);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#1E2B4A] gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-violet-400 animate-pulse" />
            <span>Voice Studio & AI Acoustic Engine</span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Kuwaiti Dialect Voiceprint
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>استوديو الصوت والبصمة الإعلانية</span>
            <span className="text-xs bg-violet-950/80 text-violet-300 border border-violet-800/60 px-2 py-0.5 rounded-md font-mono">
              Pro Audio v2
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            نظام إنتاج الصوت الإعلاني المتكامل: تسجيل البصمة الصوتية، المعايرة الأكوستيكية، وتوليد إعلانات باللهجة الكويتية الأصيلة.
          </p>
        </div>

        {/* Quick Progress Indicator */}
        <div className="flex items-center gap-2 bg-[#0D1424] border border-[#1E2B4A] px-4 py-2.5 rounded-xl">
          <div className="text-xs text-zinc-400 font-medium">مرحلة العمل:</div>
          <div className="flex items-center gap-1 font-mono text-sm">
            <span className="text-violet-400 font-bold">{activeStep}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">6</span>
          </div>
          <span className="text-xs text-zinc-300 mr-2 font-medium">
            {activeStep === 1 && 'تسجيل العينة'}
            {activeStep === 2 && 'ملف المتحدث'}
            {activeStep === 3 && 'المعايرة'}
            {activeStep === 4 && 'السكريبت الإعلاني'}
            {activeStep === 5 && 'المعاينة المباشرة'}
            {activeStep === 6 && 'الاعتماد والتصدير'}
          </span>
        </div>
      </div>

      {/* 6-Step Visual Progression Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
        {[
          { step: 1, label: '1. تسجيل العينة', desc: 'مايكروفون أو ملف', icon: Mic },
          { step: 2, label: '2. هوية المتحدث', desc: 'النبرة والأسلوب', icon: Radio },
          { step: 3, label: '3. المعايرة والصفاء', desc: 'عزل وتشويش EQ', icon: Sliders },
          { step: 4, label: '4. سكريبت الإعلان', desc: 'نصوص اللهجة 🇰🇼', icon: Sparkles },
          { step: 5, label: '5. المعاينة المباشرة', desc: 'مشغل واستماع', icon: Play },
          { step: 6, label: '6. الاعتماد والربط', desc: 'دمج مع الفيديو', icon: CheckCircle2 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeStep === item.step;
          const isPassed = activeStep > item.step;

          return (
            <button
              key={item.step}
              onClick={() => setActiveStep(item.step as any)}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-[#151D33] border-violet-500/80 shadow-lg shadow-violet-950/30'
                  : isPassed
                  ? 'bg-[#0D1424] border-emerald-900/60 hover:border-emerald-700/80 text-zinc-300'
                  : 'bg-[#0D1424]/60 border-[#1E2B4A]/60 hover:border-[#1E2B4A] text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : isPassed ? 'text-emerald-400' : 'text-zinc-500'}`} />
                {isPassed && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div>
                <div className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                  {item.label}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Primary Workspace (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STAGE 1: VOICE SAMPLE INGESTION */}
          {activeStep === 1 && (
            <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1E2B4A]">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Mic className="w-5 h-5 text-violet-400" />
                    <span>المرحلة 1: تسجيل عينة الصوت أو الرفع المباشر</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    سجل صوتك المباشر لمدة 10-15 ثانية أو ارفع مذكرة صوتية مسجلة من هاتفك (MP3/WAV/M4A).
                  </p>
                </div>
                <span className="text-xs bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  حماية البصمة والصلاحيات
                </span>
              </div>

              {micError && (
                <div className="mb-6 bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 text-xs text-rose-300 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">ملاحظة أذونات المايكروفون:</div>
                    <div>{micError}</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Live Mic Recording Card */}
                <div className="bg-[#131C31] border border-[#1E2B4A] rounded-xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-4 text-violet-400">
                    <Mic className={`w-8 h-8 ${isRecording ? 'text-rose-500 animate-pulse' : ''}`} />
                  </div>

                  <h4 className="font-bold text-sm text-white mb-1">تسجيل مباشر عبر المايكروفون</h4>
                  <p className="text-xs text-zinc-400 mb-4 max-w-xs">
                    تحدث بأسلوب إعلاني كويتي عفوي (مثال: «طلعت كشتة وانقطعت الكهربا؟!»)
                  </p>

                  {isRecording ? (
                    <div className="space-y-3 w-full">
                      <div className="text-rose-400 font-mono font-bold text-lg animate-pulse">
                        {recordingSeconds} ثانية / 15
                      </div>
                      <button
                        onClick={handleStopRecording}
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/30"
                      >
                        <MicOff className="w-4 h-4" />
                        <span>إيقاف وحفظ العينة الصوتية</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartRecording}
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-950/40"
                    >
                      <Mic className="w-4 h-4" />
                      <span>بدء التسجيل الآن (15 ثانية)</span>
                    </button>
                  )}
                </div>

                {/* Upload Existing Audio File */}
                <div className="bg-[#131C31] border border-[#1E2B4A] rounded-xl p-5 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-sky-600/20 border border-sky-500/30 flex items-center justify-center mb-4 text-sky-400">
                    <Upload className="w-8 h-8" />
                  </div>

                  <h4 className="font-bold text-sm text-white mb-1">رفع مذكرة صوتية أو ملف</h4>
                  <p className="text-xs text-zinc-400 mb-4 max-w-xs">
                    يدعم MP3، WAV، M4A المسجلة عبر هاتف آيفون أو أندرويد (بحد أقصى 25 ميجابايت).
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="audio/*,.mp3,.wav,.ogg,.m4a"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[#1A2642] hover:bg-[#203054] text-zinc-200 border border-[#2D3F66] font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Upload className="w-4 h-4 text-sky-400" />
                    <span>اختيار ملف صوتي من الجهاز</span>
                  </button>
                </div>
              </div>

              {/* Instant Audio Preview if loaded */}
              {recordedAudioUrl && (
                <div className="bg-[#131C31] border border-emerald-900/40 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlayAudio}
                      className="w-10 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md transition-all"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 mr-0.5" />}
                    </button>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{audioFileName || 'العينة الصوتية المحملة'}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {Math.floor(currentTime)}ث / {duration}ث
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveStep(2)}
                    className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    <span>المتابعة لضبط المتحدث</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STAGE 2: VOICE PROFILE & SETTINGS */}
          {activeStep === 2 && (
            <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1E2B4A]">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-violet-400" />
                    <span>المرحلة 2: الملف الصوتي وهوية المتحدث</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    حدد الشخصية الإعلانية ونبرة الإلقاء المناسبة لحملة «{product.name}».
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400">Persona Profile</span>
              </div>

              {/* Persona Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  {
                    id: 'merchant_kuwait',
                    title: 'التاجر الكويتي الثقة 🇰🇼',
                    badge: 'الأعلى تحويلاً',
                    desc: 'نبرة تجارية وقورة وموثوقة، تشرح كفالة الوكيل ومواصفات المنتج بعفوية أهل الديرة.',
                  },
                  {
                    id: 'youth_energetic',
                    title: 'الحماسي للريلز والتيك توك ⚡',
                    badge: 'سريع وتفاعلي',
                    desc: 'إيقاع سريع يجذب انتباه المشاهد في أول 3 ثوانٍ ويحث على الشراء فوراً.',
                  },
                  {
                    id: 'kashta_adventurer',
                    title: 'راعي البر والكشتات 🏕️',
                    badge: 'أجواء التخييم',
                    desc: 'نبرة خبير لوازم الرحلات، تركيز على صمود الأجهزة في الحرارة العالية وراحة البال.',
                  },
                  {
                    id: 'calm_luxury',
                    title: 'الراقي والفاخر (VIP) ✨',
                    badge: 'منتجات النخبة',
                    desc: 'نبرة هادئة ورزينة تركز على الجودة العالية، مناسبة للإعلانات المؤسسية والبراندات الفاخرة.',
                  },
                ].map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => setSpeakerPersona(persona.id as any)}
                    className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      speakerPersona === persona.id
                        ? 'bg-[#151D33] border-violet-500 shadow-md shadow-violet-950/30'
                        : 'bg-[#131C31] border-[#1E2B4A] hover:border-[#2A3B66] text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold text-white">{persona.title}</div>
                      <span className="text-[10px] bg-violet-950 text-violet-300 border border-violet-800/40 px-2 py-0.5 rounded font-medium">
                        {persona.badge}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{persona.desc}</p>
                  </button>
                ))}
              </div>

              {/* Speed & Pitch Controls */}
              <div className="bg-[#131C31] border border-[#1E2B4A] rounded-xl p-4 space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-white">إيقاع وسرعة الإلقاء (Pacing)</span>
                    <span className="text-violet-400 font-mono">
                      {speechPace === 'urgent' ? 'إيقاع إعلاني سريع (ريلز)' : speechPace === 'dynamic' ? 'ديناميكي تفاعلي' : 'طبيعي معتدل'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'normal', label: 'طبيعي (Normal)' },
                      { id: 'dynamic', label: 'ديناميكي (Dynamic)' },
                      { id: 'urgent', label: 'إعلاني سريع (Urgent)' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSpeechPace(p.id as any)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                          speechPace === p.id
                            ? 'bg-violet-600 text-white border-violet-500'
                            : 'bg-[#0D1424] text-zinc-400 border-[#1E2B4A] hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setActiveStep(1)}
                  className="text-xs text-zinc-400 hover:text-white py-2 px-3"
                >
                  الرجوع لتسجيل العينة
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-violet-950/40"
                >
                  <span>المتابعة للمعايرة الصوتية</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: CALIBRATION & ACOUSTIC TUNING */}
          {activeStep === 3 && (
            <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1E2B4A]">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-violet-400" />
                    <span>المرحلة 3: المعايرة الأكوستيكية والفلترة</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    ضبط استجابة الترددات، إزالة الضوضاء الخلفية، وفحص جودة النبرة الإعلانية.
                  </p>
                </div>
                <button
                  onClick={handleEvaluateTone}
                  disabled={isEvaluatingTone}
                  className="bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEvaluatingTone ? 'جاري فحص النبرة...' : 'فحص جودة النبرة الإعلانية'}</span>
                </button>
              </div>

              {toneVerdict && (
                <div className="mb-6 bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-900/40 border border-emerald-600/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg">
                      {toneEvaluationScore}%
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">مطابقة اللهجة الكويتية والإقناع التجاري</div>
                      <div className="text-xs text-emerald-300 mt-0.5">{toneVerdict}</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded font-mono">
                    PASS ✓
                  </span>
                </div>
              )}

              {/* Acoustic Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#131C31] border border-[#1E2B4A] rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-white">دفء الصوت وقوة الباس (Bass / Warmth)</span>
                    <span className="text-violet-400 font-mono">{bassWarmth}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bassWarmth}
                    onChange={(e) => setBassWarmth(Number(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer"
                  />
                  <div className="text-[10px] text-zinc-400 mt-1">يمنح الصوت هيبة وثباتاً يماثل استوديوهات الإذاعة الكويتية.</div>
                </div>

                <div className="bg-[#131C31] border border-[#1E2B4A] rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-white">وضوح مخارج الحروف (Treble & Air)</span>
                    <span className="text-sky-400 font-mono">{trebleAir}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={trebleAir}
                    onChange={(e) => setTrebleAir(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="text-[10px] text-zinc-400 mt-1">يعزز نطق حرف (الجيم والشين والقاف) في اللهجة الكويتية بوضوح تام.</div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <label className="flex items-center justify-between bg-[#131C31] border border-[#1E2B4A] p-3 rounded-xl cursor-pointer">
                  <div className="text-xs">
                    <div className="font-semibold text-white">عزل الضوضاء بالذكاء الاصطناعي</div>
                    <div className="text-[10px] text-zinc-400">إزالة صدى الغرفة وهواء المكيف تلقائياً</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={noiseReduction}
                    onChange={(e) => setNoiseReduction(e.target.checked)}
                    className="w-4 h-4 accent-violet-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between bg-[#131C31] border border-[#1E2B4A] p-3 rounded-xl cursor-pointer">
                  <div className="text-xs">
                    <div className="font-semibold text-white">معزز الصوت التجاري (Commercial Maximizer)</div>
                    <div className="text-[10px] text-zinc-400">موازنة مستوى الصوت لمنع التقطيع</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={vocalClarityBoost}
                    onChange={(e) => setVocalClarityBoost(e.target.checked)}
                    className="w-4 h-4 accent-violet-600 rounded"
                  />
                </label>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setActiveStep(2)}
                  className="text-xs text-zinc-400 hover:text-white py-2 px-3"
                >
                  الرجوع لملف المتحدث
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-violet-950/40"
                >
                  <span>المتابعة لسكريبت الإعلان</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: TEST ADVERTISING SCRIPTS */}
          {activeStep === 4 && (
            <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1E2B4A]">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                    <span>المرحلة 4: سكريبت الإعلان التجاري المعتمد</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    نصوص مصممة خصيصاً للتسويق الكويتي، خالية من العبارات المحظورة ومطابقة لمواصفات المنتج.
                  </p>
                </div>
                <span className="text-xs bg-violet-950/80 text-violet-300 border border-violet-800/40 px-2 py-0.5 rounded font-mono">
                  15s Commercial Script
                </span>
              </div>

              {/* Script Type Selector */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { id: 'hook_kashta', label: 'كشتة وبر 🏕️', hook: 'طلعت كشتة وانقطعت الكهربا؟ لا تخرب طلعة ربعك! ⚡' },
                  { id: 'direct_offer', label: 'عرض مباشر وخصم 🔥', hook: `عرض خاص ومحدود على ${product.name} مع كفالة سنتين!` },
                  { id: 'specs_lock', label: 'قفل مواصفات وأمان 🔒', hook: `تبي طاقة معتمدة ما تخذلك؟ ${product.name} جاهز لكل الظروف!` },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveScriptType(s.id as any);
                      setScriptHeadline(s.hook);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                      activeScriptType === s.id
                        ? 'bg-violet-600 text-white border-violet-500 font-semibold'
                        : 'bg-[#131C31] text-zinc-300 border-[#1E2B4A] hover:border-violet-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Script Edit Fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    1. الهوك وجذب الانتباه (0 - 3.5 ثانية):
                  </label>
                  <input
                    type="text"
                    value={scriptHeadline}
                    onChange={(e) => setScriptHeadline(e.target.value)}
                    className="w-full bg-[#131C31] border border-[#1E2B4A] focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    2. صلب الإعلان وقفل مواصفات المنتج (Product Lock 🔒):
                  </label>
                  <textarea
                    rows={2}
                    value={scriptBody}
                    onChange={(e) => setScriptBody(e.target.value)}
                    className="w-full bg-[#131C31] border border-[#1E2B4A] focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    3. الدعوة للشراء وحث الجمهور (Kuwaiti CTA 🇰🇼):
                  </label>
                  <input
                    type="text"
                    value={scriptCta}
                    onChange={(e) => setScriptCta(e.target.value)}
                    className="w-full bg-[#131C31] border border-[#1E2B4A] focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setActiveStep(3)}
                  className="text-xs text-zinc-400 hover:text-white py-2 px-3"
                >
                  الرجوع للمعايرة
                </button>
                <button
                  onClick={handleGenerateVoiceover}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-violet-950/40"
                >
                  <Wand2 className="w-4 h-4 text-violet-200" />
                  <span>{isGenerating ? `جاري التوليد (${generationProgress}%)...` : 'توليد الصوت الإعلاني بالبصمة المستنسخة'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 5: GENERATE & LISTEN TO LIVE PREVIEW */}
          {activeStep === 5 && (
            <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1E2B4A]">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Play className="w-5 h-5 text-violet-400" />
                    <span>المرحلة 5: استماع ومعاينة الصوت المولد</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    تحقق من تدفق الصوت، نبرة اللهجة الكويتية، ومطابقة التوقيت مع فيديو 15 ثانية.
                  </p>
                </div>
                <span className="text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 px-2.5 py-1 rounded font-mono">
                  Ready to Deploy
                </span>
              </div>

              {/* Dedicated Waveform Player Card */}
              <div className="bg-[#131C31] border border-[#1E2B4A] rounded-2xl p-6 mb-6">
                <div className="flex flex-col items-center justify-center text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-violet-950/50 mb-3 cursor-pointer hover:scale-105 transition-transform" onClick={togglePlayAudio}>
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 mr-1" />}
                  </div>
                  <div className="text-sm font-bold text-white mb-0.5">
                    {audioFileName || 'الإعلان الصوتي المولد بالبصمة الصوتية'}
                  </div>
                  <div className="text-xs text-zinc-400">
                    بصمة معتمدة • {speakerPersona === 'merchant_kuwait' ? 'التاجر الكويتي الثقة' : 'نبرة حماسية'}
                  </div>
                </div>

                {/* Simulated Waveform Bars */}
                <div className="flex items-center justify-center gap-1.5 h-12 mb-4 px-4 bg-[#0D1424] rounded-xl border border-[#1E2B4A]/60">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const heightPercent = 25 + Math.sin(i * 0.4) * 45 + ((i % 3) * 15);
                    const isPlayedBar = (i / 32) * duration <= currentTime;

                    return (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlayedBar ? 'bg-violet-400 shadow-sm shadow-violet-500/50' : 'bg-zinc-700/60'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    );
                  })}
                </div>

                {/* Playhead Progress & Scrub */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 15}
                    step="0.1"
                    value={currentTime}
                    onChange={(e) => {
                      const newTime = Number(e.target.value);
                      setCurrentTime(newTime);
                      if (audioInstanceRef.current) {
                        audioInstanceRef.current.currentTime = newTime;
                      }
                    }}
                    className="w-full accent-violet-500 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>{Math.floor(currentTime)} ثانية</span>
                    <span>15 ثانية (معيار ريلز)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setActiveStep(4)}
                  className="text-xs text-zinc-400 hover:text-white py-2 px-3"
                >
                  تعديل السكريبت
                </button>
                <button
                  onClick={handleApproveVoice}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>اعتماد البصمة الصوتية والمتابعة</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 6: APPROVE & REUSE */}
          {activeStep === 6 && (
            <div className="bg-[#0D1424] border border-emerald-900/50 rounded-2xl p-6 shadow-xl">
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  تم اعتماد البصمة الصوتية الكويتية بنجاح! 🎉
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
                  البصمة الصوتية الآن جاهزة للاستخدام في مخرج الفيديو، لإنتاج مقاطع ريلز وتيك توك مع تركيب الصوت تلقائياً على مشاهد المنتج.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {onSendToVideoDirector && (
                    <button
                      onClick={onSendToVideoDirector}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-950/50 transition-all"
                    >
                      <span>فتح مخرج الفيديو لتركيب الصوت على الريلز 🎬</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {recordedAudioUrl && (
                    <a
                      href={recordedAudioUrl}
                      download={audioFileName || 'adcraft-voiceover.wav'}
                      className="bg-[#131C31] hover:bg-[#1A2642] text-zinc-200 border border-[#2A3B66] text-xs font-semibold py-3 px-5 rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>تحميل ملف الصوت المعتمد (WAV)</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Safeguards, Specs & Dialect Guide (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Safeguard & Consent Status Card */}
          <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>إقرار الصلاحية وحماية البصمة الصوتية</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              يلتزم AdCraft AI بأعلى معايير حماية الملكية الفكرية. لا يتم استخدام أي بصمة صوتية تجارية إلا بموافقة صاحب الصوت المسجل أو التاجر المعتمد.
            </p>

            <div className="bg-[#131C31] border border-[#1E2B4A] rounded-xl p-3 text-xs flex items-center justify-between">
              <span className="text-zinc-300">حالة الإقرار:</span>
              <span className={`font-mono font-bold ${hasVoiceConsent ? 'text-emerald-400' : 'text-amber-400'}`}>
                {hasVoiceConsent ? 'معتمد وموثق ✓' : 'مطلوب إقرار'}
              </span>
            </div>

            {!hasVoiceConsent && (
              <button
                onClick={() => setShowConsentModal(true)}
                className="w-full mt-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold py-2 px-3 rounded-xl text-xs transition-all"
              >
                تأكيد وتوقيع إقرار الصلاحية ✍️
              </button>
            )}
          </div>

          {/* Product Lock Status for Voice */}
          <div className="bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-3">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>مطابقة نصوص الصوت مع Product Lock 🔒</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#1E2B4A]/60 text-zinc-300">
                <span>اسم المنتج المثبت:</span>
                <span className="font-semibold text-white">{product.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2B4A]/60 text-zinc-300">
                <span>السعر المعتمد:</span>
                <span className="font-mono text-emerald-400 font-bold">{product.priceKWD} د.ك</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1E2B4A]/60 text-zinc-300">
                <span>الكفالة المذكورة بالصوت:</span>
                <span className="text-zinc-200">{product.specs.warranty || 'كفالة الوكيل المعتمد'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Cloning Consent Safeguard Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0D1424] border border-[#202D4C] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
              <h3 className="font-bold text-base text-white">إقرار التفويض الأخلاقي للبصمة الصوتية</h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              بموجب سياسات AdCraft AI الأخلاقية، أقر بأنني أملك الحق الكامل أو التفويض المباشر لاستخدام هذه العينة الصوتية في الإعلانات التجارية للمتجر، مع الالتزام بعدم تقليد شخصيات عامة دون إذن مسبق.
            </p>

            <label className="flex items-start gap-3 bg-[#131C31] border border-[#1E2B4A] p-3 rounded-xl cursor-pointer mb-5 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={consentCheck}
                onChange={(e) => setConsentCheck(e.target.checked)}
                className="w-4 h-4 accent-violet-600 rounded mt-0.5"
              />
              <span>أوافق وأقر بأن التسجيل يخص متجري التجاري ومفوض رسمياً للاستخدام الإعلاني.</span>
            </label>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowConsentModal(false)}
                className="text-xs text-zinc-400 hover:text-white px-3 py-2"
              >
                إلغاء
              </button>
              <button
                disabled={!consentCheck}
                onClick={() => {
                  setHasVoiceConsent(true);
                  setShowConsentModal(false);
                }}
                className={`text-xs font-semibold py-2 px-5 rounded-xl transition-all ${
                  consentCheck
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-md'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                تأكيد واعتماد الإقرار
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
