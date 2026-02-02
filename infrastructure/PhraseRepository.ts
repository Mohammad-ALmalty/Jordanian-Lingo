
import { Phrase } from '../types';
import { db } from './DatabaseService';

export interface IPhraseRepository {
  getUnlockedPhrasesByLevel(level: number): Promise<Phrase[]>;
  getLockedPhrasesByLevel(level: number, count: number): Promise<Phrase[]>;
  unlockPhrases(ids: string[]): Promise<void>;
  countTotalInLevel(level: number): Promise<number>;
  toggleFavorite(id: string, status: boolean): Promise<void>;
  getFavorites(): Promise<Phrase[]>;
}

class PhraseRepository implements IPhraseRepository {
  async getUnlockedPhrasesByLevel(level: number): Promise<Phrase[]> {
    const phrases = await db.phrases
      .where('level')
      .equals(level)
      .filter(p => !!p.isUnlocked)
      .toArray();

    return phrases.sort((a, b) => {
      const numA = parseInt(a.id.split('-')[1] || "0");
      const numB = parseInt(b.id.split('-')[1] || "0");
      return numA - numB;
    });
  }

  async getLockedPhrasesByLevel(level: number, count: number): Promise<Phrase[]> {
    const allInLevel = await db.phrases.where('level').equals(level).toArray();
    return allInLevel.filter(p => !p.isUnlocked).slice(0, count);
  }

  async unlockPhrases(ids: string[]): Promise<void> {
    await db.phrases.where('id').anyOf(ids).modify({ isUnlocked: true });
  }

  async countTotalInLevel(level: number): Promise<number> {
    return await db.phrases.where('level').equals(level).count();
  }

  async toggleFavorite(id: string, status: boolean): Promise<void> {
    await db.phrases.update(id, { isFavorite: status });
  }

  async getFavorites(): Promise<Phrase[]> {
    // استخدمنا filter هنا لأن القيم المنطقية (true/false) قد تُخزن بشكل مختلف 
    // والفلتر يضمن جلب أي جملة لديها خاصية isFavorite تساوي true
    return await db.phrases.filter(p => p.isFavorite === true).toArray();
  }
}

export const phraseRepository = new PhraseRepository();
