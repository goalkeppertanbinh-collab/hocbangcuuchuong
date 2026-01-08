
export enum GameState {
  HOME = 'HOME',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
  STATS = 'STATS',
  MULTIPLAYER_SETUP = 'MULTIPLAYER_SETUP',
  MULTIPLAYER_QUIZ = 'MULTIPLAYER_QUIZ',
  MULTIPLAYER_RESULT = 'MULTIPLAYER_RESULT'
}

export enum GameMode {
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION'
}

export interface Question {
  id: number;
  multiplier1: number;
  multiplier2: number;
  answer: number;
  options: number[];
  mode: GameMode;
}

export interface QuizResult {
  score: number;
  total: number;
  wrongAnswers: Question[];
}

export interface MultiplayerResult {
  p1Score: number;
  p2Score: number;
  total: number;
}

export interface TableStats {
  table: number;
  mode: GameMode;
  attempts: number;
  bestScore: number;
  totalScore: number;
  lastAttempt: string;
}

export interface ProgressData {
  multiplication: number[]; // Tables marked as "learned"
  division: number[];
  quizHistory: TableStats[];
}
