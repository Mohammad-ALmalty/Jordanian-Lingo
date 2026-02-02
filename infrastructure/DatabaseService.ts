
import Dexie, { type Table } from 'dexie';
import { Phrase, ChatMessage } from '../types';

export interface UserProgress {
  id: string;
  xp: number;
  selectedLevel: number;
  streak: number;
  lastActive: Date;
}

export class AppDatabase extends Dexie {
  phrases!: Table<Phrase>;
  messages!: Table<ChatMessage & { id?: number }>;
  progress!: Table<UserProgress>;

  constructor() {
    super('JordanianLingoDB');
    this.version(4).stores({
      // أضفنا فهرس isFavorite لدعم استرجاع المفضلة بسرعة
      phrases: 'id, level, category, isUnlocked, isFavorite, [level+isUnlocked]',
      messages: '++id, role, timestamp',
      progress: 'id'
    });
  }
}

export const db = new AppDatabase();
