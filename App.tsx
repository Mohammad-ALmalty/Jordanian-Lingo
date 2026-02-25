
import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, Zap, Moon, Sun, Home as HomeIcon, Heart, MessageSquare, 
  Loader2, Star, Volume2, LayoutGrid, Send, AlertTriangle, Settings as SettingsIcon, X
} from 'lucide-react';
import { ViewState, Phrase } from './types';
import { aiService } from './services/AiService';
import { audioService } from './services/audioService';
import { useApp } from './AppContext';
import { useGemini } from './hooks/useGemini';
import { useDiscovery } from './hooks/useDiscovery';
import { HomeView } from './components/views/HomeView';
import { LevelsView } from './components/views/LevelsView';
import { FavoritesView } from './components/views/FavoritesView';
import { LevelPhrasesView } from './components/views/LevelPhrasesView';
import { SettingsView } from './components/views/SettingsView';
import { phraseRepository } from './infrastructure/PhraseRepository';
import { RANKS } from './domain/ProgressionService';

const App: React.FC = () => {
  const { xp, addXp, isDarkMode, toggleDarkMode, currentRank, isLoading } = useApp();
  const { messages, sendMessage, isTyping, error, clearError } = useGemini();
  const [view, setView] = useState<ViewState>('home');
  const [userInput, setUserInput] = useState('');
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Phrase[]>([]);
  const [levelPhrases, setLevelPhrases] = useState<Phrase[]>([]);
  const [selectedLevel, setInternalSelectedLevel] = useState(1);
  const [totalInLevel, setTotalInLevel] = useState(0);

  const loadInitialData = useCallback(async () => {
    const favs = await phraseRepository.getFavorites();
    setFavorites(favs);
  }, []);

  const loadLevelData = useCallback(async (level: number) => {
    const phrases = await phraseRepository.getUnlockedPhrasesByLevel(level);
    const total = await phraseRepository.countTotalInLevel(level);
    setLevelPhrases(phrases);
    setTotalInLevel(total);
  }, []);

  useEffect(() => {
    if (!isLoading) loadInitialData();
  }, [isLoading, loadInitialData]);

  useEffect(() => {
    if (view === 'level_detail') loadLevelData(selectedLevel);
    if (view === 'favorites') loadInitialData();
  }, [view, selectedLevel, loadLevelData, loadInitialData]);

  const { isGenerating, discoveredPhrases, discover, reset } = useDiscovery(selectedLevel, addXp);

  const handlePlayAudio = useCallback(async (text: string, id: string) => {
    setAudioLoadingId(id);
    const audioData = await aiService.generateSpeech(text);
    if (audioData) {
      await audioService.play(audioData);
      addXp(2);
    }
    setAudioLoadingId(null);
  }, [addXp]);

  const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
    triggerHaptic();
    await phraseRepository.toggleFavorite(id, !currentStatus);
    await loadInitialData();
    if (view === 'level_detail') await loadLevelData(selectedLevel);
    if (!currentStatus) addXp(5);
  };

  const onHandleDiscover = async () => {
    const success = await discover();
    if (success) setView('discovery');
    else alert("No more phrases available.");
  };

  const onHandleCollect = async () => {
    const idsToUnlock = discoveredPhrases.map(p => p.id);
    await phraseRepository.unlockPhrases(idsToUnlock);
    await loadLevelData(selectedLevel);
    reset();
    setView('level_detail');
  };

  const triggerHaptic = () => 'vibrate' in navigator && navigator.vibrate(10);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7] dark:bg-zinc-950">
        <Loader2 className="w-12 h-12 animate-spin text-[#e2725b]" />
      </div>
    );
  }

  const renderContent = () => {
    switch(view) {
      case 'home':
        return <HomeView currentRank={currentRank} favoritesCount={favorites.length} onNavigate={setView} />;
      case 'levels':
        return <LevelsView currentRank={currentRank} onNavigate={setView} onSelectLevel={(l) => { setInternalSelectedLevel(l); triggerHaptic(); }} onPlayAudio={handlePlayAudio} audioLoadingId={audioLoadingId} />;
      case 'level_detail':
        const rank = RANKS.find(r => r.level === selectedLevel)!;
        return <LevelPhrasesView level={selectedLevel} rank={rank} phrases={levelPhrases} totalInLevel={totalInLevel} onBack={() => setView('levels')} onPlayAudio={handlePlayAudio} onToggleFavorite={handleToggleFavorite} onDiscover={onHandleDiscover} isGenerating={isGenerating} audioLoadingId={audioLoadingId} />;
      case 'favorites':
        return <FavoritesView favorites={favorites} onPlayAudio={handlePlayAudio} onToggleFavorite={handleToggleFavorite} audioLoadingId={audioLoadingId} />;
      case 'settings':
        return <SettingsView onNavigate={setView} />;
      case 'discovery':
        return (
          <div className="max-w-4xl mx-auto space-y-10 py-10 animate-fade-in px-4 text-center">
             <h2 className="text-4xl font-black dark:text-white">كلمات جديدة!</h2>
             <div className="grid gap-4">
                {discoveredPhrases.map((phrase) => (
                   <div key={phrase.id} className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-md border-l-8 border-brand-orange flex justify-between items-center gap-4">
                      <div className="text-left">
                         <h4 className="text-xl font-black dark:text-white">{phrase.transliteration}</h4>
                         <p className="text-xs text-gray-400">{phrase.english}</p>
                      </div>
                      <p className="text-3xl font-black arabic-font dark:text-zinc-100" dir="rtl">{phrase.arabic}</p>
                   </div>
                ))}
             </div>
             <button onClick={onHandleCollect} className="bg-brand-orange text-white px-12 py-5 rounded-[2.5rem] font-black text-lg shadow-xl hover:scale-105 transition-all">
                أضف لرحلتي
             </button>
          </div>
        );
      case 'tutor':
        return (
          <div className="max-w-5xl mx-auto h-[75vh] flex flex-col bg-white dark:bg-zinc-900 rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">
             <div className={`p-8 ${currentRank.color} text-white flex items-center justify-between`}>
               <div className="flex items-center gap-5">
                 <Star className="w-8 h-8 fill-current" />
                 <h3 className="font-black text-2xl">المعلم الذكي</h3>
               </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50 dark:bg-zinc-950 no-scrollbar relative">
               {messages.length === 0 && !error && (
                 <div className="text-center py-20 space-y-4 opacity-30">
                   <MessageSquare className="w-16 h-16 mx-auto" />
                   <p className="font-bold">ابدأ المحادثة مع المعلم الذكي الآن</p>
                 </div>
               )}

               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                   <div className={`max-w-[85%] px-8 py-6 rounded-[2.5rem] shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-zinc-800 text-white rounded-tr-none' : 'bg-white dark:bg-zinc-900 dark:text-zinc-100 rounded-tl-none border border-gray-100 dark:border-zinc-800'}`}>
                     <p className="text-[17px] font-medium arabic-font leading-relaxed">{msg.text}</p>
                   </div>
                 </div>
               ))}

               {isTyping && (
                 <div className="flex justify-start">
                   <div className="bg-white dark:bg-zinc-900 px-6 py-4 rounded-[2rem] rounded-tl-none flex items-center gap-2 shadow-sm">
                     <Loader2 className="w-5 h-5 animate-spin text-brand-orange" />
                     <span className="text-xs font-bold text-gray-400">المعلم يفكر...</span>
                   </div>
                 </div>
               )}

               {error && (
                 <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/50 p-8 rounded-[2.5rem] space-y-6 animate-fade-in relative overflow-hidden shadow-xl shadow-red-500/5">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                     <AlertTriangle className="w-24 h-24 text-red-600" />
                   </div>
                   
                   <div className="flex items-center gap-3 text-red-600 dark:text-red-400 relative z-10">
                     <AlertTriangle className="w-8 h-8 shrink-0" />
                     <h4 className="font-black text-xl">حدث خطأ في الاتصال</h4>
                   </div>
                   
                   <div className="space-y-4 relative z-10">
                     <p className="text-gray-700 dark:text-zinc-300 font-bold leading-relaxed">
                       حدث خطأ أثناء محاولة الاتصال بالمعلم. يرجى التأكد من اتصالك بالإنترنت أو المحاولة مرة أخرى لاحقاً.
                     </p>
                     
                     <div className="flex flex-col sm:flex-row gap-4">
                       <button 
                         onClick={clearError} 
                         className="flex-1 bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                       >
                         إغلاق
                       </button>
                     </div>
                   </div>
                 </div>
               )}
             </div>

             <div className="p-8 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
               <input 
                 type="text" 
                 value={userInput} 
                 onChange={(e) => setUserInput(e.target.value)} 
                 onKeyDown={(e) => e.key === 'Enter' && userInput.trim() && !isTyping && !error && (sendMessage(userInput), setUserInput(''))} 
                 placeholder={error ? "حدث خطأ في الاتصال..." : "دردش مع المعلم بالعامية..."}
                 disabled={!!error || isTyping} 
                 className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] px-8 py-5 outline-none font-bold text-gray-700 dark:text-zinc-200 disabled:opacity-50" 
               />
               <button 
                 onClick={() => { sendMessage(userInput); setUserInput(''); triggerHaptic(); }} 
                 disabled={!!error || isTyping || !userInput.trim()} 
                 className={`p-5 ${currentRank.color} text-white rounded-[2rem] shadow-xl hover:scale-105 transition-all disabled:opacity-50`}
               >
                 <Send className="w-7 h-7" />
               </button>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfaf7] dark:bg-zinc-950 transition-colors duration-300">
      {view !== 'discovery' && (
        <header className="sticky top-0 z-50 bg-[#e2725b] text-white shadow-xl px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer haptic-feedback" onClick={() => setView('home')}>
              <MapPin className="w-6 h-6" />
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter">Jordanian Lingo</h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center h-10 gap-1.5 bg-white/20 px-3 py-1.5 rounded-2xl text-[10px] font-black">
                 <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                 <span>{xp} XP</span>
               </div>
               <button onClick={toggleDarkMode} className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                 {isDarkMode ? <Moon className="w-4 h-4 fill-current" /> : <Sun className="w-4 h-4" />}
               </button>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">{renderContent()}</main>
      {view !== 'discovery' && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border-t border-gray-100 dark:border-zinc-800 flex justify-around p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          {[
            {Icon: HomeIcon, id: 'home', label: 'الرئيسية'}, 
            {Icon: LayoutGrid, id: 'levels', label: 'المستويات'}, 
            {Icon: Heart, id: 'favorites', label: 'المفضلة'}, 
            {Icon: MessageSquare, id: 'tutor', label: 'المعلم'},
            {Icon: SettingsIcon, id: 'settings', label: 'الإعدادات'}
          ].map(item => (
            <button key={item.id} onClick={() => { setView(item.id as ViewState); triggerHaptic(); }} className={`flex flex-col items-center gap-2 transition-all ${view === item.id ? 'text-[#e2725b] scale-110' : 'text-gray-400'}`}>
              <item.Icon className={`w-6 h-6 ${item.id === 'favorites' && view === 'favorites' ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default App;
