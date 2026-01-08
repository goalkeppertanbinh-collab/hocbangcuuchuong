
import React, { useState, useEffect } from 'react';
// ProgressData is defined in types.ts
import { GameMode, ProgressData } from '../types';
// getProgress is exported from storage.ts
import { getProgress } from '../utils/storage';

interface TableSelectorProps {
  onSelectLearn: (table: number, mode: GameMode) => void;
  onSelectQuiz: (table: number, mode: GameMode) => void;
  onSelectMultiplayer: (table: number, mode: GameMode) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ onSelectLearn, onSelectQuiz, onSelectMultiplayer }) => {
  const [activeMode, setActiveMode] = useState<GameMode>(GameMode.MULTIPLICATION);
  // Ensure initial state matches ProgressData interface
  const [progress, setProgress] = useState<ProgressData>({ multiplication: [], division: [], quizHistory: [] });
  const tables = [2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    // Tải tiến trình khi component được hiển thị
    setProgress(getProgress());
  }, []);

  const isCompleted = (num: number) => {
    const list = activeMode === GameMode.MULTIPLICATION ? progress.multiplication : progress.division;
    return list.includes(num);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-sky-800">Chào mừng bạn nhỏ! 👋</h2>
        
        <div className="inline-flex p-1 bg-sky-100 rounded-2xl border-2 border-sky-200">
          <button 
            onClick={() => setActiveMode(GameMode.MULTIPLICATION)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeMode === GameMode.MULTIPLICATION ? 'bg-sky-600 text-white shadow-md' : 'text-sky-600 hover:bg-sky-200'}`}
          >
            ✖️ Bảng Nhân
          </button>
          <button 
            onClick={() => setActiveMode(GameMode.DIVISION)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeMode === GameMode.DIVISION ? 'bg-orange-500 text-white shadow-md' : 'text-orange-600 hover:bg-orange-200'}`}
          >
            ➗ Bảng Chia
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tables.map((num) => {
          const completed = isCompleted(num);
          return (
            <div 
              key={num} 
              className={`group relative rounded-3xl p-6 border-2 transition-all text-center cursor-default ${
                completed 
                  ? (activeMode === GameMode.MULTIPLICATION ? 'bg-green-50 border-green-200' : 'bg-green-50 border-green-200')
                  : (activeMode === GameMode.MULTIPLICATION ? 'bg-sky-50 border-sky-100 hover:border-sky-400' : 'bg-orange-50 border-orange-100 hover:border-orange-400')
              }`}
            >
              {completed && (
                <div className="absolute -top-3 -right-3 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                  ✅
                </div>
              )}
              
              <div className={`text-5xl font-black mb-4 group-hover:scale-110 transition-transform ${
                completed ? 'text-green-600' : (activeMode === GameMode.MULTIPLICATION ? 'text-sky-500' : 'text-orange-500')
              }`}>
                {num}
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => onSelectLearn(num, activeMode)}
                  className={`w-full font-bold py-2 rounded-xl border transition-colors text-sm ${
                    completed 
                      ? 'bg-white text-green-600 border-green-200 hover:bg-green-600 hover:text-white'
                      : (activeMode === GameMode.MULTIPLICATION ? 'bg-white text-sky-600 border-sky-200 hover:bg-sky-600 hover:text-white' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-600 hover:text-white')
                  }`}
                >
                  {completed ? 'Xem lại 📖' : 'Học tập 📖'}
                </button>
                <button 
                  onClick={() => onSelectQuiz(num, activeMode)}
                  className={`w-full text-white font-bold py-2 rounded-xl transition-colors shadow-sm text-sm ${
                    completed
                      ? 'bg-green-500 hover:bg-green-600'
                      : (activeMode === GameMode.MULTIPLICATION ? 'bg-sky-600 hover:bg-sky-700' : 'bg-orange-500 hover:bg-orange-600')
                  }`}
                >
                  Thử thách 🏆
                </button>
                <button 
                  onClick={() => onSelectMultiplayer(num, activeMode)}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-xl transition-colors shadow-sm text-sm flex items-center justify-center gap-1"
                >
                  Thi đấu ⚔️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <p className="text-gray-500 italic text-sm">
          Tiến trình của em được lưu tự động trên trình duyệt này nhé! ✨
        </p>
      </div>
    </div>
  );
};

export default TableSelector;
