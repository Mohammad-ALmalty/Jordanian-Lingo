
import { UserRank } from '../types';

export const RANKS: UserRank[] = [
  { level: 1, name: 'Beginner', label: 'Beginner', minXp: 0, color: 'bg-slate-400' },
  { level: 2, name: 'Novice', label: 'Novice', minXp: 500, color: 'bg-green-500' },
  { level: 3, name: 'Intermediate', label: 'Intermediate', minXp: 1500, color: 'bg-blue-500' },
  { level: 4, name: 'Advanced', label: 'Advanced', minXp: 3500, color: 'bg-purple-500' },
  { level: 5, name: 'Expert', label: 'Expert', minXp: 7000, color: 'bg-orange-500' },
  { level: 6, name: 'Professional', label: 'Professional', minXp: 12000, color: 'bg-red-600' },
];

export class ProgressionService {
  static calculateRank(xp: number, manualLevel: number): UserRank {
    if (manualLevel > 0) {
      return RANKS.find(r => r.level === manualLevel) || RANKS[0];
    }
    return [...RANKS].reverse().find(r => xp >= r.minXp) || RANKS[0];
  }

  static getNextRank(currentLevel: number): UserRank | null {
    return RANKS.find(r => r.level === currentLevel + 1) || null;
  }

  static calculateProgress(xp: number, current: UserRank, next: UserRank | null): number {
    if (!next) return 100;
    const range = next.minXp - current.minXp;
    const currentProgress = xp - current.minXp;
    return Math.min(Math.floor((currentProgress / range) * 100), 100);
  }
}
