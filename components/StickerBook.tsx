
import React from 'react';
import { getProgress } from '../utils/storage';

interface StickerBookProps {
  onBack: () => void;
}

const StickerBook: React.FC<StickerBookProps> = ({ onBack }) => {
  const progress = getProgress();
  const stickers = progress.stickers || [];
  
  const allStickers = ['🦖', '🦄', '🚀', '🐱‍🚀', '🦁', '🦉', '🦋', '🐳', '🐲', '🚁', '🍔', '🍦', '💎', '🎮', '🛸', '🌋'];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500 pb-10">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-full text-gray-400 hover:text-sky-500 transition-colors shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold text-sky-800 font-school">Sổ Tay Nhãn Dán ✨</h2>
      </div>

      <div className="bg-yellow-50 p-8 rounded-[3rem] border-4 border-yellow-200 shadow-inner">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {allStickers.map((s, idx) => {
            const isOwned = stickers.includes(s);
            return (
              <div 
                key={idx} 
                className={`aspect-square rounded-3xl flex items-center justify-center text-5xl shadow-sm transition-all ${
                  isOwned 
                    ? 'bg-white border-2 border-yellow-300 scale-100 rotate-3 hover:rotate-0' 
                    : 'bg-gray-200/50 border-2 border-dashed border-gray-300 opacity-30 grayscale'
                }`}
              >
                {isOwned ? s : '?'}
              </div>
            );
          })}
        </div>
        
        {stickers.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">📓</div>
            <p className="text-xl font-bold text-yellow-800 font-school">Sổ tay còn trống trơn...</p>
            <p className="text-gray-500">Hãy đạt điểm 10 ở các bài thử thách để thu thập nhãn dán bé nhé!</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button onClick={onBack} className="bg-sky-600 text-white font-black py-4 px-12 rounded-2xl hover:bg-sky-700 transition-all shadow-lg transform active:scale-95 text-xl">
          Tiếp tục thám hiểm 🏃‍♂️
        </button>
      </div>
    </div>
  );
};

export default StickerBook;
