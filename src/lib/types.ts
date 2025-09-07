export type MoodValue = 'happy' | 'sad' | 'angry' | 'stressed' | 'excited';

export interface Mood {
  id: string;
  mood: MoodValue;
  note?: string;
  timestamp: string;
}

export interface User {
  email: string;
  name?: string;
}
