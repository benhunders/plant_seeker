export type CareTaskType = 'water' | 'fertilize' | 'rotate' | 'repot' | 'mist';

export type CareTask = {
  id: string;
  type: CareTaskType;
  /** Short human label, e.g. "Water thoroughly". */
  label: string;
  /** Days between occurrences. */
  intervalDays: number;
  /** ISO date (YYYY-MM-DD) when this task is next due. */
  nextDue: string;
  /** ISO date of the last time it was marked done. */
  lastDone?: string;
};

export type Difficulty = 'easy' | 'moderate' | 'hard';

export type CareInfo = {
  light: string;
  water: string;
  soil: string;
  humidity: string;
  temperature: string;
  difficulty: Difficulty;
  /** One-line "how to care" summary. */
  summary: string;
};

export type Plant = {
  id: string;
  nickname?: string;
  commonName: string;
  scientificName: string;
  /** e.g. "high" | "medium" | "low" — how sure the model was. */
  confidence: string;
  /** Data URL of the captured photo (stored locally). */
  imageDataUrl: string;
  care: CareInfo;
  schedule: CareTask[];
  createdAt: string;
};

/** Shape returned by POST /api/identify (before we attach id/image/createdAt). */
export type IdentifyResult = {
  identified: boolean;
  /** Present when identified is false — a friendly explanation. */
  message?: string;
  commonName: string;
  scientificName: string;
  confidence: string;
  care: CareInfo;
  schedule: Array<{
    type: CareTaskType;
    label: string;
    intervalDays: number;
  }>;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
