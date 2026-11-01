import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  MessageCircle, 
  Bot, 
  User, 
  ArrowRight, 
  RotateCcw, 
  CheckCheck, 
  Sparkles,
  Bold,
  List,
  Link as LinkIcon,
  Trash2,
  HardDrive
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface ChatAppProps {
  onSwitchToAdCraft?: () => void;
}

const STORAGE_KEY = 'chat_messages_history_v1';
const STARTED_KEY = 'chat_is_started_v1';

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: '1',
  sender: 'bot',
  text: `مرحباً بك في **تطبيق الدردشة**! أصبح التطبيق يدعم الآن حفظ المحادثات في **التخزين المحلي (localStorage)** وتنسيقات **Markdown**:

- **حفظ تلقائي وفوري**: يتم حفظ كافة رسائلك في ذاكرة المتصفح المحلية لتظهر عند تحديث الصفحة أو العودة للتطبيق.
- **نصوص عريضة (Bold)**: \`**نص عريض**\` لإبراز الكلمات الهامة.
- **قوائم نقطية ومرقمة (Lists)**: لتنسيق الأفكار وتعداد البنود.
- **روابط تفاعلية (Links)**: مثل [بوابة الذكاء الاصطناعي](https://ai.google.dev).

يمكنك تجربة كتابة أي رسالة، وستبقى محفوظة حتى بعد إعادة فتح المتصفح!`,
  timestamp: new Date().toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' }),
};

