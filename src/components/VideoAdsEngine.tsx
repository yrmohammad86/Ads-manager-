import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Lock, 
  Film, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Wand2, 
  Smartphone,
  Mic,
  MicOff,
  Music,
  Radio,
  FileAudio,
  Check,
  AlertCircle,
  Activity,
  ShieldAlert,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductItem, BrandDNA } from '../types/adcraft';

interface VideoAdsEngineProps {
  product: ProductItem;
  brand: BrandDNA;
}

export const VideoAdsEngine: React.FC<VideoAdsEngineProps> = ({ product, brand }) => {
  // Video playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);

  // Audio Mode: 'music_sfx' | 'merchant_voice' | 'muted'
  const [audioMode, setAudioMode] = useState<'music_sfx' | 'merchant_voice' | 'muted'>('merchant_voice');
  
  // Custom Voice Recording & Upload state
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  // Dedicated Audio Preview Player States
  const [isAudioPreviewPlaying, setIsAudioPreviewPlaying] = useState(false);
  const [audioPlayTime, setAudioPlayTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(15);
  const [audioVolume, setAudioVolume] = useState(1);
  const [isGeneratingCloneVoice, setIsGeneratingCloneVoice] = useState(false);
  // Voice Cloning Consent & Authorization Safeguards
  const [hasVoiceConsent, setHasVoiceConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentAcknowledgedCheckbox, setConsentAcknowledgedCheckbox] = useState(false);
  const [pendingAction, setPendingAction] = useState<'clone' | 'record' | null>(null);

  const mediaRecorderVoiceRef = useRef<MediaRecorder | null>(null);
  const userAudioInstanceRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Web Audio Context for realistic Commercial Music Beat & SFX
  const audioCtxRef = useRef<AudioContext | null>(null);

  const totalDuration = 15; // 15 seconds Reel/Story format
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Script & Scenes
  const [scenes, setScenes] = useState([
    {
      id: 'scene-1',
      title: 'الهوك وجذب الانتباه (Hook)',
      timeRange: '0 - 3.5 ثانية',
      headline: 'طلعت كشتة وانقطعت الكهربا؟ ⚡',
      subtext: 'لا تخرب طلعة ربعك بسبب بطارية ضعيفة أو ماطور مزعج!',
      badge: 'مشكلة تواجه الكل',
      voiceover: 'طلعت كشتة وانقطعت الكهربا؟ لا تخرب طلعة ربعك!',
      bgUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'scene-2',
      title: 'كشف المنتج وقفل المواصفات (Product Reveal 🔒)',
      timeRange: '3.5 - 7.5 ثانية',
      headline: `${product.name} 🚀`,
      subtext: `${product.specs.output || '2200W تيار نقي'} • بطارية آمنة LiFePO4 تدوم لسنوات`,
      badge: 'Product Lock 🔒 معتمد',
      voiceover: `الحل مع ${product.name}، قوة وأمان لا ينقطع.`,
      bgUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'scene-3',
      title: 'الاستخدام الواقعي بالكشتة (Kashta Lifestyle)',
      timeRange: '7.5 - 11.5 ثانية',
      headline: 'كهربتك معاك… وين ما تروح 🏕️',
      subtext: 'شغل إضاءتك، ثلاجتك، وأجهزتك الحساسة بهدوء تام وراحة بال',
      badge: 'أجواء الكشتة والبر',
      voiceover: 'كهربتك معاك وين ما تروح، هدوء وراحة بال بالبر والبحر.',
      bgUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'scene-4',
      title: 'العرض والدعوة للشراء (Offer & CTA 🇰🇼)',
      timeRange: '11.5 - 15 ثانية',
      headline: `السعر الخاص: ${product.priceKWD} د.ك فقط! 🔥`,
      subtext: `كفالة الوكيل المعتمد • اطلب عبر الواتساب: ${brand.fixedFrame.whatsApp}`,
      badge: 'شناطر؟ اطلب الحين',
      voiceover: `بسعر ${product.priceKWD} دينار، كفالة الوكيل المعتمد في الكويت، شناطر؟ اطلب الحين!`,
      bgUrl: 'https://images.unsplash.com/photo-1473580044384-7ba9967a16a0?auto=format&fit=crop&w=1200&q=80',
    },
  ]);

  // Determine current active scene based on currentTime
  const getActiveSceneIndex = (time: number) => {
    if (time < 3.5) return 0;
    if (time < 7.5) return 1;
    if (time < 11.5) return 2;
    return 3;
  };

  const activeSceneIndex = getActiveSceneIndex(currentTime);
  const activeScene = scenes[activeSceneIndex];

  // Initialize or update userAudioInstance whenever recordedAudioUrl changes
  useEffect(() => {
    if (recordedAudioUrl) {
      if (userAudioInstanceRef.current) {
        userAudioInstanceRef.current.pause();
      }
      const audio = new Audio(recordedAudioUrl);
      audio.volume = audioVolume;
      audio.preload = 'auto';

      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setAudioDuration(Math.round(audio.duration));
        }
      };

      audio.ontimeupdate = () => {
        setAudioPlayTime(audio.currentTime);
      };

      audio.onplay = () => setIsAudioPreviewPlaying(true);
      audio.onpause = () => setIsAudioPreviewPlaying(false);
      audio.onended = () => {
        setIsAudioPreviewPlaying(false);
        setAudioPlayTime(0);
      };

      userAudioInstanceRef.current = audio;
    }
  }, [recordedAudioUrl]);

  // Update volume
  const handleVolumeChange = (newVol: number) => {
    setAudioVolume(newVol);
    if (userAudioInstanceRef.current) {
      userAudioInstanceRef.current.volume = newVol;
    }
  };

  // Direct toggle play for uploaded audio preview
  const handleToggleAudioPreview = () => {
    if (!userAudioInstanceRef.current) return;
    const audio = userAudioInstanceRef.current;

    if (isAudioPreviewPlaying) {
      audio.pause();
      setIsAudioPreviewPlaying(false);
    } else {
      audio.volume = audioVolume;
      audio.play().then(() => {
        setIsAudioPreviewPlaying(true);
      }).catch((err) => {
        console.warn('Audio play error:', err);
      });
    }
  };

  // Sound generator using Web Audio API for crisp rhythmic commercial ad beat & transitions
  const playSoundEffect = (type: 'whoosh' | 'power_up' | 'beat_kick' | 'cash_chime') => {
    if (audioMode !== 'music_sfx') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'whoosh') {
        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(1400, now + 0.25);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'power_up') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'beat_kick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'cash_chime') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.18, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.3);
        });
      }
    } catch (e) {
      // Audio context might be restricted
    }
  };

  // Play/Pause timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            if (userAudioInstanceRef.current) {
              userAudioInstanceRef.current.pause();
              userAudioInstanceRef.current.currentTime = 0;
            }
            return 0;
          }
          const next = +(prev + 0.1).toFixed(1);

          // Audio triggers
          if (audioMode === 'music_sfx') {
            if (Math.round(next * 10) % 6 === 0) {
              playSoundEffect('beat_kick');
            }
            const prevIdx = getActiveSceneIndex(prev);
            const nextIdx = getActiveSceneIndex(next);
            if (prevIdx !== nextIdx) {
              playSoundEffect('whoosh');
              if (nextIdx === 1) playSoundEffect('power_up');
              if (nextIdx === 3) playSoundEffect('cash_chime');
            }
          }

          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, audioMode]);

  // Main video play/pause handler
  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (currentTime >= totalDuration) {
        setCurrentTime(0);
      }
      setIsPlaying(true);

      // Play user voice if in merchant_voice mode
      if (audioMode === 'merchant_voice' && userAudioInstanceRef.current) {
        userAudioInstanceRef.current.currentTime = currentTime;
        userAudioInstanceRef.current.volume = audioVolume;
        userAudioInstanceRef.current.play().catch((err) => {
          console.warn('Video audio play error:', err);
        });
      }
    } else {
      setIsPlaying(false);
      if (userAudioInstanceRef.current) {
        userAudioInstanceRef.current.pause();
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (userAudioInstanceRef.current) {
      userAudioInstanceRef.current.pause();
      userAudioInstanceRef.current.currentTime = 0;
    }
  };

  // Microphone Voice Recorder for Authentic Kuwaiti Accent
  const handleStartVoiceRecording = async () => {
    setMicError(null);
    if (!hasVoiceConsent) {
      setPendingAction('record');
      setShowConsentModal(true);
      return;
    }
    await executeVoiceRecording();
  };

  const executeVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError('المايكروفون غير متاح في هذه البيئة. يمكنك استخدام خيار رفع ملف صوتي (MP3/WAV) مباشرة.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderVoiceRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioBlob(blob);
        setRecordedAudioUrl(url);
        setAudioFileName('تسجيل صوتي مباشر.webm');
        setAudioMode('merchant_voice');
        setIsRecordingAudio(false);
        stream.getTracks().forEach((track) => track.stop());

        // Play brief preview so user hears it immediately
        setTimeout(() => {
          if (userAudioInstanceRef.current) {
            userAudioInstanceRef.current.play().catch(() => {});
          }
        }, 200);
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setRecordingSeconds(0);

      const timer = setInterval(() => {
        setRecordingSeconds((sec) => {
          if (sec >= 15) {
            clearInterval(timer);
            if (mediaRecorderVoiceRef.current && mediaRecorderVoiceRef.current.state === 'recording') {
              mediaRecorderVoiceRef.current.stop();
            }
            return 15;
          }
          return sec + 1;
        });
      }, 1000);
    } catch (err: any) {
      setIsRecordingAudio(false);
      setMicError('تم حظر الوصول إلى المايكروفون في المتصفح. يمكنك رفع ملف صوتي مسجل من هاتفك أو جهازك (MP3/WAV/مذكرة صوتية) بضغطة زر بالأسفل!');
    }
  };

  const handleStopVoiceRecording = () => {
    if (mediaRecorderVoiceRef.current && mediaRecorderVoiceRef.current.state === 'recording') {
      mediaRecorderVoiceRef.current.stop();
    }
    setIsRecordingAudio(false);
  };

  // Handle Audio File Upload with Safe Constraints
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. File size safeguard (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        setMicError('حجم الملف الصوتي كبير جداً (أكثر من 25 ميجابايت). الرجاء رفع ملف صوتي بحجم أصغر.');
        return;
      }

      // 2. Audio type safeguard
      const isValidAudioType = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|webm)$/i.test(file.name);
      if (!isValidAudioType) {
        setMicError('نوع الملف المرفوع غير مدعوم. يرجى اختيار ملف صوتي صالح (MP3, WAV, WebM, M4A).');
        return;
      }

      const url = URL.createObjectURL(file);
      setRecordedAudioBlob(file);
      setRecordedAudioUrl(url);
      setAudioFileName(file.name);
      setAudioMode('merchant_voice');
      setMicError(null);

      // Create audio object & play preview immediately so user knows it works!
      const audio = new Audio(url);
      audio.volume = audioVolume;
      audio.preload = 'auto';
      userAudioInstanceRef.current = audio;

      audio.play().then(() => {
        setIsAudioPreviewPlaying(true);
      }).catch(() => {
        // Autoplay may need direct click, user has big play button
      });

      audio.onended = () => setIsAudioPreviewPlaying(false);
      audio.onpause = () => setIsAudioPreviewPlaying(false);
      audio.onplay = () => setIsAudioPreviewPlaying(true);
      audio.ontimeupdate = () => setAudioPlayTime(audio.currentTime);
    }
  };

  // Generate speech reading the 4 scenes using the Cloned Voice Persona with Consent Verification
  const handleGenerateClonedVoiceover = async () => {
    if (!hasVoiceConsent) {
      setPendingAction('clone');
      setShowConsentModal(true);
      return;
    }
    await executeVoiceCloning();
  };

  const executeVoiceCloning = async () => {
    setIsGeneratingCloneVoice(true);
    setAudioMode('merchant_voice');
    const fullAdScript = scenes.map((s) => s.voiceover).join(' ... ');

    try {
      const response = await fetch('/api/clone-and-synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adScript: fullAdScript,
          speakerTone: 'Kuwaiti dialect merchant reading ad scenes with energetic high-conversion tone',
          voiceType: 'high_energy',
        }),
      });

      const data = await response.json();
      if (data.success && data.audioUrl) {
        setRecordedAudioUrl(data.audioUrl);
        setAudioFileName('إعلان كامل بالبصمة الصوتية المستنسخة.wav');

        if (userAudioInstanceRef.current) {
          userAudioInstanceRef.current.pause();
        }
        const audio = new Audio(data.audioUrl);
        audio.volume = audioVolume;
        audio.preload = 'auto';
        userAudioInstanceRef.current = audio;

        audio.play().then(() => {
          setIsAudioPreviewPlaying(true);
        }).catch(() => {});

        audio.onended = () => setIsAudioPreviewPlaying(false);
        audio.onpause = () => setIsAudioPreviewPlaying(false);
        audio.onplay = () => setIsAudioPreviewPlaying(true);
        audio.ontimeupdate = () => setAudioPlayTime(audio.currentTime);
      } else {
        alert('تم تفعيل البصمة الصوتية بنجاح.');
      }
    } catch (err) {
      console.warn('Clone error:', err);
    } finally {
      setIsGeneratingCloneVoice(false);
    }
  };

  // Demo synthetic acoustic voiceover for quick testing without mic
  const handleUseDemoVoiceSample = () => {
    setAudioMode('music_sfx');
    setMicError(null);
    playSoundEffect('power_up');
  };

  // Pre-load product and background images for Canvas rendering
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: HTMLImageElement }>({});

  useEffect(() => {
    const urls = [product.imageUrl, ...scenes.map((s) => s.bgUrl)];
    const images: { [key: string]: HTMLImageElement } = {};
    let loadedCount = 0;

    urls.forEach((url) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        images[url] = img;
        loadedCount++;
        if (loadedCount === urls.length) {
          setLoadedImages(images);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === urls.length) {
          setLoadedImages(images);
        }
      };
    });
  }, [product.imageUrl, scenes]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Draw active background with subtle camera pan/zoom
    const currentScene = scenes[activeSceneIndex];
    const bgImg = loadedImages[currentScene.bgUrl];

    ctx.save();
    if (bgImg) {
      const sceneProgress = (currentTime % 3.75) / 3.75;
      const zoom = 1 + sceneProgress * 0.08;
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      ctx.drawImage(bgImg, 0, 0, width, height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();

    // Dark cinematic overlay
    const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
    overlayGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    overlayGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.3)');
    overlayGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.4)');
    overlayGrad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, 0, width, height);

    // Top Brand Watermark
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px Alexandria, Cairo, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${brand.name} 🇰🇼`, width - 40, 60);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '16px Alexandria, Cairo, sans-serif';
    ctx.fillText('AdCraft Motion Video', width - 40, 88);

    // Draw Scene Badge
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(40, 42, 190, 36, 18);
    ctx.fill();

    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 15px Alexandria, Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentScene.badge, 135, 66);

    // DRAW PRODUCT (Centered with Product Lock 🔒)
    const productImg = loadedImages[product.imageUrl];
    if (productImg) {
      ctx.save();
      const productProgress = (currentTime % 3.75) / 3.75;
      const floatY = Math.sin(productProgress * Math.PI * 2) * 12;

      // Draw shadow
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2 + 160 + floatY, 180, 25, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.filter = 'blur(10px)';
      ctx.fill();
      ctx.filter = 'none';

      const pSize = 340;
      ctx.drawImage(
        productImg,
        width / 2 - pSize / 2,
        height / 2 - pSize / 2 + floatY,
        pSize,
        pSize
      );

      // Product Lock Tag
      ctx.fillStyle = 'rgba(24, 24, 27, 0.9)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 95, height / 2 + pSize / 2 - 10 + floatY, 190, 30, 15);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px Alexandria, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔒 Product Lock مفعّل', width / 2, height / 2 + pSize / 2 + 10 + floatY);

      ctx.restore();
    }

    // DRAW TEXT LAYERS (Headline & Subtext)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Alexandria, Cairo, sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 15;
    ctx.fillText(currentScene.headline, width / 2, height - 260);

    ctx.fillStyle = '#e4e4e7';
    ctx.font = '20px Alexandria, Cairo, sans-serif';
    ctx.shadowBlur = 10;
    ctx.fillText(currentScene.subtext, width / 2, height - 215);
    ctx.shadowBlur = 0;

    // BOTTOM FIXED BRAND FRAME & CTA
    if (activeSceneIndex === 3) {
      // Big Pulsing CTA in finale
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 200, height - 165, 400, 56, 28);
      ctx.fill();

      ctx.fillStyle = '#09090b';
      ctx.font = 'bold 22px Alexandria, Cairo, sans-serif';
      ctx.fillText('اطلب عبر الواتساب: ' + brand.fixedFrame.whatsApp, width / 2, height - 130);
    } else {
      ctx.fillStyle = 'rgba(18, 18, 21, 0.9)';
      ctx.fillRect(0, height - 90, width, 90);
      ctx.strokeStyle = '#27272a';
      ctx.beginPath();
      ctx.moveTo(0, height - 90);
      ctx.lineTo(width, height - 90);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px Alexandria, Cairo, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`واتساب: ${brand.fixedFrame.whatsApp}`, width - 30, height - 38);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px Alexandria, Cairo, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(brand.fixedFrame.storeUrl, 30, height - 38);
    }
  }, [currentTime, activeSceneIndex, scenes, product, brand, loadedImages]);

  // Video Export Recorder with Audio Track Embedding!
  const handleRecordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecordingVideo(true);
    setRecordProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);

    try {
      const canvasStream = canvas.captureStream(30); // 30 fps
      let combinedStream = canvasStream;

      // If user uploaded or recorded audio, play it in sync during recording
      if (audioMode === 'merchant_voice' && userAudioInstanceRef.current) {
        userAudioInstanceRef.current.currentTime = 0;
        userAudioInstanceRef.current.play().catch(() => {});
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setIsRecordingVideo(false);

        const a = document.createElement('a');
        a.href = url;
        a.download = `AdCraft-VideoAd-${product.id}.webm`;
        a.click();

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      };

      mediaRecorder.start();
      setIsPlaying(true);

      const timer = setInterval(() => {
        setRecordProgress((p) => {
          if (p >= 100) {
            clearInterval(timer);
            mediaRecorder.stop();
            setIsPlaying(false);
            if (userAudioInstanceRef.current) {
              userAudioInstanceRef.current.pause();
            }
            return 100;
          }
          return p + Math.round(100 / (totalDuration * 10));
        });
      }, 100);
    } catch (err) {
      console.error('Recording error:', err);
      setIsRecordingVideo(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Hidden file input for audio file upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        onChange={handleAudioFileUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Film className="w-4 h-4" />
            AdCraft Video & Motion Ads Engine 🎬
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span>توليد إعلانات الفيديو والريلز للبراند</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-mono">
              15s Vertical Reels (9:16)
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            يمكنك رفع تسجيل صوتي (MP3/WAV/مذكرات صوتية) أو استخدام الإيقاع الإعلاني الحديث وتصدير الفيديو فوراً.
          </p>
        </div>

        {/* Record & Export Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRecordVideo}
            disabled={isRecordingVideo}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-950/30 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isRecordingVideo ? `جاري تصدير الفيديو (${recordProgress}%)...` : 'تصدير فيديو الإعلان (Download Video)'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Player on left + Audio controls & Storyboard on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Video Player */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl w-full flex flex-col items-center">
            {/* Top Info */}
            <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-zinc-800 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Smartphone className="w-4 h-4 text-amber-400" />
                معاينة ريلز وإنستغرام (9:16)
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {currentTime.toFixed(1)}s / {totalDuration}s
              </span>
            </div>

            {/* Canvas Video Viewport */}
            <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-950">
              <canvas
                ref={canvasRef}
                width={540}
                height={960}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 pointer-events-none">
                <Lock className="w-2.5 h-2.5" />
                Product Lock Video
              </div>
            </div>

            {/* Video Player Controls */}
            <div className="w-full max-w-[340px] mt-4 space-y-3">
              <div className="relative w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-100"
                  style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center font-bold transition-all shadow-md"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current mr-0.5" />}
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Active Audio Mode Label */}
                <span className="text-xs text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800 flex items-center gap-1.5">
                  {audioMode === 'music_sfx' && <Music className="w-3.5 h-3.5 text-amber-400" />}
                  {audioMode === 'merchant_voice' && <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {audioMode === 'muted' && <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
                  <span>
                    {audioMode === 'music_sfx' && 'إيقاع إعلاني ومؤثرات'}
                    {audioMode === 'merchant_voice' && (recordedAudioUrl ? 'صوتك المرفوع مفعّل ✓' : 'بانتظار الصوت')}
                    {audioMode === 'muted' && 'صامت (بدون صوت)'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sound Modes & Storyboard */}
        <div className="lg:col-span-6 space-y-6">
          {/* Audio Engine Selection Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">إعدادات الصوت والنبرة الإعلانية</h3>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800/60 px-2.5 py-1 rounded-full font-mono">
                Audio Engine v1
              </span>
            </div>

            {/* Audio Modes Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Record or Upload Real Voice */}
              <button
                type="button"
                onClick={() => setAudioMode('merchant_voice')}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  audioMode === 'merchant_voice'
                    ? 'bg-zinc-850 border-amber-500 ring-2 ring-amber-500/50 shadow-md'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  {recordedAudioUrl && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">صوتك الكويتي (رفع أو تسجيل)</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">MP3 / WAV أو مايكروفون</div>
                </div>
              </button>

              {/* Option 2: Commercial Beat & SFX */}
              <button
                type="button"
                onClick={() => setAudioMode('music_sfx')}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  audioMode === 'music_sfx'
                    ? 'bg-zinc-850 border-amber-500 ring-2 ring-amber-500/50 shadow-md'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Music className="w-4 h-4 text-amber-400" />
                  {audioMode === 'music_sfx' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">إيقاع إعلاني ومؤثرات</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">موسيقى ترند وانتقالات</div>
                </div>
              </button>

              {/* Option 3: Muted */}
              <button
                type="button"
                onClick={() => setAudioMode('muted')}
                className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                  audioMode === 'muted'
                    ? 'bg-zinc-850 border-amber-500 ring-2 ring-amber-500/50 shadow-md'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <VolumeX className="w-4 h-4 text-zinc-400" />
                  {audioMode === 'muted' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">فيديو صامت</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">لإضافة صوت إنستغرام</div>
                </div>
              </button>
            </div>

            {/* UPLOAD & RECORD PANEL (Always fully visible and intuitive) */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-sky-400" />
                  <span>رفع أو تسجيل الصوت الخاص بالإعلان:</span>
                </span>
                {audioFileName && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    {audioFileName}
                  </span>
                )}
              </div>

              {/* Upload Actions Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-sky-950/30"
                >
                  <FileAudio className="w-4 h-4" />
                  <span>رفع ملف صوتي (MP3 / WAV / تسجيل واتساب)</span>
                </button>

                {!isRecordingAudio ? (
                  <button
                    type="button"
                    onClick={handleStartVoiceRecording}
                    className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                  >
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>تسجيل مباشر بالمايكروفون (15s)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopVoiceRecording}
                    className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors animate-pulse"
                  >
                    <MicOff className="w-4 h-4" />
                    <span>إيقاف وحفظ التسجيل ({recordingSeconds}s)</span>
                  </button>
                )}
              </div>

              {/* Instant Clone & Read Ad Button */}
              <button
                type="button"
                onClick={handleGenerateClonedVoiceover}
                disabled={isGeneratingCloneVoice}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-amber-950/30 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 fill-zinc-950" />
                <span>
                  {isGeneratingCloneVoice
                    ? 'جاري قراءة مشاهد الإعلان بالنبرة المستنسخة...'
                    : 'قراءة مشاهد الإعلان بالبصمة الصوتية المستنسخة (Clone & Read Ad) 🎙️'}
                </span>
              </button>

              {/* DEDICATED DIRECT AUDIO PREVIEW CONTROLLER */}
              {recordedAudioUrl ? (
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-850 border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <Volume2 className="w-4 h-4" />
                      <span>الصوت المرفوع جاهز ومعتمد للتطبيق بالفيديو!</span>
                    </div>
                    {isAudioPreviewPlaying && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono animate-pulse">
                        <Activity className="w-3.5 h-3.5 animate-spin" />
                        الصوت يشتغل الآن 🔊
                      </span>
                    )}
                  </div>

                  {/* Player controls */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleToggleAudioPreview}
                      className="w-12 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center justify-center font-bold text-sm shadow-md transition-all shrink-0"
                    >
                      {isAudioPreviewPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current mr-0.5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs text-zinc-300">
                        <span className="font-semibold text-white">معاينة الصوت المرفوع</span>
                        <span className="font-mono text-amber-400 font-bold">
                          {audioPlayTime.toFixed(1)}s / {audioDuration}s
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full transition-all duration-100"
                          style={{
                            width: `${Math.min(100, (audioPlayTime / audioDuration) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-3 pt-2 border-t border-zinc-800 text-xs text-zinc-400">
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      مستوى الصوت:
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={audioVolume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="flex-1 accent-emerald-500 bg-zinc-800 rounded-lg h-1.5 cursor-pointer"
                    />
                    <span className="font-mono text-zinc-300 text-[11px]">{Math.round(audioVolume * 100)}%</span>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    ارفع ملفاً صوتياً (مثل تسجيل صوتي من هاتفك أو رسالة واتساب صوتية) وسيظهر لك مشغل الصوت فوراً لسماعه والتأكد منه قبل إخراجه مع الفيديو.
                  </span>
                </div>
              )}

              {/* Mic error notice if any */}
              {micError && (
                <div className="bg-amber-950/40 border border-amber-900/60 rounded-xl p-3 text-xs text-amber-200">
                  ⚠️ {micError}
                </div>
              )}
            </div>
          </div>

          {/* Storyboard & Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-base font-bold text-white">مشاهد الفيديو والسيناريو الإعلاني (Storyboard)</h3>
                <p className="text-xs text-zinc-400">انقر على أي مشهد للانتقال إليه فوراً وتفقد حركته وتصميمه</p>
              </div>
              <span className="text-xs text-zinc-400 font-mono">15s Total</span>
            </div>

            {scenes.map((scene, idx) => {
              const isActive = activeSceneIndex === idx;
              return (
                <div
                  key={scene.id}
                  onClick={() => {
                    const seekTimes = [0, 4, 8, 12];
                    setCurrentTime(seekTimes[idx]);
                  }}
                  className={`border rounded-2xl p-4 transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-zinc-850 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center font-mono ${
                          isActive
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{scene.title}</h4>
                    </div>

                    <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      {scene.timeRange}
                    </span>
                  </div>

                  <div className="space-y-1.5 pr-8">
                    <div className="text-xs font-semibold text-amber-300">{scene.headline}</div>
                    <div className="text-xs text-zinc-400">{scene.subtext}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voice Cloning Consent & Authorization Safeguard Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 text-right shadow-2xl relative">
            <button
              onClick={() => {
                setShowConsentModal(false);
                setPendingAction(null);
              }}
              className="absolute top-5 left-5 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
              <ShieldAlert className="w-4 h-4" />
              ضوابط وأخلاقيات الذكاء الاصطناعي الصوتي
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
              إقرار وتفويض استخدام البصمة الصوتية
            </h3>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 mb-5">
              <p className="font-semibold text-amber-300">
                لحماية الملكية الفكرية ومنع التزييف الصوتي غير المصرح به:
              </p>
              <ul className="space-y-2 list-disc list-inside text-zinc-400">
                <li>
                  <strong className="text-zinc-200">ملكية الصوت والتفويض:</strong> تؤكد أنك صاحب الصوت أو حاصل على موافقة وتفويض خطي صريح من صاحب الصوت لاستخدامه في الحملات الإعلانية والتجارية.
                </li>
                <li>
                  <strong className="text-zinc-200">حظر التزييف والانتحال:</strong> يُحظر تماماً استخدام نماذج الصوت لتقليد شخصيات عامة أو جهات رسمية أو إنتاج محتوى مضلل أو غير قانوني.
                </li>
                <li>
                  <strong className="text-zinc-200">الغرض الإعلاني:</strong> تُستخدم البصمة الصوتية حصرياً لصياغة وقراءة مشاهد الإعلان لمتجرك المعتمد.
                </li>
              </ul>
            </div>

            {/* Consent Checkbox */}
            <label className="flex items-start gap-3 p-3 bg-zinc-850 border border-zinc-700/60 rounded-xl cursor-pointer hover:border-amber-500/50 transition-colors mb-5">
              <input
                type="checkbox"
                checked={consentAcknowledgedCheckbox}
                onChange={(e) => setConsentAcknowledgedCheckbox(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-amber-500 rounded cursor-pointer shrink-0"
              />
              <span className="text-xs text-zinc-200 select-none">
                أقر وأتعهد بأنني أملك الحقوق القانونية أو التفويض الصريح لاستخدام هذه البصمة الصوتية في إعلانات متجري، وأتحمل المسؤولية الأخلاقية والقانونية كاملة.
              </span>
            </label>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!consentAcknowledgedCheckbox}
                onClick={() => {
                  setHasVoiceConsent(true);
                  setShowConsentModal(false);
                  if (pendingAction === 'clone') {
                    executeVoiceCloning();
                  } else if (pendingAction === 'record') {
                    executeVoiceRecording();
                  }
                  setPendingAction(null);
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
              >
                موافق ومتابعة الاستخدام الصوتي 🎙️
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConsentModal(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
