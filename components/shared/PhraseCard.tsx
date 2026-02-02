
import React, { memo } from 'react';
import { Volume2, Loader2, Heart } from 'lucide-react';
import { Phrase } from '../../types';

interface PhraseCardProps {
  phrase: Phrase;
  onPlay: (text: string, id: string) => void;
  onToggleFavorite?: (id: string, currentStatus: boolean) => void;
  isLoading: boolean;
}

export const PhraseCard = memo(({ phrase, onPlay, onToggleFavorite, isLoading }: PhraseCardProps) => (
  <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-xl transition-all animate-fade-in group relative overflow-hidden">
    <div className="flex justify-between items-start mb-6">
      <span className="text-[10px] font-black uppercase text-[#e2725b] bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full">
        {phrase.category}
      </span>
      <div className="flex gap-2">
        <button 
          onClick={() => onToggleFavorite?.(phrase.id, !!phrase.isFavorite)}
          className={`p-2 rounded-xl haptic-feedback transition-colors ${phrase.isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-50 dark:bg-zinc-800 text-gray-300'}`}
        >
          <Heart className={`w-5 h-5 ${phrase.isFavorite ? 'fill-current' : ''}`} />
        </button>
        <button 
          onClick={() => onPlay(phrase.arabic, phrase.id)}
          className="p-2 bg-orange-50 dark:bg-orange-900/20 text-[#e2725b] rounded-xl haptic-feedback"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
    <div className="space-y-4">
      <p className="text-4xl font-black text-right arabic-font dark:text-zinc-100" dir="rtl">
        {phrase.arabic}
      </p>
      <div>
        <p className="text-xl font-black dark:text-white leading-tight">{phrase.transliteration}</p>
        <p className="text-sm font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-tighter">
          {phrase.english}
        </p>
      </div>
    </div>
  </div>
));
