
import React from 'react';
import { Star, ChevronRight, Volume2, Loader2 } from 'lucide-react';
import { RANKS } from '../../domain/ProgressionService';
import { UserRank } from '../../types';
import { STATIC_PHRASE_LIBRARY } from '../../constants';

interface LevelsViewProps {
  currentRank: UserRank;
  onNavigate: (view: any) => void;
  onSelectLevel: (level: number) => void;
  onPlayAudio?: (text: string, id: string) => void;
  audioLoadingId?: string | null;
}

export const LevelsView: React.FC<LevelsViewProps> = ({ 
  currentRank, 
  onNavigate, 
  onSelectLevel,
  onPlayAudio,
  audioLoadingId
}) => {
  const getFirstTenPhrases = (level: number) => {
    return STATIC_PHRASE_LIBRARY
      .filter(p => p.level === level)
      .slice(0, 10);
  };

  return (
    <div className="space-y-12 animate-fade-in pb-32">
      <header className="text-left space-y-2">
        <h2 className="text-4xl font-black dark:text-white">Learning Path</h2>
        <p className="text-gray-500 dark:text-zinc-400 font-medium">Progress through 6 levels of Jordanian Ammiya.</p>
      </header>

      <div className="space-y-16">
        {RANKS.map((rank) => {
          const starterPhrases = getFirstTenPhrases(rank.level);
          const isCurrent = currentRank.level === rank.level;

          return (
            <section key={rank.level} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2 border-b-2 border-gray-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${rank.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    {rank.level === 1 ? <Star className="w-6 h-6 fill-current" /> : <span className="text-xl font-black">{rank.level}</span>}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black dark:text-white flex items-center gap-3">
                      {rank.label}
                    </h3>
                  </div>
                </div>
                
                <button 
                  onClick={() => { onSelectLevel(rank.level); onNavigate('level_detail'); }}
                  className="flex items-center gap-2 text-xs font-black text-brand-orange hover:gap-3 transition-all group"
                >
                  VIEW ALL PHRASES
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
                {starterPhrases.map((phrase) => (
                  <div 
                    key={phrase.id} 
                    className={`flex-shrink-0 w-64 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border ${isCurrent ? 'border-brand-orange/30' : 'border-gray-100 dark:border-zinc-800'} space-y-4 hover:shadow-md transition-all`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-black uppercase text-brand-orange bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                        {phrase.category}
                      </span>
                      <button 
                        onClick={() => onPlayAudio?.(phrase.arabic, phrase.id)}
                        disabled={audioLoadingId === phrase.id}
                        className="p-2 bg-orange-50 dark:bg-orange-900/20 text-brand-orange rounded-xl"
                      >
                        {audioLoadingId === phrase.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-right arabic-font dark:text-white" dir="rtl">{phrase.arabic}</p>
                      <p className="text-sm font-black dark:text-zinc-200 truncate">{phrase.transliteration}</p>
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">{phrase.english}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
