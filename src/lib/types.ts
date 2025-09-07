export interface Entry {
  id: string;
  date: string;
  sleep: number;
  stress: number;
  symptoms: number;
  mood: number;
  engagement: number;
  drugNames: string;
  notes?: string;
}

export interface User {
  email: string;
  name?: string;
}
