
import React from 'react';
import { ChevronLeft, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { Phrase, UserRank } from '../../types';
import { PhraseCard } from '../shared/PhraseCard';

interface LevelPhrasesViewProps {
  level: number;
  rank: UserRank;
  phrases: Phrase[];
  totalInLevel: number;
  onBack: () => void;
  onPlayAudio: (text: string, id: string) => void;
  onToggleFavorite: (id: string, status: boolean) => void;
  onDiscover: () => void;
  isGenerating: boolean;
  audioLoadingId: string | null;
}

export const LevelPhrasesView: React.FC<LevelPhrasesViewProps> = ({ 
  level, rank, phrases, totalInLevel, onBack, onPlayAudio, onToggleFavorite, onDiscover, isGenerating, audioLoadingId 
}) => {
  const hasMore = totalInLevel > phrases.length;

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:scale-105 transition-all text-gray-500">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black dark:text-white">{rank.label} Phrases</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phrases.map(p => (
          <PhraseCard 
            key={p.id}
            phrase={p} 
            onPlay={onPlayAudio} 
            onToggleFavorite={onToggleFavorite}
            isLoading={audioLoadingId === p.id} 
          />
        ))}
      </div>

      {hasMore && (
        <div className="py-12 flex justify-center">
           <button 
             onClick={onDiscover} 
             disabled={isGenerating} 
             className="flex flex-col items-center bg-zinc-900 text-white px-12 py-6 rounded-[2.5rem] font-black shadow-2xl hover:scale-105 transition-all border-2 border-brand-orange haptic-feedback"
           >
              <div className="flex items-center gap-2 text-sm uppercase tracking-tighter">
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-6 h-6 text-brand-orange fill-brand-orange" />}
                Unlock 10 More Phrases
              </div>
           </button>
        </div>
      )}
    </div>
  );
};
