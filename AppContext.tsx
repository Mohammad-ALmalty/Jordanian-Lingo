
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { UserRank, Phrase } from './types';
import { ProgressionService, RANKS } from './domain/ProgressionService';
import { db } from './infrastructure/DatabaseService';
import { STATIC_PHRASE_LIBRARY } from './constants';

export { RANKS };

interface AppContextType {
  xp: number;
  addXp: (amount: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentRank: UserRank;
  setSelectedLevel: (level: number) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Recover progress from DB
        const savedProgress = await db.progress.get('current');
        if (savedProgress) {
          setXp(savedProgress.xp);
          setSelectedLevel(savedProgress.selectedLevel);
        } else {
          await db.progress.put({ id: 'current', xp: 0, selectedLevel: 0, streak: 0, lastActive: new Date() });
        }

        // 2. Data Seeding Logic
        const count = await db.phrases.count();
        
        if (count === 0) {
          console.log("Seeding Database...");
          const phrasesToInjest: Phrase[] = STATIC_PHRASE_LIBRARY.map((p) => {
            const levelGroup = STATIC_PHRASE_LIBRARY.filter(item => item.level === p.level);
            const indexInLevel = levelGroup.findIndex(item => item.id === p.id);
            return { ...p, isUnlocked: indexInLevel < 10 };
          });
          await db.phrases.bulkAdd(phrasesToInjest);
        } else {
          // ضمان تفعيل أول 10 جمل لكل المستويات في حال كانت موجودة ولكن غير مفعلة
          for (let l = 1; l <= 6; l++) {
            const levelPhrases = await db.phrases.where('level').equals(l).toArray();
            const sorted = levelPhrases.sort((a, b) => {
              const numA = parseInt(a.id.split('-')[1] || "0");
              const numB = parseInt(b.id.split('-')[1] || "0");
              return numA - numB;
            });
            
            const firstTenIds = sorted.slice(0, 10).map(p => p.id);
            if (firstTenIds.length > 0) {
              await db.phrases.where('id').anyOf(firstTenIds).modify({ isUnlocked: true });
            }
          }
        }
      } catch (err) {
        console.error("Initialization Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      db.progress.update('current', { xp, selectedLevel });
    }
  }, [xp, selectedLevel, isLoading]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const currentRank = useMemo(() => 
    ProgressionService.calculateRank(xp, selectedLevel), 
    [xp, selectedLevel]
  );

  const addXp = (amount: number) => setXp(prev => prev + amount);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AppContext.Provider value={{ 
      xp, addXp, isDarkMode, toggleDarkMode, currentRank, setSelectedLevel, isLoading 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
