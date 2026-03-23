export type DreamType = 'ordinaire' | 'lucide' | 'cauchemar' | 'prémonitoire' | 'récurrent';
export type DreamTone = 'positive' | 'négative' | 'neutre';

export interface Dream {
  id: string;
  description: string;
  dreamType: DreamType;
  tone: DreamTone;
  date: string;
  time: string;
  emotionBefore: string;
  emotionAfter: string;
  emotionIntensity: number; // 1–5
  dreamClarity: number; // 1–5
  sleepQuality: number; // 1–5
  personalMeaning: string;
  places: string[];
  peoples: string[];
  tags: string[];
  keywords: string[]; // places + peoples + tags (for search)
  isNightmare: boolean; // backward compat (true when dreamType === 'cauchemar')
}

export const DREAM_TYPE_LABELS: Record<DreamType, string> = {
  ordinaire: 'Ordinaire',
  lucide: 'Lucide',
  cauchemar: 'Cauchemar',
  prémonitoire: 'Prémonitoire',
  récurrent: 'Récurrent',
};

export const DREAM_TYPE_COLORS: Record<DreamType, string> = {
  ordinaire: '#3b82f6',
  lucide: '#8b5cf6',
  cauchemar: '#ef4444',
  prémonitoire: '#f59e0b',
  récurrent: '#10b981',
};

export const TONE_COLORS: Record<DreamTone, string> = {
  positive: '#10b981',
  neutre: '#6b7280',
  négative: '#ef4444',
};

export const TONE_EMOJIS: Record<DreamTone, string> = {
  positive: '🌟',
  neutre: '😶',
  négative: '🌑',
};

export const EMOTIONS = [
  { value: 'joyeux', label: 'Joyeux 😊' },
  { value: 'calme', label: 'Calme 😌' },
  { value: 'anxieux', label: 'Anxieux 😰' },
  { value: 'triste', label: 'Triste 😢' },
  { value: 'excité', label: 'Excité 🤩' },
  { value: 'effrayé', label: 'Effrayé 😱' },
  { value: 'confus', label: 'Confus 🤔' },
  { value: 'paisible', label: 'Paisible 🌿' },
];
