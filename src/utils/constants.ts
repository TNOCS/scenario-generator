import { v4 as uuidv4 } from 'uuid';

export const version = '1.0.0';
export const themeStorageKey = 'V2018_THEME';
export const kanbanDirectionStorageKey = 'V2018_KANBAN_DIR';

export const getUuid = (full = false): string => (full ? uuidv4() : uuidv4().substr(0, 8));

export const vowelSoundWords = (): string[] => ['hour'];
export const isVowelSound = (s: string): boolean => {
  if (!s || s.length <= 0) return false;
  return /^[aeiou]$/i.test(s[0]) || vowelSoundWords().some(w => w.startsWith(s.toLocaleLowerCase()));
};
