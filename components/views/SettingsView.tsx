
import React from 'react';
import { 
  User, Key, Database, Moon, Sun, Download, Trash2, 
  Settings2, Star, Shield, Info, ExternalLink, RefreshCcw, CheckCircle, RefreshCw
} from 'lucide-react';
import { useApp } from '../../AppContext';
import { ExportService } from '../../services/ExportService';
import { db } from '../../infrastructure/DatabaseService';

interface SettingsViewProps {
  onNavigate: (view: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const { xp, currentRank, isDarkMode, toggleDarkMode } = useApp();

  const handleExport = async () => {
    await ExportService.exportToJSON();
  };

  const handleClearChat = async () => {
    if (confirm("هل أنت متأكد من مسح محادثات سامي؟")) {
      await db.messages.clear();
      alert("تم مسح السجل.");
    }
  };

  const handleResetAll = async () => {
    if (confirm("تحذير: سيتم مسح كل التقدم والنقاط. هل تريد الاستمرار؟")) {
      localStorage.clear();
      await db.delete();
      window.location.reload();
    }
  };

  const handleOpenKey = async () => {
    if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      alert("تم تحديث إعدادات المفتاح.");
    } else {
      alert("هذه الخاصية متاحة فقط في بيئة AI Studio.");
    }
  };

  const triggerHaptic = () => 'vibrate' in navigator && navigator.vibrate(10);

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-32">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black dark:text-white">Settings</h2>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">تحكم في هويتك ومفاتيحك.</p>
        </div>
        <Settings2 className="w-10 h-10 text-gray-200 dark:text-zinc-800" />
      </header>

      {/* Manual Key Slot Display */}
      <section className="bg-white dark:bg-zinc-900 p-8 rounded-[3.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Key className="w-32 h-32 rotate-45" />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-brand-orange rounded-2xl">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black dark:text-white">إدارة المفتاح يدوياً</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Manual API Configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-500 bg-green-50 dark:bg-green-900/10 px-4 py-2 rounded-full text-[10px] font-black">
            <CheckCircle className="w-3 h-3" />
            CONNECTED
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <label className="text-sm font-black text-gray-500 dark:text-zinc-400 block px-2">
            مفتاح الـ API الحالي (AIzaSy...):
          </label>
          <div 
            onClick={handleOpenKey}
            className="w-full flex items-center gap-4 p-6 bg-gray-50 dark:bg-zinc-800/50 border-2 border-brand-orange/20 rounded-[2.5rem] cursor-pointer hover:border-brand-orange transition-all group"
          >
            <div className="flex-1 overflow-hidden">
               <code className="text-brand-orange font-black text-lg block truncate opacity-40 select-none">
                 ••••••••••••••••••••••••••••••••••••
               </code>
               <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">انقر هنا لتغيير أو وضع مفتاحك الخاص بيدك</p>
            </div>
            <div className="p-4 bg-zinc-900 dark:bg-brand-orange text-white rounded-2xl shadow-lg group-hover:rotate-12 transition-transform">
              <RefreshCw className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 relative z-10">
           <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noreferrer"
            className="text-xs text-gray-400 font-bold flex items-center gap-1 hover:text-brand-orange transition-colors"
          >
            <Shield className="w-3 h-3" /> شروط الاستخدام والفوترة <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-2xl">
              {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </div>
            <h4 className="text-xl font-black dark:text-white">السمة</h4>
          </div>
          <button 
            onClick={() => { toggleDarkMode(); triggerHaptic(); }}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl font-bold dark:text-zinc-200"
          >
            <span>{isDarkMode ? 'الوضع الليلي' : 'الوضع النهاري'}</span>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-brand-orange' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
            </div>
          </button>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black dark:text-white">البيانات</h4>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleExport}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl font-bold dark:text-zinc-200"
            >
              <span>تصدير نسخة احتياطية</span>
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={handleClearChat}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl font-bold text-orange-500"
            >
              <span>مسح سجل الدردشة</span>
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[2.5rem] border border-red-100 dark:border-red-900/20 md:col-span-2 space-y-4 text-center">
          <h4 className="text-xl font-black text-red-600">منطقة الخطر</h4>
          <p className="text-sm text-red-500/70 font-medium">سيؤدي هذا الخيار لمسح جميع النقاط والتقدم يدوياً.</p>
          <button 
            onClick={handleResetAll}
            className="inline-flex items-center gap-2 text-red-600 font-black hover:bg-red-100 dark:hover:bg-red-900/20 px-8 py-3 rounded-xl transition-colors"
          >
            <Trash2 className="w-5 h-5" /> إعادة ضبط المصنع
          </button>
        </div>
      </div>
    </div>
  );
};
