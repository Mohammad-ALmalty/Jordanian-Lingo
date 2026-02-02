
import React from 'react';
import { Star, MessageSquare, Heart, Trophy, Target } from 'lucide-react';
import { UserRank } from '../../types';

interface HomeViewProps {
  currentRank: UserRank;
  favoritesCount: number;
  onNavigate: (view: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  currentRank, 
  favoritesCount, 
  onNavigate
}) => {
  return (
    <div className="space-y-12 animate-fade-in pb-32">
      <section className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-10">
        <div className={`w-32 h-32 md:w-40 md:h-40 ${currentRank.color} rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl rotate-3 shrink-0`}>
          <Star className="w-16 h-16 fill-current" />
        </div>
        <div className="text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full text-brand-orange text-[10px] font-black uppercase tracking-widest">
            <Trophy className="w-4 h-4" />
            Rank: {currentRank.label}
          </div>
          <h2 className="text-4xl md:text-5xl font-black dark:text-white leading-none">
            Yalla, let's learn!
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 font-medium max-w-lg">
            Master the Jordanian dialect one phrase at a time.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => onNavigate('levels')}
          className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 cursor-pointer hover:border-brand-orange transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black dark:text-white">Curriculum</h3>
          <p className="text-gray-400 text-sm mt-1">Explore all levels of Jordanian Ammiya.</p>
        </div>

        <div 
          onClick={() => onNavigate('favorites')}
          className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-zinc-800 cursor-pointer hover:border-brand-orange transition-all group"
        >
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h3 className="text-xl font-black dark:text-white">My Favorites</h3>
          <p className="text-gray-400 text-sm mt-1">{favoritesCount} phrases saved for review.</p>
        </div>
      </div>

      <section className="bg-brand-orange rounded-[3.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-black">Talk to Sami</h3>
          <p className="text-orange-100 font-medium">Practice your Ammiya in real-time.</p>
        </div>
        <button 
          onClick={() => onNavigate('tutor')}
          className="bg-white text-brand-orange px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all"
        >
          <MessageSquare className="w-5 h-5" /> Start Conversation
        </button>
      </section>
    </div>
  );
};
