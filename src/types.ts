export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface WordToken {
  word: string;
  isError: boolean;
  suggestion?: string;
  reason?: string;
}

export interface GrammarExplanation {
  originalPart: string;
  correctedPart: string;
  explanationEn: string;
  explanationEs: string;
}

export interface AlternativePhrasing {
  sentence: string;
  label: string; // e.g. "Natural & Everyday", "Formal & Professional", "Expressive & Rich"
  synonymsUsed: string[];
  explanation: string;
}

export interface SentenceAnalysisResponse {
  id: string;
  timestamp: number;
  originalSentence: string;
  cefrLevel: CEFRLevel;
  cefrDescription: string;
  isCorrect: boolean;
  correctedSentence: string;
  wordTokens: WordToken[];
  explanations: GrammarExplanation[];
  alternatives: AlternativePhrasing[];
  overallTip: string;
}

export interface PresetSentence {
  text: string;
  label: string;
  level: string;
}