export const ChatApp: React.FC<ChatAppProps> = ({ onSwitchToAdCraft }) => {
  // Load saved state from localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading chat history from localStorage:', err);
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [isStarted, setIsStarted] = useState<boolean>(() => {
    try {
      const savedStarted = localStorage.getItem(STARTED_KEY);
      if (savedStarted === 'true') {
        return true;
      }
    } catch {
      // fallback
    }
    return false;
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.error('Error persisting chat to localStorage:', err);
    }
  }, [messages]);

  // Sync isStarted state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STARTED_KEY, String(isStarted));
    } catch {
      // fallback
    }
  }, [isStarted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isStarted) {
      scrollToBottom();
    }
  }, [messages, isTyping, isStarted]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userTime = new Date().toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: userTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate receiving an automatic reply
    setTimeout(() => {
      const botResponses = [
        `أهلاً بك! تم استلام رسالتك **بنجاح**:
- **المرسل**: أنت
- **النص المستلم**: "${trimmed}"
- **الحالة**: تم التحقق والعرض الفوري

يمكنك زيارة [بوابة الذكاء الاصطناعي](https://ai.google.dev) للاطلاع على أحدث الميزات.`,
        `شكراً لتواصلك معنا! يسعدنا إخبارك أن الرسائل تدعم تنسيق **Markdown**:
1. **نصوص عريضة**: \`**نص**\`
2. **قوائم مرقمة ونقطية**: \`- عنصر\` أو \`1. عنصر\`
3. **روابط ويب قابلة للنقر**: [رابط تجريبي](https://www.google.com)`,
        `رسالة رائعة! تم تسجيل استفسارك وسنوافيك بالرد فوراً.
- **الجهوزية**: 100%
- **مستوى الاستجابة**: فوري ومباشر
- زر [مركز المساعدة](https://ai.google.dev) لمزيد من التفاصيل.`,
      ];

      // Custom greeting responses
      let replyText = botResponses[Math.floor(Math.random() * botResponses.length)];
      if (trimmed.includes('مرحبا') || trimmed.includes('سلام') || trimmed.includes('هلا')) {
        replyText = `أهلاً وسهلاً بك! **نورت الدردشة**، كيف يمكننا مساعدتك اليوم؟
- استفسارات عامة
- تجربة نصوص الماركداون والروابط
- تواصل مباشر وسريع`;
      } else if (trimmed.includes('شكرا') || trimmed.includes('يعطيك')) {
        replyText = '**العفو!** دائماً في خدمتك، ويسعدنا تواصلك في أي وقت عبر [تطبيق الدردشة](https://ai.google.dev).';
      }

      const botTime = new Date().toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' });
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: botTime,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleClearHistory = () => {
    if (messages.length <= 1) return;
    const confirmed = window.confirm('هل تريد مسح سجل المحادثة المحفوظ في التخزين المحلي (localStorage)؟');
    if (!confirmed) return;

    const resetMsg = [DEFAULT_WELCOME_MESSAGE];
    setMessages(resetMsg);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2500);
    } catch (err) {
      console.error('Error clearing localStorage:', err);
    }
  };

  // 1. Initial screen: Main title 'تطبيق الدردشة' and one button 'ابدأ'
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#080C16] via-[#0D1424] to-[#080C16] text-white flex flex-col justify-between items-center p-6 text-center select-none" dir="rtl">
        {/* Top bar with optional switch */}
        <div className="w-full max-w-xl flex justify-between items-center py-2">
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold">
            <MessageCircle className="w-4 h-4" />
            <span>نظام المحادثة الفورية</span>
          </div>
          {onSwitchToAdCraft && (
            <button
              onClick={onSwitchToAdCraft}
              className="text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              استوديو AdCraft AI 🚀
            </button>
          )}
        </div>

        {/* Hero Card */}
        <div className="my-auto max-w-md w-full bg-[#0D1424]/90 border border-[#1E2B4A] rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-violet-500/25">
            <MessageCircle className="w-10 h-10" />
          </div>

          {/* Main Title: Exact required text 'تطبيق الدردشة' */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            تطبيق الدردشة
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed mb-4">
            منصة تواصل تفاعلية فورية لإرسال واستقبال الرسائل بكل سهولة وسرعة.
          </p>

          {/* LocalStorage persistence badge if previous chat exists */}
          {messages.length > 1 && (
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/70 border border-violet-800/60 text-xs text-violet-300">
              <HardDrive className="w-3.5 h-3.5 text-violet-400" />
              <span>يوجد سجل محادثة سابق محفوظ ({messages.length} رسائل)</span>
            </div>
          )}

          {/* Single primary button: Exact required text 'ابدأ' */}
          <button
            onClick={() => setIsStarted(true)}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] text-white font-bold text-lg py-3.5 px-6 rounded-2xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ابدأ</span>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* Footer */}
        <div className="text-xs text-zinc-500 pt-4 flex items-center justify-center gap-2">
          <span>تطبيق الدردشة</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1 text-zinc-400">
            <HardDrive className="w-3 h-3 text-violet-400" />
            حفظ تلقائي في التخزين المحلي (localStorage)
          </span>
        </div>
      </div>
    );
  }

  // 2. Chat screen: Messages area, text input field, send button
  return (
    <div className="min-h-screen bg-[#080C16] text-zinc-100 flex flex-col" dir="rtl">
      {/* Toast Notification when history is cleared */}
      {showSavedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/90 border border-emerald-700/80 text-emerald-200 text-xs font-medium px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>تم مسح سجل المحادثات من التخزين المحلي بنجاح</span>
        </div>
      )}

      {/* Header with Title 'تطبيق الدردشة' */}
      <header className="border-b border-[#1E2B4A] bg-[#0D1424]/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-600/25">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">
                تطبيق الدردشة
              </h1>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  متصل الآن
                </span>
                <span className="text-zinc-600">&bull;</span>
                <span className="flex items-center gap-1 text-violet-300/80">
                  <HardDrive className="w-3 h-3 text-violet-400" />
                  محفوظ محلياً
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              disabled={messages.length <= 1}
              className="text-xs text-rose-400 hover:text-rose-300 disabled:opacity-40 disabled:hover:text-rose-400 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              title="مسح سجل المحادثة من التخزين المحلي"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">مسح السجل</span>
            </button>

            <button
              onClick={() => setIsStarted(false)}
              className="text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              title="العودة لشاشة البداية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>شاشة البداية</span>
            </button>

            {onSwitchToAdCraft && (
              <button
                onClick={onSwitchToAdCraft}
                className="text-xs text-violet-300 hover:text-white bg-violet-950/60 border border-violet-800/60 px-3 py-1.5 rounded-lg transition-colors"
              >
                AdCraft AI 🚀
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Messages Area (منطقة لعرض الرسائل المتبادلة) */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {/* Welcome Announcement */}
          <div className="bg-[#0D1424]/60 border border-[#1E2B4A]/60 rounded-2xl p-3 text-center text-xs text-zinc-400 max-w-sm mx-auto shadow-sm">
            <div className="flex items-center justify-center gap-1.5 text-violet-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>محادثة محفوظة في التخزين المحلي</span>
            </div>
            <span>رسائلك محفوظة تلقائياً في المتصفح وستظهر دائماً عند التحديث أو إعادة الفتح.</span>
          </div>

          {/* Exchanged Messages List */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-violet-600 text-white'
                      : 'bg-zinc-800 border border-zinc-700 text-indigo-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble with ReactMarkdown */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-xs'
                      : 'bg-[#131E35] border border-[#1E2B4A] text-zinc-100 rounded-bl-xs'
                  }`}
                >
                  <div className="break-words">
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="mb-1.5 last:mb-0 leading-relaxed" {...props} />,
                        strong: ({ node, ...props }) => (
                          <strong className={isUser ? 'font-bold text-amber-200' : 'font-bold text-amber-400'} {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc list-inside space-y-1 my-1.5 pr-1" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal list-inside space-y-1 my-1.5 pr-1" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="leading-snug" {...props} />
                        ),
                        a: ({ node, ...props }) => (
                          <a
                            className={`underline font-semibold hover:opacity-85 transition-opacity ${
                              isUser ? 'text-amber-200' : 'text-cyan-300'
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        ),
                        code: ({ node, className, children, ...props }) => (
                          <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono text-amber-300" {...props}>
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-1 text-[10px] ${
                      isUser ? 'text-violet-200 justify-end' : 'text-zinc-400 justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-violet-200" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-end gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-indigo-400 text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#131E35] border border-[#1E2B4A] px-4 py-2.5 rounded-2xl rounded-bl-xs text-xs text-zinc-400 flex items-center gap-1.5">
                <span>جاري كتابة الرد</span>
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar: Quick formatting shortcuts, Input field and Send message button */}
        <div className="pt-2 pb-2 sticky bottom-0 bg-[#080C16]">
          {/* Markdown Quick Formatting Toolbar */}
          <div className="flex items-center gap-1.5 mb-1.5 px-1 text-xs">
            <span className="text-[11px] text-zinc-500 ml-1">تنسيق Markdown:</span>
            <button
              type="button"
              onClick={() => setInputText((prev) => `${prev} **نص عريض** `)}
              className="flex items-center gap-1 bg-[#0D1424] hover:bg-[#131E35] border border-[#1E2B4A] hover:border-violet-500/50 text-zinc-300 px-2 py-1 rounded-lg transition-colors cursor-pointer text-xs"
              title="إدراج نص عريض (Bold)"
            >
              <Bold className="w-3 h-3 text-amber-400" />
              <span>غامق</span>
            </button>
            <button
              type="button"
              onClick={() => setInputText((prev) => `${prev}\n- عنصر في القائمة`)}
              className="flex items-center gap-1 bg-[#0D1424] hover:bg-[#131E35] border border-[#1E2B4A] hover:border-violet-500/50 text-zinc-300 px-2 py-1 rounded-lg transition-colors cursor-pointer text-xs"
              title="إدراج قائمة نقطية (List)"
            >
              <List className="w-3 h-3 text-emerald-400" />
              <span>قائمة</span>
            </button>
            <button
              type="button"
              onClick={() => setInputText((prev) => `${prev} [اسم الرابط](https://example.com) `)}
              className="flex items-center gap-1 bg-[#0D1424] hover:bg-[#131E35] border border-[#1E2B4A] hover:border-violet-500/50 text-zinc-300 px-2 py-1 rounded-lg transition-colors cursor-pointer text-xs"
              title="إدراج رابط تشعبي (Link)"
            >
              <LinkIcon className="w-3 h-3 text-cyan-400" />
              <span>رابط</span>
            </button>
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 bg-[#0D1424] border border-[#1E2B4A] rounded-2xl p-2 shadow-lg focus-within:border-violet-500/80 transition-colors"
          >
            {/* Input Text Field (حقل لإدخال النص) */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك هنا... (يدعم **غامق**، - قوائم، [روابط](url))"
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none"
              autoFocus
            />

            {/* Send Button (زر لإرسال الرسالة) */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-violet-600/30 flex items-center gap-1.5 cursor-pointer shrink-0"
              title="إرسال الرسالة"
            >
              <span>إرسال</span>
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
