
import React from 'react';
import { Key, ShieldCheck, ExternalLink, Sparkles, Lock, ArrowRight, Fingerprint } from 'lucide-react';

interface ApiKeyGateProps {
  onKeySelected: () => void;
}

export const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onKeySelected }) => {
  const handleConnect = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
      // فتح نافذة Google الرسمية لوضع المفتاح يدوياً
      await (window as any).aistudio.openSelectKey();
      onKeySelected();
    } else {
      alert("خاصية اختيار المفتاح متاحة فقط داخل بيئة AI Studio.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-zinc-950 flex items-center justify-center p-6 font-['Inter']">
      <div className="max-w-xl w-full bg-white dark:bg-zinc-900 rounded-[3.5rem] shadow-2xl p-10 md:p-16 border border-gray-100 dark:border-zinc-800 text-center space-y-10 animate-fade-in relative overflow-hidden">
        
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>

        <div className="space-y-4 relative z-10">
          <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-[2rem] flex items-center justify-center mx-auto text-brand-orange shadow-inner border border-orange-100/50">
            <Fingerprint className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black dark:text-white leading-tight">
            ربط المفتاح <br />
            <span className="text-brand-orange text-3xl">يدوياً</span>
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium px-4 leading-relaxed">
            لتفعيل المعلم "سامي" وضمان استقرار الخدمة، يرجى وضع مفتاح الـ API الخاص بك (AIzaSy...).
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <button 
            onClick={handleConnect}
            className="group w-full bg-zinc-900 dark:bg-brand-orange text-white p-8 rounded-[2.5rem] font-black text-xl flex flex-col items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-orange-500/20"
          >
            <div className="flex items-center gap-3">
              <Key className="w-8 h-8 group-hover:rotate-45 transition-transform duration-500" />
              <span>اضغط لوضع مفتاحك</span>
            </div>
            <span className="text-xs opacity-60 font-medium">سيتم فتح نافذة Google الآمنة للصق المفتاح</span>
          </button>
          
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 dark:bg-zinc-800/50 py-3 px-6 rounded-full inline-flex mx-auto border border-gray-100 dark:border-zinc-800">
            <Lock className="w-4 h-4 text-green-500" />
            <span>مفتاحك مشفر ومحمي تماماً</span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50 dark:border-zinc-800 flex flex-col items-center gap-3 relative z-10">
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-brand-orange hover:underline font-black text-sm"
          >
            كيف أحصل على مفتاح مجاني؟ <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
