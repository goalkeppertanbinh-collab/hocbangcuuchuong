
import { GameMode, ProgressData, TableStats } from '../types';

const STORAGE_KEY = 'math_adventure_progress_v1';

export const getProgress = (): ProgressData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Đảm bảo có quizHistory
      if (!data.quizHistory) data.quizHistory = [];
      return data;
    }
  } catch (e) {
    console.error("Lỗi khi đọc progress từ localStorage", e);
  }
  return { multiplication: [], division: [], quizHistory: [] };
};

export const saveProgress = (table: number, mode: GameMode) => {
  const progress = getProgress();
  const key = mode === GameMode.MULTIPLICATION ? 'multiplication' : 'division';
  
  if (!progress[key].includes(table)) {
    progress[key].push(table);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
};

export const saveQuizAttempt = (table: number, mode: GameMode, score: number) => {
  const progress = getProgress();
  const existingIdx = progress.quizHistory.findIndex(h => h.table === table && h.mode === mode);
  
  if (existingIdx > -1) {
    const history = progress.quizHistory[existingIdx];
    history.attempts += 1;
    history.totalScore += score;
    if (score > history.bestScore) history.bestScore = score;
    history.lastAttempt = new Date().toISOString();
  } else {
    progress.quizHistory.push({
      table,
      mode,
      attempts: 1,
      bestScore: score,
      totalScore: score,
      lastAttempt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const clearProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
};
