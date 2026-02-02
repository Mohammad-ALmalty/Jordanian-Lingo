
import { Phrase } from './types';
import { level1 } from './level1';
import { level2 } from './level2';
import { level3 } from './level3';
import { level4 } from './level4';
import { level5 } from './level5';
import { level6 } from './level6';

export const INITIAL_PHRASES: Phrase[] = [];

// تجميع كل الجمل في مكتبة واحدة مرتبة حسب المستويات
export const STATIC_PHRASE_LIBRARY: Phrase[] = [
  ...level1,
  ...level2,
  ...level3,
  ...level4,
  ...level5,
  ...level6
];
