
export interface Phrase {
  id: string;
  english: string;
  arabic: string;
  transliteration: string;
  category: 'Greetings' | 'Food' | 'Directions' | 'Social' | 'Market' | 'Slang' | 'Idioms';
  context?: string;
  level: number; // 1 to 6
  isUnlocked?: boolean;
  isFavorite?: boolean; 
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface UserRank {
  level: number;
  name: string;
  minXp: number;
  color: string;
  label: string;
}

export type ViewState = 'home' | 'levels' | 'favorites' | 'tutor' | 'level_detail' | 'discovery' | 'settings';
