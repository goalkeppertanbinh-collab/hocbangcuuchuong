
import React from 'react';
import { MultiplayerResult as MultiResultType, GameMode } from '../types';

interface MultiplayerResultProps {
  result: MultiResultType;
  table: number;
  mode: GameMode;
  onRetry: () => void;
  onHome: () => void;
}

const MultiplayerResult: React.FC<MultiplayerResultProps> = ({ result, table, mode, onRetry, onHome }) => {
  const winner = result.p1Score > result.p2Score ? 1 : result.p1Score < result.p2Score ? 2 : 0;

  return (
    <div className="space-y-12 animate-in zoom-in duration-500 max-w-2xl mx-auto py-10">
      <div className="text-center space-y-6">
        <div className="text-9xl mb-6">
          {winner === 1 ? '🥇' : winner === 2 ? '🥇' : '🤝'}
        </div>
        <h2 className="text-5xl font-black text-gray-800 tracking-tight">
          {winner === 0 ? 'HÒA NHAU RỒI!' : `NGƯỜI CHƠI ${winner} THẮNG!`}
        </h2>
        <p className="text-2xl text-gray-500 font-medium italic font-school">
          Một trận thi đấu vô cùng kịch tính!
        </p>
      </div>

      <div className="flex items-center justify-center gap-10">
        <div className={`flex-1 p-8 rounded-[3rem] border-4 text-center transition-all ${winner === 1 ? 'bg-sky-50 border-sky-500 shadow-xl scale-110' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
           <div className="text-sm font-bold text-sky-500 mb-2">NGƯỜI CHƠI 1</div>
           <div className="text-6xl font-black text-sky-800">{result.p1Score}</div>
           <div className="text-sm text-sky-400 mt-2 font-bold">điểm</div>
        </div>

        <div className="text-4xl font-black text-gray-300">VS</div>

        <div className={`flex-1 p-8 rounded-[3rem] border-4 text-center transition-all ${winner === 2 ? 'bg-orange-50 border-orange-500 shadow-xl scale-110' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
           <div className="text-sm font-bold text-orange-500 mb-2">NGƯỜI CHƠI 2</div>
           <div className="text-6xl font-black text-orange-800">{result.p2Score}</div>
           <div className="text-sm text-orange-400 mt-2 font-bold">điểm</div>
        </div>
      </div>

      <div className="bg-pink-50 p-6 rounded-[2rem] border-2 border-pink-100 flex items-center gap-6">
        <div className="text-6xl">👩‍🏫</div>
        <div>
          <h4 className="text-xl font-bold text-pink-800 font-school">Cô Linh khen ngợi:</h4>
          <p className="text-lg text-gray-700 font-school leading-relaxed">
            {winner === 0 
              ? "Cả hai bạn đều rất giỏi! Kiến thức của hai bạn ngang ngửa nhau đó. Thử một bảng khác khó hơn xem sao nào!" 
              : `Chúc mừng Người chơi ${winner}! Bạn có phản xạ rất nhanh. Người chơi ${winner === 1 ? 2 : 1} cũng đừng buồn nhé, hãy luyện tập thêm rồi phục thù nha!`}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <button onClick={onRetry} className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-black py-6 rounded-3xl shadow-lg transition-all text-2xl transform active:scale-95">
          Tái đấu ngay ⚔️
        </button>
        <button onClick={onHome} className="flex-1 bg-white text-gray-600 font-black py-6 rounded-3xl border-4 border-gray-100 shadow-md transition-all text-2xl transform active:scale-95">
          Quay về 🏠
        </button>
      </div>
    </div>
  );
};

export default MultiplayerResult;
