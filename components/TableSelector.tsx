
import React, { useState, useEffect } from 'react';
import { GameMode, ProgressData } from '../types';
import { getProgress } from '../utils/storage';

interface TableSelectorProps {
  onSelectLearn: (table: number, mode: GameMode) => void;
  onSelectQuiz: (table: number, mode: GameMode) => void;
  onSelectMultiplayer: (table: number, mode: GameMode) => void;
  onOpenStickers: () => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ onSelectLearn, onSelectQuiz, onSelectMultiplayer, onOpenStickers }) => {
  const [activeMode, setActiveMode] = useState<GameMode>(GameMode.MULTIPLICATION);
  const [progress, setProgress] = useState<ProgressData>({ multiplication: [], division: [], quizHistory: [], stickers: [] });
  const tables = [2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const isCompleted = (num: number) => {
    const list = activeMode === GameMode.MULTIPLICATION ? progress.multiplication : progress.division;
    return list.includes(num);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left">
          <h2 className="text-4xl font-black text-sky-800 font-school tracking-tight">Bản đồ thám hiểm 🗺️</h2>
          <p className="text-sky-600 font-bold">Vượt qua thử thách để thu thập nhãn dán nhé!</p>
        </div>

        <div className="flex items-center gap-4">
           <button 
            onClick={onOpenStickers}
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
          >
            <span className="text-2xl">🎨</span>
            <span>Sổ Nhãn Dán ({progress.stickers.length})</span>
          </button>

          <div className="inline-flex p-1 bg-white rounded-2xl shadow-inner border-2 border-sky-100">
            <button 
              onClick={() => setActiveMode(GameMode.MULTIPLICATION)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeMode === GameMode.MULTIPLICATION ? 'bg-sky-600 text-white shadow-md' : 'text-sky-600 hover:bg-sky-50'}`}
            >
              <span>✖️ Nhân</span>
            </button>
            <button 
              onClick={() => setActiveMode(GameMode.DIVISION)}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeMode === GameMode.DIVISION ? 'bg-orange-500 text-white shadow-md' : 'text-orange-600 hover:bg-orange-50'}`}
            >
              <span>➗ Chia</span>
            </button>
          </div>
        </div>
      </div>

      {/* Adventure Map View */}
      <div className="relative pb-10">
        {/* Decorative Path Line */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-sky-100 -translate-y-1/2 hidden md:block rounded-full"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {tables.map((num, index) => {
            const completed = isCompleted(num);
            const isUnlocked = index === 0 || isCompleted(tables[index-1]);
            
            return (
              <div 
                key={num} 
                className={`group relative rounded-[2.5rem] p-6 border-4 transition-all text-center ${
                  !isUnlocked ? 'opacity-50 grayscale' : ''
                } ${
                  completed 
                    ? 'bg-green-50 border-green-300 shadow-green-100'
                    : (activeMode === GameMode.MULTIPLICATION ? 'bg-white border-sky-200 shadow-sky-100 hover:border-sky-400' : 'bg-white border-orange-200 shadow-orange-100 hover:border-orange-400')
                } shadow-xl transform hover:-translate-y-2`}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-[2.5rem] z-20 flex items-center justify-center">
                    <span className="text-6xl">🔒</span>
                  </div>
                )}

                <div className={`text-6xl font-black mb-4 ${
                  completed ? 'text-green-500' : (activeMode === GameMode.MULTIPLICATION ? 'text-sky-500' : 'text-orange-500')
                }`}>
                  {num}
                </div>
                
                <div className="space-y-3">
                  <button 
                    disabled={!isUnlocked}
                    onClick={() => onSelectLearn(num, activeMode)}
                    className="w-full bg-white text-gray-700 font-bold py-3 rounded-2xl border-2 border-gray-100 hover:border-sky-500 hover:text-sky-600 transition-all shadow-sm"
                  >
                    Học tập 📖
                  </button>
                  <button 
                    disabled={!isUnlocked}
                    onClick={() => onSelectQuiz(num, activeMode)}
                    className={`w-full text-white font-black py-3 rounded-2xl transition-all shadow-lg ${
                      completed ? 'bg-green-500 hover:bg-green-600' : (activeMode === GameMode.MULTIPLICATION ? 'bg-sky-600 hover:bg-sky-700' : 'bg-orange-500 hover:bg-orange-600')
                    }`}
                  >
                    Thử thách 🏆
                  </button>
                  <button 
                    disabled={!isUnlocked}
                    onClick={() => onSelectMultiplayer(num, activeMode)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Thi đấu ⚔️
                  </button>
                </div>

                {completed && (
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-bounce text-xl">
                    ⭐
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-sky-600 rounded-[3rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 opacity-10 text-[15rem] leading-none pointer-events-none">🚀</div>
         <div className="flex-1 space-y-4 relative z-10">
            <h3 className="text-3xl font-black">Nhiệm vụ Thám Hiểm!</h3>
            <p className="text-sky-100 text-lg font-medium">Hoàn thành bảng 9 để nhận nhãn dán "Rồng Thần Lam" siêu hiếm! Bé đã sẵn sàng chưa?</p>
            <div className="flex gap-4">
               <div className="bg-white/20 px-4 py-2 rounded-xl font-bold">Tiến độ: {progress.multiplication.length + progress.division.length}/16</div>
            </div>
         </div>
         <button onClick={() => onSelectLearn(2, GameMode.MULTIPLICATION)} className="bg-white text-sky-600 font-black px-10 py-5 rounded-[2rem] text-xl shadow-xl hover:bg-sky-50 transition-all transform active:scale-95">
           Bắt đầu ngay! 🏃‍♂️
         </button>
      </div>
    </div>
  );
};

export default TableSelector;
