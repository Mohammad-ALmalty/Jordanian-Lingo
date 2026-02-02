
import { useState } from 'react';
import { Phrase } from '../types';
import { phraseRepository } from '../infrastructure/PhraseRepository';

export const useDiscovery = (currentLevel: number, addXp: (n: number) => void) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [discoveredPhrases, setDiscoveredPhrases] = useState<Phrase[]>([]);

  const discover = async () => {
    setIsGenerating(true);
    
    // محاكاة وقت البحث
    await new Promise(r => setTimeout(r, 800));
    
    // جلب الـ 10 جمل المغلقة التالية من قاعدة البيانات مباشرة
    const nextPhrases = await phraseRepository.getLockedPhrasesByLevel(currentLevel, 10);
    
    if (nextPhrases.length > 0) {
      setDiscoveredPhrases(nextPhrases);
      addXp(100); 
      setIsGenerating(false);
      return true;
    }
    
    setIsGenerating(false);
    return false;
  };

  const reset = () => setDiscoveredPhrases([]);

  return { isGenerating, discoveredPhrases, discover, reset };
};
