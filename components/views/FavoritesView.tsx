
import React from 'react';
import { Heart, Search } from 'lucide-react';
import { Phrase } from '../../types';
import { PhraseCard } from '../shared/PhraseCard';

interface FavoritesViewProps {
  favorites: Phrase[];
  onPlayAudio: (text: string, id: string) => void;
  onToggleFavorite: (id: string, status: boolean) => void;
  audioLoadingId: string | null;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ 
  favorites, 
  onPlayAudio, 
  onToggleFavorite, 
  audioLoadingId 
}) => {
  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black dark:text-white flex items-center justify-center md:justify-start gap-3">
            <Heart className="text-red-500 fill-current" />
            My Favorites
          </h2>
          <p className="text-gray-400 font-medium text-sm mt-1">{favorites.length} phrases saved</p>
        </div>
      </header>

      {favorites.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(p => (
            <PhraseCard 
              key={p.id}
              phrase={p} 
              onPlay={onPlayAudio} 
              onToggleFavorite={onToggleFavorite}
              isLoading={audioLoadingId === p.id} 
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4">
           <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-gray-300">
             <Heart className="w-10 h-10" />
           </div>
           <div className="max-w-xs mx-auto">
             <p className="text-gray-500 font-black">Your heart is empty!</p>
             <p className="text-gray-400 text-sm mt-2 font-medium">Heart phrases in any level to see them here for quick practice.</p>
           </div>
        </div>
      )}
    </div>
  );
};
